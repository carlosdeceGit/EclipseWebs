import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSection } from "@/components/AdSlot";
import { ListingCard } from "@/components/ListingCard";
import { Badge, Callout, Card, PageHeader, Section } from "@/components/ui";
import { DIRECTORY_CATEGORIES, getListings } from "@/lib/db/listings";
import { buildMetadata } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";
import { cityName } from "@/lib/eclipse/cities";
import { isLocale, localePath } from "@/i18n/config";

export const revalidate = 600;

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
    path: "/directorio",
    title:
      locale === "es"
        ? `Directorio de negocios para el eclipse en ${name}`
        : `Business directory for the eclipse in ${name}`,
    description:
      locale === "es"
        ? `Hoteles, restaurantes, ópticas, transporte y actividades de ${name} preparados para el eclipse del 2 de agosto de 2027. Alta gratuita para negocios locales.`
        : `Hotels, restaurants, opticians, transport and activities in ${name} ready for the 2 August 2027 eclipse. Free listing for local businesses.`,
  });
}

export default async function DirectoryPage({
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
  const listings = await getListings({ kind: "directory", citySlug: city.slug, category: cat });

  return (
    <>
      <PageHeader
        title={locale === "es" ? `Directorio de negocios de ${name}` : `Business directory for ${name}`}
        lead={
          locale === "es"
            ? "Negocios locales preparados para el eclipse del 2 de agosto de 2027. El alta básica es gratuita y la revisamos a mano antes de publicarla."
            : "Local businesses ready for the 2 August 2027 eclipse. Basic listings are free and reviewed by hand before publication."
        }
      />
      <Section>
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href={localePath(locale, "/directorio")}
            className="rounded-full border px-3 py-1.5 text-sm"
            style={{
              borderColor: "hsl(var(--border))",
              background: !cat ? "hsl(var(--accent) / 0.15)" : "transparent",
              color: !cat ? "hsl(var(--accent))" : "hsl(var(--muted))",
            }}
          >
            {locale === "es" ? "Todas" : "All"}
          </Link>
          {DIRECTORY_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`${localePath(locale, "/directorio")}?cat=${c.slug}`}
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
              {locale === "es"
                ? "El directorio está abierto y todavía vacío"
                : "The directory is open and still empty"}
            </h2>
            <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
              {locale === "es"
                ? `Estamos dando de alta los primeros negocios de ${name}. Si tienes un alojamiento, un restaurante, una óptica o cualquier servicio útil para quien venga al eclipse, ser de los primeros tiene premio: llevas casi un año de ventaja para posicionar tu ficha.`
                : `We are adding the first businesses in ${name}. If you run accommodation, a restaurant, an optician's or any service useful to eclipse visitors, being early pays: you get almost a year's head start on ranking.`}
            </p>
            <Link
              href={localePath(locale, "/anunciate")}
              className="mt-4 inline-block rounded-lg px-4 py-2 text-sm font-semibold"
              style={{ background: "hsl(var(--accent))", color: "hsl(var(--on-accent))" }}
            >
              {locale === "es" ? "Dar de alta mi negocio gratis" : "List my business for free"}
            </Link>
          </Card>
        )}
      </Section>

      <AdSection name="listing" locale={locale} />

      <Section title={locale === "es" ? "¿Tienes un negocio en la zona?" : "Do you run a business here?"}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Callout
            title={
              locale === "es"
                ? "El 2 de agosto de 2027 llegan visitantes que no volverán"
                : "On 2 August 2027 visitors arrive who will not return"
            }
          >
            {locale === "es"
              ? "La franja de totalidad es estrecha y el eclipse dura minutos, pero la gente se queda días. Aparecer donde buscan alojamiento, comida y actividades es la diferencia entre vivir el eclipse y facturarlo."
              : "The path is narrow and the eclipse lasts minutes, but people stay for days. Appearing where they search for accommodation, food and activities is the difference between watching the eclipse and earning from it."}
          </Callout>
          <Card>
            <div className="flex items-center gap-2">
              <Badge>{locale === "es" ? "Gratis" : "Free"}</Badge>
              <h2 className="font-bold">{locale === "es" ? "Ficha básica" : "Basic listing"}</h2>
            </div>
            <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
              {locale === "es"
                ? "Nombre, categoría, contacto y enlace a tu web. Sin coste ni permanencia."
                : "Name, category, contact details and a link to your site. No cost, no commitment."}
            </p>
            <Link
              href={localePath(locale, "/anunciate")}
              className="mt-4 inline-block rounded-lg px-4 py-2 text-sm font-semibold"
              style={{ background: "hsl(var(--accent))", color: "hsl(var(--on-accent))" }}
            >
              {locale === "es" ? "Ver opciones" : "See options"}
            </Link>
          </Card>
        </div>
      </Section>
    </>
  );
}
