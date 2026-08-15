import { seguridad } from "./seguridad";
import { alojamiento, comoLlegar } from "./viaje";
import { dondeVerlo, clima } from "./observacion";
import { guia, fotografia } from "./guia";
import { eventos, fuentes } from "./eventos";
import { gafas } from "./gafas";
import { avisoLegal, contacto, cookies, privacidad } from "./legal";
import type { Article } from "./types";

export type { Article, ArticleContent, Block } from "./types";

/**
 * Registro de guías.
 *
 * El orden es el de la navegación editorial: primero lo que resuelve la duda
 * inmediata (qué es, dónde, cuándo), luego lo logístico y por último lo accesorio.
 */
export const ARTICLES: Article[] = [
  guia,
  dondeVerlo,
  seguridad,
  gafas,
  alojamiento,
  comoLlegar,
  clima,
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
