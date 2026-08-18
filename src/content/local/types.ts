import type { Locale } from "@/lib/eclipse/types";

/**
 * Capa de conocimiento local.
 *
 * Los datos del eclipse se calculan para cualquier coordenada (ver `besselian.ts`),
 * así que un dominio nuevo tiene cifras correctas desde el minuto uno. Lo que el
 * cálculo no da es lo que hace que una web sirva de algo en su ciudad: cómo se
 * llega, dónde cabe la gente, qué carretera se colapsa y qué nube local aparece
 * justo a esa hora.
 *
 * Eso es lo que guarda este módulo, y es también lo que impide que las webs de la
 * red sean la misma guía con el topónimo cambiado. Sin perfil local, un tenant
 * sigue funcionando con el texto genérico; con perfil, las guías compartidas se
 * reescriben solas alrededor de su ciudad.
 *
 * Regla al rellenarlo: nada que no se pueda comprobar. Un mirador inventado o un
 * horario de ferry de memoria cuestan más credibilidad de la que aporta el texto.
 * Las cifras del eclipse **no se escriben aquí**: se calculan.
 */

/** Texto corto en los dos idiomas. El inglés no es traducción literal: reencuadra. */
export type Bilingual = Record<Locale, string>;

/** Punto de observación con nombre propio. */
export interface LocalSpot {
  name: string;
  /** Nombre en inglés cuando el sitio se conoce por otro (Catalan Bay / La Caleta). */
  nameEn?: string;
  /** Qué lo hace bueno el día del eclipse. */
  why: Bilingual;
  /**
   * El pero, y es obligatorio.
   *
   * Un mirador recomendado sin su pega es una recomendación falsa: el día 2 la
   * diferencia entre un buen sitio y una trampa es el aparcamiento, el aforo o la
   * única carretera de salida, no la vista.
   */
  caveat: Bilingual;
}

/** Aviso con título, para renderizar como `callout`. */
export interface LocalNote {
  title: Bilingual;
  text: Bilingual;
}

export interface LocalProfile {
  citySlug: string;
  /**
   * La tesis: qué hace distinto ver este eclipse aquí y no cincuenta kilómetros más
   * allá. Abre las guías locales y es lo primero que distingue un dominio de otro.
   */
  angle: Bilingual;
  /**
   * Por qué este eclipse importa aquí, para la guía troncal.
   *
   * Se separa de `angle` a propósito: `angle` abre la guía de miradores y habla de
   * logística; esto abre la guía general y habla de la ciudad. Repetir el mismo
   * párrafo en dos páginas del mismo dominio sería duplicar dentro de casa, que es
   * el error que este módulo existe para evitar fuera.
   */
  whyHere: Bilingual;
  /** Puntos de observación reales, con su pega. */
  spots: LocalSpot[];
  /** Cómo se llega, en los términos de esta ciudad y no en genérico. */
  access: Record<Locale, string[]>;
  /** El cuello de botella concreto del día 2. */
  bottleneck: LocalNote;
  /** Dónde dormir cuando el consejo general no sirve. */
  stay: Record<Locale, string[]>;
  /** El riesgo meteorológico propio del sitio, que aquí nunca es el mismo. */
  weather: LocalNote;
}
