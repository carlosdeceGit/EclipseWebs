import type { Locale } from "@/lib/eclipse/types";

/**
 * Taxonomía de navegación.
 *
 * Vive fuera del diccionario porque no es una cadena suelta: es la estructura de
 * la web, y la consumen a la vez el menú de escritorio, el cajón de móvil, la
 * barra inferior y el pie. Tenerla en un solo sitio es lo que garantiza que las
 * tres navegaciones digan lo mismo — que alguien aprenda dos webs distintas
 * según el tamaño de su pantalla es el fallo clásico de este patrón.
 *
 * Los cuatro grupos responden a las cuatro preguntas que trae quien busca un
 * eclipse, en el orden en que se las hace: cuándo pasa, desde dónde lo veo, cómo
 * llego, y qué necesito saber.
 */
export interface NavItem {
  /** Camino interno, sin prefijo de idioma. */
  href: string;
  label: string;
  /** Una línea de qué hay ahí. Se muestra en el menú de escritorio. */
  hint?: string;
  /** Entradas destacadas: las herramientas propias, no las guías. */
  tool?: boolean;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

const ES: NavGroup[] = [
  {
    id: "cuando",
    label: "Cuándo",
    items: [
      { href: "/horarios", label: "Horarios minuto a minuto", hint: "Los cinco contactos y la hora del máximo.", tool: true },
      { href: "/ciudades", label: "Dónde dura más", hint: "Ranking de municipios por duración de la totalidad." },
      { href: "/faq", label: "Preguntas frecuentes", hint: "Lo que todo el mundo pregunta antes del día 2." },
    ],
  },
  {
    id: "donde",
    label: "Dónde",
    items: [
      { href: "/localizador", label: "Tu punto exacto", hint: "Tus horas en tus coordenadas, no las del centro del pueblo.", tool: true },
      { href: "/visor", label: "Visor 360º", hint: "Apunta con la cámara y mira si un edificio te tapa el Sol.", tool: true },
      { href: "/donde-verlo", label: "Dónde verlo", hint: "Miradores, con la pega de cada uno." },
      { href: "/clima", label: "Probabilidad de cielo despejado", hint: "Climatología de agosto y el efecto del levante." },
    ],
  },
  {
    id: "ir",
    label: "Ir",
    items: [
      { href: "/como-llegar", label: "Cómo llegar", hint: "Ferris, aeropuertos y el atasco previsible." },
      { href: "/alojamiento", label: "Alojamiento", hint: "Qué queda libre y qué precios esperar." },
      { href: "/eventos", label: "Eventos y observaciones", hint: "Qué organizan agrupaciones astronómicas y ayuntamientos." },
      { href: "/directorio", label: "Directorio de la ciudad", hint: "Alojamiento, eventos y actividades, con su ficha y su contacto." },
      { href: "/publicar", label: "Publica lo tuyo", hint: "Da de alta tu alojamiento, tu evento o tu actividad. Gratis." },
      { href: "/clasificados", label: "Clasificados", hint: "Anuncios entre particulares." },
    ],
  },
  {
    id: "saber",
    label: "Saber",
    items: [
      { href: "/seguridad", label: "Seguridad ocular", hint: "Cuándo puedes mirar y cuándo no. Empieza por aquí." },
      { href: "/gafas-de-eclipse", label: "Gafas de eclipse", hint: "Qué exige Europa y cómo detectar una falsificación." },
      { href: "/guia", label: "Guía del eclipse", hint: "Qué es, qué vas a ver y en qué orden." },
      { href: "/fotografia", label: "Fotografiar el eclipse", hint: "Filtros, ajustes y las tomas que da tiempo a hacer." },
      { href: "/blog", label: "Blog", hint: "Guías largas de la ciudad, con ilustraciones propias." },
      { href: "/fuentes", label: "Fuentes y metodología", hint: "Cómo calculamos las horas y contra qué las validamos." },
    ],
  },
];

const EN: NavGroup[] = [
  {
    id: "cuando",
    label: "When",
    items: [
      { href: "/horarios", label: "Minute-by-minute timings", hint: "The five contacts and maximum eclipse.", tool: true },
      { href: "/ciudades", label: "Where it lasts longest", hint: "Towns ranked by length of totality." },
      { href: "/faq", label: "FAQ", hint: "What everyone asks before the day." },
    ],
  },
  {
    id: "donde",
    label: "Where",
    items: [
      { href: "/localizador", label: "Your exact spot", hint: "Your timings at your coordinates, not the town centre's.", tool: true },
      { href: "/visor", label: "360º viewer", hint: "Point your camera and see whether a building blocks the Sun.", tool: true },
      { href: "/donde-verlo", label: "Where to watch", hint: "Viewpoints, each with its catch." },
      { href: "/clima", label: "Chance of clear skies", hint: "August climatology and the levante effect." },
    ],
  },
  {
    id: "ir",
    label: "Getting there",
    items: [
      { href: "/como-llegar", label: "Getting there", hint: "Ferries, airports and the traffic to expect." },
      { href: "/alojamiento", label: "Where to stay", hint: "What is left and what prices to expect." },
      { href: "/eventos", label: "Events and public viewings", hint: "Astronomy societies and councils." },
      { href: "/directorio", label: "City directory", hint: "Accommodation, events and activities, each with its contact." },
      { href: "/publicar", label: "List yours", hint: "Add your accommodation, event or activity. Free." },
      { href: "/clasificados", label: "Classifieds", hint: "Ads between individuals." },
    ],
  },
  {
    id: "saber",
    label: "Know",
    items: [
      { href: "/seguridad", label: "Eye safety", hint: "When you can look and when you cannot. Start here." },
      { href: "/gafas-de-eclipse", label: "Eclipse glasses", hint: "What the EU requires and how to spot a fake." },
      { href: "/guia", label: "Eclipse guide", hint: "What it is, what you will see and in what order." },
      { href: "/fotografia", label: "Photographing it", hint: "Filters, settings and the shots you have time for." },
      { href: "/blog", label: "Blog", hint: "Long city guides with our own illustrations." },
      { href: "/fuentes", label: "Sources and method", hint: "How we compute the timings and what we validate against." },
    ],
  },
];

const GROUPS: Record<Locale, NavGroup[]> = { es: ES, en: EN };

export function navGroups(locale: Locale): NavGroup[] {
  return GROUPS[locale];
}

/**
 * Los cuatro destinos de la barra inferior de móvil.
 *
 * Son cuatro y no seis a propósito: por debajo de unos 44 px de ancho por
 * destino el pulgar deja de acertar. Tres son las respuestas más buscadas y el
 * cuarto abre el resto, que es donde vive la cola larga editorial.
 */
export interface MobileDestination {
  href: string;
  label: string;
  icon: "clock" | "pin" | "camera" | "menu" | "book" | "pen" | "tag";
}

export const MOBILE_NAV: Record<Locale, MobileDestination[]> = {
  es: [
    { href: "/horarios", label: "Horarios", icon: "clock" },
    { href: "/visor", label: "Visor 360º", icon: "camera" },
    { href: "/guia", label: "Guía", icon: "book" },
    { href: "/blog", label: "Blog", icon: "pen" },
  ],
  en: [
    { href: "/horarios", label: "Timings", icon: "clock" },
    { href: "/visor", label: "360º viewer", icon: "camera" },
    { href: "/guia", label: "Guide", icon: "book" },
    { href: "/blog", label: "Blog", icon: "pen" },
  ],
};

/**
 * Los cuatro apartados fijos del header, iguales en las dos pantallas.
 *
 * Son los mismos que la barra inferior de móvil a propósito: el usuario aprende
 * una sola web. Lo demás vive en el panel completo, que abren tanto el botón del
 * header como el de la barra.
 */
export const HEADER_NAV = MOBILE_NAV;

/**
 * Grupo al que pertenece un camino, para marcar el activo en la navegación.
 *
 * Compara por prefijo porque las rutas con hijos —`/blog/algo`,
 * `/ciudades/tarifa`— deben iluminar la misma entrada que su padre.
 */
export function activeGroupId(locale: Locale, path: string): string | null {
  for (const group of navGroups(locale)) {
    for (const item of group.items) {
      if (path === item.href || path.startsWith(`${item.href}/`)) return group.id;
    }
  }
  return null;
}

export function isActivePath(path: string, href: string): boolean {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}
