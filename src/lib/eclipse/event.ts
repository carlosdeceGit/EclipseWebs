import type { SourceRef } from "./types";

/** Fuentes de referencia del proyecto, reutilizadas por el dataset y por los agentes. */
export const SOURCES = {
  ign: {
    name: "IGN — Instituto Geográfico Nacional",
    url: "https://eclipses.ign.es/eclipse-total-sol-de-2-de-agosto-2027.html",
    checkedAt: null,
  },
  ignAstronomia: {
    name: "IGN — Astronomía",
    url: "https://astronomia.ign.es/en/eclipses-de-sol-y-luna/eclipse-total-sol-de-2-de-agosto-2027",
    checkedAt: null,
  },
  juntaAndalucia: {
    name: "Junta de Andalucía",
    url: "https://www.juntadeandalucia.es/organismos/universidadindustriaenergiaeinnovacion/servicios/actualidad/noticias/detalle/658819.html",
    checkedAt: null,
  },
} satisfies Record<string, SourceRef>;

/**
 * Datos del evento que no dependen de la ciudad.
 *
 * El eclipse es el 2 de agosto de 2027, lunes. La franja entra por el Atlántico,
 * cruza el estrecho de Gibraltar de oeste a este y sigue por el norte de África
 * hasta Egipto, el mar Rojo, Arabia Saudí, Yemen y Somalia, terminando en el
 * océano Índico.
 */
export const ECLIPSE = {
  /** Fecha en ISO. La hora es la del máximo aproximado en la península. */
  dateISO: "2027-08-02",
  isoDateTimeUTC: "2027-08-02T08:47:00Z",
  weekdayEs: "lunes",
  /** Ventana de totalidad en el sur de España, hora peninsular (CEST). */
  spainTotalityWindow: { from: "10:45", to: "10:53" },
  /** Municipios españoles dentro de la franja, según la Junta de Andalucía. */
  totalityMunicipalities: {
    total: 115,
    byProvince: { Cádiz: 31, Málaga: 58, Granada: 16, Almería: 10 },
    /** Ceuta y Melilla son ciudades autónomas y van aparte del recuento. */
    note: "Además de los 115 municipios andaluces, la franja cubre Ceuta y Melilla al completo.",
    source: SOURCES.juntaAndalucia,
  },
  /** Altura del Sol sobre el horizonte en el sur de España durante la totalidad. */
  sunAltitudeRangeDeg: { min: 37, max: 42 },
  nextTotalInSpain: "2028-01-26 (anular) y el siguiente total no vuelve hasta 2053",
  previousTotalInSpain: "2026-08-12",
} as const;

/** Cuenta atrás: instante exacto usado por el contador de todas las webs. */
export const ECLIPSE_TIMESTAMP_MS = Date.parse(ECLIPSE.isoDateTimeUTC);
