import type { Locale } from "@/lib/eclipse/types";

export const LOCALES = ["es", "en"] as const;

/**
 * El español va sin prefijo y el inglés bajo /en.
 *
 * La audiencia principal es española y la mayoría de las búsquedas serán en
 * español, así que las URLs canónicas más valiosas no deben cargar con un prefijo
 * ni con una redirección. El proxy reescribe internamente a /es, pero eso nunca
 * asoma en la URL.
 */
export const DEFAULT_LOCALE: Locale = "es";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Ruta pública de un camino interno para un idioma dado. */
export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  return locale === DEFAULT_LOCALE ? clean || "/" : `/en${clean}`;
}

/** Etiquetas del selector de idioma. */
export const LOCALE_LABELS: Record<Locale, string> = {
  es: "Español",
  en: "English",
};

export const HTML_LANG: Record<Locale, string> = {
  es: "es-ES",
  en: "en-GB",
};

export const OG_LOCALE: Record<Locale, string> = {
  es: "es_ES",
  en: "en_GB",
};

export const INTL_LOCALE: Record<Locale, string> = {
  es: "es-ES",
  en: "en-GB",
};
