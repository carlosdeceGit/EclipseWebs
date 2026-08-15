/**
 * Consentimiento de cookies.
 *
 * La AEPD exige tres cosas que condicionan el diseño y que son las que más se
 * incumplen en la práctica:
 *
 *  1. Rechazar tiene que ser tan fácil como aceptar. Nada de esconder el rechazo
 *     tras un segundo nivel de menú.
 *  2. Nada no esencial puede cargarse antes de que haya consentimiento. Por eso el
 *     script de AdSense no vive en el layout: lo monta el componente de consentimiento
 *     y solo después de un "sí" explícito.
 *  3. Retirar el consentimiento tiene que ser tan fácil como darlo, y estar siempre
 *     accesible. De ahí el enlace permanente en el pie.
 *
 * Seguir navegando no es consentir, así que el banner no se cierra solo al hacer
 * scroll ni al pulsar fuera.
 */

export type ConsentValue = "granted" | "denied";

export interface ConsentState {
  /** Publicidad y medición de terceros. Lo único opcional que usamos hoy. */
  advertising: ConsentValue;
  /** Momento de la decisión, en ISO. Sirve como prueba de consentimiento. */
  decidedAt: string;
  /** Versión de la política aceptada; subirla vuelve a pedir consentimiento. */
  version: number;
}

/**
 * Versión de la política de cookies.
 *
 * Súbela cuando cambien las finalidades o los proveedores: un consentimiento dado
 * para AdSense no cubre añadir después otra red publicitaria.
 */
export const CONSENT_VERSION = 1;

export const CONSENT_STORAGE_KEY = "eclipse-consent";

/** Evento que abre el panel desde cualquier sitio, típicamente el pie. */
export const CONSENT_OPEN_EVENT = "eclipse:open-consent";

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (parsed.advertising !== "granted" && parsed.advertising !== "denied") return null;
    return parsed as ConsentState;
  } catch {
    // localStorage puede fallar en modo privado o con cookies bloqueadas. Ante la
    // duda, tratamos como si no hubiera decisión y no cargamos nada.
    return null;
  }
}

export function writeConsent(advertising: ConsentValue): ConsentState {
  const state: ConsentState = {
    advertising,
    decidedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Si no se puede guardar, la decisión vale para esta sesión y se volverá a
    // preguntar. Es el comportamiento correcto: nunca asumir un sí.
  }
  return state;
}

export function openConsentPanel(): void {
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
}
