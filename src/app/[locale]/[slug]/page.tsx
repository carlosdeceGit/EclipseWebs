import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { Callout, Section } from "@/components/ui";
import { ARTICLES, ARTICLES_BY_SLUG, type Block } from "@/content/articles";
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

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={i} id={block.text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
          {block.text}
        </h2>
      );
    case "h3":
      return <h3 key={i}>{block.text}</h3>;
    case "p":
      return <p key={i}>{block.text}</p>;
    case "ul":
      return (
        <ul key={i}>
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div key={i} className="my-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ color: "hsl(var(--muted))" }}>
                {block.head.map((h) => (
                  <th key={h} className="pb-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  {row.map((cell, c) => (
                    <td key={c} className="py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <div key={i} className="my-6">
          <Callout title={block.title}>{block.text}</Callout>
        </div>
      );
    case "faq":
      return (
        <div key={i} className="my-6 space-y-3">
          {block.items.map((item) => (
            <details
              key={item.q}
              className="rounded-2xl border p-5"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface))" }}
            >
              <summary className="cursor-pointer font-semibold">{item.q}</summary>
              <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      );
  }
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
          {content.body.slice(0, adAfter).map(renderBlock)}
          <div className="my-8">
            <AdSlot name="inArticle" locale={locale} />
          </div>
          {content.body.slice(adAfter).map((b, i) => renderBlock(b, i + adAfter))}
        </div>
      </article>

      <Section>
        <AdSlot name="footer" locale={locale} />
      </Section>
    </>
  );
}
