/**
 * Validación del solucionador besseliano.
 *
 * Compara lo que calcula `circumstancesAt()` con valores publicados de forma
 * independiente. Si esto no pasa, ningún dato de la web es fiable, así que corre
 * en CI antes de cada despliegue.
 *
 *   npx tsx scripts/validate-eclipse.ts
 */

import { circumstancesAt, eclipseTrack } from "../src/lib/eclipse/besselian";

interface Check {
  name: string;
  lat: number;
  lon: number;
  /** Duración esperada de la totalidad en segundos. */
  expectedSeconds: number;
  /** Tolerancia en segundos. */
  tolerance: number;
  source: string;
}

/**
 * Las duraciones de las ciudades españolas proceden de las tablas del IGN
 * recogidas por prensa; la del máximo, de la NASA. Son referencias independientes
 * de nuestro cálculo, que es justo lo que las hace útiles como test.
 */
const CHECKS: Check[] = [
  {
    name: "Máximo del eclipse (Egipto)",
    lat: 25.505,
    lon: 33.1833,
    expectedSeconds: 382.6, // 06m 22.6s
    tolerance: 3,
    source: "NASA GSFC",
  },
  // Duraciones municipales del IGN. La tolerancia de 8 s cubre dos cosas: que el
  // punto de referencia del municipio no tiene por qué ser el nuestro, y que el IGN
  // y la NASA no usan exactamente el mismo radio lunar, lo que introduce un sesgo
  // sistemático de uno o dos segundos.
  { name: "Ceuta", lat: 35.8894, lon: -5.3213, expectedSeconds: 288, tolerance: 8, source: "IGN" },
  { name: "Tarifa", lat: 36.0143, lon: -5.6044, expectedSeconds: 278, tolerance: 8, source: "IGN" },
  { name: "Melilla", lat: 35.2923, lon: -2.9381, expectedSeconds: 273, tolerance: 8, source: "IGN" },
  { name: "Algeciras", lat: 36.1275, lon: -5.4536, expectedSeconds: 267, tolerance: 8, source: "IGN" },
  { name: "La Línea", lat: 36.1611, lon: -5.3486, expectedSeconds: 263, tolerance: 8, source: "IGN" },
  { name: "Los Barrios", lat: 36.1847, lon: -5.4917, expectedSeconds: 259, tolerance: 8, source: "IGN" },
  { name: "San Roque", lat: 36.2103, lon: -5.3844, expectedSeconds: 257, tolerance: 8, source: "IGN" },
  { name: "Cádiz", lat: 36.5271, lon: -6.2886, expectedSeconds: 174, tolerance: 8, source: "IGN" },
  { name: "Málaga", lat: 36.7213, lon: -4.4214, expectedSeconds: 108, tolerance: 8, source: "IGN" },
];

/** Localidades fuera de la franja, comprobadas por porcentaje de disco cubierto. */
const OBSCURATION_CHECKS = [
  { name: "Sevilla", lat: 37.3891, lon: -5.9845, expectedPct: 98, tolerance: 1.5, source: "IGN" },
];

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds - m * 60;
  return `${m}m ${s.toFixed(1)}s`;
}

let failures = 0;

console.log("Validación del cálculo besseliano — eclipse del 2 de agosto de 2027\n");
console.log(
  `${"Punto".padEnd(28)} ${"Calculado".padEnd(12)} ${"Esperado".padEnd(12)} ${"Δ".padEnd(9)} Fuente`,
);
console.log("-".repeat(84));

for (const check of CHECKS) {
  const result = circumstancesAt({ lat: check.lat, lon: check.lon });
  const diff = result.totalitySeconds - check.expectedSeconds;
  const ok = Math.abs(diff) <= check.tolerance;
  if (!ok) failures++;

  console.log(
    `${(ok ? "✓ " : "✗ ") + check.name.padEnd(26)} ${fmt(result.totalitySeconds).padEnd(12)} ${fmt(
      check.expectedSeconds,
    ).padEnd(12)} ${`${diff >= 0 ? "+" : ""}${diff.toFixed(1)}s`.padEnd(9)} ${check.source}`,
  );
}

console.log("");
for (const check of OBSCURATION_CHECKS) {
  const result = circumstancesAt({ lat: check.lat, lon: check.lon });
  const pct = result.obscuration * 100;
  const diff = pct - check.expectedPct;
  const ok = !result.isTotal && Math.abs(diff) <= check.tolerance;
  if (!ok) failures++;
  console.log(
    `${ok ? "✓" : "✗"} ${check.name}: parcial al ${pct.toFixed(1)}% (esperado ${check.expectedPct}%, Δ ${diff >= 0 ? "+" : ""}${diff.toFixed(1)}) — ${check.source}`,
  );
}

// Un punto claramente fuera de la franja no debe dar totalidad bajo ningún concepto:
// es el error que haría que alguien se quitara el filtro sin motivo.
const madrid = circumstancesAt({ lat: 40.4168, lon: -3.7038 });
if (madrid.isTotal) {
  console.log("✗ Madrid aparece como total, lo cual es imposible");
  failures++;
} else {
  console.log(
    `✓ Madrid: parcial, magnitud ${madrid.magnitude.toFixed(3)}, ${(madrid.obscuration * 100).toFixed(1)}% del disco cubierto`,
  );
}

const ceuta = circumstancesAt({ lat: 35.8894, lon: -5.3213 });
console.log(
  `\nCeuta, cinco contactos (UTC): C1 ${ceuta.partialStart?.toISOString().slice(11, 19)} · C2 ${ceuta.totalityStart
    ?.toISOString()
    .slice(11, 19)} · máx ${ceuta.maximum.toISOString().slice(11, 19)} · C3 ${ceuta.totalityEnd
    ?.toISOString()
    .slice(11, 19)} · C4 ${ceuta.partialEnd?.toISOString().slice(11, 19)}`,
);
console.log(
  `Altura del Sol en el máximo: ${ceuta.sunAltitudeDeg.toFixed(1)}° · azimut ${ceuta.sunAzimuthDeg.toFixed(1)}°`,
);


/*
  Recorrido del Sol durante el eclipse.

  Es lo que dibuja el visor sobre la imagen de la cámara, así que tiene que
  coincidir con las tablas hasta la última cifra: dos formas de calcular la
  posición del Sol que se separen darían una web que dice una cosa y un visor que
  apunta a otra.
*/
console.log("");

const ceutaTrack = eclipseTrack({ lat: 35.8894, lon: -5.3213 });
const trackMaximum = ceutaTrack.find((sample) => sample.contact === "maximum");

if (!trackMaximum) {
  console.log("✗ El recorrido de Ceuta no incluye el máximo");
  failures++;
} else {
  const dAz = Math.abs(trackMaximum.azimuthDeg - ceuta.sunAzimuthDeg);
  const dAlt = Math.abs(trackMaximum.altitudeDeg - ceuta.sunAltitudeDeg);
  const ok = dAz < 1e-4 && dAlt < 1e-4 && Math.abs(trackMaximum.obscuration - ceuta.obscuration) < 1e-9;
  if (!ok) failures++;
  console.log(
    `${ok ? "✓" : "✗"} El máximo del recorrido coincide con las tablas (Δ azimut ${dAz.toExponential(1)}°, Δ altura ${dAlt.toExponential(1)}°)`,
  );
}

const contactsInTrack = ceutaTrack.filter((sample) => sample.contact !== null).length;
if (contactsInTrack !== 5) {
  console.log(`✗ El recorrido de Ceuta trae ${contactsInTrack} contactos y deberían ser cinco`);
  failures++;
} else {
  console.log("✓ El recorrido de Ceuta trae los cinco contactos");
}

// Entre C2 y C3 el disco está tapado del todo, y en C1 y C4 no lo está en absoluto:
// si esto se rompiera, el visor pintaría un Sol eclipsado donde no lo está.
const totalityCovered = ceutaTrack
  .filter((sample) => sample.contact === "totalityStart" || sample.contact === "totalityEnd")
  .every((sample) => sample.obscuration > 0.9999);
const edgesUncovered = ceutaTrack
  .filter((sample) => sample.contact === "partialStart" || sample.contact === "partialEnd")
  .every((sample) => sample.obscuration < 1e-6);
if (!totalityCovered || !edgesUncovered) {
  console.log("✗ La cobertura del disco en los contactos no cuadra");
  failures++;
} else {
  console.log("✓ Disco tapado del todo en C2 y C3, y sin tapar en C1 y C4");
}

// El recorrido va ordenado en el tiempo y siempre con el Sol por encima del
// horizonte: el visor une los puntos con una línea y no debe apuntar bajo tierra.
const ordered = ceutaTrack.every(
  (sample, index) => index === 0 || sample.time.getTime() >= ceutaTrack[index - 1].time.getTime(),
);
const aboveHorizon = ceutaTrack.every((sample) => sample.altitudeDeg > 0);
if (!ordered || !aboveHorizon) {
  console.log("✗ El recorrido no está ordenado o baja del horizonte");
  failures++;
} else {
  const first = ceutaTrack[0];
  const last = ceutaTrack[ceutaTrack.length - 1];
  console.log(
    `✓ Recorrido ordenado y sobre el horizonte: ${ceutaTrack.length} puntos, azimut ${first.azimuthDeg.toFixed(1)}° → ${last.azimuthDeg.toFixed(1)}°, altura ${first.altitudeDeg.toFixed(1)}° → ${last.altitudeDeg.toFixed(1)}°`,
  );
}

// En las antípodas la geometría besseliana sigue dando un eclipse perfectamente
// calculado que ocurre bajo tierra. El recorrido tiene que salir vacío: mandar a
// alguien a apuntar la cámara al suelo sería peor que no enseñar nada.
const sydney = eclipseTrack({ lat: -33.8688, lon: 151.2093 });
if (sydney.length !== 0) {
  console.log(`✗ Sídney devuelve ${sydney.length} puntos de recorrido con el Sol bajo el horizonte`);
  failures++;
} else {
  console.log("✓ Sin Sol sobre el horizonte no hay recorrido que dibujar (Sídney)");
}

console.log(failures === 0 ? "\nTodas las comprobaciones pasan." : `\n${failures} comprobaciones fallan.`);
process.exit(failures === 0 ? 0 : 1);
