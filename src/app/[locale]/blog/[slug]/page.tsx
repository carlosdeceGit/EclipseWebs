import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSection, AdSlot } from "@/components/AdSlot";
import {
  ArticleHeader,
  ArticleLayout,
  ArticleNav,
  ArticleToc,
  sectionsOf,
  type ArticleLink,
} from "@/components/Article";
import { Blocks, inline, renderBlock } from "@/components/Blocks";
import { Figure } from "@/components/art";
import { Badge, Card, Section } from "@/components/ui";
import {
  BLOG_POSTS,
  BLOG_POSTS_BY_SLUG,
  CATEGORY_LABELS,
  postsForCity,
  readingMinutes,
  relatedPosts,
} from "@/content/blog";
import { blogPostingGraph, breadcrumbGraph, buildMetadata, faqGraph, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";
import type { Locale } from "@/lib/eclipse/types";
import { getDictionary } from "@/i18n/dictionary";
import { INTL_LOCALE, LOCALES, isLocale, localePath } from "@/i18n/config";

/**
 * Post del blog.
 *
 * La comprobación que importa está en el cuerpo: si el post no pertenece a la ciudad
 * del dominio que sirve la petición, devuelve 404. Eso es lo que impide que un
 * artículo sobre Ceuta se publique también en `eclipsecadiz.com` y que dos dominios
 * propios compitan por la misma consulta.
 */
export function generateStaticParams() {
  return LOCALES.flatMap((locale) => BLOG_POSTS.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = BLOG_POSTS_BY_SLUG.get(slug);
  if (!post || !isLocale(locale)) return {};

  const tenant = await currentTenant();
  if (post.citySlug !== tenant.citySlug) return {};

  const city = tenantCity(tenant);
  const content = post.content[locale](city, tenant);

  return buildMetadata({
    tenant,
    city,
    locale,
    path: `/blog/${slug}`,
    title: content.title,
    description: content.description,
    ogTitle: content.title,
    published: post.published,
    modified: post.updated,
  });
}

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = BLOG_POSTS_BY_SLUG.get(slug);
  if (!post || !isLocale(locale)) notFound();

  const tenant = await currentTenant();
  // Un post pertenece a una ciudad. Servirlo desde otro dominio de la red sería
  // contenido duplicado entre dominios propios, que es la regla que no se rompe.
  if (post.citySlug !== tenant.citySlug) notFound();

  const city = tenantCity(tenant);
  const t = getDictionary(locale);
  const content = post.content[locale](city, tenant);
  const minutes = readingMinutes(content.body, content.lead);
  const related = relatedPosts(post);
  const sections = [
    ...sectionsOf(content.body),
    ...(content.faq ? [{ id: "preguntas", text: t.home.faqTitle }] : []),
  ];

  // Anterior y siguiente en el orden editorial del blog de esta ciudad, que es el
  // orden en el que se escribieron para leerse. «Relacionados» responde a otra
  // pregunta —qué más hay sobre esto— y por eso siguen estando los dos.
  const ordered = postsForCity(tenant.citySlug);
  const at = ordered.findIndex((p) => p.slug === slug);
  const link = (i: number): ArticleLink | undefined => {
    const other = ordered[i];
    if (!other) return undefined;
    return {
      href: `/blog/${other.slug}`,
      title: other.content[locale](city, tenant).title,
    };
  };

  // El anuncio va tras el primer bloque de nivel 2: el lector ya se ha enganchado
  // pero todavía no ha llegado al grueso del artículo.
  const firstH2 = content.body.findIndex((b) => b.type === "h2");
  const adAfter = firstH2 === -1 ? content.body.length : firstH2;

  // La portada solo se dibuja arriba si el cuerpo no la usa ya como figura. Sin esta
  // comprobación, un post cuya primera ilustración es su propia portada la mostraría
  // dos veces seguidas, que es el fallo que introduce cualquiera que añada un post
  // reutilizando su portada dentro del texto.
  const coverInBody = content.body.some((b) => b.type === "figure" && b.art === post.cover);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          blogPostingGraph({
            tenant,
            city,
            locale,
            slug,
            title: content.title,
            description: content.description,
            published: post.published,
            updated: post.updated,
          }),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbGraph(tenant, locale, [
            { name: t.common.home, path: "/" },
            { name: "Blog", path: "/blog" },
            { name: content.title, path: `/blog/${slug}` },
          ]),
        )}
      />
      {content.faq && (
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqGraph(content.faq))} />
      )}

      <ArticleLayout
        header={
          <ArticleHeader
            meta={
              <>
                <Link href={localePath(locale, "/blog")} className="hover:underline">
                  ← {t.blog.backToIndex}
                </Link>
                <Badge>{CATEGORY_LABELS[post.category][locale]}</Badge>
                <span>
                  {minutes} {t.blog.readingTime}
                </span>
              </>
            }
            title={content.title}
            lead={inline(content.lead)}
            after={
              <p className="mt-4 text-sm" style={{ color: "hsl(var(--faint))" }}>
                {post.updated
                  ? `${t.blog.updated} ${formatDate(post.updated, locale)}`
                  : `${t.blog.published} ${formatDate(post.published, locale)}`}
              </p>
            }
          />
        }
        toc={<ArticleToc sections={sections} locale={locale} />}
        locale={locale}
      >
        {/* Portada. Va después del titular y no antes: el titular es lo que el lector
            ha venido a confirmar, y en móvil una imagen a sangre lo empujaría fuera
            de la primera pantalla. */}
        {!coverInBody && <Figure art={post.cover} city={city} locale={locale} className="mt-8" />}

        <article className="prose-eclipse mt-8">
          <Blocks blocks={content.body.slice(0, adAfter)} city={city} locale={locale} />
          <AdSlot name="inArticle" locale={locale} className="my-8" />
          <Blocks blocks={content.body.slice(adAfter)} city={city} locale={locale} offset={adAfter} />

          {content.faq && (
            <>
              <h2 id="preguntas">{t.home.faqTitle}</h2>
              {renderBlock({ type: "faq", items: content.faq }, 9000, city, locale)}
            </>
          )}
        </article>

        <p className="mt-10 text-sm" style={{ color: "hsl(var(--faint))" }}>
          {t.blog.illustrationNote}{" "}
          <Link href={localePath(locale, "/fuentes")} className="underline">
            {t.common.sources}
          </Link>
        </p>

        <ArticleNav prev={link(at - 1)} next={link(at + 1)} locale={locale} />
      </ArticleLayout>

      {related.length > 0 && (
        <Section title={t.blog.related}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((other) => {
              const otherContent = other.content[locale](city, tenant);
              return (
                <Link key={other.slug} href={localePath(locale, `/blog/${other.slug}`)} className="block">
                  <Card interactive className="h-full">
                    <Badge tone="muted">{CATEGORY_LABELS[other.category][locale]}</Badge>
                    <h3 className="mt-3 font-semibold leading-snug">{otherContent.title}</h3>
                    <p className="mt-1.5 text-sm" style={{ color: "hsl(var(--muted))" }}>
                      {otherContent.description}
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Section>
      )}

      <AdSection name="footer" locale={locale} />
    </>
  );
}
