import { seguridad } from "./seguridad";
import { alojamiento, comoLlegar } from "./viaje";
import { dondeVerlo, clima } from "./observacion";
import { guia, fotografia } from "./guia";
import { eventos, fuentes } from "./eventos";
import { gafas } from "./gafas";
import { LOCAL_ARTICLES } from "./locales";
import { avisoLegal, contacto, cookies, privacidad } from "./legal";
import type { Article } from "./types";

export type { Article, ArticleContent, Block } from "./types";

/**
 * Registro de guías.
 *
 * El orden es el de la navegación editorial: primero lo que resuelve la duda
 * inmediata (qué es, dónde, cuándo), luego lo logístico y por último lo accesorio.
 *
 * Las guías de `locales.ts` llevan `cities` y solo existen en su dominio: son las
 * que impiden que las webs de la red sean la misma guía con el topónimo cambiado.
 */
export const ARTICLES: Article[] = [
  guia,
  dondeVerlo,
  seguridad,
  gafas,
  alojamiento,
  comoLlegar,
  clima,
  ...LOCAL_ARTICLES,
  eventos,
  fotografia,
  fuentes,
  avisoLegal,
  privacidad,
  cookies,
  contacto,
];

export const ARTICLES_BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, a]));

/** Solo las guías editoriales, sin las legales. */
export const EDITORIAL_ARTICLES = ARTICLES.filter((a) => !a.legal);

/** Cierto si el artículo debe servirse en la ciudad de este tenant. */
export function articleServesCity(article: Article, citySlug: string): boolean {
  return !article.cities || article.cities.includes(citySlug);
}

/**
 * Las guías que existen en un dominio concreto.
 *
 * Es la fuente de verdad para el sitemap, el `llms.txt` y el 404 de la ruta: si un
 * artículo no está aquí, ese dominio no lo tiene y no debe anunciarlo en ningún
 * sitio. Un sitemap que declara URLs que devuelven 404 es una señal de calidad
 * negativa, no un descuido inocuo.
 */
export function articlesFor(citySlug: string): Article[] {
  return ARTICLES.filter((a) => articleServesCity(a, citySlug));
}

/** Igual que `articlesFor`, sin las páginas legales. */
export function editorialArticlesFor(citySlug: string): Article[] {
  return articlesFor(citySlug).filter((a) => !a.legal);
}
