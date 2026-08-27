import { circumstancesAt, eclipseTrack, type ObserverPosition } from "./besselian";
import type { City, CityWithCircumstances, Locale } from "./types";

/**
 * Registro de localidades.
 *
 * Solo guarda lo que no se puede calcular. Las horas, la duración, la magnitud y la
 * posición del Sol salen de `circumstancesAt()`, así que añadir un municipio es
 * añadir su nombre y sus coordenadas: los datos del eclipse aparecen solos y son
 * correctos por construcción.
 */
export const CITIES: City[] = [
  // --- Ciudades autónomas -------------------------------------------------
  {
    slug: "ceuta",
    name: "Ceuta",
    province: "Ceuta",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 35.8894,
    lon: -5.3213,
    altitudeM: 30,
    population: 83517,
    hook: {
      es: "El mejor punto de toda España: casi cinco minutos de totalidad, el máximo del país.",
      en: "The best spot in all of Spain: almost five minutes of totality, the country's maximum.",
    },
  },
  {
    slug: "melilla",
    name: "Melilla",
    province: "Melilla",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 35.2923,
    lon: -2.9381,
    altitudeM: 30,
    population: 86261,
    hook: {
      es: "Más de cuatro minutos y medio de totalidad con el Sol muy alto sobre el Mediterráneo.",
      en: "Over four and a half minutes of totality with the Sun high above the Mediterranean.",
    },
  },

  // --- Campo de Gibraltar: el corazón de la franja peninsular -------------
  {
    slug: "algeciras",
    name: "Algeciras",
    province: "Cádiz",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.1275,
    lon: -5.4536,
    altitudeM: 20,
    population: 123078,
    hook: {
      es: "El mejor punto de la Península: más de cuatro minutos y medio de totalidad.",
      en: "The best spot on the Spanish mainland: over four and a half minutes of totality.",
    },
  },
  {
    slug: "la-linea-de-la-concepcion",
    name: "La Línea de la Concepción",
    province: "Cádiz",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.1611,
    lon: -5.3486,
    altitudeM: 10,
    population: 62864,
    hook: {
      es: "Junto al Peñón y a pocos kilómetros del centro de la franja.",
      en: "Next to the Rock and just a few kilometres from the centre of the path.",
    },
  },
  {
    slug: "san-roque",
    name: "San Roque",
    province: "Cádiz",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.2103,
    lon: -5.3844,
    altitudeM: 109,
    population: 32118,
    hook: {
      es: "Campo de Gibraltar, en pleno eje de la franja de máxima duración peninsular.",
      en: "Campo de Gibraltar, right on the axis of the mainland's longest totality.",
    },
  },
  {
    slug: "los-barrios",
    name: "Los Barrios",
    province: "Cádiz",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.1847,
    lon: -5.4917,
    altitudeM: 25,
    population: 24029,
    hook: {
      es: "Interior del Campo de Gibraltar, con menos afluencia que la costa y la misma totalidad.",
      en: "Inland Campo de Gibraltar: fewer crowds than the coast, the same totality.",
    },
  },
  {
    slug: "gibraltar",
    name: "Gibraltar",
    province: "Gibraltar",
    country: "GI",
    timeZone: "Europe/Gibraltar",
    lat: 36.1408,
    lon: -5.3536,
    altitudeM: 5,
    population: 32688,
    hook: {
      es: "El Peñón, dentro de la franja y con visitantes llegando desde el Reino Unido.",
      en: "The Rock, inside the path of totality and drawing visitors from the UK.",
    },
  },

  // --- Costa de la Luz (Cádiz) --------------------------------------------
  {
    slug: "tarifa",
    name: "Tarifa",
    province: "Cádiz",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.0143,
    lon: -5.6044,
    altitudeM: 15,
    population: 18775,
    hook: {
      es: "El punto más al sur de la Península, con horizonte marino y África enfrente.",
      en: "Mainland Europe's southernmost point, with an open sea horizon and Africa in view.",
    },
  },
  {
    slug: "cadiz",
    name: "Cádiz",
    nameEn: "Cadiz",
    province: "Cádiz",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.5271,
    lon: -6.2886,
    altitudeM: 11,
    population: 110616,
    hook: {
      es: "Una de las dos únicas capitales de provincia dentro de la franja de totalidad.",
      en: "One of only two provincial capitals inside the path of totality.",
    },
  },
  {
    slug: "conil-de-la-frontera",
    name: "Conil de la Frontera",
    province: "Cádiz",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.2769,
    lon: -6.0894,
    altitudeM: 25,
    population: 22505,
    hook: {
      es: "Playas abiertas al Atlántico y cielos despejados en agosto.",
      en: "Wide Atlantic beaches and reliably clear August skies.",
    },
  },
  {
    slug: "vejer-de-la-frontera",
    name: "Vejer de la Frontera",
    province: "Cádiz",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.2529,
    lon: -5.9663,
    altitudeM: 190,
    population: 12905,
    hook: {
      es: "Pueblo blanco en alto: uno de los mejores miradores naturales de la franja.",
      en: "A hilltop white village: one of the best natural viewpoints on the path.",
    },
  },
  {
    slug: "barbate",
    name: "Barbate",
    province: "Cádiz",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.1922,
    lon: -5.9223,
    altitudeM: 10,
    population: 22558,
    hook: {
      es: "Costa de la Luz, con el cabo de Trafalgar como escenario de observación.",
      en: "Costa de la Luz, with Cape Trafalgar as your viewing backdrop.",
    },
  },
  {
    slug: "chiclana-de-la-frontera",
    name: "Chiclana de la Frontera",
    province: "Cádiz",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.4194,
    lon: -6.1464,
    altitudeM: 25,
    population: 87543,
    hook: {
      es: "La Barrosa y una de las mayores capacidades de alojamiento de la provincia.",
      en: "La Barrosa beach and one of the largest accommodation capacities in the province.",
    },
  },
  {
    slug: "san-fernando",
    name: "San Fernando",
    province: "Cádiz",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.4664,
    lon: -6.1997,
    altitudeM: 5,
    population: 94815,
    hook: {
      es: "En la bahía de Cádiz, sede del Real Observatorio de la Armada.",
      en: "On the Bay of Cadiz, home of the Royal Naval Observatory.",
    },
  },
  {
    slug: "puerto-real",
    name: "Puerto Real",
    province: "Cádiz",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.5283,
    lon: -6.1897,
    altitudeM: 10,
    population: 42605,
    hook: {
      es: "Bahía de Cádiz, con buenos accesos y menos saturación que la capital.",
      en: "Bay of Cadiz, with good access and less congestion than the capital.",
    },
  },
  {
    slug: "el-puerto-de-santa-maria",
    name: "El Puerto de Santa María",
    province: "Cádiz",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.5936,
    lon: -6.2331,
    altitudeM: 10,
    population: 89249,
    hook: {
      es: "Bahía de Cádiz, bien conectado y con mucha oferta de alojamiento.",
      en: "Bay of Cadiz, well connected and with plenty of places to stay.",
    },
  },
  {
    slug: "medina-sidonia",
    name: "Medina Sidonia",
    province: "Cádiz",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.4569,
    lon: -5.9269,
    altitudeM: 337,
    population: 11760,
    hook: {
      es: "Cerro de 337 m sobre la campiña: vistas de 360° y menos gente que la costa.",
      en: "A 337 m hilltop over open countryside: 360° views and far fewer people than the coast.",
    },
  },
  {
    slug: "jerez-de-la-frontera",
    name: "Jerez de la Frontera",
    province: "Cádiz",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.6866,
    lon: -6.1361,
    altitudeM: 55,
    population: 213231,
    hook: {
      es: "Aeropuerto propio y la mayor ciudad de la provincia: puerta de entrada a la franja.",
      en: "Its own airport and the province's largest city: the gateway to the path.",
    },
  },

  // --- Costa del Sol y serranía (Málaga) ----------------------------------
  {
    slug: "malaga",
    name: "Málaga",
    nameEn: "Malaga",
    province: "Málaga",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.7213,
    lon: -4.4214,
    altitudeM: 11,
    population: 586384,
    hook: {
      es: "Capital dentro de la franja, pero cerca del borde: la totalidad es corta.",
      en: "A provincial capital inside the path, but close to the edge: totality is short.",
    },
  },
  {
    slug: "marbella",
    name: "Marbella",
    province: "Málaga",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.5101,
    lon: -4.8824,
    altitudeM: 25,
    population: 156295,
    hook: {
      es: "Totalidad en la Costa del Sol occidental, con la mayor oferta hotelera de la franja.",
      en: "Totality on the western Costa del Sol, with the path's biggest hotel capacity.",
    },
  },
  {
    slug: "estepona",
    name: "Estepona",
    province: "Málaga",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.4276,
    lon: -5.1448,
    altitudeM: 20,
    population: 78060,
    hook: {
      es: "Costa del Sol con totalidad más larga que Málaga capital por estar más al oeste.",
      en: "Costa del Sol, with longer totality than Malaga city thanks to being further west.",
    },
  },
  {
    slug: "fuengirola",
    name: "Fuengirola",
    province: "Málaga",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.5397,
    lon: -4.6247,
    altitudeM: 10,
    population: 83287,
    hook: {
      es: "Costa del Sol central, muy bien conectada por tren de cercanías con Málaga.",
      en: "Central Costa del Sol, well connected to Malaga by commuter train.",
    },
  },
  {
    slug: "torremolinos",
    name: "Torremolinos",
    province: "Málaga",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.6247,
    lon: -4.4997,
    altitudeM: 50,
    population: 69389,
    hook: {
      es: "Junto al aeropuerto de Málaga y con enorme capacidad hotelera.",
      en: "Right by Malaga airport and with enormous hotel capacity.",
    },
  },
  {
    slug: "benalmadena",
    name: "Benalmádena",
    province: "Málaga",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.5988,
    lon: -4.5166,
    altitudeM: 200,
    population: 71914,
    hook: {
      es: "Tiene teleférico y observatorio: altura fácil y horizonte despejado.",
      en: "Home to a cable car and an observatory: easy height and a clear horizon.",
    },
  },
  {
    slug: "mijas",
    name: "Mijas",
    province: "Málaga",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.5959,
    lon: -4.6373,
    altitudeM: 428,
    population: 91136,
    hook: {
      es: "Pueblo en la sierra a 428 m, por encima de las nubes bajas de la costa.",
      en: "A mountain village at 428 m, above the coast's low cloud.",
    },
  },
  {
    slug: "ronda",
    name: "Ronda",
    province: "Málaga",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.7423,
    lon: -5.1665,
    altitudeM: 723,
    population: 33978,
    hook: {
      es: "A 723 m sobre el tajo, con uno de los horizontes más amplios de la provincia.",
      en: "At 723 m above its gorge, with one of the widest horizons in the province.",
    },
  },
  {
    slug: "nerja",
    name: "Nerja",
    province: "Málaga",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.7444,
    lon: -3.8747,
    altitudeM: 20,
    population: 21996,
    hook: {
      es: "Axarquía oriental, en el tramo final de la franja antes de Granada.",
      en: "Eastern Axarquia, on the final stretch of the path before Granada.",
    },
  },
  {
    slug: "velez-malaga",
    name: "Vélez-Málaga",
    province: "Málaga",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.7797,
    lon: -4.1011,
    altitudeM: 67,
    population: 84559,
    hook: {
      es: "Capital de la Axarquía, con playa en Torre del Mar y buenos accesos.",
      en: "Capital of the Axarquia, with a beach at Torre del Mar and good access.",
    },
  },

  // --- Costa Tropical (Granada) y Almería ---------------------------------
  {
    slug: "motril",
    name: "Motril",
    province: "Granada",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.7448,
    lon: -3.5188,
    altitudeM: 45,
    population: 62290,
    hook: {
      es: "Costa Tropical granadina, en el tramo sur de la provincia que entra en la franja.",
      en: "Granada's Costa Tropical, on the southern strip of the province inside the path.",
    },
  },
  {
    slug: "almunecar",
    name: "Almuñécar",
    province: "Granada",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.7339,
    lon: -3.6911,
    altitudeM: 25,
    population: 26161,
    hook: {
      es: "Costa Tropical, entre acantilados y con muchos miradores sobre el mar.",
      en: "Costa Tropical, among cliffs and with plenty of sea viewpoints.",
    },
  },
  {
    slug: "salobrena",
    name: "Salobreña",
    province: "Granada",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.744,
    lon: -3.5872,
    altitudeM: 100,
    population: 12163,
    hook: {
      es: "Peñón y castillo sobre la vega: mirador natural sobre el Mediterráneo.",
      en: "A rock and castle above the plain: a natural balcony over the Mediterranean.",
    },
  },
  {
    slug: "adra",
    name: "Adra",
    province: "Almería",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.7487,
    lon: -3.0207,
    altitudeM: 10,
    population: 25523,
    hook: {
      es: "Uno de los municipios almerienses que alcanzan la totalidad.",
      en: "One of the Almeria municipalities that reach totality.",
    },
  },
  {
    slug: "el-ejido",
    name: "El Ejido",
    province: "Almería",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.7767,
    lon: -2.8156,
    altitudeM: 91,
    population: 84710,
    hook: {
      es: "Poniente almeriense, en el extremo oriental de la franja española.",
      en: "Western Almeria, at the eastern end of the Spanish path.",
    },
  },

  // --- Fuera de la franja -------------------------------------------------
  // Se incluyen a propósito: "¿se verá el eclipse en Sevilla?" es una de las
  // búsquedas con más volumen, y la respuesta honesta —parcial, no total— es la
  // que convierte a esa gente en visitantes de la franja.
  {
    slug: "sevilla",
    name: "Sevilla",
    nameEn: "Seville",
    province: "Sevilla",
    provinceEn: "Seville",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 37.3891,
    lon: -5.9845,
    altitudeM: 7,
    population: 681998,
    hook: {
      es: "Se queda a las puertas: eclipse parcial muy profundo, pero sin totalidad.",
      en: "Just outside: a very deep partial eclipse, but no totality.",
    },
  },
  {
    slug: "granada",
    name: "Granada",
    province: "Granada",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 37.1773,
    lon: -3.5986,
    altitudeM: 738,
    population: 232462,
    hook: {
      es: "La capital queda fuera, aunque el sur de la provincia sí entra en la franja.",
      en: "The city itself is outside, though the south of the province is inside the path.",
    },
  },
  {
    slug: "almeria",
    name: "Almería",
    nameEn: "Almeria",
    province: "Almería",
    provinceEn: "Almeria",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 36.8381,
    lon: -2.4597,
    altitudeM: 25,
    population: 200753,
    hook: {
      es: "Muy cerca del borde: basta bajar al poniente de la provincia para ver la totalidad.",
      en: "Very close to the edge: a short drive west in the province reaches totality.",
    },
  },
  {
    slug: "huelva",
    name: "Huelva",
    province: "Huelva",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 37.2614,
    lon: -6.9447,
    altitudeM: 54,
    population: 143663,
    hook: {
      es: "Eclipse parcial profundo, con la franja a poco más de una hora en coche.",
      en: "A deep partial eclipse, with the path little more than an hour's drive away.",
    },
  },
  {
    slug: "cordoba",
    name: "Córdoba",
    nameEn: "Cordoba",
    province: "Córdoba",
    provinceEn: "Cordoba",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 37.8882,
    lon: -4.7794,
    altitudeM: 106,
    population: 319515,
    hook: {
      es: "Parcial muy marcado, pero la corona solo se ve bajando al sur.",
      en: "A pronounced partial eclipse, but the corona requires heading south.",
    },
  },
  {
    slug: "madrid",
    name: "Madrid",
    province: "Madrid",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 40.4168,
    lon: -3.7038,
    altitudeM: 650,
    population: 3332035,
    hook: {
      es: "Eclipse parcial notable, pero sin oscuridad ni corona: la diferencia es enorme.",
      en: "A noticeable partial eclipse, but no darkness and no corona: the difference is vast.",
    },
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    province: "Barcelona",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 41.3874,
    lon: 2.1686,
    altitudeM: 12,
    population: 1620343,
    hook: {
      es: "Parcial moderado. Para ver la totalidad hay que cruzar la península.",
      en: "A moderate partial eclipse. Totality means crossing the peninsula.",
    },
  },
  {
    slug: "valencia",
    name: "València",
    nameEn: "Valencia",
    province: "Valencia",
    country: "ES",
    timeZone: "Europe/Madrid",
    lat: 39.4699,
    lon: -0.3763,
    altitudeM: 15,
    population: 792492,
    hook: {
      es: "Eclipse parcial. La franja queda al suroeste, a unas horas de viaje.",
      en: "A partial eclipse. The path lies to the southwest, a few hours away.",
    },
  },
  {
    slug: "lisboa",
    name: "Lisboa",
    nameEn: "Lisbon",
    province: "Lisboa",
    provinceEn: "Lisbon",
    country: "PT",
    timeZone: "Europe/Lisbon",
    lat: 38.7223,
    lon: -9.1393,
    altitudeM: 100,
    population: 545796,
    hook: {
      es: "Parcial profundo desde Portugal, con el Algarve más cerca de la franja.",
      en: "A deep partial from Portugal, with the Algarve closer to the path.",
    },
  },

  // --- Norte de África ----------------------------------------------------
  {
    slug: "tanger",
    name: "Tánger",
    nameEn: "Tangier",
    province: "Tánger-Tetuán-Alhucemas",
    provinceEn: "Tangier-Tetouan-Al Hoceima",
    country: "MA",
    timeZone: "Africa/Casablanca",
    lat: 35.7595,
    lon: -5.834,
    altitudeM: 20,
    population: 1275428,
    hook: {
      es: "Al otro lado del Estrecho, con totalidad larga y una hora local distinta.",
      en: "Across the Strait, with long totality and a different local time.",
    },
  },
  {
    slug: "tetuan",
    name: "Tetuán",
    nameEn: "Tetouan",
    province: "Tánger-Tetuán-Alhucemas",
    provinceEn: "Tangier-Tetouan-Al Hoceima",
    country: "MA",
    timeZone: "Africa/Casablanca",
    lat: 35.5785,
    lon: -5.3684,
    altitudeM: 80,
    population: 380787,
    hook: {
      es: "Muy cerca del centro de la franja, justo al sur de Ceuta.",
      en: "Very close to the centre of the path, just south of Ceuta.",
    },
  },
];

export const CITIES_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

/**
 * Formatea un instante en la hora local de la ciudad.
 *
 * Se apoya en la base de datos de zonas horarias del entorno en vez de sumar un
 * desfase a mano: Ceuta y Melilla van con la península, pero Gibraltar y Marruecos
 * no, y en agosto de 2027 Marruecos está en UTC+1 mientras España está en UTC+2.
 */
export function toLocalTime(date: Date | null, timeZone: string, withSeconds = true): string | null {
  if (!date) return null;
  return new Intl.DateTimeFormat("es-ES", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    ...(withSeconds ? { second: "2-digit" } : {}),
    hour12: false,
  }).format(date);
}

/**
 * Recorrido del Sol durante el eclipse, listo para el visor de cámara.
 *
 * El visor es un componente de cliente y no debe cargar el cálculo besseliano ni
 * la tabla de elementos, así que las posiciones llegan resueltas y las horas ya
 * formateadas en la zona horaria del punto. Los grados se redondean a la décima,
 * que es la precisión que declaramos: dar más cifras sería fingir una puntería
 * que ni el magnetómetro del móvil ni el campo visual estimado permiten.
 */
export function viewerTrack(observer: ObserverPosition, timeZone: string) {
  return eclipseTrack(observer).map((sample) => ({
    time: toLocalTime(sample.time, timeZone) ?? "",
    azimuthDeg: Number(sample.azimuthDeg.toFixed(1)),
    altitudeDeg: Number(sample.altitudeDeg.toFixed(1)),
    obscuration: sample.obscuration,
    contact: sample.contact,
  }));
}

/**
 * Resuelve las circunstancias de una ciudad.
 *
 * El cálculo es puro y barato (unas pocas iteraciones de Newton), así que no se
 * cachea: mantener el resultado siempre derivado del registro evita que un dato
 * quede desincronizado de sus coordenadas.
 */
export function resolveCity(city: City): CityWithCircumstances {
  const eclipse = circumstancesAt({ lat: city.lat, lon: city.lon, altitudeM: city.altitudeM });
  return {
    ...city,
    eclipse,
    localTimes: {
      partialStart: toLocalTime(eclipse.partialStart, city.timeZone),
      totalityStart: toLocalTime(eclipse.totalityStart, city.timeZone),
      maximum: toLocalTime(eclipse.maximum, city.timeZone)!,
      totalityEnd: toLocalTime(eclipse.totalityEnd, city.timeZone),
      partialEnd: toLocalTime(eclipse.partialEnd, city.timeZone),
    },
  };
}

export function getCity(slug: string): CityWithCircumstances | undefined {
  const city = CITIES_BY_SLUG.get(slug);
  return city ? resolveCity(city) : undefined;
}

export function allCities(): CityWithCircumstances[] {
  return CITIES.map(resolveCity);
}

/** Ciudades con totalidad, de más larga a más corta. */
export function citiesByTotality(): CityWithCircumstances[] {
  return allCities()
    .filter((c) => c.eclipse.isTotal)
    .sort((a, b) => b.eclipse.totalitySeconds - a.eclipse.totalitySeconds);
}

/** Ciudades del registro que se quedan fuera de la franja. */
export function citiesOutsideTotality(): CityWithCircumstances[] {
  return allCities().filter((c) => !c.eclipse.isTotal);
}

/** "4 min 48 s" / "4 min 48 s". Devuelve null si no hay totalidad. */
export function formatDuration(seconds: number, locale: Locale = "es"): string | null {
  if (!seconds) return null;
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (locale === "en") return s === 0 ? `${m} min` : `${m} min ${s} s`;
  return s === 0 ? `${m} min` : `${m} min ${s} s`;
}

/**
 * Porcentaje de disco solar cubierto, listo para mostrar.
 *
 * Localidades justo al borde de la franja, como Almería, cubren un 99,96 % que al
 * redondear sale "100,0 %". Mostrar eso en una localidad sin totalidad es engañoso:
 * cualquiera leería que allí se hace de noche. Por eso el 100 % se reserva a la
 * totalidad de verdad y el resto se topa en 99,9 %.
 */
export function formatObscuration(obscuration: number, isTotal: boolean): string {
  const pct = obscuration * 100;
  if (isTotal) return "100%";
  return `${Math.min(pct, 99.9).toFixed(1)}%`;
}

/** Nombre de la ciudad en el idioma pedido. */
export function cityName(city: City, locale: Locale): string {
  return locale === "en" && city.nameEn ? city.nameEn : city.name;
}

export function provinceName(city: City, locale: Locale): string {
  return locale === "en" && city.provinceEn ? city.provinceEn : city.province;
}
