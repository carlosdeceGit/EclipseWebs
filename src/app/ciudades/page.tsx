import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Badge, Card, Section } from "@/components/ui";
import { CITIES, citiesByTotality, formatDuration } from "@/lib/eclipse/cities";
import { ECLIPSE } from "@/lib/eclipse/event";
import { buildMetadata } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await currentTenant();
  return buildMetadata({
    tenant,
    city: tenantCity(tenant),
    path: "/ciudades",
    title: "Dónde se ve el eclipse total: localidades de la franja",
    description:
      "Listado de ciudades y municipios del sur de España dentro de la franja de totalidad del eclipse del 2 de agosto de 2027, con la duración de la totalidad en cada uno.",
  });
}

export default async function CiudadesPage() {
  const tenant = await currentTenant();
  const current = tenantCity(tenant);
  const inBand = citiesByTotality();
  const outside = CITIES.filter((c) => !c.circumstances.inTotality);
  const { byProvince, total } = ECLIPSE.totalityMunicipalities;

  return (
    <>
      <Section
        title="Localidades dentro de la franja de totalidad"
        lead={`El eclipse del 2 de agosto de 2027 será total en Ceuta, en Melilla y en ${total} municipios andaluces. Aquí están las localidades principales, ordenadas por duración de la totalidad.`}
      >
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(byProvince).map(([province, count]) => (
            <Card key={province}>
              <div className="text-3xl font-black" style={{ color: "hsl(var(--accent))" }}>
                {count}
              </div>
              <div className="mt-1 text-sm" style={{ color: "hsl(var(--muted))" }}>
                municipios en {province}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inBand.map((c) => (
            <Link key={c.slug} href={`/ciudades/${c.slug}`}>
              <Card className="h-full transition hover:brightness-125">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-bold">{c.name}</h2>
                  {c.slug === current.slug && <Badge>estás aquí</Badge>}
                </div>
                <p className="mt-0.5 text-xs" style={{ color: "hsl(var(--muted))" }}>
                  {c.province}
                </p>
                <p
                  className="mt-3 text-2xl font-black tabular-nums"
                  style={{ color: "hsl(var(--accent))" }}
                >
                  {formatDuration(c.circumstances.totalitySeconds) ?? "por confirmar"}
                </p>
                <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
                  {c.hook}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <AdSlot name="listing" />
      </Section>

      {outside.length > 0 && (
        <Section
          title="Cerca de la franja, pero fuera"
          lead="En estas localidades el eclipse se verá parcial. Merece la pena el desplazamiento: entre el 99% y el 100% de ocultación no hay comparación posible."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {outside.map((c) => (
              <Link key={c.slug} href={`/ciudades/${c.slug}`}>
                <Card className="h-full transition hover:brightness-125">
                  <h2 className="font-bold">{c.name}</h2>
                  <p className="mt-0.5 text-xs" style={{ color: "hsl(var(--muted))" }}>
                    {c.province}
                  </p>
                  <p className="mt-3 text-sm" style={{ color: "hsl(var(--muted))" }}>
                    {c.hook}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
