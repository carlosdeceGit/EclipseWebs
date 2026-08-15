import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { Callout, Section } from "@/components/ui";
import { ARTICLES, ARTICLES_BY_SLUG, type Block } from "@/content/articles";
import { breadcrumbGraph, buildMetadata, faqGraph, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";

/**
 * Guías largas. Las rutas explícitas del proyecto (/horarios, /directorio…) tienen
 * prioridad sobre este segmento dinámico, así que aquí solo caen los slugs de
 * `ARTICLES`; cualquier otro devuelve 404.
 */
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES_BY_SLUG.get(slug);
  if (!article) return {};

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  return buildMetadata({
    tenant,
    city,
    path: `/${slug}`,
    title: article.title(city),
    description: article.description(city),
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
    case "callout":
      return (
        <div key={i} className="my-6">
          <Callout title={block.title}>{block.text}</Callout>
        </div>
      );
    case "faq":
      return (
        <div key={i} className="my-6 space-y-3 not-prose">
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

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES_BY_SLUG.get(slug);
  if (!article) notFound();

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const blocks = article.body(city);
  const faqItems = article.faq?.(city);

  // El anuncio va tras el primer bloque de nivel 2, que es donde el lector ya se ha
  // enganchado pero todavía no ha llegado al grueso del contenido.
  const firstH2 = blocks.findIndex((b) => b.type === "h2");
  const adAfter = firstH2 === -1 ? blocks.length : firstH2;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbGraph(tenant, [
            { name: "Inicio", path: "/" },
            { name: article.title(city), path: `/${slug}` },
          ]),
        )}
      />
      {faqItems && (
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqGraph(faqItems))} />
      )}

      <article className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-black leading-tight sm:text-4xl">{article.title(city)}</h1>
        <p className="mt-4 text-lg" style={{ color: "hsl(var(--muted))" }}>
          {article.description(city)}
        </p>
        <div className="prose-eclipse mt-8">
          {blocks.slice(0, adAfter).map(renderBlock)}
          <div className="my-8">
            <AdSlot name="inArticle" />
          </div>
          {blocks.slice(adAfter).map((b, i) => renderBlock(b, i + adAfter))}
        </div>
      </article>

      <Section>
        <AdSlot name="footer" />
      </Section>
    </>
  );
}
