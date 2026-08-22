import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSection } from "@/components/AdSlot";
import { Badge, Card, PageHeader, Section } from "@/components/ui";
import { citiesByTotality, citiesOutsideTotality, cityName, formatDuration, formatObscuration } from "@/lib/eclipse/cities";
import { ECLIPSE } from "@/lib/eclipse/event";
import { buildMetadata, datasetGraph, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";
import { isLocale, localePath } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const tenant = await currentTenant();

  return buildMetadata({
    tenant,
    city: tenantCity(tenant),
    locale,
    path: "/ciudades",
    title:
      locale === "es"
        ? "Dónde se ve el eclipse total: localidad por localidad"
        : "Where the total eclipse is visible: location by location",
    description:
      locale === "es"
        ? "Duración de la totalidad y horarios en cada ciudad de la franja del eclipse del 2 de agosto de 2027, y qué se verá desde las capitales que quedan fuera."
        : "Length of totality and timings for every location in the path of the 2 August 2027 eclipse, plus what the cities outside will see.",
  });
}

export default async function CitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const tenant = await currentTenant();
  const current = tenantCity(tenant);
  const inBand = citiesByTotality();
  const outside = citiesOutsideTotality();
  const { byProvince, total } = ECLIPSE.totalityMunicipalities;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(datasetGraph(tenant, locale))} />

      <PageHeader
        title={locale === "es" ? "Localidades dentro de la franja" : "Locations inside the path"}
        lead={
          locale === "es"
            ? `El eclipse será total en Ceuta, en Melilla, en Gibraltar y en ${total} municipios andaluces. Estas son las localidades principales, ordenadas por duración.`
            : `The eclipse is total in Ceuta, Melilla, Gibraltar and ${total} Andalusian municipalities. These are the main locations, ordered by duration.`
        }
      />
      <Section>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(byProvince).map(([province, count]) => (
            <Card key={province}>
              <div className="text-3xl font-black" style={{ color: "hsl(var(--accent))" }}>
                {count}
              </div>
              <div className="mt-1 text-sm" style={{ color: "hsl(var(--muted))" }}>
                {locale === "es" ? `municipios en ${province}` : `municipalities in ${province}`}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inBand.map((c) => (
            <Link key={c.slug} href={localePath(locale, `/ciudades/${c.slug}`)}>
              <Card className="h-full transition hover:brightness-125">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-bold">{cityName(c, locale)}</h2>
                  {c.slug === current.slug && <Badge>{locale === "es" ? "estás aquí" : "you are here"}</Badge>}
                </div>
                <p className="mt-0.5 text-xs" style={{ color: "hsl(var(--muted))" }}>
                  {c.province}
                </p>
                <p className="mt-3 text-2xl font-black tabular-nums" style={{ color: "hsl(var(--accent))" }}>
                  {formatDuration(c.eclipse.totalitySeconds, locale)}
                </p>
                <p className="mt-1 text-xs tabular-nums" style={{ color: "hsl(var(--muted))" }}>
                  {c.localTimes.totalityStart} – {c.localTimes.totalityEnd}
                </p>
                <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
                  {c.hook[locale]}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <AdSection name="listing" locale={locale} />

      {outside.length > 0 && (
        <Section
          title={locale === "es" ? "Fuera de la franja" : "Outside the path"}
          lead={
            locale === "es"
              ? "Aquí el eclipse se verá parcial. Entre el 99% y el 100% no hay comparación posible: merece la pena el desplazamiento."
              : "Here the eclipse is partial. There is no comparison between 99% and 100%: the trip is worth it."
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {outside
              .sort((a, b) => b.eclipse.obscuration - a.eclipse.obscuration)
              .map((c) => (
                <Link key={c.slug} href={localePath(locale, `/ciudades/${c.slug}`)}>
                  <Card className="h-full transition hover:brightness-125">
                    <h2 className="font-bold">{cityName(c, locale)}</h2>
                    <p className="mt-0.5 text-xs" style={{ color: "hsl(var(--muted))" }}>
                      {c.province}
                    </p>
                    <p className="mt-3 text-2xl font-black tabular-nums" style={{ color: "hsl(var(--muted))" }}>
                      {formatObscuration(c.eclipse.obscuration, c.eclipse.isTotal)}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: "hsl(var(--muted))" }}>
                      {locale === "es" ? "del Sol cubierto, sin totalidad" : "of the Sun covered, no totality"}
                    </p>
                    <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
                      {c.hook[locale]}
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
