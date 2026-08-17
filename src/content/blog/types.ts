import type { FaqItem } from "../faq";
import type { Block } from "../articles/types";
import type { ArtName } from "@/components/art";
import type { CityWithCircumstances, Locale } from "@/lib/eclipse/types";
import type { Tenant } from "@/lib/tenants";

/**
 * Modelo del blog.
 *
 * Dos decisiones que conviene entender antes de añadir posts.
 *
 * **1. Cada post pertenece a una ciudad (`citySlug`) y solo se publica en el dominio
 * de esa ciudad.** No es una preferencia editorial, es la regla del proyecto: servir
 * el mismo artículo sobre Ceuta en `ceutaeclipse.es` y en `eclipsecadiz.com` es
 * contenido duplicado entre dominios propios, y la forma más rápida de que Google se
 * quede con uno e ignore el resto. La ruta del post devuelve 404 si el tenant no es
 * el de su ciudad, así que la regla se cumple sola.
 *
 * **2. El cuerpo es una función de la ciudad.** Igual que en las guías: los horarios,
 * la duración y la altura del Sol se interpolan del cálculo besseliano en vez de
 * escribirse a mano. Si mañana se afina el cálculo, los posts se afinan con él y no
 * queda ninguna cifra huérfana contradiciendo a las tablas.
 */

export type BlogCategory = "eclipse" | "observacion" | "viaje" | "ciudad";

export interface BlogPostContent {
  title: string;
  /** Meta description y subtítulo. Dato duro por delante. */
  description: string;
  /**
   * Primer párrafo, en grande.
   *
   * Es la frase que copian los motores generativos, así que responde a la pregunta
   * del título sin rodeos y se sostiene fuera de contexto.
   */
  lead: string;
  body: Block[];
  /** FAQ propia del post. Alimenta el JSON-LD `FAQPage`. */
  faq?: FaqItem[];
}

export interface BlogPost {
  /** Slug único, el mismo en los dos idiomas para que el hreflang sea trivial. */
  slug: string;
  citySlug: string;
  category: BlogCategory;
  /** Fecha de publicación en ISO (YYYY-MM-DD). Alimenta `datePublished` y el RSS. */
  published: string;
  /** Solo si se ha revisado de verdad. Fingir revisiones no engaña a nadie dos veces. */
  updated?: string;
  /** Ilustración de portada, del registro de `components/art`. */
  cover: ArtName;
  /**
   * Fotografía de portada, cuando haya.
   *
   * Hoy no hay ninguna: no publicamos fotos de las que no tengamos los derechos. El
   * campo existe para que el día que haya fotos propias de Ceuta entren sin tocar
   * plantillas, y el diseño ya trata la ilustración como el caso normal.
   */
  photo?: { src: string; alt: Record<Locale, string>; credit: string };
  /** Slugs de otros posts que amplían este. Se muestran al final. */
  related?: string[];
  content: Record<Locale, (city: CityWithCircumstances, tenant: Tenant) => BlogPostContent>;
}
