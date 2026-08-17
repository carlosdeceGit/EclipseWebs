import { cincoContactos, porQueCeuta, queSeVe, sombraEstrecho } from "./ceuta/eclipse";
import { dondeVerCeuta, haciaDondeMirar, levanteYTiempo, planDelDia } from "./ceuta/observacion";
import { conNinos, fotografiar, gafasEnCeuta, movilidad } from "./ceuta/practico";
import { comoLlegar, dondeDormir } from "./ceuta/viaje";
import { dosDias, queComer } from "./ceuta/ciudad";
import type { BlogCategory, BlogPost } from "./types";
import type { Block } from "../articles/types";
import type { Locale } from "@/lib/eclipse/types";

export type { BlogCategory, BlogPost, BlogPostContent } from "./types";

/**
 * Registro del blog.
 *
 * El orden es el editorial: lo que resuelve la duda inmediata primero. Dentro de una
 * misma fecha de publicación, este orden es el que se ve en el índice.
 */
export const BLOG_POSTS: BlogPost[] = [
  porQueCeuta,
  dondeVerCeuta,
  planDelDia,
  cincoContactos,
  queSeVe,
  haciaDondeMirar,
  sombraEstrecho,
  levanteYTiempo,
  gafasEnCeuta,
  conNinos,
  fotografiar,
  comoLlegar,
  dondeDormir,
  movilidad,
  queComer,
  dosDias,
];

export const BLOG_POSTS_BY_SLUG = new Map(BLOG_POSTS.map((p) => [p.slug, p]));

/**
 * Los posts de un dominio.
 *
 * Ésta es la función que hace cumplir la regla de no duplicar contenido entre
 * dominios propios: un post de Ceuta no se sirve en `eclipsecadiz.com`, ni aparece
 * en su índice, ni en su sitemap, ni en su RSS. Cuando se escriban posts de Cádiz,
 * llevarán `citySlug: "cadiz"` y ocurrirá lo simétrico.
 */
export function postsForCity(citySlug: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.citySlug === citySlug).sort(byRecency);
}

/** Más recientes primero; a igualdad de fecha, el orden editorial del registro. */
function byRecency(a: BlogPost, b: BlogPost): number {
  if (a.published === b.published) {
    return BLOG_POSTS.indexOf(a) - BLOG_POSTS.indexOf(b);
  }
  return a.published < b.published ? 1 : -1;
}

/**
 * Posts relacionados.
 *
 * Se respetan los declarados en `related` y, si faltan, se completa con otros de la
 * misma categoría. Así un post nuevo tiene enlaces internos desde el primer día sin
 * tener que revisar el resto del registro.
 */
export function relatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const pool = postsForCity(post.citySlug).filter((p) => p.slug !== post.slug);
  const declared = (post.related ?? [])
    .map((slug) => pool.find((p) => p.slug === slug))
    .filter((p): p is BlogPost => Boolean(p));

  const rest = pool.filter((p) => !declared.includes(p) && p.category === post.category);
  return [...declared, ...rest].slice(0, limit);
}

/** Etiquetas de categoría, para los filtros del índice. */
export const CATEGORY_LABELS: Record<BlogCategory, Record<Locale, string>> = {
  eclipse: { es: "El eclipse", en: "The eclipse" },
  observacion: { es: "Cómo verlo", en: "Watching it" },
  viaje: { es: "Viaje y logística", en: "Travel and logistics" },
  ciudad: { es: "La ciudad", en: "The city" },
};

/** Orden en que se agrupan las categorías en el índice. */
export const CATEGORY_ORDER: BlogCategory[] = ["eclipse", "observacion", "viaje", "ciudad"];

/**
 * Minutos de lectura estimados.
 *
 * Se calcula del contenido real en vez de guardarse a mano, porque un número escrito
 * a mano deja de ser cierto en la primera revisión del texto. 200 palabras por minuto
 * es la referencia habitual para prosa en pantalla.
 */
export function readingMinutes(blocks: Block[], lead: string): number {
  const words = countWords(lead) + blocks.reduce((sum, b) => sum + blockWords(b), 0);
  return Math.max(1, Math.round(words / 200));
}

function blockWords(block: Block): number {
  switch (block.type) {
    case "h2":
    case "h3":
    case "p":
      return countWords(block.text);
    case "ul":
    case "ol":
      return block.items.reduce((s, i) => s + countWords(i), 0);
    case "callout":
      return countWords(block.title) + countWords(block.text);
    case "table":
      return block.rows.flat().reduce((s, c) => s + countWords(c), 0);
    case "faq":
      return block.items.reduce((s, i) => s + countWords(i.q) + countWords(i.a), 0);
    case "figure":
      return countWords(block.caption ?? "");
  }
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}
