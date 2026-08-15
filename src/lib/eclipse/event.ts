/** Fuentes de referencia del proyecto, citadas en la web y usadas por los agentes. */
export interface SourceRef {
  name: string;
  url: string;
}

export const SOURCES = {
  nasa: {
    name: "NASA/GSFC — Besselian Elements, Total Solar Eclipse of 2027 Aug 02",
    url: "https://eclipse.gsfc.nasa.gov/SEbeselm/SEbeselm2001/SE2027Aug02Tbeselm.html",
  },
  ign: {
    name: "IGN — Instituto Geográfico Nacional",
    url: "https://eclipses.ign.es/eclipse-total-sol-de-2-de-agosto-2027.html",
  },
  ignAstronomia: {
    name: "IGN — Astronomía",
    url: "https://astronomia.ign.es/eclipses-de-sol-y-luna/eclipse-total-sol-de-2-de-agosto-2027",
  },
  juntaAndalucia: {
    name: "Junta de Andalucía",
    url: "https://www.juntadeandalucia.es/organismos/universidadindustriaenergiaeinnovacion/servicios/actualidad/noticias/detalle/658819.html",
  },
} satisfies Record<string, SourceRef>;

/**
 * Datos del evento que no dependen de la localidad.
 *
 * Todo lo que sí depende de la localidad —horas, duración, magnitud— se calcula en
 * `besselian.ts` y no se guarda aquí.
 */
export const ECLIPSE = {
  dateISO: "2027-08-02",
  /** Instante del máximo eclipse mundial, sobre Egipto. */
  isoDateTimeUTC: "2027-08-02T10:06:38Z",
  weekdayEs: "lunes",
  weekdayEn: "Monday",
  /** Ventana aproximada de totalidad en el sur de España, hora peninsular (CEST). */
  spainTotalityWindow: { from: "10:44", to: "10:52" },
  /** Municipios españoles dentro de la franja, según la Junta de Andalucía. */
  totalityMunicipalities: {
    total: 115,
    byProvince: { Cádiz: 31, Málaga: 58, Granada: 16, Almería: 10 },
    note: "Además de los 115 municipios andaluces, la franja cubre Ceuta, Melilla y Gibraltar.",
    source: SOURCES.juntaAndalucia,
  },
  nextTotalInSpain: "2028-01-26 (anular); el siguiente total no vuelve hasta 2053",
  previousTotalInSpain: "2026-08-12",
} as const;

/** Cuenta atrás: instante usado por el contador de todas las webs. */
export const ECLIPSE_TIMESTAMP_MS = Date.parse(ECLIPSE.isoDateTimeUTC);
