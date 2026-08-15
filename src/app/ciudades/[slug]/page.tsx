import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Callout, Card, DataRow, Section } from "@/components/ui";
import { CITIES, getCity, formatDuration } from "@/lib/eclipse/cities";
import { breadcrumbGraph, buildMetadata, cityGraph, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { TENANTS } from "@/lib/tenants";

export function generateStaticParams() {
  return CITIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return {};

  const tenant = await currentTenant();
  const d = formatDuration(city.circumstances.totalitySeconds);
  return buildMetadata({
    tenant,
    city,
    path: `/ciudades/${slug}`,
    title: `Eclipse del 2 de agosto de 2027 en ${city.name}`,
    description: city.circumstances.inTotality
      ? `${city.name} está dentro de la franja de totalidad${d ? ` con ${d} de totalidad` : ""}. Horarios, cómo llegar y dónde verlo.`
      : `Desde ${city.name} el eclipse del 2 de agosto de 2027 se verá parcial. Estas son las opciones más cercanas para ver la totalidad.`,
  });
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const tenant = await currentTenant();
  const c = city.circumstances;
  const duration = formatDuration(c.totalitySeconds);
  /** Si esta ciudad tiene dominio propio, se enlaza: es la guía completa. */
  const ownSite = TENANTS.find((t) => t.citySlug === city.slug && t.domain !== tenant.domain);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(cityGraph(tenant, city))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbGraph(tenant, [
            { name: "Inicio", path: "/" },
            { name: "Localidades", path: "/ciudades" },
            { name: city.name, path: `/ciudades/${city.slug}` },
          ]),
        )}
      />

      <Section
        title={`El eclipse en ${city.name}`}
        lead={
          c.inTotality
            ? `${city.name} (${city.province}) está dentro de la franja de totalidad del eclipse del lunes 2 de agosto de 2027. ${city.hook}`
            : `Desde ${city.name} (${city.province}) el eclipse del 2 de agosto de 2027 se verá parcial, no total.`
        }
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <dl>
              <DataRow label="Provincia" value={city.province} />
              <DataRow label="¿Totalidad?" value={c.inTotality ? "Sí" : "No, solo parcial"} />
              <DataRow label="Duración de la totalidad" value={duration} />
              <DataRow label="Empieza la totalidad" value={c.contacts.totalityStart} note="hora local" />
              <DataRow label="Termina la totalidad" value={c.contacts.totalityEnd} note="hora local" />
              <DataRow label="Zona horaria" value={city.timeZone} />
              <DataRow label="Coordenadas" value={`${city.lat.toFixed(4)}, ${city.lon.toFixed(4)}`} />
              <DataRow
                label="Población"
                value={city.population ? city.population.toLocaleString("es-ES") + " hab." : null}
              />
            </dl>
          </Card>

          <div className="space-y-6">
            {ownSite && (
              <Callout title={`Guía completa de ${city.name}`}>
                Esta localidad tiene su propia web con horarios, alojamiento, eventos y
                directorio local:{" "}
                <a href={`https://${ownSite.domain}`} className="underline">
                  {ownSite.domain}
                </a>
              </Callout>
            )}
            {city.timeZone !== "Europe/Madrid" && (
              <Callout title="Ojo con la hora">
                {city.name} no usa la hora peninsular española. Las horas de esta ficha son
                locales de {city.name}; si vienes desde la Península, comprueba la diferencia
                antes de salir.
              </Callout>
            )}
            <AdSlot name="sidebar" className="hidden lg:flex" />
          </div>
        </div>
      </Section>

      <Section title="Seguir preparando el viaje">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["/horarios", "Horarios"],
            ["/donde-verlo", "Dónde verlo"],
            ["/alojamiento", "Alojamiento"],
            ["/como-llegar", "Cómo llegar"],
            ["/seguridad", "Seguridad ocular"],
            ["/clima", "Probabilidad de nubes"],
            ["/eventos", "Eventos"],
            ["/directorio", "Directorio"],
          ].map(([href, label]) => (
            <Link key={href} href={href}>
              <Card className="h-full text-center transition hover:brightness-125">
                <span className="font-semibold">{label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <AdSlot name="footer" />
      </Section>
    </>
  );
}
