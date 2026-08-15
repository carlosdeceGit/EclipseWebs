import type { Locale } from "@/lib/eclipse/types";

/**
 * Cadenas de interfaz.
 *
 * Solo lo que no es contenido editorial: navegación, etiquetas de tablas, botones
 * y avisos cortos. Las guías largas y las FAQ viven en `src/content`, donde cada
 * idioma tiene su propio texto escrito, no traducido palabra por palabra.
 */
export interface Dictionary {
  nav: { href: string; label: string }[];
  common: {
    home: string;
    advertise: string;
    skipToContent: string;
    seeAll: string;
    youAreHere: string;
    pending: string;
    localTime: string;
    source: string;
    sources: string;
    otherCities: string;
    legal: string;
    sections: string;
    free: string;
    publish: string;
    viewAllLocalities: string;
    switchLanguage: string;
  };
  home: {
    badge: string;
    h1: (city: string) => string;
    ctaTimes: string;
    ctaWhere: string;
    dataTitle: (city: string) => string;
    rankingTitle: string;
    rankingLead: string;
    planTitle: string;
    faqTitle: string;
  };
  data: {
    date: string;
    totality: string;
    duration: string;
    partialStart: string;
    totalityStart: string;
    maximum: string;
    totalityEnd: string;
    partialEnd: string;
    sunAltitude: string;
    sunAzimuth: string;
    magnitude: string;
    obscuration: string;
    coordinates: string;
    population: string;
    province: string;
    timeZone: string;
    yesInPath: string;
    noPartialOnly: string;
    locality: string;
    dateValue: string;
  };
  countdown: { days: string; hours: string; minutes: string; seconds: string; label: string };
  safety: { title: string; body: string; link: string };
  footer: { tagline: string; warning: string };
  /**
   * Cadenas del localizador.
   *
   * Aquí no puede haber funciones: este bloque viaja entero a un Client Component y
   * las funciones no cruzan la frontera servidor/cliente. Las que necesitan un valor
   * usan un marcador `{...}` que el componente sustituye.
   */
  locator: {
    title: string;
    lead: string;
    useMyLocation: string;
    locating: string;
    latitude: string;
    longitude: string;
    calculate: string;
    orPickCity: string;
    /** Contiene `{duration}`. */
    resultTotal: string;
    /** Contiene `{percent}`. */
    resultPartial: string;
    /** Contiene `{km}`. */
    moveAdvice: string;
    onCenterline: string;
    errorGeolocation: string;
    errorRange: string;
    whereToLook: string;
    aboveHorizon: string;
  };
  ads: { placeholder: string };
}

const es: Dictionary = {
  nav: [
    { href: "/", label: "Inicio" },
    { href: "/horarios", label: "Horarios" },
    { href: "/localizador", label: "Localizador" },
    { href: "/donde-verlo", label: "Dónde verlo" },
    { href: "/alojamiento", label: "Alojamiento" },
    { href: "/eventos", label: "Eventos" },
    { href: "/directorio", label: "Directorio" },
    { href: "/clasificados", label: "Clasificados" },
    { href: "/guia", label: "Guía" },
    { href: "/faq", label: "Preguntas" },
  ],
  common: {
    home: "Inicio",
    advertise: "Anúnciate",
    skipToContent: "Saltar al contenido",
    seeAll: "Ver todo",
    youAreHere: "estás aquí",
    pending: "sin datos",
    localTime: "hora local",
    source: "Fuente",
    sources: "Fuentes y metodología",
    otherCities: "Otras ciudades",
    legal: "Legal",
    sections: "Secciones",
    free: "Gratis",
    publish: "Publicar anuncio",
    viewAllLocalities: "Ver todas las localidades",
    switchLanguage: "English",
  },
  home: {
    badge: "2 de agosto de 2027 · lunes",
    h1: (city) => `Eclipse solar total en ${city}`,
    ctaTimes: "Ver horarios exactos",
    ctaWhere: "Calcular mi punto exacto",
    dataTitle: (city) => `El eclipse en ${city}, dato a dato`,
    rankingTitle: "Dónde dura más el eclipse",
    rankingLead:
      "La duración de la totalidad cambia mucho en pocos kilómetros: cuanto más cerca del centro de la franja, más tiempo de oscuridad.",
    planTitle: "Planifica tu eclipse",
    faqTitle: "Preguntas frecuentes",
  },
  data: {
    date: "Fecha",
    totality: "¿Totalidad?",
    duration: "Duración de la totalidad",
    partialStart: "C1 · Empieza el eclipse parcial",
    totalityStart: "C2 · Empieza la totalidad",
    maximum: "Máximo del eclipse",
    totalityEnd: "C3 · Termina la totalidad",
    partialEnd: "C4 · Termina el eclipse parcial",
    sunAltitude: "Altura del Sol",
    sunAzimuth: "Azimut del Sol",
    magnitude: "Magnitud",
    obscuration: "Disco solar cubierto",
    coordinates: "Coordenadas",
    population: "Población",
    province: "Provincia",
    timeZone: "Zona horaria",
    yesInPath: "Sí, dentro de la franja",
    noPartialOnly: "No, solo eclipse parcial",
    locality: "Localidad",
    dateValue: "lunes 2 de agosto de 2027",
  },
  countdown: { days: "días", hours: "horas", minutes: "min", seconds: "seg", label: "Cuenta atrás para el eclipse" },
  safety: {
    title: "Lo que no debes hacer",
    body: "Mirar al Sol sin gafas de eclipse certificadas ISO 12312-2 en ningún momento de la fase parcial. Las gafas de sol normales, los negativos y los cristales ahumados no sirven.",
    link: "Guía de seguridad",
  },
  footer: {
    tagline:
      "Guía independiente del eclipse solar total del 2 de agosto de 2027. Las circunstancias locales se calculan con elementos besselianos de la NASA.",
    warning:
      "Nunca mires al Sol sin filtro solar certificado ISO 12312-2, salvo durante la fase de totalidad.",
  },
  locator: {
    title: "Localizador: tu eclipse, en tu punto exacto",
    lead: "La duración cambia kilómetro a kilómetro. Dinos dónde vas a estar y calculamos tus horas exactas, cuánto durará tu totalidad y si te compensa moverte.",
    useMyLocation: "Usar mi ubicación",
    locating: "Localizando…",
    latitude: "Latitud",
    longitude: "Longitud",
    calculate: "Calcular",
    orPickCity: "O elige una localidad",
    resultTotal: "Verás la totalidad durante {duration}",
    resultPartial: "Desde aquí NO hay totalidad: el Sol se cubrirá como mucho al {percent}",
    moveAdvice: "Estás a unos {km} km del centro de la franja.",
    onCenterline: "Estás prácticamente en el centro de la franja. No te muevas.",
    errorGeolocation: "No hemos podido obtener tu ubicación. Introduce las coordenadas a mano.",
    errorRange: "Esas coordenadas no parecen válidas.",
    whereToLook: "Dónde mirar",
    aboveHorizon: "sobre el horizonte",
  },
  ads: { placeholder: "Espacio publicitario" },
};

const en: Dictionary = {
  nav: [
    { href: "/", label: "Home" },
    { href: "/horarios", label: "Timings" },
    { href: "/localizador", label: "Locator" },
    { href: "/donde-verlo", label: "Where to watch" },
    { href: "/alojamiento", label: "Where to stay" },
    { href: "/eventos", label: "Events" },
    { href: "/directorio", label: "Directory" },
    { href: "/clasificados", label: "Classifieds" },
    { href: "/guia", label: "Guide" },
    { href: "/faq", label: "FAQ" },
  ],
  common: {
    home: "Home",
    advertise: "Advertise",
    skipToContent: "Skip to content",
    seeAll: "See all",
    youAreHere: "you are here",
    pending: "no data",
    localTime: "local time",
    source: "Source",
    sources: "Sources and method",
    otherCities: "Other cities",
    legal: "Legal",
    sections: "Sections",
    free: "Free",
    publish: "Post an ad",
    viewAllLocalities: "See all locations",
    switchLanguage: "Español",
  },
  home: {
    badge: "2 August 2027 · Monday",
    h1: (city) => `Total solar eclipse in ${city}`,
    ctaTimes: "See exact timings",
    ctaWhere: "Calculate my exact spot",
    dataTitle: (city) => `The eclipse in ${city}, fact by fact`,
    rankingTitle: "Where totality lasts longest",
    rankingLead:
      "Totality changes a lot over just a few kilometres: the closer to the centre of the path, the longer the darkness.",
    planTitle: "Plan your eclipse",
    faqTitle: "Frequently asked questions",
  },
  data: {
    date: "Date",
    totality: "Totality?",
    duration: "Length of totality",
    partialStart: "C1 · Partial eclipse begins",
    totalityStart: "C2 · Totality begins",
    maximum: "Maximum eclipse",
    totalityEnd: "C3 · Totality ends",
    partialEnd: "C4 · Partial eclipse ends",
    sunAltitude: "Sun altitude",
    sunAzimuth: "Sun azimuth",
    magnitude: "Magnitude",
    obscuration: "Solar disc covered",
    coordinates: "Coordinates",
    population: "Population",
    province: "Province",
    timeZone: "Time zone",
    yesInPath: "Yes, inside the path",
    noPartialOnly: "No, partial eclipse only",
    locality: "Location",
    dateValue: "Monday 2 August 2027",
  },
  countdown: { days: "days", hours: "hours", minutes: "min", seconds: "sec", label: "Countdown to the eclipse" },
  safety: {
    title: "What you must not do",
    body: "Look at the Sun without ISO 12312-2 certified eclipse glasses at any point during the partial phase. Ordinary sunglasses, camera negatives and smoked glass do not work.",
    link: "Eye safety guide",
  },
  footer: {
    tagline:
      "An independent guide to the total solar eclipse of 2 August 2027. Local circumstances are computed from NASA Besselian elements.",
    warning:
      "Never look at the Sun without an ISO 12312-2 certified solar filter, except during totality itself.",
  },
  locator: {
    title: "Locator: your eclipse, at your exact spot",
    lead: "Totality changes kilometre by kilometre. Tell us where you will be and we compute your exact timings, how long your totality lasts and whether it is worth moving.",
    useMyLocation: "Use my location",
    locating: "Locating…",
    latitude: "Latitude",
    longitude: "Longitude",
    calculate: "Calculate",
    orPickCity: "Or pick a location",
    resultTotal: "You will see totality for {duration}",
    resultPartial: "No totality here: at most {percent} of the Sun will be covered",
    moveAdvice: "You are about {km} km from the centre of the path.",
    onCenterline: "You are practically on the centreline. Do not move.",
    errorGeolocation: "We could not get your location. Enter the coordinates manually.",
    errorRange: "Those coordinates do not look valid.",
    whereToLook: "Where to look",
    aboveHorizon: "above the horizon",
  },
  ads: { placeholder: "Advertisement" },
};

const DICTIONARIES: Record<Locale, Dictionary> = { es, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
