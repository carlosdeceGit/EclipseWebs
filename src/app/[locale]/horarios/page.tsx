import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSection, AdSlot } from "@/components/AdSlot";
import { DurationBar } from "@/components/DurationBar";
import { EclipseTimeline } from "@/components/EclipseTimeline";
import { Callout, Card, DataRow, Datum, PageHeader, Section } from "@/components/ui";
import {
  citiesByTotality,
  cityName,
  formatDuration,
  formatObscuration,
  toLocalTime,
} from "@/lib/eclipse/cities";
import { breadcrumbGraph, buildMetadata, datasetGraph, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";
import { getDictionary } from "@/i18n/dictionary";
import { isLocale, localePath } from "@/i18n/config";

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
  const d = formatDuration(city.eclipse.totalitySeconds, locale);

  return buildMetadata({
    tenant,
    city,
    locale,
    path: "/horarios",
    title:
      locale === "es"
        ? `Horarios del eclipse en ${name} — 2 de agosto de 2027`
        : `Eclipse timings in ${name} — 2 August 2027`,
    description:
      locale === "es"
        ? `A qué hora empieza y termina el eclipse en ${name}${d ? `, con ${d} de totalidad` : ""}: los cinco contactos, el máximo y la duración de cada fase.`
        : `When the eclipse starts and ends in ${name}${d ? `, with ${d} of totality` : ""}: the five contacts, maximum eclipse and the length of each phase.`,
  });
}

export default async function TimingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const t = getDictionary(locale);
  const name = cityName(city, locale);
  const duration = formatDuration(city.eclipse.totalitySeconds, locale);
  // Sin segundos para el titular: al segundo está en la tabla de debajo.
  // Una sola lectura del registro: se usa para las filas y para fijar la escala
  // de las barras, que la marca la localidad más larga de la tabla.
  const allTotal = citiesByTotality();
  const longest = allTotal[0]?.eclipse.totalitySeconds ?? 0;
  const startShort =
    toLocalTime(city.eclipse.totalityStart ?? city.eclipse.maximum, city.timeZone, false) ??
    city.localTimes.maximum;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbGraph(tenant, locale, [
            { name: t.common.home, path: "/" },
            { name: t.nav[1].label, path: "/horarios" },
          ]),
        )}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(datasetGraph(tenant, locale))} />

      <PageHeader
        eyebrow={name}
        title={locale === "es" ? `Horarios del eclipse en ${name}` : `Eclipse timings in ${name}`}
        lead={
          locale === "es"
            ? `Todas las horas están en hora local de ${name} (${city.timeZone}). El eclipse es el lunes 2 de agosto de 2027.`
            : `All times are local to ${name} (${city.timeZone}). The eclipse is on Monday 2 August 2027.`
        }
      >
        {/* Las tres cifras que se buscan, antes de la tabla. La tabla sigue
            estando: lo que cambia es que ya no hay que leerla para saber lo
            esencial. */}
        <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {city.eclipse.isTotal && duration ? (
            <>
              <Datum
                label={locale === "es" ? "Empieza la totalidad" : "Totality begins"}
                value={startShort}
                note={t.common.localTime}
                size="md"
              />
              <Datum label={locale === "es" ? "Duración" : "Duration"} value={duration} size="md" />
              <Datum
                label={t.data.obscuration}
                value={formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)}
                size="md"
              />
            </>
          ) : (
            <>
              <Datum label={t.data.maximum} value={city.localTimes.maximum} note={t.common.localTime} size="md" />
              <Datum
                label={t.data.obscuration}
                value={formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)}
                size="md"
              />
            </>
          )}
        </div>

        <div className="mt-10 max-w-4xl">
          <EclipseTimeline city={city} locale={locale} />
        </div>
      </PageHeader>

      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-bold">
              {locale === "es" ? "Los cinco contactos" : "The five contacts"}
            </h2>
            <dl>
              <DataRow label={t.data.partialStart} value={city.localTimes.partialStart} locale={locale} />
              <DataRow label={t.data.totalityStart} value={city.localTimes.totalityStart} locale={locale} />
              <DataRow label={t.data.maximum} value={city.localTimes.maximum} locale={locale} />
              <DataRow label={t.data.totalityEnd} value={city.localTimes.totalityEnd} locale={locale} />
              <DataRow label={t.data.partialEnd} value={city.localTimes.partialEnd} locale={locale} />
              <DataRow label={t.data.duration} value={duration} locale={locale} />
              <DataRow label={t.data.sunAltitude} value={`${city.eclipse.sunAltitudeDeg.toFixed(1)}°`} locale={locale} />
              <DataRow label={t.data.sunAzimuth} value={`${city.eclipse.sunAzimuthDeg.toFixed(0)}°`} locale={locale} />
              <DataRow
                label={t.data.obscuration}
                value={formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)}
                locale={locale}
              />
            </dl>
          </Card>

          <div className="space-y-6">
            <Callout
              title={locale === "es" ? "No te fíes del reloj" : "Do not trust the clock"}
            >
              {locale === "es"
                ? "Estas horas están calculadas al segundo, pero el instante real de C2 y C3 depende del relieve del limbo lunar. Quítate el filtro cuando desaparezca el último rayo y vuelve a ponértelo al primer destello."
                : "These times are computed to the second, but the real instant of C2 and C3 depends on the terrain of the lunar limb. Remove your filter when the last sliver vanishes and replace it at the first flash."}
            </Callout>
            <Callout
              title={locale === "es" ? "Tu punto exacto" : "Your exact spot"}
            >
              {locale === "es"
                ? "Estas horas son las del centro de la localidad. "
                : "These are the timings for the town centre. "}
              <Link href={localePath(locale, "/localizador")} className="underline">
                {locale === "es" ? "Calcula las tuyas" : "Compute yours"}
              </Link>
            </Callout>
            <AdSlot name="sidebar" locale={locale} className="hidden lg:flex" />
          </div>
        </div>
      </Section>

      <Section title={locale === "es" ? "Qué pasa en cada momento" : "What happens when"}>
        <div className="prose-eclipse max-w-3xl">
          <p>
            {locale === "es"
              ? "Entre C1 y C2 pasa algo más de una hora en la que el Sol se va comiendo poco a poco. Sin filtro no notarás casi nada hasta el último cuarto de hora: el ojo compensa la pérdida de luz muy bien. Los últimos cinco minutos antes de la totalidad son los que cambian de verdad, con la luz volviéndose gris metálica y la temperatura bajando."
              : "Between C1 and C2 there is just over an hour in which the Sun is gradually eaten away. Without a filter you will notice almost nothing until the last quarter of an hour: the eye compensates for the loss of light remarkably well. The final five minutes before totality are what really change, with the light turning metallic grey and the temperature dropping."}
          </p>
          <p>
            {locale === "es"
              ? "El instante de C2 es el que hay que tener claro. Es cuando aparece el anillo de diamante y, justo después, cuando ya se puede mirar sin filtro. Y el de C3, el momento de volver a ponérselo, sin esperar a comprobar nada."
              : "The moment of C2 is the one to have clear. It is when the diamond ring appears and, immediately after, when you can look without a filter. And C3 is when it goes back on, without waiting to check anything."}
          </p>
        </div>
      </Section>

      <AdSection name="inArticle" locale={locale} />

      <Section
        title={locale === "es" ? "Horarios en otras localidades" : "Timings elsewhere"}
        lead={
          locale === "es"
            ? "La franja avanza de oeste a este: las localidades atlánticas entran en totalidad antes que las mediterráneas."
            : "The path travels west to east: Atlantic locations enter totality before Mediterranean ones."
        }
      >
        <div className="overflow-x-auto">
          <table className="data-table min-w-[48rem] text-sm">
            <thead>
              <tr>
                <th>{t.data.locality}</th>
                <th>{t.data.province}</th>
                <th>C1</th>
                <th>C2</th>
                <th>C3</th>
                <th className="text-right">{t.data.duration}</th>
                <th className="w-[18%]" aria-hidden="true" />
              </tr>
            </thead>
            <tbody>
              {allTotal.map((c) => (
                <tr key={c.slug} data-self={c.slug === city.slug ? "true" : undefined}>
                  <td className="font-semibold">
                    <Link href={localePath(locale, `/ciudades/${c.slug}`)} className="hover:underline">
                      {cityName(c, locale)}
                    </Link>
                  </td>
                  <td style={{ color: "hsl(var(--muted))" }}>{c.province}</td>
                  <td className="num" style={{ color: "hsl(var(--muted))" }}>
                    {c.localTimes.partialStart}
                  </td>
                  <td className="num">{c.localTimes.totalityStart}</td>
                  <td className="num">{c.localTimes.totalityEnd}</td>
                  <td className="num text-right font-semibold">
                    {formatDuration(c.eclipse.totalitySeconds, locale)}
                  </td>
                  <td>
                    <DurationBar seconds={c.eclipse.totalitySeconds} max={longest} locale={locale} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs" style={{ color: "hsl(var(--muted))" }}>
          {locale === "es"
            ? "Horas locales de cada localidad. Ojo: Marruecos va una hora por detrás de España en agosto."
            : "Local time for each location. Note: Morocco runs one hour behind Spain in August."}
        </p>
      </Section>
    </>
  );
}
