/**
 * Modelo de datos del eclipse solar total del 2 de agosto de 2027.
 *
 * Las circunstancias locales ya no se transcriben de tablas ajenas: se calculan con
 * elementos besselianos (ver `besselian.ts`), lo que permite dar datos correctos
 * para cualquier coordenada, no solo para las localidades que alguien haya
 * tabulado. El registro de ciudades solo guarda lo que no se puede calcular:
 * posición, nombre y contexto.
 */

export type Locale = "es" | "en";

export interface City {
  /** Slug estable, usado en URLs y como clave de tenant. */
  slug: string;
  name: string;
  /** Nombre en inglés cuando difiere del español. */
  nameEn?: string;
  province: string;
  provinceEn?: string;
  country: "ES" | "MA" | "GI" | "PT";
  /** Zona horaria IANA. Ceuta y Melilla van con la península; Marruecos no. */
  timeZone: string;
  /** Latitud geodésica, norte positivo. */
  lat: number;
  /** Longitud, este positivo. */
  lon: number;
  /** Altitud media en metros. Afecta a los contactos en menos de un segundo. */
  altitudeM?: number;
  population: number | null;
  /** Frase corta que resume por qué esta localidad importa para el eclipse. */
  hook: Record<Locale, string>;
}

/** Ciudad con sus circunstancias ya resueltas. Es lo que consumen las páginas. */
export interface CityWithCircumstances extends City {
  eclipse: import("./besselian").LocalCircumstances;
  /** Horas locales ya formateadas en la zona horaria de la ciudad. */
  localTimes: {
    partialStart: string | null;
    totalityStart: string | null;
    maximum: string;
    totalityEnd: string | null;
    partialEnd: string | null;
  };
}
