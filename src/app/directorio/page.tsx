import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { ListingCard } from "@/components/ListingCard";
import { Badge, Callout, Card, Section } from "@/components/ui";
import { DIRECTORY_CATEGORIES, getListings } from "@/lib/db/listings";
import { buildMetadata } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  return buildMetadata({
    tenant,
    city,
    path: "/directorio",
    title: `Directorio de negocios para el eclipse en ${city.name}`,
    description: `Hoteles, restaurantes, ópticas, transporte y actividades de ${city.name} preparados para el eclipse del 2 de agosto de 2027. Alta gratuita para negocios locales.`,
  });
}

export default async function DirectorioPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const listings = await getListings({ kind: "directory", citySlug: city.slug, category: cat });

  return (
    <>
      <Section
        title={`Directorio de negocios de ${city.name}`}
        lead={`Negocios locales preparados para el eclipse del 2 de agosto de 2027. El alta básica es gratuita y la revisamos a mano antes de publicarla.`}
      >
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/directorio"
            className="rounded-full border px-3 py-1.5 text-sm"
            style={{
              borderColor: "hsl(var(--border))",
              background: !cat ? "hsl(var(--accent) / 0.15)" : "transparent",
              color: !cat ? "hsl(var(--accent))" : "hsl(var(--muted))",
            }}
          >
            Todas
          </Link>
          {DIRECTORY_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/directorio?cat=${c.slug}`}
              className="rounded-full border px-3 py-1.5 text-sm"
              style={{
                borderColor: "hsl(var(--border))",
                background: cat === c.slug ? "hsl(var(--accent) / 0.15)" : "transparent",
                color: cat === c.slug ? "hsl(var(--accent))" : "hsl(var(--muted))",
              }}
            >
              {c.icon} {c.label}
            </Link>
          ))}
        </div>

        {listings.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <Card>
            <h2 className="font-bold">El directorio está abierto y todavía vacío</h2>
            <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
              Estamos dando de alta los primeros negocios de {city.name}. Si tienes un
              alojamiento, un restaurante, una óptica o cualquier servicio útil para quien
              venga al eclipse, ser de los primeros tiene premio: llevas más de un año de
              ventaja para posicionar tu ficha.
            </p>
            <Link
              href="/anunciate"
              className="mt-4 inline-block rounded-lg px-4 py-2 text-sm font-semibold"
              style={{ background: "hsl(var(--accent))", color: "hsl(224 44% 8%)" }}
            >
              Dar de alta mi negocio gratis
            </Link>
          </Card>
        )}
      </Section>

      <Section>
        <AdSlot name="listing" />
      </Section>

      <Section title="¿Tienes un negocio en la zona?">
        <div className="grid gap-6 lg:grid-cols-2">
          <Callout title="El 2 de agosto de 2027 llegan visitantes que no volverán">
            La franja de totalidad es estrecha y el eclipse dura minutos, pero la gente se
            queda días. Aparecer en el sitio donde buscan alojamiento, comida y actividades
            es la diferencia entre vivir el eclipse y facturarlo.
          </Callout>
          <Card>
            <div className="flex items-center gap-2">
              <Badge>Gratis</Badge>
              <h2 className="font-bold">Ficha básica</h2>
            </div>
            <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
              Nombre, categoría, contacto y enlace a tu web. Sin coste ni permanencia.
            </p>
            <Link
              href="/anunciate"
              className="mt-4 inline-block rounded-lg px-4 py-2 text-sm font-semibold"
              style={{ background: "hsl(var(--accent))", color: "hsl(224 44% 8%)" }}
            >
              Ver opciones
            </Link>
          </Card>
        </div>
      </Section>
    </>
  );
}
