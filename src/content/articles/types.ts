import type { FaqItem } from "../faq";
import type { CityWithCircumstances, Locale } from "@/lib/eclipse/types";
import type { Tenant } from "@/lib/tenants";

export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; title: string; text: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "faq"; items: FaqItem[] };

export interface ArticleContent {
  title: string;
  description: string;
  body: Block[];
}

export interface Article {
  slug: string;
  /**
   * Las páginas legales tienen ruta y sitemap pero no aparecen en los listados de
   * guías: no son contenido editorial.
   */
  legal?: boolean;
  /**
   * El tenant llega como segundo argumento porque las páginas legales necesitan el
   * dominio para componer el correo de contacto. Las guías editoriales lo ignoran.
   */
  content: Record<Locale, (city: CityWithCircumstances, tenant: Tenant) => ArticleContent>;
  faq?: Record<Locale, FaqItem[]>;
}
