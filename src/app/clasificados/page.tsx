import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { ListingCard } from "@/components/ListingCard";
import { Callout, Card, Section } from "@/components/ui";
import { CLASSIFIED_CATEGORIES, getListings } from "@/lib/db/listings";
import { buildMetadata } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  return buildMetadata({
    tenant,
    city,
    path: "/clasificados",
    title: `Clasificados del eclipse en ${city.name}`,
    description: `Tablón de anuncios entre particulares para el eclipse del 2 de agosto de 2027 en ${city.name}: alojamiento, coche compartido, material de observación y servicios puntuales.`,
  });
}

export default async function ClasificadosPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const listings = await getListings({ kind: "classified", citySlug: city.slug, category: cat });

  return (
    <>
      <Section
        title={`Clasificados del eclipse en ${city.name}`}
        lead="Tablón entre particulares para los días del eclipse. Publicar es gratis; revisamos todos los anuncios antes de que aparezcan."
      >
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Link
            href="/clasificados"
            className="rounded-full border px-3 py-1.5 text-sm"
            style={{
              borderColor: "hsl(var(--border))",
              background: !cat ? "hsl(var(--accent) / 0.15)" : "transparent",
              color: !cat ? "hsl(var(--accent))" : "hsl(var(--muted))",
            }}
          >
            Todos
          </Link>
          {CLASSIFIED_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/clasificados?cat=${c.slug}`}
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
          <Link
            href="/clasificados/nuevo"
            className="ml-auto rounded-lg px-4 py-2 text-sm font-semibold"
            style={{ background: "hsl(var(--accent))", color: "hsl(224 44% 8%)" }}
          >
            Publicar anuncio
          </Link>
        </div>

        {listings.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <Card>
            <h2 className="font-bold">Todavía no hay anuncios en {city.name}</h2>
            <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
              Sé el primero. Funciona especialmente bien para lo que no cubre ningún portal:
              una habitación libre en casa esos días, plazas en el coche desde tu ciudad,
              gafas certificadas que te sobran o un sitio para aparcar la autocaravana.
            </p>
            <Link
              href="/clasificados/nuevo"
              className="mt-4 inline-block rounded-lg px-4 py-2 text-sm font-semibold"
              style={{ background: "hsl(var(--accent))", color: "hsl(224 44% 8%)" }}
            >
              Publicar gratis
            </Link>
          </Card>
        )}
      </Section>

      <Section>
        <AdSlot name="listing" />
      </Section>

      <Section>
        <Callout title="Cuidado con las estafas de alojamiento">
          Alrededor de un evento así proliferan los anuncios falsos de alojamiento. No pagues
          por adelantado por transferencia ni por Bizum a alguien que no puedas verificar, y
          desconfía de cualquier precio muy por debajo del mercado. Nosotros moderamos, pero
          no podemos garantizar a los anunciantes: la transacción es entre particulares.
        </Callout>
      </Section>
    </>
  );
}
