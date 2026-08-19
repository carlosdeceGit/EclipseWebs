"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ALIGN_TOLERANCE_DEG,
  cameraElevation,
  compassHeading,
  fovForScreenAngle,
  normalizeDegrees,
  projectTarget,
} from "@/lib/eclipse/solar-viewer";
import type { Locale } from "@/lib/eclipse/types";

/**
 * Visor solar de realidad aumentada.
 *
 * Responde a una pregunta que ninguna tabla puede responder: desde este balcón
 * concreto, ¿me va a tapar el Sol aquel edificio? El azimut y la altura del Sol en
 * el máximo ya los ha calculado `besselian.ts` para las coordenadas del usuario;
 * aquí solo se superponen sobre la imagen de la cámara.
 *
 * Tres decisiones que condicionan todo el componente:
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
 */

/** Milisegundos entre actualizaciones de estado desde los sensores. */
const SENSOR_THROTTLE_MS = 50;
/** Tiempo que esperamos a que llegue un rumbo absoluto antes de pasar a manual. */
const COMPASS_TIMEOUT_MS = 8000;
/** Corrección manual del rumbo, en grados a cada lado. */
const HEADING_OFFSET_RANGE = 30;

type Stage = "idle" | "calibrating" | "viewer";
type CameraStatus = "idle" | "opening" | "ready" | "error";
type OrientationMode = "sensor" | "manual";
type CameraErrorKind = "denied" | "insecure" | "unavailable" | "unsupported";

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
      "Apunta el móvil hacia donde estará el Sol en el máximo y comprueba, con la cámara, si un edificio, un árbol o un monte te lo va a tapar.",
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
    calibrateGrant: "Permitir orientación y abrir la cámara",
    calibrateManual: "Mi móvil no detecta la brújula: usar ajuste manual",
    calibrateBack: "Cancelar",
    opening: "Abriendo la cámara…",
    close: "Cerrar el visor",
    viewerLabel: "Visor solar con cámara",
    maximum: "Máximo",
    targetAzimuth: "Azimut objetivo",
    targetAltitude: "Altura objetivo",
    currentHeading: "Rumbo actual",
    currentElevation: "Inclinación actual",
    aligned: "El Sol estará dentro del círculo central",
    behindCircle: "Lo que quede detrás del círculo amarillo tapará el Sol.",
    warning: "No mires directamente al Sol: la pantalla y la cámara no protegen tus ojos.",
    turnRight: (deg: number) => `Gira ${deg}° a la derecha`,
    turnLeft: (deg: number) => `Gira ${deg}° a la izquierda`,
    tiltUp: (deg: number) => `Inclina ${deg}° hacia arriba`,
    tiltDown: (deg: number) => `Inclina ${deg}° hacia abajo`,
    onTargetHorizontal: "Rumbo correcto",
    onTargetVertical: "Inclinación correcta",
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
    waitingCompass: "Esperando a la brújula…",
    errorInsecure: "El visor necesita una conexión segura (https). Abre la web con https:// y vuelve a intentarlo.",
    errorDenied: "No has dado permiso para usar la cámara. Puedes concederlo desde los ajustes del navegador.",
    errorUnavailable: "No hemos podido abrir la cámara. Puede que otra aplicación la esté usando.",
    errorUnsupported: "Este navegador no permite abrir la cámara desde una web.",
    retry: "Reintentar",
    degrees: "°",
    cardinal: ["N", "NE", "E", "SE", "S", "SO", "O", "NO"],
  },
  en: {
    cardTitle: "Camera sun viewer",
    cardLead:
      "Point your phone where the Sun will be at maximum and use the camera to check whether a building, a tree or a hill will block it.",
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
    calibrateGrant: "Allow orientation and open the camera",
    calibrateManual: "My phone has no compass: use manual adjustment",
    calibrateBack: "Cancel",
    opening: "Opening the camera…",
    close: "Close the viewer",
    viewerLabel: "Camera sun viewer",
    maximum: "Maximum",
    targetAzimuth: "Target azimuth",
    targetAltitude: "Target altitude",
    currentHeading: "Current heading",
    currentElevation: "Current tilt",
    aligned: "The Sun will be inside the central circle",
    behindCircle: "Whatever sits behind the yellow circle will block the Sun.",
    warning: "Do not look directly at the Sun: the screen and the camera do not protect your eyes.",
    turnRight: (deg: number) => `Turn ${deg}° right`,
    turnLeft: (deg: number) => `Turn ${deg}° left`,
    tiltUp: (deg: number) => `Tilt ${deg}° up`,
    tiltDown: (deg: number) => `Tilt ${deg}° down`,
    onTargetHorizontal: "Heading is right",
    onTargetVertical: "Tilt is right",
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
    waitingCompass: "Waiting for the compass…",
    errorInsecure: "The viewer needs a secure connection (https). Open the site over https:// and try again.",
    errorDenied: "You did not allow camera access. You can grant it from your browser settings.",
    errorUnavailable: "We could not open the camera. Another app may be using it.",
    errorUnsupported: "This browser cannot open the camera from a web page.",
    retry: "Try again",
    degrees: "°",
    cardinal: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
  },
} as const;

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

export function SolarARViewer({
  locale,
  sunAzimuthDeg,
  sunAltitudeDeg,
  maximumTime,
  timeZone,
}: {
  locale: Locale;
  /** Azimut del Sol en el máximo, grados desde el norte. Sale del cálculo besseliano. */
  sunAzimuthDeg: number;
  /** Altura del Sol sobre el horizonte en el máximo, grados. */
  sunAltitudeDeg: number;
  /** Hora local del máximo, ya formateada por el localizador. */
  maximumTime: string;
  /** Zona horaria de esa hora, para que no quede ambigua. */
  timeZone?: string;
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

  /** Para el stream y suelta la cámara. Idempotente. */
  const stopStream = useCallback(() => {
    const current = streamRef.current;
    if (current) {
      current.getTracks().forEach((track) => track.stop());
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
        current.getTracks().forEach((track) => track.stop());
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
        media.getTracks().forEach((track) => track.stop());
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
   */
  useEffect(() => {
    if (stage !== "viewer" || mode !== "sensor") return;
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
   * Escape sale de las dos, el foco entra en el primer control accionable y el
   * cuerpo deja de hacer scroll por detrás mientras haya algo abierto.
   */
  useEffect(() => {
    if (stage === "idle") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (stage === "viewer") closeViewer();
      else setStage("idle");
    };
    window.addEventListener("keydown", onKeyDown);
    (stage === "viewer" ? closeButtonRef : calibrateButtonRef).current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [stage, closeViewer]);

  /**
   * Pide el permiso de orientación y abre la cámara.
   *
   * `requestPermission()` de iOS tiene que salir del gesto del usuario, así que es
   * lo primero que se hace en el manejador del clic, antes de cualquier `await`
   * ajeno. Si no existe —Android y escritorio— se pasa directamente a la cámara. Si
   * se deniega, no se bloquea nada: se abre igual en modo manual.
   */
  async function startViewer() {
    const constructor = typeof window !== "undefined"
      ? (window.DeviceOrientationEvent as unknown as PermissionCapableOrientation | undefined)
      : undefined;

    if (!constructor) {
      setMode("manual");
      setModeNotice("timeout");
    } else if (typeof constructor.requestPermission === "function") {
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
    } else {
      setMode("sensor");
      setModeNotice(null);
    }

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
  const sensorHeading = mode === "sensor" ? compassHeading(reading ?? { alpha: null, beta: null, gamma: null }) : null;
  const sensorElevation = mode === "sensor" ? cameraElevation(reading ?? { alpha: null, beta: null, gamma: null }) : null;

  // En modo manual el rumbo lo pone el usuario, así que la corrección del
  // magnetómetro no pinta nada: se aplica solo sobre la lectura del sensor.
  const cameraAzimuthDeg =
    mode === "manual" ? manualHeading : sensorHeading === null ? null : normalizeDegrees(sensorHeading + headingOffset);
  const cameraAltitudeDeg = mode === "manual" ? manualElevation : sensorElevation;

  const hasAim = cameraAzimuthDeg !== null && cameraAltitudeDeg !== null;
  const projection = hasAim
    ? projectTarget({
        targetAzimuthDeg: sunAzimuthDeg,
        targetAltitudeDeg: sunAltitudeDeg,
        cameraAzimuthDeg,
        cameraAltitudeDeg,
        fovHorizontalDeg: fov.horizontal,
        fovVerticalDeg: fov.vertical,
      })
    : null;

  // La retícula ocupa exactamente la tolerancia de alineación: lo que cabe dentro
  // del círculo es lo que taparía el Sol.
  const reticleWidthPercent = (ALIGN_TOLERANCE_DEG * 2 / fov.horizontal) * 100;

  // Safari devuelve una precisión negativa cuando la brújula no está calibrada.
  const lowAccuracy = mode === "sensor" && typeof reading?.accuracy === "number" && reading.accuracy < 0;

  const horizontalHint = !projection
    ? null
    : Math.abs(projection.deltaAzimuthDeg) <= ALIGN_TOLERANCE_DEG
      ? { arrow: "●", text: t.onTargetHorizontal, done: true }
      : projection.deltaAzimuthDeg > 0
        ? { arrow: "▶", text: t.turnRight(Math.round(Math.abs(projection.deltaAzimuthDeg))), done: false }
        : { arrow: "◀", text: t.turnLeft(Math.round(Math.abs(projection.deltaAzimuthDeg))), done: false };

  const verticalHint = !projection
    ? null
    : Math.abs(projection.deltaAltitudeDeg) <= ALIGN_TOLERANCE_DEG
      ? { arrow: "●", text: t.onTargetVertical, done: true }
      : projection.deltaAltitudeDeg > 0
        ? { arrow: "▲", text: t.tiltUp(Math.round(Math.abs(projection.deltaAltitudeDeg))), done: false }
        : { arrow: "▼", text: t.tiltDown(Math.round(Math.abs(projection.deltaAltitudeDeg))), done: false };

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

  const calibration = stage !== "calibrating" ? null : (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="solar-ar-calibrate-title"
      className="fixed inset-0 z-[100] overflow-y-auto"
      style={{ background: "hsl(224 44% 6%)", color: "hsl(0 0% 100%)" }}
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
        <p className="mt-3 text-sm" style={{ color: "hsl(0 0% 84%)" }}>
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

        <p
          className="mt-6 rounded-xl border p-3 text-sm"
          style={{ borderColor: "hsl(45 93% 58%)", color: "hsl(45 93% 74%)" }}
        >
          {t.warning}
        </p>

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
            style={{ borderColor: "hsl(0 0% 45%)", color: "hsl(0 0% 100%)" }}
          >
            {t.calibrateManual}
          </button>
          <button
            type="button"
            onClick={() => setStage("idle")}
            className="w-full rounded-xl px-5 py-3 text-sm"
            style={{ color: "hsl(0 0% 72%)" }}
          >
            {t.calibrateBack}
          </button>
        </div>
      </div>
    </div>
  );

  // --- Visor ---------------------------------------------------------------

  const sliderClass = "w-full accent-amber-400";
  const readoutStyle = { background: "hsl(224 44% 6% / 0.72)" };

  const viewer = stage !== "viewer" ? null : (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.viewerLabel}
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ background: "#000", color: "#fff" }}
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

      {/* Superposición. Es decorativa: todo lo que dice está también en texto abajo. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Retícula fija en el centro. */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed"
          style={{ width: `${reticleWidthPercent}%`, aspectRatio: "1", borderColor: "rgba(255,255,255,0.85)" }}
        />
        <div className="absolute left-1/2 top-1/2 h-px w-10 -translate-x-1/2 -translate-y-1/2" style={{ background: "rgba(255,255,255,0.85)" }} />
        <div className="absolute left-1/2 top-1/2 h-10 w-px -translate-x-1/2 -translate-y-1/2" style={{ background: "rgba(255,255,255,0.85)" }} />

        {/* Círculo del Sol. Solo se dibuja cuando de verdad cae dentro del encuadre:
            pintarlo pegado a un borde sugeriría que el Sol está ahí, y no lo está. */}
        {projection?.onScreen && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-4"
            style={{
              left: `${projection.xPercent}%`,
              top: `${projection.yPercent}%`,
              width: `${reticleWidthPercent}%`,
              aspectRatio: "1",
              borderColor: "hsl(45 96% 58%)",
              boxShadow: "0 0 0 2px rgba(0,0,0,0.55), inset 0 0 0 2px rgba(0,0,0,0.35)",
            }}
          />
        )}
      </div>

      {/* Barra superior: cerrar y datos del objetivo. */}
      <div
        className="absolute inset-x-0 top-0 px-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.75rem)" }}
      >
        <div className="flex items-start gap-3">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeViewer}
            className="shrink-0 rounded-full px-5 py-3 text-sm font-bold"
            style={{ background: "hsl(0 0% 100%)", color: "hsl(var(--on-accent))", minHeight: "48px", minWidth: "48px" }}
          >
            ✕ <span className="sr-only">{t.close}</span>
            <span aria-hidden="true" className="ml-1 hidden sm:inline">
              {t.close}
            </span>
          </button>

          <dl className="min-w-0 flex-1 rounded-xl px-3 py-2 text-xs leading-tight" style={readoutStyle}>
            <div className="flex justify-between gap-2">
              <dt>{t.maximum}</dt>
              <dd className="font-bold tabular-nums">
                {maximumTime}
                {timeZone ? ` · ${timeZone}` : ""}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>{t.targetAzimuth}</dt>
              <dd className="font-bold tabular-nums">
                {sunAzimuthDeg.toFixed(1)}
                {t.degrees} {cardinal(sunAzimuthDeg, locale)}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>{t.targetAltitude}</dt>
              <dd className="font-bold tabular-nums">
                {sunAltitudeDeg.toFixed(1)}
                {t.degrees}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>{t.currentHeading}</dt>
              <dd className="font-bold tabular-nums">
                {cameraAzimuthDeg === null
                  ? t.waitingCompass
                  : `${Math.round(cameraAzimuthDeg)}${t.degrees} ${cardinal(cameraAzimuthDeg, locale)}`}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>{t.currentElevation}</dt>
              <dd className="font-bold tabular-nums">
                {cameraAltitudeDeg === null ? "—" : `${Math.round(cameraAltitudeDeg)}${t.degrees}`}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Panel inferior: instrucciones, avisos y ajuste manual.
          El tope de altura no es estético: la retícula está en el centro exacto de la
          pantalla y el panel no puede llegar hasta ella, o el usuario dejaría de ver
          justo lo que tiene que mirar. Con pantallas pequeñas el panel se queda corto
          y hace scroll dentro de sí mismo. */}
      <div
        className="absolute inset-x-0 bottom-0 max-h-[45%] space-y-2 overflow-y-auto px-3 pt-3"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
      >
        <div className="rounded-xl px-3 py-3" style={readoutStyle}>
          <div aria-live="polite">
            {projection?.aligned ? (
              <p className="text-base font-bold" style={{ color: "hsl(45 96% 62%)" }}>
                ✓ {t.aligned}
              </p>
            ) : (
              <ul className="space-y-1 text-base font-semibold">
                {horizontalHint && (
                  <li>
                    <span aria-hidden="true">{horizontalHint.arrow}</span> {horizontalHint.text}
                  </li>
                )}
                {verticalHint && (
                  <li>
                    <span aria-hidden="true">{verticalHint.arrow}</span> {verticalHint.text}
                  </li>
                )}
                {!projection && <li>{t.waitingCompass}</li>}
              </ul>
            )}
          </div>
          <p className="mt-2 text-xs" style={{ color: "hsl(0 0% 84%)" }}>
            {t.behindCircle}
          </p>
        </div>

        {modeNotice && (
          <p className="rounded-xl px-3 py-2 text-xs" style={readoutStyle} role="status">
            {modeNotice === "denied" ? t.deniedOrientation : t.noCompass}
          </p>
        )}
        {lowAccuracy && (
          <p className="rounded-xl px-3 py-2 text-xs" style={readoutStyle} role="status">
            {t.lowAccuracy}
          </p>
        )}

        {mode === "manual" ? (
          <div className="rounded-xl px-3 py-3" style={readoutStyle}>
            <h3 className="text-sm font-bold">{t.manualTitle}</h3>
            <p className="mt-1 text-xs" style={{ color: "hsl(0 0% 84%)" }}>
              {t.manualLead}
            </p>
            <label className="mt-3 block text-xs font-semibold">
              {t.manualHeading}: <span className="tabular-nums">{manualHeading}{t.degrees} {cardinal(manualHeading, locale)}</span>
              <input
                type="range"
                min={0}
                max={359}
                step={1}
                value={manualHeading}
                onChange={(event) => setManualHeading(Number(event.target.value))}
                className={sliderClass}
              />
            </label>
            <label className="mt-2 block text-xs font-semibold">
              {t.manualElevation}: <span className="tabular-nums">{manualElevation}{t.degrees}</span>
              <input
                type="range"
                min={-20}
                max={90}
                step={1}
                value={manualElevation}
                onChange={(event) => setManualElevation(Number(event.target.value))}
                className={sliderClass}
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
              className="mt-3 w-full rounded-lg border px-3 py-2 text-xs font-semibold"
              style={{ borderColor: "hsl(0 0% 60%)", color: "hsl(0 0% 100%)" }}
            >
              {t.manualRetry}
            </button>
          </div>
        ) : (
          <div className="rounded-xl px-3 py-3" style={readoutStyle}>
            <label className="block text-xs font-semibold">
              {t.offsetTitle}: <span className="tabular-nums">{headingOffset > 0 ? "+" : ""}{headingOffset}{t.degrees}</span>
              <input
                type="range"
                min={-HEADING_OFFSET_RANGE}
                max={HEADING_OFFSET_RANGE}
                step={1}
                value={headingOffset}
                onChange={(event) => setHeadingOffset(Number(event.target.value))}
                className={sliderClass}
              />
            </label>
            <p className="mt-1 text-xs" style={{ color: "hsl(0 0% 84%)" }}>
              {t.offsetLead}
            </p>
            <button
              type="button"
              onClick={() => {
                setMode("manual");
                setModeNotice(null);
              }}
              className="mt-3 w-full rounded-lg border px-3 py-2 text-xs font-semibold"
              style={{ borderColor: "hsl(0 0% 60%)", color: "hsl(0 0% 100%)" }}
            >
              {t.manualSwitch}
            </button>
          </div>
        )}

        <p
          className="rounded-xl border px-3 py-2 text-xs font-semibold"
          style={{ ...readoutStyle, borderColor: "hsl(45 93% 58%)", color: "hsl(45 93% 74%)" }}
        >
          ⚠ {t.warning}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {card}
      {calibration}
      {viewer}
    </>
  );
}
