/**
 * Configuración de publicidad.
 *
 * Dos fuentes de ingresos conviven en las mismas páginas:
 *  1. Red programática (AdSense por defecto; Ezoic o Mediavine cuando el tráfico lo
 *     justifique, ya que pagan bastante mejor a partir de ~50k sesiones/mes).
 *  2. Anuncios propios: negocios del directorio y clasificados destacados, que se
 *     sirven desde nuestra base de datos y no pasan por ninguna red.
 *
 * Los IDs de slot se rellenan desde el panel de AdSense una vez aprobado el dominio.
 */

export type AdSlotName = "header" | "inArticle" | "sidebar" | "footer" | "listing";

export interface AdSlotConfig {
  id: string | null;
  format: "auto" | "fluid" | "rectangle";
  /** Alto reservado para evitar saltos de layout. */
  minHeight: number;
}

export const AD_SLOTS: Record<AdSlotName, AdSlotConfig> = {
  header: { id: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER ?? null, format: "auto", minHeight: 90 },
  inArticle: { id: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE ?? null, format: "fluid", minHeight: 250 },
  sidebar: { id: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? null, format: "auto", minHeight: 600 },
  footer: { id: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER ?? null, format: "auto", minHeight: 90 },
  listing: { id: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LISTING ?? null, format: "fluid", minHeight: 250 },
};

export function adsenseClientId(): string | null {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? null;
}

/**
 * Cierto cuando este hueco tiene de verdad un anuncio que servir.
 *
 * Lo consultan las páginas antes de dibujar el contenedor del anuncio: si el hueco
 * no está activo no se pinta nada, ni marcador ni sección vacía con su relleno.
 */
export function adSlotEnabled(name: AdSlotName): boolean {
  return Boolean(adsenseClientId() && AD_SLOTS[name].id);
}

/** Tarifas de los anuncios propios, en euros. Se muestran en /anunciate. */
export const OWN_AD_PRICING = [
  {
    id: "directorio-basico",
    name: { es: "Ficha básica en el directorio", en: "Basic directory listing" },
    price: 0,
    period: { es: "gratis", en: "free" },
    features: {
      es: [
        "Nombre, categoría, teléfono y web",
        "Aparece en el listado de tu ciudad",
        "Enlace externo con atributo sponsored",
      ],
      en: [
        "Name, category, phone and website",
        "Appears in your city's listing",
        "Outbound link with the sponsored attribute",
      ],
    },
  },
  {
    id: "directorio-destacado",
    name: { es: "Ficha destacada", en: "Featured listing" },
    price: 49,
    period: { es: "hasta el 2 de agosto de 2027", en: "until 2 August 2027" },
    features: {
      es: [
        "Posición fija arriba del listado de tu categoría",
        "Foto de portada y descripción larga",
        "Enlace en la guía de la ciudad",
        "Etiqueta visual de destacado",
      ],
      en: [
        "Pinned to the top of your category listing",
        "Cover photo and long description",
        "A link from the city guide",
        "Visual featured badge",
      ],
    },
  },
  {
    id: "patrocinio-ciudad",
    name: { es: "Patrocinio de ciudad", en: "City sponsorship" },
    price: 390,
    period: { es: "hasta el 2 de agosto de 2027", en: "until 2 August 2027" },
    features: {
      es: [
        "Banner propio en la portada del dominio de tu ciudad",
        "Mención en la guía de alojamiento y en la de eventos",
        "Exclusividad por categoría y ciudad",
      ],
      en: [
        "Your own banner on the home page of your city's domain",
        "A mention in the accommodation and events guides",
        "Category exclusivity within your city",
      ],
    },
  },
] as const;
