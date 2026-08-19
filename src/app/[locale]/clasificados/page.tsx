import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSection } from "@/components/AdSlot";
import { ListingCard } from "@/components/ListingCard";
import { Callout, Card, PageHeader, Section } from "@/components/ui";
import { CLASSIFIED_CATEGORIES, getListings } from "@/lib/db/listings";
import { buildMetadata } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";
import { cityName } from "@/lib/eclipse/cities";
import { isLocale, localePath } from "@/i18n/config";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const name = cityName(city, locale);

  return buildMetadata({
    tenant,
    city,
    locale,
    path: "/clasificados",
    title: locale === "es" ? `Clasificados del eclipse en ${name}` : `Eclipse classifieds in ${name}`,
    description:
      locale === "es"
        ? `Tablón de anuncios entre particulares para el eclipse del 2 de agosto de 2027 en ${name}: alojamiento, coche compartido, material de observación y servicios.`
        : `Peer-to-peer noticeboard for the 2 August 2027 eclipse in ${name}: accommodation, car sharing, viewing gear and services.`,
  });
}

export default async function ClassifiedsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cat?: string }>;
}) {
  const { locale } = await params;
  const { cat } = await searchParams;
  if (!isLocale(locale)) notFound();

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const name = cityName(city, locale);
  const listings = await getListings({ kind: "classified", citySlug: city.slug, category: cat });

  return (
    <>
      <PageHeader
        title={locale === "es" ? `Clasificados del eclipse en ${name}` : `Eclipse classifieds in ${name}`}
        lead={
          locale === "es"
            ? "Tablón entre particulares para los días del eclipse. Publicar es gratis; revisamos todos los anuncios antes de que aparezcan."
            : "A peer-to-peer board for the eclipse days. Posting is free; every ad is reviewed before it appears."
        }
      />
      <Section>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Link
            href={localePath(locale, "/clasificados")}
            className="rounded-full border px-3 py-1.5 text-sm"
            style={{
              borderColor: "hsl(var(--border))",
              background: !cat ? "hsl(var(--accent) / 0.15)" : "transparent",
              color: !cat ? "hsl(var(--accent))" : "hsl(var(--muted))",
            }}
          >
            {locale === "es" ? "Todos" : "All"}
          </Link>
          {CLASSIFIED_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`${localePath(locale, "/clasificados")}?cat=${c.slug}`}
              className="rounded-full border px-3 py-1.5 text-sm"
              style={{
                borderColor: "hsl(var(--border))",
                background: cat === c.slug ? "hsl(var(--accent) / 0.15)" : "transparent",
                color: cat === c.slug ? "hsl(var(--accent))" : "hsl(var(--muted))",
              }}
            >
              {c.icon} {c.label[locale]}
            </Link>
          ))}
          <Link
            href={localePath(locale, "/publicar") + "?tipo=particular"}
            className="ml-auto rounded-lg px-4 py-2 text-sm font-semibold"
            style={{ background: "hsl(var(--accent))", color: "hsl(var(--on-accent))" }}
          >
            {locale === "es" ? "Publicar anuncio" : "Post an ad"}
          </Link>
        </div>

        {listings.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} locale={locale} />
            ))}
          </div>
        ) : (
          <Card>
            <h2 className="font-bold">
              {locale === "es" ? `Todavía no hay anuncios en ${name}` : `No listings in ${name} yet`}
            </h2>
            <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
              {locale === "es"
                ? "Sé el primero. Funciona especialmente bien para lo que no cubre ningún portal: una habitación libre en casa esos días, plazas en el coche desde tu ciudad, gafas certificadas que te sobran o un sitio para aparcar la autocaravana."
                : "Be the first. It works especially well for what no booking site covers: a spare room in your home for those days, seats in your car from your city, spare certified glasses, or somewhere to park a motorhome."}
            </p>
            <Link
              href={localePath(locale, "/publicar") + "?tipo=particular"}
              className="mt-4 inline-block rounded-lg px-4 py-2 text-sm font-semibold"
              style={{ background: "hsl(var(--accent))", color: "hsl(var(--on-accent))" }}
            >
              {locale === "es" ? "Publicar gratis" : "Post for free"}
            </Link>
          </Card>
        )}
      </Section>

      <AdSection name="listing" locale={locale} />

      <Section>
        <Callout
          title={
            locale === "es"
              ? "Cuidado con las estafas de alojamiento"
              : "Beware of accommodation scams"
          }
        >
          {locale === "es"
            ? "Alrededor de un evento así proliferan los anuncios falsos. No pagues por adelantado por transferencia ni por Bizum a alguien que no puedas verificar, y desconfía de cualquier precio muy por debajo del mercado. Nosotros moderamos, pero no podemos garantizar a los anunciantes: la transacción es entre particulares."
            : "Fake listings proliferate around events like this. Do not pay in advance by bank transfer to someone you cannot verify, and be wary of any price far below market. We moderate, but we cannot vouch for advertisers: the transaction is between private individuals."}
        </Callout>
      </Section>
    </>
  );
}
