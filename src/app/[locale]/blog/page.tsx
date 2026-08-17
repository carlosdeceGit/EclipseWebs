import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSection } from "@/components/AdSlot";
import { inline } from "@/components/Blocks";
import { Figure } from "@/components/art";
import { Badge, Card, Section } from "@/components/ui";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type BlogPost,
  postsForCity,
  readingMinutes,
} from "@/content/blog";
import { blogGraph, breadcrumbGraph, buildMetadata, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity, type Tenant } from "@/lib/tenants";
import type { CityWithCircumstances, Locale } from "@/lib/eclipse/types";
import { getDictionary } from "@/i18n/dictionary";
import { INTL_LOCALE, LOCALES, isLocale, localePath } from "@/i18n/config";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const name = locale === "en" ? (city.nameEn ?? city.name) : city.name;
  const t = getDictionary(locale);
  const posts = postsForCity(tenant.citySlug);

  return {
    ...buildMetadata({
      tenant,
      city,
      locale,
      path: "/blog",
      title: t.blog.title.replace("{city}", name),
      description: t.blog.lead.replace("{city}", name),
    }),
    // Un índice vacío es una página fina: mejor no ofrecerla al índice hasta que
    // haya contenido de esta ciudad. La navegación sigue funcionando.
    ...(posts.length === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`));
}

/** Tarjeta de post. La ilustración es el gancho, así que va arriba y completa. */
function PostCard({
  post,
  city,
  tenant,
  locale,
  featured = false,
}: {
  post: BlogPost;
  city: CityWithCircumstances;
  tenant: Tenant;
  locale: Locale;
  featured?: boolean;
}) {
  const content = post.content[locale](city, tenant);
  const t = getDictionary(locale);
  const minutes = readingMinutes(content.body, content.lead);

  return (
    <Link href={localePath(locale, `/blog/${post.slug}`)} className="block">
      <Card className={`h-full transition hover:brightness-125 ${featured ? "lg:flex lg:gap-8" : ""}`}>
        <div className={featured ? "lg:w-1/2" : ""}>
          <Figure art={post.cover} city={city} locale={locale} />
        </div>
        <div className={featured ? "mt-5 lg:mt-0 lg:flex lg:w-1/2 lg:flex-col lg:justify-center" : "mt-4"}>
          <div className="flex items-center gap-3">
            <Badge>{CATEGORY_LABELS[post.category][locale]}</Badge>
            <span className="text-xs" style={{ color: "hsl(var(--muted))" }}>
              {minutes} {t.blog.readingTime}
            </span>
          </div>
          <h3 className={`mt-3 font-bold leading-snug ${featured ? "text-2xl sm:text-3xl" : "text-lg"}`}>
            {content.title}
          </h3>
          <p className={`mt-2 ${featured ? "" : "text-sm"}`} style={{ color: "hsl(var(--muted))" }}>
            {featured ? inline(content.lead) : content.description}
          </p>
          <p className="mt-3 text-xs" style={{ color: "hsl(var(--muted))" }}>
            {formatDate(post.updated ?? post.published, locale)}
          </p>
        </div>
      </Card>
    </Link>
  );
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const name = locale === "en" ? (city.nameEn ?? city.name) : city.name;
  const t = getDictionary(locale);
  const posts = postsForCity(tenant.citySlug);

  if (posts.length === 0) {
    return (
      <Section title={t.blog.empty} lead={t.blog.emptyLead.replace("{city}", name)}>
        <div className="flex flex-wrap gap-3">
          <Link
            href={localePath(locale, "/horarios")}
            className="rounded-xl px-5 py-3 font-semibold"
            style={{ background: "hsl(var(--accent))", color: "hsl(224 44% 8%)" }}
          >
            {t.home.ctaTimes}
          </Link>
          <Link
            href={localePath(locale, "/localizador")}
            className="rounded-xl border px-5 py-3 font-semibold"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            {t.home.ctaWhere}
          </Link>
        </div>
      </Section>
    );
  }

  const [featured, ...rest] = posts;
  const summaries = posts.map((p) => {
    const c = p.content[locale](city, tenant);
    return { slug: p.slug, title: c.title, description: c.description, published: p.published };
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(blogGraph(tenant, locale, summaries))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbGraph(tenant, locale, [
            { name: t.common.home, path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        )}
      />

      <section className="mx-auto max-w-6xl px-4 pb-2 pt-12">
        <h1 className="text-3xl font-black leading-tight sm:text-4xl">
          {t.blog.title.replace("{city}", name)}
        </h1>
        <p className="mt-4 max-w-3xl text-lg" style={{ color: "hsl(var(--muted))" }}>
          {t.blog.lead.replace("{city}", name)}
        </p>
        <p className="mt-4 flex flex-wrap items-center gap-4 text-sm" style={{ color: "hsl(var(--muted))" }}>
          <span>{t.blog.postCount.replace("{count}", String(posts.length))}</span>
          <a href="/blog/rss.xml" className="underline" style={{ color: "hsl(var(--accent))" }}>
            {t.blog.feed}
          </a>
        </p>
      </section>

      <Section title={t.blog.latest}>
        <PostCard post={featured} city={city} tenant={tenant} locale={locale} featured />
      </Section>

      <AdSection name="header" locale={locale} />

      {CATEGORY_ORDER.map((category) => {
        const inCategory = rest.filter((p) => p.category === category);
        if (inCategory.length === 0) return null;
        return (
          <Section key={category} title={CATEGORY_LABELS[category][locale]}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {inCategory.map((post) => (
                <PostCard key={post.slug} post={post} city={city} tenant={tenant} locale={locale} />
              ))}
            </div>
          </Section>
        );
      })}

      <Section>
        <p className="text-sm" style={{ color: "hsl(var(--muted))" }}>
          {t.blog.illustrationNote}{" "}
          <Link href={localePath(locale, "/fuentes")} className="underline">
            {t.common.sources}
          </Link>
        </p>
      </Section>

      <AdSection name="footer" locale={locale} />
    </>
  );
}
