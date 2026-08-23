import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AdSection, AdSlot } from "@/components/AdSlot";
import {
  ArticleHeader,
  ArticleLayout,
  ArticleNav,
  ArticleToc,
  sectionsOf,
  type ArticleLink,
} from "@/components/Article";
import { Blocks, renderBlock } from "@/components/Blocks";
import {
  ARTICLES,
  ARTICLES_BY_SLUG,
  articleServesCity,
  editorialArticlesFor,
} from "@/content/articles";
import { breadcrumbGraph, buildMetadata, faqGraph, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity, type Tenant } from "@/lib/tenants";
import type { CityWithCircumstances, Locale } from "@/lib/eclipse/types";
import { getDictionary } from "@/i18n/dictionary";
import { LOCALES, isLocale } from "@/i18n/config";

/**
 * Guías largas. Las rutas explícitas (/horarios, /localizador, /directorio…) tienen
 * prioridad sobre este segmento dinámico, así que aquí solo caen los slugs de
 * `ARTICLES`; cualquier otro devuelve 404.
 */
export function generateStaticParams() {
  return LOCALES.flatMap((locale) => ARTICLES.map((a) => ({ locale, slug: a.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = ARTICLES_BY_SLUG.get(slug);
  if (!article || !isLocale(locale)) return {};

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  if (!articleServesCity(article, city.slug)) return {};
  const content = article.content[locale](city, tenant);

  return buildMetadata({
    tenant,
    city,
    locale,
    path: `/${slug}`,
    title: content.title,
    description: content.description,
  });
}

/**
 * La guía anterior y la siguiente, en el orden editorial del registro.
 *
 * Solo entre guías editoriales: encadenar el aviso legal detrás de la guía de
 * seguridad no es una lectura que nadie quiera seguir. Y solo dentro de las que
 * este dominio sirve, así que en Tarifa la cadena incluye `/levante` y en Cádiz
 * no, sin que haya que mantener una lista aparte.
 */
function neighbours(
  slug: string,
  citySlug: string,
  locale: Locale,
  city: CityWithCircumstances,
  tenant: Tenant,
): { prev?: ArticleLink; next?: ArticleLink } {
  const list = editorialArticlesFor(citySlug);
  const at = list.findIndex((a) => a.slug === slug);
  if (at === -1) return {};

  const link = (i: number): ArticleLink | undefined => {
    const a = list[i];
    if (!a) return undefined;
    const c = a.content[locale](city, tenant);
    return { href: `/${a.slug}`, title: c.shortTitle ?? c.title };
  };

  return { prev: link(at - 1), next: link(at + 1) };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = ARTICLES_BY_SLUG.get(slug);
  if (!article || !isLocale(locale)) notFound();

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  // Las guías exclusivas de una ciudad no existen en el resto de dominios: hablan de
  // una frontera, un ferry o un borde de franja que allí no están. 404, no redirección.
  if (!articleServesCity(article, city.slug)) notFound();

  const t = getDictionary(locale);
  const content = article.content[locale](city, tenant);
  const faqItems = article.faq?.[locale];
  // Las preguntas van al índice como una sección más: para quien busca «¿puedo
  // usar unas gafas del eclipse anterior?» es la única sección que le importa.
  const sections = [
    ...sectionsOf(content.body),
    ...(faqItems ? [{ id: "preguntas", text: t.home.faqTitle }] : []),
  ];
  const { prev, next } = article.legal
    ? {}
    : neighbours(slug, city.slug, locale, city, tenant);

  // El anuncio va tras el primer bloque de nivel 2: el lector ya se ha enganchado
  // pero todavía no ha llegado al grueso del contenido.
  const firstH2 = content.body.findIndex((b) => b.type === "h2");
  const adAfter = firstH2 === -1 ? content.body.length : firstH2;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbGraph(tenant, locale, [
            { name: t.common.home, path: "/" },
            { name: content.title, path: `/${slug}` },
          ]),
        )}
      />
      {faqItems && (
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqGraph(faqItems))} />
      )}

      <ArticleLayout
        header={<ArticleHeader title={content.title} lead={content.description} />}
        toc={<ArticleToc sections={sections} locale={locale} />}
        locale={locale}
      >
        <article className="prose-eclipse mt-10">
          <Blocks blocks={content.body.slice(0, adAfter)} city={city} locale={locale} />
          <AdSlot name="inArticle" locale={locale} className="my-8" />
          <Blocks blocks={content.body.slice(adAfter)} city={city} locale={locale} offset={adAfter} />

          {/* Las preguntas frecuentes de la guía existían solo como datos
              estructurados: se le daban a Google y no se le enseñaban a nadie.
              Además de ser contenido desaprovechado, marcar como FAQPage algo que
              no está visible en la página es justo lo que la documentación de
              Google señala como motivo para dejar de mostrar el resultado. */}
          {faqItems && (
            <>
              <h2 id="preguntas">{t.home.faqTitle}</h2>
              {renderBlock({ type: "faq", items: faqItems }, 9000, city, locale)}
            </>
          )}
        </article>

        <ArticleNav prev={prev} next={next} locale={locale} />
      </ArticleLayout>

      <AdSection name="footer" locale={locale} />
    </>
  );
}
