/**
 * Validación de la geometría del visor solar.
 *
 * El visor pinta un círculo sobre la imagen de la cámara y le dice al usuario
 * cuánto le falta girar. Si la aritmética de ángulos está mal, el círculo miente
 * y alguien se planta el 2 de agosto detrás de un edificio. Como son funciones
 * puras, se comprueban aquí sin navegador, sin cámara y sin sensores.
 *
 *   npm run validate:viewer
 */

import {
  ALIGN_TOLERANCE_DEG,
  angleDifference,
  cameraElevation,
  compassHeading,
  fovForScreenAngle,
  normalizeDegrees,
  projectTarget,
} from "../src/lib/eclipse/solar-viewer";

let failures = 0;

function check(name: string, condition: boolean, detail = ""): void {
  if (condition) {
    console.log(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
  } else {
    console.log(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
    failures++;
  }
}

/** Comparación con tolerancia: aquí todo son grados y hay trigonometría de por medio. */
function near(actual: number, expected: number, tolerance = 1e-6): boolean {
  return Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance;
}

console.log("Normalización de ángulos\n");

check("normalizeDegrees(-10) = 350", normalizeDegrees(-10) === 350);
check("normalizeDegrees(370) = 10", normalizeDegrees(370) === 10);
check("normalizeDegrees(360) = 0", normalizeDegrees(360) === 0);
check("normalizeDegrees(0) = 0", normalizeDegrees(0) === 0);
check("normalizeDegrees(-0.5) = 359.5", near(normalizeDegrees(-0.5), 359.5));
check("normalizeDegrees(359.9) se queda igual", near(normalizeDegrees(359.9), 359.9));
check("normalizeDegrees(-720) = 0", normalizeDegrees(-720) === 0);
check("normalizeDegrees(NaN) no devuelve un ángulo", Number.isNaN(normalizeDegrees(NaN)));

console.log("\nCruce por el norte\n");

check("de 355° a 5° faltan +10°", angleDifference(355, 5) === 10);
check("de 5° a 355° faltan -10°", angleDifference(5, 355) === -10);
check("de 0° a 359° faltan -1°", angleDifference(0, 359) === -1);
check("de 359° a 0° falta +1°", angleDifference(359, 0) === 1);
check("de 90° a 90° no falta nada", angleDifference(90, 90) === 0);
check("de 10° a 100° faltan +90°", angleDifference(10, 100) === 90);
check("de 0° a 180° se resuelve como +180°", angleDifference(0, 180) === 180);
check("nunca se devuelve más de media vuelta", Math.abs(angleDifference(1, 300)) <= 180, `${angleDifference(1, 300)}°`);

console.log("\nElevación del eje de la cámara\n");

// Móvil vertical en la mano, apuntando al horizonte: beta = 90.
check(
  "vertical apuntando al horizonte → 0°",
  near(cameraElevation({ alpha: 0, beta: 90, gamma: 0 }) ?? NaN, 0, 1e-9),
  `${cameraElevation({ alpha: 0, beta: 90, gamma: 0 })?.toFixed(3)}°`,
);
// Inclinado hacia atrás 30° respecto a la vertical: la cámara sube 30°.
check(
  "vertical inclinado 30° hacia atrás → +30°",
  near(cameraElevation({ alpha: 0, beta: 120, gamma: 0 }) ?? NaN, 30, 1e-9),
  `${cameraElevation({ alpha: 0, beta: 120, gamma: 0 })?.toFixed(3)}°`,
);
// Tumbado sobre la mesa con la pantalla arriba: la cámara mira al suelo.
check(
  "plano sobre la mesa → -90°",
  near(cameraElevation({ alpha: 0, beta: 0, gamma: 0 }) ?? NaN, -90, 1e-9),
);
// Boca arriba: la cámara mira al cenit.
check(
  "pantalla hacia el suelo → +90°",
  near(cameraElevation({ alpha: 0, beta: 180, gamma: 0 }) ?? NaN, 90, 1e-9),
);
// Apaisado y apuntando al horizonte: leer `beta` a secas daría 0° de inclinación
// mal interpretada; el vector lo resuelve.
check(
  "apaisado apuntando al horizonte → 0°",
  near(cameraElevation({ alpha: 0, beta: 0, gamma: 90, screenAngle: 90 }) ?? NaN, 0, 1e-9),
);
check(
  "apaisado al otro lado apuntando al horizonte → 0°",
  near(cameraElevation({ alpha: 0, beta: 0, gamma: -90, screenAngle: 270 }) ?? NaN, 0, 1e-9),
);
check("sin ángulos no hay elevación", cameraElevation({ alpha: null, beta: null, gamma: null }) === null);

console.log("\nRumbo de la cámara\n");

check(
  "vertical con alpha 0 → norte",
  near(compassHeading({ alpha: 0, beta: 90, gamma: 0 }) ?? NaN, 0, 1e-6),
  `${compassHeading({ alpha: 0, beta: 90, gamma: 0 })?.toFixed(2)}°`,
);
check(
  "vertical con alpha 90 → oeste",
  near(compassHeading({ alpha: 90, beta: 90, gamma: 0 }) ?? NaN, 270, 1e-6),
  `${compassHeading({ alpha: 90, beta: 90, gamma: 0 })?.toFixed(2)}°`,
);
check(
  "vertical con alpha 270 → este",
  near(compassHeading({ alpha: 270, beta: 90, gamma: 0 }) ?? NaN, 90, 1e-6),
  `${compassHeading({ alpha: 270, beta: 90, gamma: 0 })?.toFixed(2)}°`,
);
check(
  "vertical con alpha 180 → sur",
  near(compassHeading({ alpha: 180, beta: 90, gamma: 0 }) ?? NaN, 180, 1e-6),
  `${compassHeading({ alpha: 180, beta: 90, gamma: 0 })?.toFixed(2)}°`,
);
// Levantar el móvil no debe cambiar el rumbo: es justo lo que falla con `360 - alpha`.
check(
  "inclinar 40° hacia el cielo no cambia el rumbo",
  near(compassHeading({ alpha: 180, beta: 130, gamma: 0 }) ?? NaN, 180, 1e-6),
  `${compassHeading({ alpha: 180, beta: 130, gamma: 0 })?.toFixed(2)}°`,
);
check("sin ángulos no hay rumbo", compassHeading({ alpha: null, beta: 90, gamma: 0 }) === null);

console.log("\nProyección sobre la pantalla\n");

const fov = { fovHorizontalDeg: 46, fovVerticalDeg: 60 };
const base = { cameraAzimuthDeg: 180, cameraAltitudeDeg: 60, ...fov };

const centered = projectTarget({ targetAzimuthDeg: 180, targetAltitudeDeg: 60, ...base });
check("objetivo centrado → 50% / 50%", near(centered.xPercent, 50) && near(centered.yPercent, 50));
check("objetivo centrado → dentro de pantalla", centered.onScreen);
check("objetivo centrado → alineado", centered.aligned);

const right = projectTarget({ targetAzimuthDeg: 190, targetAltitudeDeg: 60, ...base });
check("objetivo a la derecha → delta positivo", right.deltaAzimuthDeg === 10);
check("objetivo a la derecha → x > 50%", right.xPercent > 50, `${right.xPercent.toFixed(1)}%`);
check("objetivo a la derecha → no alineado", !right.aligned);
check("objetivo a la derecha → sigue en pantalla", right.onScreen);

const left = projectTarget({ targetAzimuthDeg: 170, targetAltitudeDeg: 60, ...base });
check("objetivo a la izquierda → delta negativo", left.deltaAzimuthDeg === -10);
check("objetivo a la izquierda → x < 50%", left.xPercent < 50, `${left.xPercent.toFixed(1)}%`);

const above = projectTarget({ targetAzimuthDeg: 180, targetAltitudeDeg: 75, ...base });
check("objetivo por encima → delta positivo", above.deltaAltitudeDeg === 15);
check("objetivo por encima → y < 50%", above.yPercent < 50, `${above.yPercent.toFixed(1)}%`);

const below = projectTarget({ targetAzimuthDeg: 180, targetAltitudeDeg: 40, ...base });
check("objetivo por debajo → delta negativo", below.deltaAltitudeDeg === -20);
check("objetivo por debajo → y > 50%", below.yPercent > 50, `${below.yPercent.toFixed(1)}%`);

const offAzimuth = projectTarget({ targetAzimuthDeg: 250, targetAltitudeDeg: 60, ...base });
check("objetivo fuera por azimut → fuera de pantalla", !offAzimuth.onScreen);
check("objetivo fuera por azimut → manda girar a la derecha", offAzimuth.deltaAzimuthDeg > 0);

const offAltitude = projectTarget({ targetAzimuthDeg: 180, targetAltitudeDeg: 5, ...base });
check("objetivo fuera por altura → fuera de pantalla", !offAltitude.onScreen);
check("objetivo fuera por altura → manda bajar", offAltitude.deltaAltitudeDeg < 0);

// El cruce 359°/0° dentro de la proyección: la cámara mira al norte por el este y
// el objetivo está por el oeste del norte. La diferencia son 5°, no 355°.
const acrossNorth = projectTarget({
  targetAzimuthDeg: 357,
  targetAltitudeDeg: 30,
  cameraAzimuthDeg: 2,
  cameraAltitudeDeg: 30,
  ...fov,
});
check("cruce 359°/0° → delta -5°", acrossNorth.deltaAzimuthDeg === -5);
check("cruce 359°/0° → sigue en pantalla", acrossNorth.onScreen, `x ${acrossNorth.xPercent.toFixed(1)}%`);

const acrossNorthBack = projectTarget({
  targetAzimuthDeg: 3,
  targetAltitudeDeg: 30,
  cameraAzimuthDeg: 358,
  cameraAltitudeDeg: 30,
  ...fov,
});
check("cruce 0°/359° al revés → delta +5°", acrossNorthBack.deltaAzimuthDeg === 5);

console.log("\nBordes exactos del campo visual\n");

const edgeRight = projectTarget({
  targetAzimuthDeg: 180 + fov.fovHorizontalDeg / 2,
  targetAltitudeDeg: 60,
  ...base,
});
check("borde derecho exacto → x = 100%", near(edgeRight.xPercent, 100, 1e-9), `${edgeRight.xPercent}%`);
check("borde derecho exacto → cuenta como dentro", edgeRight.onScreen);

const justOutside = projectTarget({
  targetAzimuthDeg: 180 + fov.fovHorizontalDeg / 2 + 0.5,
  targetAltitudeDeg: 60,
  ...base,
});
check("medio grado más allá → fuera", !justOutside.onScreen);

const edgeTop = projectTarget({
  targetAzimuthDeg: 180,
  targetAltitudeDeg: 60 + fov.fovVerticalDeg / 2,
  ...base,
});
check("borde superior exacto → y = 0%", near(edgeTop.yPercent, 0, 1e-9), `${edgeTop.yPercent}%`);
check("borde superior exacto → cuenta como dentro", edgeTop.onScreen);

const edgeBottom = projectTarget({
  targetAzimuthDeg: 180,
  targetAltitudeDeg: 60 - fov.fovVerticalDeg / 2,
  ...base,
});
check("borde inferior exacto → y = 100%", near(edgeBottom.yPercent, 100, 1e-9), `${edgeBottom.yPercent}%`);

console.log("\nTolerancia de alineación y campo visual\n");

const atTolerance = projectTarget({
  targetAzimuthDeg: 180 + ALIGN_TOLERANCE_DEG,
  targetAltitudeDeg: 60,
  ...base,
});
check("justo en la tolerancia → alineado", atTolerance.aligned);

const pastTolerance = projectTarget({
  targetAzimuthDeg: 180 + ALIGN_TOLERANCE_DEG + 0.1,
  targetAltitudeDeg: 60,
  ...base,
});
check("pasada la tolerancia → no alineado", !pastTolerance.aligned);

const portrait = fovForScreenAngle(0);
const landscape = fovForScreenAngle(90);
check("en vertical el campo alto es el mayor", portrait.vertical > portrait.horizontal);
check("en apaisado el campo ancho es el mayor", landscape.horizontal > landscape.vertical);
check("girar 180° sigue siendo vertical", fovForScreenAngle(180).vertical === portrait.vertical);
check("girar 270° sigue siendo apaisado", fovForScreenAngle(270).horizontal === landscape.horizontal);

// Caso real: el Sol en el máximo desde Ceuta está a 95.4° de azimut y 38.4° de
// altura, según el mismo cálculo besseliano que valida `validate-eclipse.ts`. Con el
// móvil apuntando 12° a la izquierda, el visor tiene que mandar girar esos 12°.
const ceuta = projectTarget({
  targetAzimuthDeg: 95.4,
  targetAltitudeDeg: 38.4,
  cameraAzimuthDeg: 83.4,
  cameraAltitudeDeg: 38.4,
  ...fov,
});
check("caso Ceuta → manda girar 12° a la derecha", near(ceuta.deltaAzimuthDeg, 12, 1e-9), `${ceuta.deltaAzimuthDeg.toFixed(1)}°`);
check("caso Ceuta → 12° caben en el encuadre de 46°, pero no en la retícula", ceuta.onScreen && !ceuta.aligned);

console.log(
  failures === 0
    ? "\nTodas las comprobaciones del visor pasan."
    : `\n${failures} comprobaciones del visor fallan.`,
);
process.exit(failures === 0 ? 0 : 1);
