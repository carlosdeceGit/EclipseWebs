import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { AdSection, AdSlot } from "@/components/AdSlot";
import { Callout, Card, DataRow, Section } from "@/components/ui";
import { CITIES, getCity, cityName, formatDuration, formatObscuration, provinceName } from "@/lib/eclipse/cities";
import { breadcrumbGraph, buildMetadata, cityGraph, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { TENANTS } from "@/lib/tenants";
import { getDictionary } from "@/i18n/dictionary";
import { LOCALES, isLocale, localePath } from "@/i18n/config";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => CITIES.map((c) => ({ locale, slug: c.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const city = getCity(slug);
  if (!city || !isLocale(locale)) return {};

  const tenant = await currentTenant();
  const name = cityName(city, locale);
  const d = formatDuration(city.eclipse.totalitySeconds, locale);

  return buildMetadata({
    tenant,
    city,
    locale,
    path: `/ciudades/${slug}`,
    title:
      locale === "es"
        ? `Eclipse del 2 de agosto de 2027 en ${name}`
        : `The 2 August 2027 eclipse in ${name}`,
    description:
      locale === "es"
        ? city.eclipse.isTotal
          ? `${name} está en la franja de totalidad con ${d}, de ${city.localTimes.totalityStart} a ${city.localTimes.totalityEnd}. Horarios completos, cómo llegar y dónde verlo.`
          : `Desde ${name} el eclipse se verá parcial, con el ${formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)} del Sol cubierto. Dónde ir para ver la totalidad.`
        : city.eclipse.isTotal
          ? `${name} is inside the path of totality with ${d}, from ${city.localTimes.totalityStart} to ${city.localTimes.totalityEnd}. Full timings, getting there and where to watch.`
          : `From ${name} the eclipse is partial, with ${formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)} of the Sun covered. Where to go for totality.`,
  });
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const city = getCity(slug);
  if (!city || !isLocale(locale)) notFound();

  const tenant = await currentTenant();
  const t = getDictionary(locale);
  const name = cityName(city, locale);
  const duration = formatDuration(city.eclipse.totalitySeconds, locale);
  /** Si esta ciudad tiene dominio propio, se enlaza: allí está la guía completa. */
  const ownSite = TENANTS.find((x) => x.citySlug === city.slug && x.domain !== tenant.domain);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(cityGraph(tenant, city, locale))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbGraph(tenant, locale, [
            { name: t.common.home, path: "/" },
            { name: locale === "es" ? "Localidades" : "Locations", path: "/ciudades" },
            { name, path: `/ciudades/${city.slug}` },
          ]),
        )}
      />

      <Section
        title={locale === "es" ? `El eclipse en ${name}` : `The eclipse in ${name}`}
        lead={
          city.eclipse.isTotal
            ? locale === "es"
              ? `${name} (${provinceName(city, locale)}) está dentro de la franja de totalidad del eclipse del lunes 2 de agosto de 2027. ${city.hook.es}`
              : `${name} (${provinceName(city, locale)}) is inside the path of totality of the total solar eclipse on Monday 2 August 2027. ${city.hook.en}`
            : locale === "es"
              ? `Desde ${name} (${provinceName(city, locale)}) el eclipse del 2 de agosto de 2027 se verá parcial, no total. ${city.hook.es}`
              : `From ${name} (${provinceName(city, locale)}) the 2 August 2027 eclipse is partial, not total. ${city.hook.en}`
        }
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <dl>
              <DataRow label={t.data.province} value={provinceName(city, locale)} locale={locale} />
              <DataRow
                label={t.data.totality}
                value={city.eclipse.isTotal ? t.data.yesInPath : t.data.noPartialOnly}
                locale={locale}
              />
              <DataRow label={t.data.duration} value={duration} locale={locale} />
              <DataRow label={t.data.partialStart} value={city.localTimes.partialStart} locale={locale} />
              <DataRow label={t.data.totalityStart} value={city.localTimes.totalityStart} locale={locale} />
              <DataRow label={t.data.maximum} value={city.localTimes.maximum} locale={locale} />
              <DataRow label={t.data.totalityEnd} value={city.localTimes.totalityEnd} locale={locale} />
              <DataRow label={t.data.partialEnd} value={city.localTimes.partialEnd} locale={locale} />
              <DataRow
                label={t.data.obscuration}
                value={formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)}
                locale={locale}
              />
              <DataRow label={t.data.sunAltitude} value={`${city.eclipse.sunAltitudeDeg.toFixed(1)}°`} locale={locale} />
              <DataRow label={t.data.sunAzimuth} value={`${city.eclipse.sunAzimuthDeg.toFixed(0)}°`} locale={locale} />
              <DataRow label={t.data.timeZone} value={city.timeZone} locale={locale} />
              <DataRow label={t.data.coordinates} value={`${city.lat.toFixed(4)}, ${city.lon.toFixed(4)}`} locale={locale} />
              <DataRow
                label={t.data.population}
                value={city.population ? city.population.toLocaleString(locale === "es" ? "es-ES" : "en-GB") : null}
                locale={locale}
              />
            </dl>
          </Card>

          <div className="space-y-6">
            {ownSite && (
              <Callout title={locale === "es" ? `Guía completa de ${name}` : `Full guide to ${name}`}>
                {locale === "es"
                  ? "Esta localidad tiene su propia web con horarios, alojamiento, eventos y directorio local: "
                  : "This location has its own site with timings, accommodation, events and a local directory: "}
                <a href={`https://${ownSite.domain}`} className="underline">
                  {ownSite.domain}
                </a>
              </Callout>
            )}
            {city.timeZone !== "Europe/Madrid" && (
              <Callout title={locale === "es" ? "Ojo con la hora" : "Mind the time zone"}>
                {locale === "es"
                  ? `${name} no usa la hora peninsular española. Las horas de esta ficha son locales de ${name}; comprueba la diferencia antes de salir.`
                  : `${name} does not use mainland Spanish time. The times here are local to ${name}; check the difference before you travel.`}
              </Callout>
            )}
            <Callout title={locale === "es" ? "Tu punto exacto" : "Your exact spot"}>
              {locale === "es"
                ? "Estos datos son los del centro de la localidad. "
                : "These figures are for the town centre. "}
              <Link href={localePath(locale, "/localizador")} className="underline">
                {locale === "es" ? "Calcula los de tus coordenadas" : "Compute yours"}
              </Link>
            </Callout>
            <AdSlot name="sidebar" locale={locale} className="hidden lg:flex" />
          </div>
        </div>
      </Section>

      <Section title={locale === "es" ? "Seguir preparando el viaje" : "Keep planning"}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.nav.slice(1).map((item) => (
            <Link key={item.href} href={localePath(locale, item.href)}>
              <Card className="h-full text-center transition hover:brightness-125">
                <span className="font-semibold">{item.label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <AdSection name="footer" locale={locale} />
    </>
  );
}
