/**
 * Cálculo de las circunstancias locales del eclipse del 2 de agosto de 2027.
 *
 * En lugar de copiar tablas de terceros ciudad por ciudad, resolvemos el eclipse
 * con elementos besselianos. Eso da los cinco contactos, la duración, la magnitud y
 * la posición del Sol para CUALQUIER coordenada, que es lo que necesitan tanto las
 * fichas de ciudad como el localizador de puntos de observación.
 *
 * Método: elementos besselianos de la NASA (Five Millennium Canon, Espenak & Meeus),
 * resueltos con el procedimiento clásico del Explanatory Supplement to the
 * Astronomical Almanac. La implementación está validada contra las duraciones
 * publicadas de forma independiente para Ceuta, Algeciras, Cádiz, Málaga y Melilla,
 * y contra el punto de máxima duración en Egipto (ver scripts/validate-eclipse.ts).
 */

const DEG = Math.PI / 180;

/** Radio ecuatorial terrestre en km (WGS-84). */
const EARTH_RADIUS_KM = 6378.137;

/** b/a = sqrt(1 - e²) para el elipsoide terrestre. */
const FLATTENING_RATIO = 0.99664719;

/**
 * Elementos besselianos polinómicos para 2027 Aug 02 10:00:00.0 TDT (= t0).
 *
 * Cada elemento se evalúa como a = a0 + a1·t + a2·t² + a3·t³, con t en horas desde
 * t0. Válidos para 7.00 ≤ t ≤ 13.00 TDT, que cubre de sobra el eclipse en España.
 *
 * Fuente: NASA/GSFC, Besselian Elements for the Total Solar Eclipse of 2027 Aug 02.
 */
export const ELEMENTS = {
  t0Hours: 10.0,
  x: [-0.019645, 0.5447105, -0.0000444, -0.0000091],
  y: [0.160063, -0.2111569, -0.0001217, 0.0000037],
  /** Declinación del eje de la sombra, en grados. */
  d: [17.76247, -0.010181, -0.000004],
  /** Radio del cono penumbral en el plano fundamental. */
  l1: [0.530596, 0.0000138, -0.0000128],
  /** Radio del cono umbral. Negativo en eclipse total. */
  l2: [-0.015464, 0.0000137, -0.0000128],
  /** Ángulo horario de Greenwich del eje, en grados. */
  mu: [328.42249, 15.002093],
  tanF1: 0.0046064,
  tanF2: 0.0045834,
} as const;

/**
 * ΔT = TT − UT en segundos para agosto de 2027.
 *
 * Los elementos besselianos están en TDT y la hora civil se deriva de UT, así que
 * este valor desplaza en bloque todos los instantes calculados.
 *
 * 71.7 s no es una elección libre: es el valor con el que la NASA generó estos
 * elementos. Calculando el instante del máximo directamente desde los polinomios
 * sale TDT 10:07:49.4, y restarle 71.7 s da exactamente las 10:06:37.7 UT que
 * publica la NASA. Cambiarlo sin regenerar los elementos descuadraría el resultado
 * respecto a las tablas oficiales del IGN y de la NASA, que es contra lo que la
 * gente va a contrastar nuestras horas.
 *
 * El ΔT real de 2027 puede diferir en uno o dos segundos, muy por debajo de la
 * incertidumbre del propio contacto, que depende del relieve del limbo lunar.
 */
export const DELTA_T_SECONDS = 71.7;

/**
 * Corrección del meridiano de efemérides, en grados.
 *
 * El μ publicado por la NASA es el ángulo horario desde el meridiano de efemérides,
 * no desde Greenwich: son dos meridianos separados por la rotación que la Tierra
 * ejecuta en ΔT segundos. Sin esta corrección la franja entera queda desplazada
 * 0.3° en longitud —unos 27 km— y los contactos salen más de un minuto tarde.
 */
const EPHEMERIS_MERIDIAN_DEG = (1.002738 * DELTA_T_SECONDS * 15) / 3600;

/** Fecha del eclipse en UTC, a las 00:00. */
const ECLIPSE_DAY_UTC = Date.UTC(2027, 7, 2);

function poly(coefficients: readonly number[], t: number): number {
  let result = 0;
  for (let i = coefficients.length - 1; i >= 0; i--) {
    result = result * t + coefficients[i];
  }
  return result;
}

/** Derivada del polinomio respecto a t, en unidades por hora. */
function polyDerivative(coefficients: readonly number[], t: number): number {
  let result = 0;
  for (let i = coefficients.length - 1; i >= 1; i--) {
    result = result * t + coefficients[i] * i;
  }
  return result;
}

export interface ObserverPosition {
  /** Latitud geodésica en grados, norte positivo. */
  lat: number;
  /** Longitud en grados, este positivo. */
  lon: number;
  /** Altitud sobre el nivel del mar en metros. */
  altitudeM?: number;
}

/** Estado del observador en el sistema besseliano para un instante dado. */
interface Fundamental {
  /** Separación observador-eje en el plano fundamental, en radios terrestres. */
  u: number;
  v: number;
  uDot: number;
  vDot: number;
  /** Radio penumbral corregido por la posición del observador. */
  bigL1: number;
  /** Radio umbral corregido. Negativo dentro de la totalidad. */
  bigL2: number;
  /** Componente a lo largo del eje: equivale al seno de la altura del Sol. */
  zeta: number;
  /** Ángulo horario local del Sol, en grados. */
  hourAngle: number;
  declination: number;
}

/**
 * Sitúa al observador en el plano fundamental de Bessel.
 *
 * `t` va en horas TDT desde t0 (10:00 TDT del 2 de agosto de 2027).
 */
function fundamental(observer: ObserverPosition, t: number): Fundamental {
  const { lat, lon, altitudeM = 0 } = observer;
  const latRad = lat * DEG;

  // Coordenadas geocéntricas del observador sobre el elipsoide.
  const u0 = Math.atan(FLATTENING_RATIO * Math.tan(latRad));
  const heightRadii = altitudeM / 1000 / EARTH_RADIUS_KM;
  const rhoSinPhi = FLATTENING_RATIO * Math.sin(u0) + heightRadii * Math.sin(latRad);
  const rhoCosPhi = Math.cos(u0) + heightRadii * Math.cos(latRad);

  const x = poly(ELEMENTS.x, t);
  const y = poly(ELEMENTS.y, t);
  const dDeg = poly(ELEMENTS.d, t);
  const muDeg = poly(ELEMENTS.mu, t);
  const l1 = poly(ELEMENTS.l1, t);
  const l2 = poly(ELEMENTS.l2, t);

  const xDot = polyDerivative(ELEMENTS.x, t);
  const yDot = polyDerivative(ELEMENTS.y, t);
  // Las derivadas angulares pasan a radianes/hora para operar con las lineales.
  const dDot = polyDerivative(ELEMENTS.d, t) * DEG;
  const muDot = polyDerivative(ELEMENTS.mu, t) * DEG;

  const d = dDeg * DEG;
  // Ángulo horario local: μ va referido al meridiano de efemérides, así que hay
  // que descontar la separación entre ese meridiano y el de Greenwich.
  const hourAngleDeg = muDeg + lon - EPHEMERIS_MERIDIAN_DEG;
  const h = hourAngleDeg * DEG;

  const xi = rhoCosPhi * Math.sin(h);
  const eta = rhoSinPhi * Math.cos(d) - rhoCosPhi * Math.cos(h) * Math.sin(d);
  const zeta = rhoSinPhi * Math.sin(d) + rhoCosPhi * Math.cos(h) * Math.cos(d);

  const xiDot = muDot * rhoCosPhi * Math.cos(h);
  const etaDot = muDot * xi * Math.sin(d) - zeta * dDot;

  return {
    u: x - xi,
    v: y - eta,
    uDot: xDot - xiDot,
    vDot: yDot - etaDot,
    // Los conos se estrechan con la distancia del observador al plano fundamental.
    bigL1: l1 - zeta * ELEMENTS.tanF1,
    bigL2: l2 - zeta * ELEMENTS.tanF2,
    zeta,
    hourAngle: hourAngleDeg,
    declination: dDeg,
  };
}

/** Convierte horas TDT desde t0 a un instante UTC real. */
function toDate(tHours: number): Date {
  const utHours = ELEMENTS.t0Hours + tHours - DELTA_T_SECONDS / 3600;
  return new Date(ECLIPSE_DAY_UTC + utHours * 3600_000);
}

/**
 * Instante del máximo del eclipse, en horas TDT desde t0.
 *
 * Es el mínimo de la distancia observador-eje, así que se itera hasta que la
 * corrección se hace despreciable. Converge en dos o tres pasos.
 */
function solveMaximum(observer: ObserverPosition): number {
  let t = 0;
  for (let i = 0; i < 8; i++) {
    const f = fundamental(observer, t);
    const nSquared = f.uDot * f.uDot + f.vDot * f.vDot;
    const delta = -(f.u * f.uDot + f.v * f.vDot) / nSquared;
    t += delta;
    if (Math.abs(delta) < 1e-9) break;
  }
  return t;
}

/**
 * Instante de un contacto, en horas TDT desde t0.
 *
 * `cone` elige el cono (penumbral para C1/C4, umbral para C2/C3) y `sign` el lado:
 * −1 para el contacto de entrada, +1 para el de salida. Devuelve null si el cono no
 * llega a alcanzar al observador.
 */
function solveContact(
  observer: ObserverPosition,
  cone: "penumbral" | "umbral",
  sign: -1 | 1,
): number | null {
  let t = solveMaximum(observer);

  for (let i = 0; i < 20; i++) {
    const f = fundamental(observer, t);
    const nSquared = f.uDot * f.uDot + f.vDot * f.vDot;
    const n = Math.sqrt(nSquared);
    const bigL = cone === "penumbral" ? f.bigL1 : Math.abs(f.bigL2);

    // Distancia mínima del observador al eje a lo largo de la trayectoria.
    const perpendicular = (f.u * f.vDot - f.v * f.uDot) / n;
    const discriminant = bigL * bigL - perpendicular * perpendicular;
    if (discriminant < 0) return null;

    const along = (f.u * f.uDot + f.v * f.vDot) / nSquared;
    const offset = (sign * Math.sqrt(discriminant)) / n;
    const next = t - along + offset;

    const delta = next - t;
    t = next;
    if (Math.abs(delta) < 1e-9) break;
  }

  return t;
}

export interface LocalCircumstances {
  /** El observador entra en la umbra y ve la corona. */
  isTotal: boolean;
  /** Hay al menos eclipse parcial. Falso solo fuera de la penumbra. */
  isPartial: boolean;
  /** Duración de la totalidad en segundos. 0 si no hay totalidad. */
  totalitySeconds: number;
  /** Los cinco contactos en UTC. C2 y C3 son null fuera de la franja. */
  partialStart: Date | null;
  totalityStart: Date | null;
  maximum: Date;
  totalityEnd: Date | null;
  partialEnd: Date | null;
  /** Magnitud en el máximo: fracción del diámetro solar cubierta. */
  magnitude: number;
  /** Fracción del área del disco solar cubierta en el máximo, de 0 a 1. */
  obscuration: number;
  /** Altura del Sol sobre el horizonte en el máximo, en grados. */
  sunAltitudeDeg: number;
  /** Azimut del Sol en el máximo, en grados desde el norte hacia el este. */
  sunAzimuthDeg: number;
}

/**
 * Fracción del disco solar cubierta, a partir de los radios aparentes y la
 * separación entre centros. Es la intersección de dos círculos.
 */
function obscurationFraction(sunRadius: number, moonRadius: number, separation: number): number {
  if (separation >= sunRadius + moonRadius) return 0;
  if (separation <= Math.abs(moonRadius - sunRadius)) {
    return moonRadius >= sunRadius ? 1 : (moonRadius * moonRadius) / (sunRadius * sunRadius);
  }

  const s2 = separation * separation;
  const sun2 = sunRadius * sunRadius;
  const moon2 = moonRadius * moonRadius;

  const alpha = Math.acos((s2 + sun2 - moon2) / (2 * separation * sunRadius));
  const beta = Math.acos((s2 + moon2 - sun2) / (2 * separation * moonRadius));
  const area =
    sun2 * (alpha - Math.sin(2 * alpha) / 2) + moon2 * (beta - Math.sin(2 * beta) / 2);

  return area / (Math.PI * sun2);
}

/** Circunstancias locales completas del eclipse para una posición. */
export function circumstancesAt(observer: ObserverPosition): LocalCircumstances {
  const tMax = solveMaximum(observer);
  const atMax = fundamental(observer, tMax);

  const separation = Math.hypot(atMax.u, atMax.v);

  // Radios aparentes en el plano fundamental. Salen de las dos tangencias:
  // en la externa m = rSol + rLuna = L1, y en la interna m = rLuna − rSol = −L2.
  const sunRadius = (atMax.bigL1 + atMax.bigL2) / 2;
  const moonRadius = (atMax.bigL1 - atMax.bigL2) / 2;

  const magnitude = (atMax.bigL1 - separation) / (atMax.bigL1 + atMax.bigL2);
  const isPartial = separation < atMax.bigL1;
  // Totalidad cuando el observador entra en el cono umbral, que en un eclipse
  // total tiene L2 negativo y radio |L2|.
  const isTotal = isPartial && atMax.bigL2 < 0 && separation < Math.abs(atMax.bigL2);

  const partialStartT = solveContact(observer, "penumbral", -1);
  const partialEndT = solveContact(observer, "penumbral", 1);
  const totalityStartT = isTotal ? solveContact(observer, "umbral", -1) : null;
  const totalityEndT = isTotal ? solveContact(observer, "umbral", 1) : null;

  const totalitySeconds =
    totalityStartT !== null && totalityEndT !== null
      ? Math.max(0, (totalityEndT - totalityStartT) * 3600)
      : 0;

  // Altura y azimut del Sol en el máximo.
  const latRad = observer.lat * DEG;
  const decRad = atMax.declination * DEG;
  const haRad = atMax.hourAngle * DEG;
  const sinAlt =
    Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);
  const altitude = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const azimuth = Math.atan2(
    -Math.cos(decRad) * Math.sin(haRad),
    Math.sin(decRad) * Math.cos(latRad) - Math.cos(decRad) * Math.sin(latRad) * Math.cos(haRad),
  );

  return {
    isTotal,
    isPartial,
    totalitySeconds,
    partialStart: partialStartT === null ? null : toDate(partialStartT),
    totalityStart: totalityStartT === null ? null : toDate(totalityStartT),
    maximum: toDate(tMax),
    totalityEnd: totalityEndT === null ? null : toDate(totalityEndT),
    partialEnd: partialEndT === null ? null : toDate(partialEndT),
    magnitude: Math.max(0, magnitude),
    obscuration: isPartial ? obscurationFraction(sunRadius, moonRadius, separation) : 0,
    sunAltitudeDeg: altitude / DEG,
    sunAzimuthDeg: (azimuth / DEG + 360) % 360,
  };
}

/** Distancia ortodrómica en km entre dos puntos. */
function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const R = 6371.0088;
  const dLat = (bLat - aLat) * DEG;
  const dLon = (bLon - aLon) * DEG;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aLat * DEG) * Math.cos(bLat * DEG) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Latitud del centro de la franja en un meridiano dado.
 *
 * Se busca el máximo de duración recorriendo el meridiano. Para un punto fuera de
 * la franja, donde la duración es cero en todas partes, se usa la magnitud, que
 * sigue teniendo un máximo bien definido.
 */
function centerlineLatAt(lon: number, aroundLat: number, altitudeM = 0): number | null {
  let best: { lat: number; score: number } | null = null;

  const scan = (from: number, to: number, step: number) => {
    for (let lat = from; lat <= to; lat += step) {
      const c = circumstancesAt({ lat, lon, altitudeM });
      const score = c.totalitySeconds > 0 ? 1000 + c.totalitySeconds : c.magnitude;
      if (!best || score > best.score) best = { lat, score };
    }
  };

  // Barrido grueso alrededor del observador y luego fino sobre el mejor tramo.
  scan(aroundLat - 6, aroundLat + 6, 0.05);
  if (!best) return null;
  const coarse: { lat: number; score: number } = best;
  scan(coarse.lat - 0.1, coarse.lat + 0.1, 0.002);

  return best === null ? null : (best as { lat: number }).lat;
}

/**
 * Distancia en km del observador al centro de la franja, medida perpendicularmente.
 *
 * Es la respuesta a "¿me merece la pena moverme?", así que tiene que ser la
 * distancia real y no la medida a lo largo del meridiano: la franja cruza España
 * inclinada respecto al paralelo, y medir en latitud sobreestima bastante.
 *
 * Se reconstruye un tramo de la línea central alrededor del observador y se toma la
 * distancia mínima a esa polilínea.
 */
export function distanceToCenterlineKm(observer: ObserverPosition): number | null {
  const { lat, lon, altitudeM = 0 } = observer;
  let minimum: number | null = null;

  // Un grado de longitud a cada lado basta: la franja es casi recta en ese tramo.
  for (let dLon = -1; dLon <= 1.0001; dLon += 0.1) {
    const sampleLon = lon + dLon;
    const centerLat = centerlineLatAt(sampleLon, lat, altitudeM);
    if (centerLat === null) continue;

    const distance = haversineKm(lat, lon, centerLat, sampleLon);
    if (minimum === null || distance < minimum) minimum = distance;
  }

  return minimum;
}
