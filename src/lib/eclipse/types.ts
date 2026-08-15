/**
 * Modelo de datos del eclipse solar total del 2 de agosto de 2027.
 *
 * Regla del proyecto: nunca se publica un dato numérico que no venga de una fuente
 * citable. Los campos que todavía no se han verificado se dejan en `null` y la UI
 * muestra "pendiente de verificación" en lugar de inventar una cifra. Los agentes
 * diarios (ver /agents) se encargan de rellenarlos contra el IGN y de dejar
 * constancia en `sources`.
 */

/** Instante local en la ciudad, en formato "HH:MM:SS". */
export type LocalTime = string;

export type Confidence =
  /** Verificado contra una fuente oficial citada en `sources`. */
  | "verified"
  /** Publicado por medios fiables pero sin confirmación oficial directa. */
  | "reported"
  /** Aún sin dato. La UI no muestra número. */
  | "pending";

export interface SourceRef {
  /** Nombre corto de la fuente, p. ej. "IGN — Instituto Geográfico Nacional". */
  name: string;
  url: string;
  /** Fecha ISO en la que un agente comprobó por última vez esta fuente. */
  checkedAt: string | null;
}

/** Los cinco contactos clásicos de un eclipse total. */
export interface ContactTimes {
  /** C1: primer contacto, empieza la fase parcial. */
  partialStart: LocalTime | null;
  /** C2: segundo contacto, empieza la totalidad. */
  totalityStart: LocalTime | null;
  /** Máximo del eclipse. */
  maximum: LocalTime | null;
  /** C3: tercer contacto, termina la totalidad. */
  totalityEnd: LocalTime | null;
  /** C4: cuarto contacto, termina la fase parcial. */
  partialEnd: LocalTime | null;
}

export interface EclipseCircumstances {
  /** Si la ciudad queda dentro de la franja de totalidad. */
  inTotality: boolean;
  /**
   * Duración de la totalidad en segundos. `null` si la ciudad está fuera de la
   * franja o si el dato aún no está verificado.
   */
  totalitySeconds: number | null;
  contacts: ContactTimes;
  /** Altura del Sol sobre el horizonte en el máximo, en grados. */
  sunAltitudeDeg: number | null;
  /** Magnitud del eclipse (>= 1 en totalidad). */
  magnitude: number | null;
  /** Distancia en km al centro de la franja. Útil para "¿me muevo o no?". */
  kmToCenterline: number | null;
  confidence: Confidence;
  sources: SourceRef[];
}

export interface City {
  /** Slug estable, usado en URLs y como clave de tenant. */
  slug: string;
  name: string;
  /** Nombre en inglés cuando difiere, para las páginas /en. */
  nameEn?: string;
  /** Provincia o ciudad autónoma. */
  province: string;
  country: "ES" | "MA" | "GI";
  /** Zona horaria IANA. Ceuta y Melilla van con la península; Marruecos no. */
  timeZone: string;
  lat: number;
  lon: number;
  /** Población aproximada, para ordenar y para estimar presión turística. */
  population: number | null;
  circumstances: EclipseCircumstances;
  /** Frase corta que resume por qué esta ciudad importa para el eclipse. */
  hook: string;
}
