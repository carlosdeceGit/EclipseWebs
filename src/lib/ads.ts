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

/** Tarifas de los anuncios propios, en euros. Se muestran en /anunciate. */
export const OWN_AD_PRICING = [
  {
    id: "directorio-basico",
    name: "Ficha básica en el directorio",
    price: 0,
    period: "gratis",
    features: [
      "Nombre, categoría, teléfono y web",
      "Aparece en el listado de tu ciudad",
      "Enlace externo con atributo sponsored",
    ],
  },
  {
    id: "directorio-destacado",
    name: "Ficha destacada",
    price: 49,
    period: "hasta el 2 de agosto de 2027",
    features: [
      "Posición fija arriba del listado de tu categoría",
      "Foto de portada y descripción larga",
      "Enlace en la guía de la ciudad",
      "Etiqueta visual de destacado",
    ],
  },
  {
    id: "patrocinio-ciudad",
    name: "Patrocinio de ciudad",
    price: 390,
    period: "hasta el 2 de agosto de 2027",
    features: [
      "Banner propio en la portada del dominio de tu ciudad",
      "Mención en la guía de alojamiento y en la de eventos",
      "Exclusividad por categoría y ciudad",
    ],
  },
] as const;
