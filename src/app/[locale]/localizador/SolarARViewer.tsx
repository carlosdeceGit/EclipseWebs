"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ALIGN_TOLERANCE_DEG,
  alignmentState,
  cameraElevation,
  compassHeading,
  edgeMarkers,
  fovForScreenAngle,
  type EdgeInsets,
  normalizeDegrees,
  projectPath,
  projectTarget,
} from "@/lib/eclipse/solar-viewer";
import { ECLIPSE } from "@/lib/eclipse/event";
import type { Locale } from "@/lib/eclipse/types";

/**
 * Visor solar de realidad aumentada.
 *
 * Responde a una pregunta que ninguna tabla puede responder: desde este balcón
 * concreto, ¿me va a tapar el Sol aquel edificio? La posición del Sol la ha
 * calculado `besselian.ts` para las coordenadas del usuario; aquí solo se
 * superpone sobre la imagen de la cámara.
 *
 * Cinco decisiones que condicionan todo el componente:
 *
 *   1. **La cámara no graba nada.** El MediaStream se pinta en un `<video>` y se
 *      para al cerrar. No hay canvas, no hay captura, no hay subida. Lo que se ve
 *      en pantalla no sale del dispositivo.
 *   2. **El modo manual no es un plan B, es parte del producto.** Hay móviles sin
 *      magnetómetro, WebViews que no entregan rumbo absoluto y usuarios que
 *      deniegan el permiso. En todos esos casos el visor se abre igual y el rumbo
 *      se ajusta a mano.
 *   3. **La geometría vive en `@/lib/eclipse/solar-viewer`** y se valida con
 *      `npm run validate:viewer`. Aquí solo hay navegador: permisos, sensores,
 *      MediaStream y pintura.
 *   4. **El visor no enseña un instante, enseña el eclipse entero.** El Sol se
 *      mueve unos 24° de azimut y sube casi 30° entre el primer y el último
 *      contacto: el tejado que no tapa el máximo puede tapar perfectamente el
 *      principio de la totalidad. Por eso se dibuja el recorrido completo y se
 *      puede saltar a cualquiera de los cinco contactos.
 *   5. **Con el móvil en alto no se lee.** La guía son flechas grandes pegadas al
 *      borde hacia el que hay que girar, con los grados que faltan. Los ajustes
 *      —rumbo manual, corrección de la brújula— viven en un panel que se abre, no
 *      ocupando media pantalla mientras se busca el Sol.
 *   6. **Las dos pantallas completas se montan en `document.body` con un portal.**
 *      No es una preferencia de estilo: un ancestro con `transform` se convierte en
 *      el bloque contenedor de sus descendientes `fixed`, y el visor va dentro de
 *      una `<section class="reveal">`, que lleva `transform` por su animación de
 *      entrada. Sin el portal, `fixed inset-0` no cubría la ventana sino la
 *      sección: la cámara salía recortada en media pantalla, con el header y la
 *      barra inferior por encima. Se encontró midiendo el rectángulo del diálogo
 *      en un navegador real, no leyendo el código.
 */

/** Milisegundos entre actualizaciones de estado desde los sensores. */
const SENSOR_THROTTLE_MS = 50;
/** Tiempo que esperamos a que llegue un rumbo absoluto antes de pasar a manual. */
const COMPASS_TIMEOUT_MS = 8000;
/** Corrección manual del rumbo, en grados a cada lado. */
const HEADING_OFFSET_RANGE = 30;

/** Giro del chevrón de guía. El dibujo base apunta a la derecha. */
const ARROW_ROTATION = { right: 0, down: 90, left: 180, up: 270 } as const;

/**
 * Pantalla que ocupa la interfaz del visor por cada borde, en porcentaje.
 *
 * Arriba van la hora simulada y las dos lecturas del objetivo; abajo, la banda de
 * estado con sus botones y el aviso ocular. Las flechas de guía se colocan dentro
 * de lo que queda: una flecha debajo de un panel no la ve nadie.
 */
const VIEWER_INSETS: EdgeInsets = { top: 30, right: 14, bottom: 36, left: 14 };

type Stage = "idle" | "calibrating" | "viewer";
type CameraStatus = "idle" | "opening" | "ready" | "error";
type OrientationMode = "sensor" | "manual";
type CameraErrorKind = "denied" | "insecure" | "unavailable" | "unsupported";
type Panel = "none" | "time" | "settings";

/** Los cinco contactos, tal y como los nombra `besselian.ts`. */
export type ViewerContact =
  | "partialStart"
  | "totalityStart"
  | "maximum"
  | "totalityEnd"
  | "partialEnd";

/**
 * Un instante del eclipse con el Sol ya situado en el cielo.
 *
 * Llega hecho desde el servidor o desde `/api/circumstances`: aquí no se calcula
 * ninguna posición ni se formatea ninguna hora. El componente es cliente y el
 * cálculo besseliano —con su tabla de elementos— no tiene por qué cruzar al
 * navegador.
 */
export interface ViewerTrackPoint {
  /** Hora local ya formateada, «10:06:38». */
  time: string;
  /** Azimut del Sol, grados desde el norte hacia el este. */
  azimuthDeg: number;
  /** Altura del Sol sobre el horizonte, grados. */
  altitudeDeg: number;
  /** Fracción del disco solar cubierta, de 0 a 1, o `null` si no se sabe. */
  obscuration: number | null;
  /** El contacto que representa este punto, o `null` si es intermedio. */
  contact: ViewerContact | null;
}

interface Reading {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  /** ¿El rumbo está referido al norte geográfico/magnético real? */
  absolute: boolean;
  /** `webkitCompassAccuracy` de Safari: negativo significa brújula no fiable. */
  accuracy: number | null;
}

/**
 * `DeviceOrientationEvent` con los añadidos de Safari, que no están en la
 * definición estándar de TypeScript.
 */
interface SafariOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
  webkitCompassAccuracy?: number;
}

/** El constructor con el `requestPermission()` que exige iOS 13+. */
interface PermissionCapableOrientation {
  requestPermission?: () => Promise<PermissionState | "granted" | "denied">;
}

const TEXTS = {
  es: {
    cardTitle: "Visor solar con cámara",
    cardLead:
      "Apunta el móvil hacia donde vayas a estar y comprueba, con la cámara, si un edificio, un árbol o un monte te va a tapar el eclipse.",
    cardOpen: "Calibrar y abrir el visor",
    cardNote: "Solo funciona en móvil, con cámara y brújula. Nada de lo que ve la cámara se graba ni sale de tu teléfono.",

    calibrateTitle: "Antes de abrir la cámara",
    calibrateLead: "La brújula del móvil se desvía con facilidad. Un minuto de calibración evita apuntar a un sitio equivocado.",
    calibrateSteps: [
      "Aléjate de coches, barandillas, farolas y de cualquier estructura metálica.",
      "Quita el móvil de fundas con imán y sepáralo de altavoces, cargadores y auriculares.",
      "Con el móvil en la mano, dibuja un ocho en el aire varias veces, girando la muñeca.",
      "Sujeta el móvil en vertical: es la posición en la que el visor funciona mejor.",
    ],
    calibrateCheck: "Comprobación en vivo",
    calibrateCheckHint: "Gira sobre ti mismo: si la aguja se mueve y el rumbo cambia, la brújula responde.",
    compassAbsolute: "Rumbo absoluto: la brújula responde",
    compassRelative: "El móvil da orientación, pero no rumbo absoluto. Tendrás que ajustarlo a mano.",
    compassSilent: "Todavía no llega ninguna lectura",
    compassPermission: "Concede el permiso de orientación para ver la lectura",
    accuracyReported: (deg: number) => `Precisión declarada por el sistema: ±${deg}°`,
    eyeTitle: "Peligro ocular",
    eyeBody:
      "NUNCA mires directamente al Sol sin gafas de eclipse certificadas (ISO 12312-2 con marcado CE), ni siquiera a través de la pantalla de este móvil. Usa el visor para mirar la pantalla, no el cielo.",
    calibrateGrant: "Entiendo el riesgo · abrir la cámara",
    calibrateManual: "Mi móvil no detecta la brújula: usar ajuste manual",
    calibrateBack: "Cancelar",

    opening: "Abriendo la cámara…",
    close: "Salir",
    viewerLabel: "Visor solar con cámara",
    skyAt: "Cielo del",
    targetAzimuth: "Azimut",
    targetAltitude: "Altura",
    covered: "Disco cubierto",
    aiming: "Apuntas a",
    waitingCompass: "Esperando a la brújula…",

    statusSearchingTitle: "Buscando el Sol",
    statusSearchingBody: "Gira despacio siguiendo las flechas ámbar.",
    statusNearTitle: "Ya casi",
    statusNearBody: "Afina la puntería hasta que el círculo entre en la retícula.",
    statusLockedTitle: "Ahí estará el Sol",
    statusLockedBody: "Lo que veas dentro del círculo te tapará el eclipse en ese momento.",
    turn: (deg: number, right: boolean) => `Gira ${deg}° a la ${right ? "derecha" : "izquierda"}`,
    tilt: (deg: number, up: boolean) => `${up ? "Sube" : "Baja"} ${deg}°`,
    turnShort: "Girar",
    tiltUpShort: "Subir",
    tiltDownShort: "Bajar",

    timeButton: "Momento",
    settingsButton: "Ajustes",
    timeTitle: "Qué momento del eclipse",
    timeLead:
      "El Sol se mueve durante el eclipse. Comprueba también el principio y el final: el edificio que no tapa el máximo puede tapar el resto.",
    trackToggle: "Dibujar el recorrido del Sol",
    trackLegend: "La línea azul es el camino que recorrerá el Sol durante todo el eclipse.",
    contactNames: {
      partialStart: "Primer contacto",
      totalityStart: "Empieza la totalidad",
      maximum: "Máximo",
      totalityEnd: "Acaba la totalidad",
      partialEnd: "Último contacto",
    } as Record<ViewerContact, string>,
    contactShort: {
      partialStart: "C1",
      totalityStart: "C2",
      maximum: "MÁX",
      totalityEnd: "C3",
      partialEnd: "C4",
    } as Record<ViewerContact, string>,
    momentGeneric: "Durante el eclipse",

    settingsTitle: "Ajustes del visor",
    manualTitle: "Ajuste manual",
    manualLead: "Indica hacia dónde apunta el móvil ahora mismo y el círculo se colocará solo.",
    manualHeading: "Rumbo del móvil",
    manualElevation: "Inclinación de la cámara",
    manualSwitch: "Mi móvil no detecta la brújula: usar ajuste manual",
    manualRetry: "Volver a intentar con la brújula",
    offsetTitle: "Corrección de rumbo",
    offsetLead: "Si sabes que la brújula se desvía, corrígela aquí.",

    noCompass: "Este dispositivo no entrega un rumbo fiable. Hemos pasado a ajuste manual.",
    deniedOrientation: "Has denegado el acceso a la orientación. El visor funciona en ajuste manual.",
    lowAccuracy: "La brújula no está bien calibrada: vuelve a dibujar un ocho en el aire, lejos de metales.",
    manualNotice: "Ajuste manual: el círculo se coloca donde tú digas, no donde apunta el móvil.",

    errorInsecure: "El visor necesita una conexión segura (https). Abre la web con https:// y vuelve a intentarlo.",
    errorDenied: "No has dado permiso para usar la cámara. Puedes concederlo desde los ajustes del navegador.",
    errorUnavailable: "No hemos podido abrir la cámara. Puede que otra aplicación la esté usando.",
    errorUnsupported: "Este navegador no permite abrir la cámara desde una web.",
    retry: "Reintentar",

    disclaimer:
      "Posición calculada para tu punto. La calibración de la brújula, la precisión del GPS, el metal que tengas cerca y el campo visual real de tu cámara pueden desplazar unos grados lo que ves.",
    warning: "No mires al Sol sin gafas certificadas: la pantalla y la cámara no protegen tus ojos.",
    noTrack: "Desde este punto el Sol está bajo el horizonte durante el eclipse.",
    degrees: "°",
    cardinal: ["N", "NE", "E", "SE", "S", "SO", "O", "NO"],
    close2: "Cerrar",
  },
  en: {
    cardTitle: "Camera sun viewer",
    cardLead:
      "Point your phone where you plan to be and use the camera to check whether a building, a tree or a hill will block the eclipse.",
    cardOpen: "Calibrate and open the viewer",
    cardNote: "Mobile only, with a camera and a compass. Nothing the camera sees is recorded or leaves your phone.",

    calibrateTitle: "Before opening the camera",
    calibrateLead: "Phone compasses drift easily. A minute of calibration saves you from aiming at the wrong patch of sky.",
    calibrateSteps: [
      "Move away from cars, railings, lampposts and any metal structure.",
      "Take the phone out of magnetic cases and keep it away from speakers, chargers and headphones.",
      "Holding the phone, draw a figure of eight in the air several times, rotating your wrist.",
      "Hold the phone upright: that is the orientation the viewer handles best.",
    ],
    calibrateCheck: "Live check",
    calibrateCheckHint: "Turn on the spot: if the needle moves and the heading changes, the compass is working.",
    compassAbsolute: "Absolute heading: the compass responds",
    compassRelative: "The phone reports orientation but no absolute heading. You will have to set it by hand.",
    compassSilent: "No reading yet",
    compassPermission: "Grant the orientation permission to see the reading",
    accuracyReported: (deg: number) => `Accuracy reported by the system: ±${deg}°`,
    eyeTitle: "Eye hazard",
    eyeBody:
      "NEVER look directly at the Sun without certified eclipse glasses (ISO 12312-2 with CE marking), not even through this phone's screen. Use the viewer to look at the screen, not at the sky.",
    calibrateGrant: "I understand the risk · open the camera",
    calibrateManual: "My phone has no compass: use manual adjustment",
    calibrateBack: "Cancel",

    opening: "Opening the camera…",
    close: "Exit",
    viewerLabel: "Camera sun viewer",
    skyAt: "Sky on",
    targetAzimuth: "Azimuth",
    targetAltitude: "Altitude",
    covered: "Disc covered",
    aiming: "You are aiming at",
    waitingCompass: "Waiting for the compass…",

    statusSearchingTitle: "Looking for the Sun",
    statusSearchingBody: "Turn slowly, following the amber arrows.",
    statusNearTitle: "Almost there",
    statusNearBody: "Fine-tune until the circle sits inside the reticle.",
    statusLockedTitle: "The Sun will be here",
    statusLockedBody: "Whatever you see inside the circle will block the eclipse at that moment.",
    turn: (deg: number, right: boolean) => `Turn ${deg}° ${right ? "right" : "left"}`,
    tilt: (deg: number, up: boolean) => `Tilt ${deg}° ${up ? "up" : "down"}`,
    turnShort: "Turn",
    tiltUpShort: "Up",
    tiltDownShort: "Down",

    timeButton: "Moment",
    settingsButton: "Settings",
    timeTitle: "Which moment of the eclipse",
    timeLead:
      "The Sun moves during the eclipse. Check the start and the end too: a building that does not block maximum may block the rest.",
    trackToggle: "Draw the Sun's path",
    trackLegend: "The blue line is the path the Sun will follow through the whole eclipse.",
    contactNames: {
      partialStart: "First contact",
      totalityStart: "Totality begins",
      maximum: "Maximum",
      totalityEnd: "Totality ends",
      partialEnd: "Last contact",
    } as Record<ViewerContact, string>,
    contactShort: {
      partialStart: "C1",
      totalityStart: "C2",
      maximum: "MAX",
      totalityEnd: "C3",
      partialEnd: "C4",
    } as Record<ViewerContact, string>,
    momentGeneric: "During the eclipse",

    settingsTitle: "Viewer settings",
    manualTitle: "Manual adjustment",
    manualLead: "Tell us where the phone is pointing right now and the circle will place itself.",
    manualHeading: "Phone heading",
    manualElevation: "Camera tilt",
    manualSwitch: "My phone has no compass: use manual adjustment",
    manualRetry: "Try the compass again",
    offsetTitle: "Heading correction",
    offsetLead: "If you know the compass is off, correct it here.",

    noCompass: "This device does not report a reliable heading. We switched to manual adjustment.",
    deniedOrientation: "You denied access to orientation. The viewer works in manual adjustment.",
    lowAccuracy: "The compass is poorly calibrated: draw a figure of eight again, away from metal.",
    manualNotice: "Manual adjustment: the circle goes where you say, not where the phone points.",

    errorInsecure: "The viewer needs a secure connection (https). Open the site over https:// and try again.",
    errorDenied: "You did not allow camera access. You can grant it from your browser settings.",
    errorUnavailable: "We could not open the camera. Another app may be using it.",
    errorUnsupported: "This browser cannot open the camera from a web page.",
    retry: "Try again",

    disclaimer:
      "Position computed for your point. Compass calibration, GPS accuracy, nearby metal and your camera's real field of view can shift what you see by a few degrees.",
    warning: "Do not look at the Sun without certified glasses: the screen and the camera do not protect your eyes.",
    noTrack: "From this point the Sun is below the horizon during the eclipse.",
    degrees: "°",
    cardinal: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
    close2: "Close",
  },
} as const;

/**
 * El recorrido tal y como lo publica `/api/circumstances`.
 *
 * Lo comparten el localizador y el visor, que piden ese endpoint cuando el
 * usuario afina con su ubicación.
 */
export interface ApiTrackPoint {
  timeLocal: string | null;
  azimuthDeg: number;
  altitudeDeg: number;
  obscuration: number;
  contact: ViewerContact | null;
}

/**
 * Pasa el recorrido de la API a lo que espera el visor.
 *
 * Una respuesta cacheada de antes de que el recorrido existiera no lo trae, y
 * una hora local que el servidor no pudo formatear tampoco sirve de nada: los dos
 * casos acaban en una lista vacía y el visor se abre con el máximo, que es el
 * dato que siempre hay.
 */
export function trackFromApi(track: readonly ApiTrackPoint[] | undefined | null): ViewerTrackPoint[] {
  if (!Array.isArray(track)) return [];
  return track
    .filter((point) => typeof point?.timeLocal === "string")
    .map((point) => ({
      time: point.timeLocal as string,
      azimuthDeg: point.azimuthDeg,
      altitudeDeg: point.altitudeDeg,
      obscuration: point.obscuration,
      contact: point.contact ?? null,
    }));
}

/** Punto cardinal más próximo, para no depender solo de una cifra en grados. */
function cardinal(deg: number, locale: Locale): string {
  return TEXTS[locale].cardinal[Math.round(normalizeDegrees(deg) / 45) % 8];
}

/**
 * ¿Estamos en un origen que permita cámara y sensores?
 *
 * `isSecureContext` ya considera seguro `localhost`, así que en desarrollo no
 * estorba; en producción sin https la respuesta es que no, y hay que decirlo con
 * un mensaje comprensible en vez de dejar que `getUserMedia` falle sin explicación.
 */
function isInsecureOrigin(): boolean {
  if (typeof window === "undefined") return false;
  return !window.isSecureContext;
}

/** `screen.orientation.angle`, con respaldo para navegadores que no lo exponen. */
function readScreenAngle(): number {
  if (typeof window === "undefined") return 0;
  const angle = window.screen?.orientation?.angle;
  return typeof angle === "number" ? angle : 0;
}

/** Día del eclipse, corto y en el idioma de la página. No se escribe a mano. */
function eclipseDayLabel(locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(ECLIPSE.dateISO));
}

export function SolarARViewer({
  locale,
  sunAzimuthDeg,
  sunAltitudeDeg,
  maximumTime,
  timeZone,
  track,
}: {
  locale: Locale;
  /** Azimut del Sol en el máximo, grados desde el norte. Sale del cálculo besseliano. */
  sunAzimuthDeg: number;
  /** Altura del Sol sobre el horizonte en el máximo, grados. */
  sunAltitudeDeg: number;
  /** Hora local del máximo, ya formateada por quien llama. */
  maximumTime: string;
  /** Zona horaria de esa hora, para que no quede ambigua. */
  timeZone?: string;
  /**
   * Recorrido del Sol durante todo el eclipse, ya resuelto.
   *
   * Es opcional a propósito: una respuesta de `/api/circumstances` cacheada de
   * antes de que existiera el recorrido no la trae, y el visor tiene que abrirse
   * igual con el único punto que siempre hay, el del máximo.
   */
  track?: readonly ViewerTrackPoint[];
}) {
  const t = TEXTS[locale];

  const [stage, setStage] = useState<Stage>("idle");
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("idle");
  const [cameraError, setCameraError] = useState<CameraErrorKind | null>(null);
  const [mode, setMode] = useState<OrientationMode>("sensor");
  const [modeNotice, setModeNotice] = useState<"denied" | "timeout" | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);
  const [screenAngle, setScreenAngle] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [panel, setPanel] = useState<Panel>("none");
  const [showTrack, setShowTrack] = useState(true);
  /** El portal necesita `document`, que no existe en el renderizado del servidor. */
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Valores del modo manual. Arrancan en un sur genérico a media altura y NO en la
  // posición del Sol: si arrancaran allí, el visor daría por bueno el encuadre
  // antes de que el usuario haya indicado nada, que es justo la confirmación falsa
  // que hay que evitar.
  const [manualHeading, setManualHeading] = useState(180);
  const [manualElevation, setManualElevation] = useState(30);
  const [headingOffset, setHeadingOffset] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const calibrateButtonRef = useRef<HTMLButtonElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  /** Cada apertura de cámara lleva su número: si cambia, el stream que llegue tarde se tira. */
  const openTokenRef = useRef(0);
  const lastSensorUpdateRef = useRef(0);
  /** Última lectura, para consultarla sin volver a montar el temporizador de la brújula. */
  const readingRef = useRef<Reading | null>(null);

  // --- Recorrido del Sol ---------------------------------------------------

  /**
   * Los puntos que el visor puede enseñar.
   *
   * Sin recorrido queda el máximo, que es el dato que siempre llega. Con él, el
   * eclipse entero: los cinco contactos y la rejilla intermedia.
   */
  const points = useMemo<ViewerTrackPoint[]>(() => {
    if (track && track.length > 0) return [...track];
    return [
      {
        time: maximumTime,
        azimuthDeg: sunAzimuthDeg,
        altitudeDeg: sunAltitudeDeg,
        obscuration: null,
        contact: "maximum",
      },
    ];
  }, [track, maximumTime, sunAzimuthDeg, sunAltitudeDeg]);

  /** Índice del máximo: es donde se abre el visor, porque es la pregunta por defecto. */
  const maximumIndex = useMemo(() => {
    const found = points.findIndex((point) => point.contact === "maximum");
    return found >= 0 ? found : Math.floor(points.length / 2);
  }, [points]);

  const [selectedIndex, setSelectedIndex] = useState(maximumIndex);

  // Si cambian los puntos —el usuario afina con el GPS— el índice guardado puede
  // señalar a otro instante o salirse del array: se vuelve al máximo.
  useEffect(() => {
    setSelectedIndex(maximumIndex);
  }, [maximumIndex, points.length]);

  const selected = points[Math.min(selectedIndex, points.length - 1)] ?? points[0];
  const contacts = useMemo(() => points.filter((point) => point.contact !== null), [points]);

  /** Para el stream y suelta la cámara. Idempotente. */
  const stopStream = useCallback(() => {
    const current = streamRef.current;
    if (current) {
      current.getTracks().forEach((mediaTrack) => mediaTrack.stop());
      streamRef.current = null;
    }
    setStream(null);
  }, []);

  // Red de seguridad: si el componente desaparece con el visor abierto —navegación,
  // recarga parcial, error de React— la cámara se apaga igual. Solo usa la ref, así
  // que no vuelve a montarse nunca.
  useEffect(() => {
    return () => {
      const current = streamRef.current;
      if (current) {
        current.getTracks().forEach((mediaTrack) => mediaTrack.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const closeViewer = useCallback(() => {
    openTokenRef.current += 1;
    stopStream();
    setStage("idle");
    setCameraStatus("idle");
    setCameraError(null);
    readingRef.current = null;
    setReading(null);
    setModeNotice(null);
    setPanel("none");
  }, [stopStream]);

  const openCamera = useCallback(async () => {
    if (isInsecureOrigin()) {
      setCameraStatus("error");
      setCameraError("insecure");
      return;
    }
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraStatus("error");
      setCameraError("unsupported");
      return;
    }

    // Si ya hubiera una cámara abierta —un reintento, una doble pulsación— se suelta
    // antes de pedir otra: dos streams vivos dejan el indicador de cámara encendido.
    stopStream();

    const token = ++openTokenRef.current;
    setCameraStatus("opening");
    setCameraError(null);

    try {
      const media = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      // El usuario puede haber cerrado el visor mientras el navegador pedía permiso.
      // Si eso ha pasado, el stream que acaba de llegar no lo va a ver nadie: se para.
      if (token !== openTokenRef.current) {
        media.getTracks().forEach((mediaTrack) => mediaTrack.stop());
        return;
      }

      streamRef.current = media;
      setStream(media);
      setCameraStatus("ready");
    } catch (error) {
      if (token !== openTokenRef.current) return;
      const name = error instanceof DOMException ? error.name : "";
      setCameraStatus("error");
      setCameraError(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "unavailable");
    }
  }, [stopStream]);

  /**
   * Conecta el MediaStream al `<video>`.
   *
   * Va en un efecto y no dentro de `openCamera` a propósito: cuando `getUserMedia`
   * resuelve, el `<video>` puede no estar montado todavía —el visor solo se dibuja
   * cuando `stage` vale `viewer`— y asignar `srcObject` sobre `null` es una
   * condición de carrera que deja la pantalla en negro sin ningún error. El efecto
   * corre después del renderizado, con las dos cosas ya en su sitio.
   */
  useEffect(() => {
    if (stage !== "viewer" || !stream) return;
    const video = videoRef.current;
    if (!video) return;

    video.srcObject = stream;
    let cancelled = false;
    void video.play().catch(() => {
      // Safari rechaza `play()` si pierde el gesto del usuario. El `<video>` lleva
      // `autoPlay`, así que casi siempre arranca igual; si no, es un fallo real.
      if (!cancelled && video.paused) setCameraError("unavailable");
    });

    return () => {
      cancelled = true;
      video.srcObject = null;
    };
  }, [stage, stream]);

  /** Orientación de la pantalla: decide qué campo visual es el horizontal. */
  useEffect(() => {
    if (stage !== "viewer") return;
    const update = () => setScreenAngle(readScreenAngle());
    update();
    window.addEventListener("orientationchange", update);
    window.screen?.orientation?.addEventListener?.("change", update);
    return () => {
      window.removeEventListener("orientationchange", update);
      window.screen?.orientation?.removeEventListener?.("change", update);
    };
  }, [stage]);

  /**
   * Sensores de orientación.
   *
   * Se escuchan los dos eventos y se registran una sola vez: `deviceorientationabsolute`
   * es el que da rumbo absoluto en Android, y `deviceorientation` es el respaldo y el
   * único que existe en Safari, donde la referencia absoluta llega por
   * `webkitCompassHeading`. En cuanto llega un evento absoluto, el relativo se ignora,
   * de modo que nunca hay dos fuentes peleándose por el mismo estado.
   *
   * Escuchan también durante la calibración, y no solo con el visor abierto: saber
   * si la brújula responde **antes** de encender la cámara es la mitad del valor de
   * esa pantalla. En iOS no llegará nada hasta que se conceda el permiso, que es
   * exactamente lo que la pantalla dice.
   */
  useEffect(() => {
    const listening = stage === "calibrating" || (stage === "viewer" && mode === "sensor");
    if (!listening) return;
    if (typeof window === "undefined" || typeof window.DeviceOrientationEvent === "undefined") return;

    let sawAbsolute = false;

    const apply = (event: DeviceOrientationEvent, absoluteEvent: boolean) => {
      const now = Date.now();
      if (now - lastSensorUpdateRef.current < SENSOR_THROTTLE_MS) return;
      lastSensorUpdateRef.current = now;

      const safari = event as SafariOrientationEvent;
      const webkitHeading = safari.webkitCompassHeading;
      const hasWebkitHeading = typeof webkitHeading === "number" && Number.isFinite(webkitHeading);

      // En iOS `alpha` es relativo al punto en el que se abrió la página. La única
      // referencia absoluta es `webkitCompassHeading`, que es el rumbo del propio
      // `alpha`: se convierte y se le pasa a la misma matemática que en Android.
      const alpha = hasWebkitHeading ? normalizeDegrees(360 - webkitHeading) : event.alpha;

      const next: Reading = {
        alpha,
        beta: event.beta,
        gamma: event.gamma,
        absolute: absoluteEvent || event.absolute === true || hasWebkitHeading,
        accuracy: typeof safari.webkitCompassAccuracy === "number" ? safari.webkitCompassAccuracy : null,
      };
      readingRef.current = next;
      setReading(next);
    };

    const onAbsolute = (event: Event) => {
      sawAbsolute = true;
      apply(event as DeviceOrientationEvent, true);
    };
    const onRelative = (event: DeviceOrientationEvent) => {
      if (sawAbsolute) return;
      apply(event, false);
    };

    window.addEventListener("deviceorientationabsolute", onAbsolute);
    window.addEventListener("deviceorientation", onRelative);

    return () => {
      window.removeEventListener("deviceorientationabsolute", onAbsolute);
      window.removeEventListener("deviceorientation", onRelative);
    };
  }, [stage, mode]);

  /**
   * El visor no se queda esperando a una brújula que no va a llegar.
   *
   * Hay WebViews y navegadores de escritorio que entregan el evento sin rumbo
   * absoluto, o directamente no lo entregan. Pasado el plazo se cambia a manual y se
   * dice por qué, con la puerta abierta a reintentar.
   */
  useEffect(() => {
    if (stage !== "viewer" || mode !== "sensor") return;
    const timer = window.setTimeout(() => {
      if (readingRef.current?.absolute) return;
      setMode("manual");
      setModeNotice("timeout");
    }, COMPASS_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [stage, mode]);

  /**
   * Teclado y foco de las dos pantallas a pantalla completa.
   *
   * Escape cierra primero el panel abierto y solo después el visor: si cerrara las
   * dos cosas a la vez, salir de los ajustes apagaría la cámara.
   */
  useEffect(() => {
    if (stage === "idle") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (stage === "viewer" && panel !== "none") setPanel("none");
      else if (stage === "viewer") closeViewer();
      else setStage("idle");
    };
    window.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [stage, panel, closeViewer]);

  /** El foco entra en el primer control accionable de cada pantalla. */
  useEffect(() => {
    if (stage === "viewer") closeButtonRef.current?.focus();
    else if (stage === "calibrating") calibrateButtonRef.current?.focus();
  }, [stage]);

  /**
   * Pide el permiso de orientación y abre la cámara.
   *
   * `requestPermission()` de iOS tiene que salir del gesto del usuario, así que es
   * lo primero que se hace en el manejador del clic, antes de cualquier `await`
   * ajeno. Si no existe —Android y escritorio— se pasa directamente a la cámara. Si
   * se deniega, no se bloquea nada: se abre igual en modo manual.
   */
  async function requestOrientation(): Promise<void> {
    const constructor = typeof window !== "undefined"
      ? (window.DeviceOrientationEvent as unknown as PermissionCapableOrientation | undefined)
      : undefined;

    if (!constructor) {
      setMode("manual");
      setModeNotice("timeout");
      return;
    }
    if (typeof constructor.requestPermission !== "function") {
      setMode("sensor");
      setModeNotice(null);
      return;
    }
    try {
      const result = await constructor.requestPermission();
      if (result !== "granted") {
        setMode("manual");
        setModeNotice("denied");
      } else {
        setMode("sensor");
        setModeNotice(null);
      }
    } catch {
      setMode("manual");
      setModeNotice("denied");
    }
  }

  async function startViewer() {
    await requestOrientation();
    setStage("viewer");
    await openCamera();
  }

  /** Abre el visor sin tocar los sensores: el usuario ya sabe que no tiene brújula. */
  async function startManual() {
    setMode("manual");
    setModeNotice(null);
    setStage("viewer");
    await openCamera();
  }

  // --- Geometría -----------------------------------------------------------

  const fov = fovForScreenAngle(screenAngle);
  const emptyReading = { alpha: null, beta: null, gamma: null };
  const sensorHeading = compassHeading(reading ?? emptyReading);
  const sensorElevation = cameraElevation(reading ?? emptyReading);

  // En modo manual el rumbo lo pone el usuario, así que la corrección del
  // magnetómetro no pinta nada: se aplica solo sobre la lectura del sensor.
  const cameraAzimuthDeg =
    mode === "manual" ? manualHeading : sensorHeading === null ? null : normalizeDegrees(sensorHeading + headingOffset);
  const cameraAltitudeDeg = mode === "manual" ? manualElevation : sensorElevation;

  const hasAim = cameraAzimuthDeg !== null && cameraAltitudeDeg !== null;
  const aim = hasAim
    ? {
        cameraAzimuthDeg: cameraAzimuthDeg as number,
        cameraAltitudeDeg: cameraAltitudeDeg as number,
        fovHorizontalDeg: fov.horizontal,
        fovVerticalDeg: fov.vertical,
      }
    : null;

  const projection = aim
    ? projectTarget({
        targetAzimuthDeg: selected.azimuthDeg,
        targetAltitudeDeg: selected.altitudeDeg,
        ...aim,
      })
    : null;

  /**
   * Desde algunos puntos el Sol está bajo el horizonte durante el eclipse.
   *
   * La geometría besseliana sitúa al observador respecto al cono de sombra sin
   * preguntarse si mira hacia el Sol, así que en las antípodas sale un eclipse
   * perfectamente calculado que ocurre bajo tierra. Aquí no se guía a nadie: se
   * dice que desde ese punto no hay nada que apuntar.
   */
  const belowHorizon = selected.altitudeDeg <= 0;

  const state = projection && !belowHorizon ? alignmentState(projection) : "searching";
  const markers = projection && !belowHorizon ? edgeMarkers(projection, ALIGN_TOLERANCE_DEG, VIEWER_INSETS) : [];

  /**
   * El recorrido, partido en trozos dibujables.
   *
   * Se corta por los puntos que quedan a la espalda: unir dos puntos a uno y otro
   * lado de la cámara dibujaría una raya atravesando la pantalla que no
   * corresponde a nada del cielo.
   */
  const trackSegments = useMemo(() => {
    if (!aim || !showTrack || belowHorizon || points.length < 2) return [] as Array<Array<{ x: number; y: number }>>;
    const projected = projectPath(points, aim);
    const segments: Array<Array<{ x: number; y: number }>> = [];
    let current: Array<{ x: number; y: number }> = [];
    for (const point of projected) {
      if (point.behind) {
        if (current.length > 1) segments.push(current);
        current = [];
        continue;
      }
      current.push({ x: point.xPercent, y: point.yPercent });
    }
    if (current.length > 1) segments.push(current);
    // Un recorrido que no roza la pantalla es ruido: no se dibuja.
    const touchesScreen = segments.some((segment) =>
      segment.some((node) => node.x >= -20 && node.x <= 120 && node.y >= -20 && node.y <= 120),
    );
    return touchesScreen ? segments : [];
  }, [aim, showTrack, belowHorizon, points]);

  /**
   * Los cinco contactos, proyectados, para marcarlos sobre el arco.
   *
   * Solo se etiquetan los que se leen. Durante la totalidad el Sol se mueve menos
   * de un grado, así que C2, el máximo y C3 caen prácticamente en el mismo píxel y
   * sus tres etiquetas se amontonan en una mancha ilegible. Se etiqueta el máximo,
   * que es el que interesa, y los demás del grupo se quedan en punto: el dato de
   * que la totalidad entera ocurre ahí mismo lo dice mejor un punto que tres
   * rótulos superpuestos.
   */
  const projectedContacts = useMemo(() => {
    if (!aim || !showTrack || belowHorizon) return [];

    const placed = contacts.map((point) => {
      const projected = projectTarget({
        targetAzimuthDeg: point.azimuthDeg,
        targetAltitudeDeg: point.altitudeDeg,
        ...aim,
      });
      return { point, x: projected.xPercent, y: projected.yPercent, labelled: false };
    });

    // El máximo se etiqueta antes que nadie; el resto, por orden de aparición.
    const priority = [...placed].sort((a, b) => {
      const rank = (contact: ViewerContact | null) => (contact === "maximum" ? 0 : 1);
      return rank(a.point.contact) - rank(b.point.contact);
    });

    const taken: Array<{ x: number; y: number }> = [];
    for (const entry of priority) {
      const clashes = taken.some((other) => Math.abs(other.x - entry.x) < 12 && Math.abs(other.y - entry.y) < 5);
      if (clashes) continue;
      entry.labelled = true;
      taken.push({ x: entry.x, y: entry.y });
    }

    return placed;
  }, [aim, showTrack, belowHorizon, contacts]);

  // La retícula ocupa exactamente la tolerancia de alineación: lo que cabe dentro
  // del círculo es lo que taparía el Sol.
  const reticleWidthPercent = ((ALIGN_TOLERANCE_DEG * 2) / fov.horizontal) * 100;

  // Safari devuelve una precisión negativa cuando la brújula no está calibrada.
  const lowAccuracy = mode === "sensor" && typeof reading?.accuracy === "number" && reading.accuracy < 0;
  const reportedAccuracy =
    typeof reading?.accuracy === "number" && reading.accuracy >= 0 ? Math.round(reading.accuracy) : null;

  const momentLabel = selected.contact ? t.contactNames[selected.contact] : t.momentGeneric;
  const dayLabel = eclipseDayLabel(locale);

  /** Lo que se anuncia por el lector de pantalla y se lee en la banda de estado. */
  const guidance = belowHorizon
    ? t.noTrack
    : !projection
    ? t.waitingCompass
    : state === "aligned"
      ? t.statusLockedBody
      : markers
          .map((marker) =>
            marker.axis === "horizontal"
              ? t.turn(marker.degrees, marker.side === "right")
              : t.tilt(marker.degrees, marker.side === "up"),
          )
          .join(" · ");

  // --- Estilos compartidos -------------------------------------------------

  const panelStyle = { background: "hsl(var(--viewer-panel))", color: "hsl(var(--viewer-ink))" };
  const sheetStyle = { background: "hsl(var(--viewer-panel-strong))", color: "hsl(var(--viewer-ink))" };
  const dimStyle = { color: "hsl(var(--viewer-ink-dim))" };
  const sliderClass = "mt-1 w-full";
  const sliderStyle = { accentColor: "hsl(var(--viewer-guide))" };

  // --- Tarjeta -------------------------------------------------------------

  const card = (
    <div
      className="rounded-2xl border p-5"
      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface))" }}
    >
      <h3 className="text-lg font-bold">{t.cardTitle}</h3>
      <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
        {t.cardLead}
      </p>
      <button
        type="button"
        onClick={() => setStage("calibrating")}
        className="mt-4 w-full rounded-xl px-5 py-3 font-semibold sm:w-auto"
        style={{ background: "hsl(var(--accent))", color: "hsl(var(--on-accent))" }}
      >
        {t.cardOpen}
      </button>
      <p className="mt-3 text-xs" style={{ color: "hsl(var(--muted))" }}>
        {t.cardNote}
      </p>
    </div>
  );

  // --- Calibración ---------------------------------------------------------

  /**
   * Aguja de la brújula.
   *
   * No es decoración: es la comprobación de que el magnetómetro responde antes de
   * encender la cámara. Si al girar sobre uno mismo la aguja no se mueve, no hace
   * falta abrir nada para saber que hay que usar el ajuste manual.
   */
  const compassDial = (
    <svg viewBox="0 0 100 100" className="h-24 w-24" role="img" aria-label={t.calibrateCheck}>
      <circle cx="50" cy="50" r="46" fill="none" stroke="hsl(var(--viewer-ink) / 0.3)" strokeWidth="2" />
      {[0, 90, 180, 270].map((angle, index) => (
        <text
          key={angle}
          x={50 + 38 * Math.sin((angle * Math.PI) / 180)}
          y={50 - 38 * Math.cos((angle * Math.PI) / 180) + 4}
          textAnchor="middle"
          fontSize="11"
          fill="hsl(var(--viewer-ink-dim))"
        >
          {t.cardinal[index * 2]}
        </text>
      ))}
      {sensorHeading !== null && (
        <g transform={`rotate(${sensorHeading} 50 50)`}>
          <polygon points="50,12 44,54 56,54" fill="hsl(var(--viewer-guide))" />
          <polygon points="50,88 44,54 56,54" fill="hsl(var(--viewer-ink) / 0.35)" />
        </g>
      )}
      <circle cx="50" cy="50" r="4" fill="hsl(var(--viewer-ink))" />
    </svg>
  );

  const calibration = stage !== "calibrating" ? null : (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="solar-ar-calibrate-title"
      className="fixed inset-0 z-[100] overflow-y-auto"
      style={{ background: "hsl(var(--bg))", color: "hsl(var(--viewer-ink))" }}
    >
      <div
        className="mx-auto max-w-lg px-5"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 1.5rem)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)",
        }}
      >
        <h2 id="solar-ar-calibrate-title" className="text-2xl font-black">
          {t.calibrateTitle}
        </h2>
        <p className="mt-3 text-sm" style={dimStyle}>
          {t.calibrateLead}
        </p>
        <ol className="mt-5 space-y-3">
          {t.calibrateSteps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: "hsl(var(--accent))", color: "hsl(var(--on-accent))" }}
              >
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div
          className="mt-6 flex items-center gap-4 rounded-2xl border p-4"
          style={{ borderColor: "hsl(var(--border-strong))", background: "hsl(var(--surface))" }}
        >
          {compassDial}
          <div className="min-w-0 text-sm">
            <p className="font-bold">{t.calibrateCheck}</p>
            <p className="mt-1 tabular-nums" style={{ color: "hsl(var(--viewer-guide))" }}>
              {sensorHeading === null
                ? "—"
                : `${Math.round(sensorHeading)}${t.degrees} ${cardinal(sensorHeading, locale)}`}
            </p>
            <p className="mt-1 text-xs" style={dimStyle}>
              {reading === null
                ? typeof window !== "undefined" &&
                  typeof (window.DeviceOrientationEvent as unknown as PermissionCapableOrientation | undefined)
                    ?.requestPermission === "function"
                  ? t.compassPermission
                  : t.compassSilent
                : reading.absolute
                  ? t.compassAbsolute
                  : t.compassRelative}
            </p>
            {reportedAccuracy !== null && (
              <p className="mt-1 text-xs" style={dimStyle}>
                {t.accuracyReported(reportedAccuracy)}
              </p>
            )}
            <p className="mt-1 text-xs" style={dimStyle}>
              {t.calibrateCheckHint}
            </p>
          </div>
        </div>

        <div
          className="mt-6 rounded-2xl border p-4"
          style={{ borderColor: "hsl(var(--viewer-alert))", background: "hsl(var(--viewer-alert) / 0.12)" }}
        >
          <p className="text-sm font-black uppercase tracking-wide" style={{ color: "hsl(var(--viewer-alert))" }}>
            {t.eyeTitle}
          </p>
          <p className="mt-2 text-sm">{t.eyeBody}</p>
        </div>

        <div className="mt-6 space-y-3">
          <button
            ref={calibrateButtonRef}
            type="button"
            onClick={() => void startViewer()}
            className="w-full rounded-xl px-5 py-4 text-base font-bold"
            style={{ background: "hsl(var(--accent))", color: "hsl(var(--on-accent))" }}
          >
            {t.calibrateGrant}
          </button>
          <button
            type="button"
            onClick={() => void startManual()}
            className="w-full rounded-xl border px-5 py-3 text-sm font-semibold"
            style={{ borderColor: "hsl(var(--border-strong))", color: "hsl(var(--viewer-ink))" }}
          >
            {t.calibrateManual}
          </button>
          <button
            type="button"
            onClick={() => setStage("idle")}
            className="w-full rounded-xl px-5 py-3 text-sm"
            style={dimStyle}
          >
            {t.calibrateBack}
          </button>
        </div>
      </div>
    </div>
  );

  // --- Paneles del visor ---------------------------------------------------

  const timePanel = (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-black">{t.timeTitle}</h3>
        <p className="mt-1 text-xs" style={dimStyle}>
          {t.timeLead}
        </p>
      </div>

      {contacts.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {contacts.map((point) => {
            const index = points.indexOf(point);
            const active = index === selectedIndex;
            return (
              <button
                key={point.contact}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="rounded-lg px-3 py-2 text-xs font-bold"
                style={{
                  background: active ? "hsl(var(--viewer-guide))" : "hsl(var(--viewer-ink) / 0.12)",
                  color: active ? "hsl(var(--on-accent))" : "hsl(var(--viewer-ink))",
                }}
                aria-pressed={active}
              >
                {point.contact ? t.contactShort[point.contact] : ""}
                <span className="ml-2 font-normal tabular-nums">{point.time}</span>
              </button>
            );
          })}
        </div>
      )}

      {points.length > 1 && (
        <label className="block text-xs font-semibold">
          <span className="sr-only">{t.timeTitle}</span>
          <input
            type="range"
            min={0}
            max={points.length - 1}
            step={1}
            value={Math.min(selectedIndex, points.length - 1)}
            onChange={(event) => setSelectedIndex(Number(event.target.value))}
            className="w-full"
            style={sliderStyle}
            aria-label={t.timeTitle}
          />
          <span className="mt-1 flex justify-between tabular-nums" style={dimStyle}>
            <span>{points[0].time}</span>
            <span>{points[points.length - 1].time}</span>
          </span>
        </label>
      )}

      {points.length > 1 && (
        <label className="flex items-center gap-3 text-xs font-semibold">
          <input
            type="checkbox"
            checked={showTrack}
            onChange={(event) => setShowTrack(event.target.checked)}
            style={sliderStyle}
          />
          <span>
            {t.trackToggle}
            <span className="block font-normal" style={dimStyle}>
              {t.trackLegend}
            </span>
          </span>
        </label>
      )}
    </div>
  );

  const settingsPanel = (
    <div className="space-y-4">
      <h3 className="text-base font-black">{t.settingsTitle}</h3>

      {mode === "manual" ? (
        <div className="space-y-3">
          <p className="text-xs" style={dimStyle}>
            {t.manualLead}
          </p>
          <label className="block text-xs font-semibold">
            {t.manualHeading}:{" "}
            <span className="tabular-nums">
              {manualHeading}
              {t.degrees} {cardinal(manualHeading, locale)}
            </span>
            <input
              type="range"
              min={0}
              max={359}
              step={1}
              value={manualHeading}
              onChange={(event) => setManualHeading(Number(event.target.value))}
              className={sliderClass}
              style={sliderStyle}
            />
          </label>
          <label className="block text-xs font-semibold">
            {t.manualElevation}:{" "}
            <span className="tabular-nums">
              {manualElevation}
              {t.degrees}
            </span>
            <input
              type="range"
              min={-20}
              max={90}
              step={1}
              value={manualElevation}
              onChange={(event) => setManualElevation(Number(event.target.value))}
              className={sliderClass}
              style={sliderStyle}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              setMode("sensor");
              setModeNotice(null);
              readingRef.current = null;
              setReading(null);
            }}
            className="w-full rounded-lg border px-3 py-2 text-xs font-semibold"
            style={{ borderColor: "hsl(var(--viewer-ink) / 0.4)", color: "hsl(var(--viewer-ink))" }}
          >
            {t.manualRetry}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <label className="block text-xs font-semibold">
            {t.offsetTitle}:{" "}
            <span className="tabular-nums">
              {headingOffset > 0 ? "+" : ""}
              {headingOffset}
              {t.degrees}
            </span>
            <input
              type="range"
              min={-HEADING_OFFSET_RANGE}
              max={HEADING_OFFSET_RANGE}
              step={1}
              value={headingOffset}
              onChange={(event) => setHeadingOffset(Number(event.target.value))}
              className={sliderClass}
              style={sliderStyle}
            />
          </label>
          <p className="text-xs" style={dimStyle}>
            {t.offsetLead}
          </p>
          <button
            type="button"
            onClick={() => {
              setMode("manual");
              setModeNotice(null);
            }}
            className="w-full rounded-lg border px-3 py-2 text-xs font-semibold"
            style={{ borderColor: "hsl(var(--viewer-ink) / 0.4)", color: "hsl(var(--viewer-ink))" }}
          >
            {t.manualSwitch}
          </button>
        </div>
      )}

      <p className="text-xs" style={dimStyle}>
        {t.disclaimer}
      </p>
    </div>
  );

  // --- Visor ---------------------------------------------------------------

  const stateColor =
    state === "aligned" ? "hsl(var(--viewer-locked))" : state === "near" ? "hsl(var(--viewer-target))" : "hsl(var(--viewer-guide))";

  const viewer = stage !== "viewer" ? null : (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.viewerLabel}
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ background: "hsl(var(--bg))", color: "hsl(var(--viewer-ink))" }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {cameraStatus !== "ready" && (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          {cameraStatus === "opening" ? (
            <p className="text-base font-semibold" role="status">
              {t.opening}
            </p>
          ) : cameraStatus === "error" ? (
            <div className="max-w-sm space-y-4">
              <p className="text-base font-semibold" role="alert">
                {cameraError === "insecure"
                  ? t.errorInsecure
                  : cameraError === "denied"
                    ? t.errorDenied
                    : cameraError === "unsupported"
                      ? t.errorUnsupported
                      : t.errorUnavailable}
              </p>
              {cameraError !== "unsupported" && cameraError !== "insecure" && (
                <button
                  type="button"
                  onClick={() => void openCamera()}
                  className="rounded-xl px-5 py-3 font-semibold"
                  style={{ background: "hsl(var(--accent))", color: "hsl(var(--on-accent))" }}
                >
                  {t.retry}
                </button>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Superposición. Es decorativa: todo lo que dice está también en texto. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Recorrido del Sol durante todo el eclipse. `preserveAspectRatio="none"`
            hace que las coordenadas del SVG sean directamente porcentajes de
            pantalla, y `non-scaling-stroke` evita que el trazo se deforme con ellas. */}
        {trackSegments.length > 0 && (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {trackSegments.map((segment, index) => (
              <polyline
                key={index}
                points={segment.map((node) => `${node.x},${node.y}`).join(" ")}
                fill="none"
                stroke="hsl(var(--viewer-track))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                opacity="0.85"
              />
            ))}
          </svg>
        )}

        {/* Los cinco contactos, marcados sobre el arco.
            Van como elementos posicionados y no como círculos del SVG a propósito:
            ese SVG se estira con `preserveAspectRatio="none"` para que sus
            coordenadas sean porcentajes de pantalla, y dentro de él un círculo sale
            ovalado. Una línea estirada sigue siendo la misma línea; un punto, no. */}
        {projectedContacts.map(({ point, x, y, labelled }) =>
          x < -5 || x > 105 || y < -5 || y > 105 ? null : (
            <div
              key={point.contact}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span
                className="block h-2.5 w-2.5 rounded-full"
                style={{ background: "hsl(var(--viewer-track))", boxShadow: "0 0 0 2px hsl(var(--bg) / 0.6)" }}
              />
              {labelled && point.contact !== selected.contact && (
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded px-1.5 py-0.5 text-[0.65rem] font-bold"
                  style={panelStyle}
                >
                  {point.contact ? t.contactShort[point.contact] : ""}
                </span>
              )}
            </div>
          ),
        )}

        {/* Retícula fija en el centro. */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed"
          style={{
            width: `${reticleWidthPercent}%`,
            aspectRatio: "1",
            borderColor: state === "aligned" ? "hsl(var(--viewer-locked))" : "hsl(var(--viewer-ink) / 0.85)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-px w-10 -translate-x-1/2 -translate-y-1/2"
          style={{ background: "hsl(var(--viewer-ink) / 0.85)" }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-10 w-px -translate-x-1/2 -translate-y-1/2"
          style={{ background: "hsl(var(--viewer-ink) / 0.85)" }}
        />

        {/* El Sol en el instante elegido. Solo se dibuja cuando de verdad cae dentro
            del encuadre: pintarlo pegado a un borde sugeriría que el Sol está ahí. */}
        {projection?.onScreen && !belowHorizon && (
          <>
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-4"
              style={{
                left: `${projection.xPercent}%`,
                top: `${projection.yPercent}%`,
                width: `${reticleWidthPercent}vw`,
                aspectRatio: "1",
                borderColor: state === "aligned" ? "hsl(var(--viewer-locked))" : "hsl(var(--viewer-target))",
                boxShadow: "0 0 0 2px hsl(var(--bg) / 0.55), inset 0 0 0 2px hsl(var(--bg) / 0.35)",
              }}
            />
            <p
              className="absolute -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs font-bold tabular-nums"
              style={{
                ...panelStyle,
                left: `${projection.xPercent}%`,
                top: `calc(${projection.yPercent}% + ${reticleWidthPercent / 2}vw + 0.5rem)`,
              }}
            >
              {selected.time}
            </p>
          </>
        )}

        {/* Flechas de guía. Grandes y pegadas al borde hacia el que hay que moverse:
            con el móvil en alto no se lee un párrafo, se sigue una flecha. */}
        {markers.map((marker) => (
          <div
            key={marker.axis}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
            style={{ left: `${marker.xPercent}%`, top: `${marker.yPercent}%` }}
          >
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                background: "hsl(var(--viewer-guide))",
                color: "hsl(var(--on-accent))",
                boxShadow: "0 0 0 3px hsl(var(--bg) / 0.5)",
              }}
            >
              {/* Un chevrón dibujado y girado, y no un carácter: las flechas
                  tipográficas cambian de forma y de peso en cada plataforma, y
                  ésta es la única indicación que se ve con el móvil en alto. */}
              <svg viewBox="0 0 24 24" className="h-8 w-8" style={{ transform: `rotate(${ARROW_ROTATION[marker.side]}deg)` }}>
                <path
                  d="M9 4l8 8-8 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="rounded-md px-2 py-1 text-xs font-bold tabular-nums" style={panelStyle}>
              {marker.axis === "horizontal"
                ? `${t.turnShort} ${marker.degrees}${t.degrees}`
                : `${marker.side === "up" ? t.tiltUpShort : t.tiltDownShort} ${marker.degrees}${t.degrees}`}
            </span>
          </div>
        ))}
      </div>

      {/* Barra superior: el instante que se está simulando, y la salida. */}
      <div
        className="absolute inset-x-0 top-0 flex items-start gap-2 px-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.75rem)" }}
      >
        <button
          type="button"
          onClick={() => setPanel(panel === "time" ? "none" : "time")}
          className="min-w-0 flex-1 rounded-xl px-3 py-2 text-left"
          style={panelStyle}
          aria-expanded={panel === "time"}
        >
          <span className="block text-[0.65rem] uppercase tracking-widest" style={dimStyle}>
            {t.skyAt} {dayLabel}
          </span>
          <span className="block truncate text-sm font-black tabular-nums">
            {selected.time}
            {timeZone ? <span className="font-normal"> · {timeZone}</span> : null}
          </span>
          <span className="block truncate text-xs" style={{ color: "hsl(var(--viewer-guide))" }}>
            {momentLabel} {points.length > 1 ? "▾" : ""}
          </span>
        </button>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={closeViewer}
          className="shrink-0 rounded-xl px-4 py-3 text-sm font-bold"
          style={{ background: "hsl(var(--viewer-ink))", color: "hsl(var(--on-accent))", minHeight: "48px" }}
        >
          {t.close} ✕
        </button>
      </div>

      {/* Lecturas del objetivo: el dato es el activo diferencial de la red y tiene
          que leerse de un vistazo. Van en fila y debajo de la barra, no en una
          columna a media altura: el centro de la pantalla es donde el usuario está
          mirando, y los laterales son de las flechas de giro. */}
      <div
        className="absolute inset-x-3 flex gap-2"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 5.5rem)" }}
      >
        <div className="flex-1 rounded-xl border-l-4 px-3 py-2" style={{ ...panelStyle, borderColor: stateColor }}>
          <p className="text-[0.6rem] uppercase tracking-widest" style={dimStyle}>
            {t.targetAzimuth}
          </p>
          <p className="text-lg font-black leading-tight tabular-nums">
            {selected.azimuthDeg.toFixed(1)}
            {t.degrees} <span className="text-xs font-bold">{cardinal(selected.azimuthDeg, locale)}</span>
          </p>
        </div>
        <div className="flex-1 rounded-xl border-l-4 px-3 py-2" style={{ ...panelStyle, borderColor: stateColor }}>
          <p className="text-[0.6rem] uppercase tracking-widest" style={dimStyle}>
            {t.targetAltitude}
          </p>
          <p className="text-lg font-black leading-tight tabular-nums">
            {selected.altitudeDeg.toFixed(1)}
            {t.degrees}
            {selected.obscuration !== null && (
              <span className="text-xs font-bold"> · {(selected.obscuration * 100).toFixed(0)} %</span>
            )}
          </p>
        </div>
      </div>

      {/* Banda inferior: estado, avisos y los dos paneles. */}
      <div
        className="absolute inset-x-0 bottom-0 space-y-2 px-3 pt-3"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
      >
        {panel !== "none" && (
          <div className="max-h-[52vh] overflow-y-auto rounded-2xl p-4" style={sheetStyle}>
            {panel === "time" ? timePanel : settingsPanel}
            <button
              type="button"
              onClick={() => setPanel("none")}
              className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-bold"
              style={{ background: "hsl(var(--viewer-ink) / 0.14)", color: "hsl(var(--viewer-ink))" }}
            >
              {t.close2}
            </button>
          </div>
        )}

        {modeNotice && (
          <p className="rounded-xl px-3 py-2 text-xs" style={panelStyle} role="status">
            {modeNotice === "denied" ? t.deniedOrientation : t.noCompass}
          </p>
        )}
        {lowAccuracy && (
          <p className="rounded-xl px-3 py-2 text-xs" style={panelStyle} role="status">
            {t.lowAccuracy}
          </p>
        )}
        {mode === "manual" && !modeNotice && (
          <p className="rounded-xl px-3 py-2 text-xs" style={panelStyle}>
            {t.manualNotice}
          </p>
        )}

        <div className="rounded-2xl border-l-4 px-3 py-3" style={{ ...panelStyle, borderColor: stateColor }}>
          <div aria-live="polite">
            <p className="text-sm font-black uppercase tracking-wide" style={{ color: stateColor }}>
              {belowHorizon
                ? t.noTrack
                : !projection
                  ? t.waitingCompass
                  : state === "aligned"
                    ? t.statusLockedTitle
                    : state === "near"
                      ? t.statusNearTitle
                      : t.statusSearchingTitle}
            </p>
            {!belowHorizon && (
              <p className="mt-1 text-sm font-semibold">
                {!projection ? t.waitingCompass : state === "aligned" ? t.statusLockedBody : guidance}
              </p>
            )}
            {projection && !belowHorizon && state !== "aligned" && (
              <p className="mt-1 text-xs" style={dimStyle}>
                {state === "near" ? t.statusNearBody : t.statusSearchingBody}
              </p>
            )}
          </div>
          <p className="mt-2 text-xs tabular-nums" style={dimStyle}>
            {t.aiming}{" "}
            {cameraAzimuthDeg === null
              ? "—"
              : `${Math.round(cameraAzimuthDeg)}${t.degrees} ${cardinal(cameraAzimuthDeg, locale)}`}
            {cameraAltitudeDeg === null ? "" : ` · ${Math.round(cameraAltitudeDeg)}${t.degrees}`}
          </p>
        </div>

        {panel === "none" && (
          <>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPanel("time")}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-bold"
                style={panelStyle}
                aria-expanded={false}
              >
                {t.timeButton}
              </button>
              <button
                type="button"
                onClick={() => setPanel("settings")}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-bold"
                style={panelStyle}
                aria-expanded={false}
              >
                {t.settingsButton}
              </button>
            </div>

            <p
              className="rounded-xl border px-3 py-2 text-xs font-semibold"
              style={{ ...panelStyle, borderColor: "hsl(var(--viewer-alert))", color: "hsl(var(--viewer-alert))" }}
            >
              ⚠ {t.warning}
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {card}
      {mounted && (calibration || viewer)
        ? createPortal(
            <>
              {calibration}
              {viewer}
            </>,
            document.body,
          )
        : null}
    </>
  );
}
