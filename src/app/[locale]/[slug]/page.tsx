import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AdSection, AdSlot } from "@/components/AdSlot";
import { Blocks } from "@/components/Blocks";
import { ARTICLES, ARTICLES_BY_SLUG } from "@/content/articles";
import { breadcrumbGraph, buildMetadata, faqGraph, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";
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
  const t = getDictionary(locale);
  const content = article.content[locale](city, tenant);
  const faqItems = article.faq?.[locale];

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

      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-black leading-tight sm:text-4xl">{content.title}</h1>
        <p className="mt-4 text-lg" style={{ color: "hsl(var(--muted))" }}>
          {content.description}
        </p>
        <div className="prose-eclipse mt-8">
          <Blocks blocks={content.body.slice(0, adAfter)} city={city} locale={locale} />
          <AdSlot name="inArticle" locale={locale} className="my-8" />
          <Blocks blocks={content.body.slice(adAfter)} city={city} locale={locale} offset={adAfter} />
        </div>
      </article>

      <AdSection name="footer" locale={locale} />
    </>
  );
}
