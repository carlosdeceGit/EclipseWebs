import type { CityWithCircumstances } from "@/lib/eclipse/types";

/**
 * Utilidades de redacción.
 *
 * Existen para que ninguna cifra del blog se escriba a mano. Cada hora y cada
 * duración que aparece en un post sale del cálculo besseliano por estas funciones,
 * así que si el cálculo se afina, el texto se afina con él.
 */

/** "10:44:07" → "10:44". En prosa los segundos sobran y ensucian. */
export function hm(time: string | null): string {
  return time ? time.slice(0, 5) : "—";
}

/** "4 minutos y 48 segundos", para cuando el texto pide la duración escrita. */
export function durationWords(city: CityWithCircumstances, locale: "es" | "en"): string {
  const total = Math.round(city.eclipse.totalitySeconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (locale === "en") {
    return s === 0 ? `${m} minutes` : `${m} minutes and ${s} seconds`;
  }
  return s === 0 ? `${m} minutos` : `${m} minutos y ${s} segundos`;
}

/** La fecha del eclipse, escrita, porque aparece en casi todos los posts. */
export const ECLIPSE_DAY = {
  es: "lunes 2 de agosto de 2027",
  en: "Monday 2 August 2027",
} as const;
