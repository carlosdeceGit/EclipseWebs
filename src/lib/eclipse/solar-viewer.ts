/**
 * Geometría del visor solar de realidad aumentada.
 *
 * Todo lo que hace falta para pintar un círculo sobre la imagen de la cámara —y
 * para decirle al usuario cuánto le falta girar— es aritmética de ángulos. Vive
 * aquí, aparte del componente, por dos motivos:
 *
 *   1. Son funciones puras: se validan con `scripts/validate-solar-viewer.ts` sin
 *      navegador, sin cámara y sin sensores.
 *   2. El componente de React se queda con lo que solo puede hacer el navegador
 *      (permisos, MediaStream, listeners) y no mezcla trigonometría con estado.
 *
 * El azimut y la altura del Sol en el máximo NO se calculan aquí: los resuelve
 * `besselian.ts` para las coordenadas del usuario y llegan ya hechos. Este módulo
 * solo compara esa dirección con hacia dónde apunta el teléfono.
 */

/** Grados a radianes. */
const RAD = Math.PI / 180;
/** Radianes a grados. */
const DEG = 180 / Math.PI;

/**
 * Lleva cualquier ángulo al intervalo [0, 360).
 *
 * `-10` → `350`, `370` → `10`, `360` → `0`. Un valor no finito se propaga como
 * `NaN`: preferimos que reviente un test a que el círculo aparezca en un sitio
 * arbitrario de la pantalla.
 */
export function normalizeDegrees(deg: number): number {
  if (!Number.isFinite(deg)) return NaN;
  return ((deg % 360) + 360) % 360;
}

/**
 * Diferencia mínima con signo de `from` a `to`, en (-180, 180].
 *
 * Positivo significa «girar a la derecha» (sentido horario, hacia azimuts
 * crecientes) y negativo «girar a la izquierda». El cruce por el norte se
 * resuelve solo: de 355° a 5° faltan +10°, y de 5° a 355° faltan −10°.
 *
 * El caso antipodal (exactamente 180° de diferencia) se devuelve como +180 por
 * convenio: el signo ahí es arbitrario y da igual hacia dónde se gire.
 */
export function angleDifference(from: number, to: number): number {
  if (!Number.isFinite(from) || !Number.isFinite(to)) return NaN;
  const diff = normalizeDegrees(to - from + 180) - 180;
  return diff === -180 ? 180 : diff;
}

/**
 * Lectura de orientación tal y como la entrega el navegador.
 *
 * `alpha`, `beta` y `gamma` son los tres ángulos del evento `deviceorientation`
 * (rotación intrínseca Z-X'-Y'' del W3C). Pueden ser `null`: hay dispositivos y
 * WebViews que entregan el evento con campos vacíos.
 *
 * `screenAngle` es `screen.orientation.angle`. Lo aceptamos porque el llamante
 * lo necesita para elegir el campo visual (ver `fovForScreenAngle`), pero **no
 * interviene en la dirección del eje de la cámara**: los tres ángulos del evento
 * están referidos al cuerpo del dispositivo, no a cómo esté rotada la interfaz,
 * así que girar la pantalla no mueve la cámara.
 */
export interface DeviceOrientationReading {
  alpha: number | null | undefined;
  beta: number | null | undefined;
  gamma: number | null | undefined;
  /** `screen.orientation.angle`, en grados. Solo informativo para estas dos funciones. */
  screenAngle?: number;
}

/**
 * Vector unitario, en coordenadas terrestres, al que apunta la cámara trasera.
 *
 * La matriz es la del W3C para la rotación intrínseca Z-X'-Y'' (alpha, beta,
 * gamma), que lleva coordenadas del dispositivo a coordenadas terrestres con
 * X = este, Y = norte, Z = cenit. La cámara trasera mira por el eje −z del
 * dispositivo, así que basta con transformar (0, 0, −1), que es la tercera
 * columna de la matriz cambiada de signo.
 *
 * Comprobación rápida: teléfono en la mano, vertical y mirando al norte
 * (alpha 0, beta 90, gamma 0) → (0, 1, 0), es decir norte y horizonte. Teléfono
 * plano sobre la mesa (0, 0, 0) → (0, 0, −1): la cámara mira al suelo.
 */
function cameraAxis(alpha: number, beta: number, gamma: number): { east: number; north: number; up: number } {
  const cA = Math.cos(alpha * RAD);
  const sA = Math.sin(alpha * RAD);
  const cB = Math.cos(beta * RAD);
  const sB = Math.sin(beta * RAD);
  const cC = Math.cos(gamma * RAD);
  const sC = Math.sin(gamma * RAD);

  return {
    east: -(cA * sC + cC * sA * sB),
    north: -(sA * sC - cA * cC * sB),
    up: -(cB * cC),
  };
}

/** ¿Están los tres ángulos presentes y son números? */
function readAngles(
  reading: DeviceOrientationReading,
): { alpha: number; beta: number; gamma: number } | null {
  const { alpha, beta, gamma } = reading;
  if (typeof alpha !== "number" || !Number.isFinite(alpha)) return null;
  if (typeof beta !== "number" || !Number.isFinite(beta)) return null;
  if (typeof gamma !== "number" || !Number.isFinite(gamma)) return null;
  return { alpha, beta, gamma };
}

/**
 * Rumbo del eje de la cámara trasera, en grados desde el norte y sentido horario.
 *
 * **No es `360 − alpha`.** Esa simplificación solo vale con el teléfono plano
 * sobre una mesa; en cuanto se levanta para apuntar al cielo —que es exactamente
 * lo que hace aquí el usuario— el error crece hasta ser inservible. Hay que
 * combinar los tres ángulos, y eso es lo que hace `cameraAxis`.
 *
 * Devuelve `null` si falta alguno de los tres ángulos: sin ellos no hay rumbo, y
 * el visor debe pasar a modo manual en vez de dibujar un círculo inventado.
 *
 * En iOS `alpha` no es absoluto. El llamante debe sustituirlo por
 * `360 − webkitCompassHeading` antes de llamar aquí; esa es la referencia
 * absoluta que da Safari.
 *
 * Cerca del cenit y del nadir (teléfono plano) el rumbo es matemáticamente
 * indeterminado y el valor devuelto deja de significar nada: apuntando al Sol,
 * que estará muy alto pero nunca en el cenit, no es un caso que se dé.
 */
export function compassHeading(reading: DeviceOrientationReading): number | null {
  const angles = readAngles(reading);
  if (!angles) return null;

  const axis = cameraAxis(angles.alpha, angles.beta, angles.gamma);
  return normalizeDegrees(Math.atan2(axis.east, axis.north) * DEG);
}

/**
 * Elevación del eje de la cámara sobre el horizonte, en grados (−90 a +90).
 *
 * Sale del mismo vector: es el arcoseno de su componente vertical, que se reduce
 * a `−asin(cos β · cos γ)`.
 *
 * Funciona igual en vertical y en apaisado, y ese es el motivo de resolverlo con
 * el vector en vez de con `beta` a secas. Con el teléfono vertical y apuntando al
 * horizonte (β = 90, γ = 0) sale 0°. Tumbado en apaisado y apuntando también al
 * horizonte (β = 0, γ = ±90) vuelve a salir 0°, mientras que leer `beta` habría
 * dado 90° de error.
 *
 * `screenAngle` no entra en la cuenta a propósito: rotar la interfaz no mueve la
 * cámara. Lo que sí cambia con la orientación de la pantalla es qué campo visual
 * es el horizontal y cuál el vertical (ver `fovForScreenAngle`).
 */
export function cameraElevation(reading: DeviceOrientationReading): number | null {
  const angles = readAngles(reading);
  if (!angles) return null;

  const up = cameraAxis(angles.alpha, angles.beta, angles.gamma).up;
  // El coseno doble puede salirse de [-1, 1] por redondeo; asin(1.0000000002) es NaN.
  return Math.asin(Math.min(1, Math.max(-1, up))) * DEG;
}

/**
 * Campo visual de referencia de una cámara trasera de móvil, en grados.
 *
 * **Es una aproximación, no una medida.** La API del navegador no expone la
 * distancia focal de la cámara de forma fiable y portable, así que no sabemos el
 * campo visual real del dispositivo. Estos valores corresponden a un teleobjetivo
 * moderado, más estrechos que la cámara principal típica (≈65° en el lado largo),
 * y la elección es deliberadamente conservadora: declarar menos campo del que hay
 * hace que el círculo del Sol se mueva más deprisa y salga de pantalla antes, de
 * modo que el visor pide corregir la puntería en vez de dar por bueno un
 * encuadre que no lo está.
 *
 * Consecuencia práctica: el círculo puede quedar unos grados desplazado respecto
 * a dónde estará el Sol en la imagen real. Sirve para decidir si un edificio o un
 * monte se interpone, que es para lo que está, y no para apuntar un instrumento.
 */
export const CAMERA_FOV_LONG_SIDE_DEG = 60;
/** Ídem para el lado corto del sensor. Ver la nota de arriba. */
export const CAMERA_FOV_SHORT_SIDE_DEG = 46;

/**
 * Reparte el campo visual entre horizontal y vertical según cómo esté la pantalla.
 *
 * En vertical (`screen.orientation.angle` 0 o 180) la pantalla es más alta que
 * ancha, así que el lado largo del sensor cae en vertical. En apaisado (90 o 270)
 * se intercambian.
 *
 * Se recomienda usar el visor con el móvil **en vertical**: es la orientación en
 * la que los navegadores móviles se comportan de forma más previsible con la
 * cámara y con los sensores, y la que deja más campo en altura, que es por donde
 * hay que buscar un Sol alto.
 */
export function fovForScreenAngle(screenAngle: number): { horizontal: number; vertical: number } {
  const landscape = Math.abs(normalizeDegrees(screenAngle) - 90) < 45 || Math.abs(normalizeDegrees(screenAngle) - 270) < 45;
  return landscape
    ? { horizontal: CAMERA_FOV_LONG_SIDE_DEG, vertical: CAMERA_FOV_SHORT_SIDE_DEG }
    : { horizontal: CAMERA_FOV_SHORT_SIDE_DEG, vertical: CAMERA_FOV_LONG_SIDE_DEG };
}

/** Tolerancia por defecto para dar el objetivo por centrado, en grados. */
export const ALIGN_TOLERANCE_DEG = 4;

/**
 * Distancia angular, en grados, por debajo de la cual el objetivo se considera
 * «cerca»: ya no hay que buscarlo por el cielo, solo afinar la puntería.
 *
 * Está por encima del medio campo visual corto (23°) a propósito: cuando el
 * objetivo entra en el encuadre, el visor ya lo dibuja y el mensaje cambia solo.
 */
export const NEAR_TOLERANCE_DEG = 25;

/** Hacia dónde apunta la cámara y con qué encuadre. */
export interface CameraAim {
  /** Azimut al que apunta la cámara, grados desde el norte. */
  cameraAzimuthDeg: number;
  /** Elevación del eje de la cámara, grados. */
  cameraAltitudeDeg: number;
  /** Campo visual horizontal de la cámara, grados. */
  fovHorizontalDeg: number;
  /** Campo visual vertical de la cámara, grados. */
  fovVerticalDeg: number;
}

export interface ProjectTargetInput extends CameraAim {
  /** Azimut del objetivo (el Sol en el máximo), grados desde el norte. */
  targetAzimuthDeg: number;
  /** Altura del objetivo sobre el horizonte, grados. */
  targetAltitudeDeg: number;
  /** Tolerancia para considerarlo centrado. Por defecto `ALIGN_TOLERANCE_DEG`. */
  alignToleranceDeg?: number;
}

export interface ProjectedTarget {
  /**
   * Cuánto hay que girar en horizontal para poner el objetivo en el centro.
   * Positivo = a la derecha. El cruce 359°/0° ya está resuelto.
   */
  deltaAzimuthDeg: number;
  /** Cuánto hay que inclinar. Positivo = hacia arriba. */
  deltaAltitudeDeg: number;
  /** Posición horizontal en la pantalla, 0 = borde izquierdo, 100 = borde derecho. */
  xPercent: number;
  /** Posición vertical, 0 = borde superior, 100 = borde inferior. */
  yPercent: number;
  /** ¿Cae dentro del encuadre? Los bordes exactos cuentan como dentro. */
  onScreen: boolean;
  /** ¿Está dentro de la retícula central? */
  aligned: boolean;
}

/**
 * Proyecta una dirección del cielo sobre la pantalla del visor.
 *
 * El mapeo es lineal: cada grado de diferencia ocupa la misma fracción de
 * pantalla. Es la aproximación equirrectangular, exacta en el centro del
 * encuadre y con una distorsión que crece hacia los bordes; con campos visuales
 * de 45–60° y una retícula de pocos grados, esa distorsión queda por debajo del
 * error del propio magnetómetro del teléfono.
 *
 * No se aplica ninguna rotación al conjunto: la imagen de la cámara ya llega
 * enderezada respecto a la pantalla, así que el eje horizontal de la pantalla es
 * el horizontal del encuadre y girar el overlay solo introduciría un error.
 */
export function projectTarget(input: ProjectTargetInput): ProjectedTarget {
  const tolerance = input.alignToleranceDeg ?? ALIGN_TOLERANCE_DEG;

  const deltaAzimuthDeg = angleDifference(input.cameraAzimuthDeg, input.targetAzimuthDeg);
  const deltaAltitudeDeg = input.targetAltitudeDeg - input.cameraAltitudeDeg;

  const halfH = input.fovHorizontalDeg / 2;
  const halfV = input.fovVerticalDeg / 2;

  // La pantalla crece hacia abajo, el cielo hacia arriba: de ahí el signo del eje Y.
  const xPercent = 50 + (deltaAzimuthDeg / input.fovHorizontalDeg) * 100;
  const yPercent = 50 - (deltaAltitudeDeg / input.fovVerticalDeg) * 100;

  const onScreen = Math.abs(deltaAzimuthDeg) <= halfH && Math.abs(deltaAltitudeDeg) <= halfV;
  const aligned = Math.abs(deltaAzimuthDeg) <= tolerance && Math.abs(deltaAltitudeDeg) <= tolerance;

  return { deltaAzimuthDeg, deltaAltitudeDeg, xPercent, yPercent, onScreen, aligned };
}

/** Cómo de lejos está el objetivo de la retícula, en las tres categorías que cambian el mensaje. */
export type AlignmentState = "aligned" | "near" | "searching";

/**
 * Traduce la desviación en la única pregunta que le importa al usuario: ¿ya está,
 * casi, o todavía hay que buscar?
 *
 * Se mide con la mayor de las dos desviaciones y no con la distancia angular
 * combinada porque las dos correcciones se hacen por separado —girar y elevar— y
 * un objetivo a 3° de rumbo pero 30° de altura no está «a 30° de distancia», está
 * pendiente de un solo gesto.
 */
export function alignmentState(
  target: Pick<ProjectedTarget, "deltaAzimuthDeg" | "deltaAltitudeDeg">,
  alignToleranceDeg = ALIGN_TOLERANCE_DEG,
  nearToleranceDeg = NEAR_TOLERANCE_DEG,
): AlignmentState {
  const worst = Math.max(Math.abs(target.deltaAzimuthDeg), Math.abs(target.deltaAltitudeDeg));
  if (!Number.isFinite(worst)) return "searching";
  if (worst <= alignToleranceDeg) return "aligned";
  return worst <= nearToleranceDeg ? "near" : "searching";
}

/** Una flecha pegada a un borde de la pantalla, con lo que falta en ese eje. */
export interface EdgeMarker {
  /** Eje que corrige. El horizontal se arregla girando; el vertical, inclinando. */
  axis: "horizontal" | "vertical";
  /** Hacia qué lado hay que moverse. */
  side: "left" | "right" | "up" | "down";
  /** Posición del ancla en porcentaje de pantalla, ya recortada dentro del margen. */
  xPercent: number;
  yPercent: number;
  /** Grados que faltan en ese eje, positivos y redondeados al entero. */
  degrees: number;
}

/**
 * Cuánta pantalla hay ocupada por la interfaz en cada borde, en porcentaje.
 *
 * No son cuatro márgenes iguales porque la pantalla no es simétrica: arriba están
 * la hora simulada y las lecturas del objetivo, y abajo la banda de estado con sus
 * botones. Una flecha centrada en un borde ocupado no se ve, y una flecha que no
 * se ve es lo mismo que no tener flecha.
 */
export interface EdgeInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Márgenes por defecto: los mismos por los cuatro lados. */
export const DEFAULT_EDGE_INSETS: EdgeInsets = { top: 14, right: 14, bottom: 14, left: 14 };

/**
 * Flechas de guía: dónde ponerlas y qué deben decir.
 *
 * Es la diferencia entre un visor que se usa con el móvil en alto y uno que
 * obliga a bajarlo para leer un párrafo. Cada eje que se sale de la tolerancia
 * genera su flecha, anclada al borde hacia el que hay que moverse y a la altura
 * (o a la anchura) a la que está el objetivo, de modo que dos flechas juntas
 * señalan la esquina correcta.
 *
 * Devuelve una lista vacía cuando ya está centrado, que es la señal de que hay que
 * enseñar el mensaje de acierto y ninguna flecha.
 *
 * **Dos flechas nunca se apilan.** Con el objetivo muy lejos —lo normal al abrir
 * el visor— las dos anclas se recortan al mismo margen y acaban exactamente en la
 * misma esquina, así que una tapa a la otra y el usuario ve una sola corrección de
 * las dos que necesita. Cuando eso va a pasar, cada flecha se lleva al centro de
 * su borde: la de girar al centro del lado, la de inclinar al centro de arriba o
 * de abajo. Se pierde la pista diagonal, que solo es útil cuando el objetivo ya
 * está cerca del encuadre, y a cambio se ven las dos.
 */
export function edgeMarkers(
  target: ProjectedTarget,
  alignToleranceDeg = ALIGN_TOLERANCE_DEG,
  insets: EdgeInsets = DEFAULT_EDGE_INSETS,
): EdgeMarker[] {
  if (!Number.isFinite(target.deltaAzimuthDeg) || !Number.isFinite(target.deltaAltitudeDeg)) return [];

  const horizontalOut = Math.abs(target.deltaAzimuthDeg) > alignToleranceDeg;
  const verticalOut = Math.abs(target.deltaAltitudeDeg) > alignToleranceDeg;
  if (!horizontalOut && !verticalOut) return [];

  const right = target.deltaAzimuthDeg > 0;
  const up = target.deltaAltitudeDeg > 0;

  // Anclas «pegadas al borde», y la coordenada libre de cada flecha recortada a la
  // zona de pantalla que no ocupa la interfaz.
  const anchorX = right ? 100 - insets.right : insets.left;
  const anchorY = up ? insets.top : 100 - insets.bottom;
  const freeY = Math.min(100 - insets.bottom, Math.max(insets.top, target.yPercent));
  const freeX = Math.min(100 - insets.right, Math.max(insets.left, target.xPercent));

  // Separación mínima entre las dos anclas para que las dos flechas se lean.
  const apart = 25;
  const collide =
    horizontalOut && verticalOut && Math.abs(freeX - anchorX) < apart && Math.abs(freeY - anchorY) < apart;

  const midX = (insets.left + (100 - insets.right)) / 2;
  const midY = (insets.top + (100 - insets.bottom)) / 2;

  const markers: EdgeMarker[] = [];

  if (horizontalOut) {
    markers.push({
      axis: "horizontal",
      side: right ? "right" : "left",
      xPercent: anchorX,
      yPercent: collide ? midY : freeY,
      degrees: Math.round(Math.abs(target.deltaAzimuthDeg)),
    });
  }

  if (verticalOut) {
    markers.push({
      axis: "vertical",
      side: up ? "up" : "down",
      xPercent: collide ? midX : freeX,
      yPercent: anchorY,
      degrees: Math.round(Math.abs(target.deltaAltitudeDeg)),
    });
  }

  return markers;
}

/** Una dirección del cielo, sin más. */
export interface SkyDirection {
  azimuthDeg: number;
  altitudeDeg: number;
}

export interface ProjectedPathPoint {
  xPercent: number;
  yPercent: number;
  onScreen: boolean;
  /**
   * El punto queda a más de un cuarto de vuelta del eje de la cámara.
   *
   * Ahí la proyección equirrectangular deja de significar nada —el punto está
   * literalmente detrás— y unir dos puntos a uno y otro lado dibujaría una raya
   * atravesando la pantalla. El llamante parte la línea por aquí.
   */
  behind: boolean;
}

/**
 * Proyecta un recorrido entero del cielo sobre la pantalla.
 *
 * Es `projectTarget()` aplicado punto a punto, y existe porque el visor no dibuja
 * solo dónde estará el Sol en el máximo: dibuja **por dónde va a pasar durante
 * todo el eclipse**. Entre el primer y el último contacto el Sol recorre unos 24°
 * de azimut y sube casi 30°, así que el tejado que no tapa el máximo puede tapar
 * perfectamente el principio de la totalidad. Esa es justo la pregunta que el
 * visor existe para responder.
 */
export function projectPath(points: readonly SkyDirection[], camera: CameraAim): ProjectedPathPoint[] {
  return points.map((point) => {
    const projected = projectTarget({
      targetAzimuthDeg: point.azimuthDeg,
      targetAltitudeDeg: point.altitudeDeg,
      ...camera,
    });
    return {
      xPercent: projected.xPercent,
      yPercent: projected.yPercent,
      onScreen: projected.onScreen,
      behind: Math.abs(projected.deltaAzimuthDeg) > 90 || Math.abs(projected.deltaAltitudeDeg) > 90,
    };
  });
}
