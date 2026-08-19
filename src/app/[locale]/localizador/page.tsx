import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSection, AdSlot } from "@/components/AdSlot";
import { Callout, PageHeader, Section } from "@/components/ui";
import { LocatorClient, type Preset } from "./LocatorClient";
import { citiesByTotality, cityName } from "@/lib/eclipse/cities";
import { breadcrumbGraph, buildMetadata, jsonLd } from "@/lib/seo";
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

  return buildMetadata({
    tenant,
    city,
    locale,
    path: "/localizador",
    title:
      locale === "es"
        ? `Localizador: tus horas exactas del eclipse en ${name} y alrededores`
        : `Locator: your exact eclipse timings in ${name} and nearby`,
    description:
      locale === "es"
        ? "Introduce tus coordenadas o usa tu ubicación y calcula la duración de tu totalidad, tus cinco contactos, la altura del Sol y si te compensa moverte."
        : "Enter your coordinates or use your location to compute the length of your totality, your five contacts, the Sun's altitude and whether it is worth moving.",
  });
}

export default async function LocatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const t = getDictionary(locale);

  // Atajos: la propia ciudad del dominio primero, y luego las de totalidad más
  // larga, que es lo que la gente quiere comparar.
  const presets: Preset[] = [
    city,
    ...citiesByTotality().filter((c) => c.slug !== city.slug),
  ]
    .slice(0, 10)
    .map((c) => ({
      slug: c.slug,
      name: cityName(c, locale),
      lat: c.lat,
      lon: c.lon,
      timeZone: c.timeZone,
    }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbGraph(tenant, locale, [
            { name: t.common.home, path: "/" },
            { name: t.locator.title, path: "/localizador" },
          ]),
        )}
      />

      <PageHeader title={t.locator.title} lead={t.locator.lead} />
      <Section>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LocatorClient
              locale={locale}
              t={t.locator}
              labels={{
                partialStart: t.data.partialStart,
                totalityStart: t.data.totalityStart,
                maximum: t.data.maximum,
                totalityEnd: t.data.totalityEnd,
                partialEnd: t.data.partialEnd,
                sunAltitude: t.data.sunAltitude,
              }}
              presets={presets}
            />
          </div>
          <div className="space-y-6">
            <Callout title={locale === "es" ? "¿Y si me lo tapa un edificio?" : "And if a building blocks it?"}>
              {locale === "es"
                ? "El visor de cámara superpone la posición del Sol sobre lo que estás mirando, para comprobar si desde ese punto concreto hay algo en medio. "
                : "The camera viewer overlays the Sun's position on what you are looking at, to check whether anything is in the way from that exact spot. "}
              <Link href={localePath(locale, "/visor")} className="underline">
                {locale === "es" ? "Abrir el visor" : "Open the viewer"}
              </Link>
            </Callout>
            <Callout title={t.safety.title}>{t.safety.body}</Callout>
            <AdSlot name="sidebar" locale={locale} className="hidden lg:flex" />
          </div>
        </div>
      </Section>

      <Section>
        <div className="prose-eclipse max-w-3xl">
          <h2>{locale === "es" ? "Cómo se calcula esto" : "How this is computed"}</h2>
          <p>
            {locale === "es"
              ? "No consultamos una tabla: resolvemos el eclipse para tus coordenadas con los elementos besselianos publicados por la NASA para este eclipse concreto. Por eso funciona en cualquier punto del planeta y no solo en las localidades tabuladas, y por eso la duración cambia si mueves el punto unos kilómetros."
              : "We do not look up a table: we solve the eclipse for your coordinates using the Besselian elements NASA published for this specific eclipse. That is why it works anywhere on the planet rather than only in tabulated towns, and why the duration changes when you move the point a few kilometres."}
          </p>
          <p>
            {locale === "es"
              ? "El cálculo se valida automáticamente contra las duraciones municipales del IGN y contra el punto de máximo eclipse de la NASA antes de cada despliegue. Las diferencias son de uno o dos segundos."
              : "The calculation is validated automatically against Spain's IGN municipal durations and against NASA's point of greatest eclipse before every deployment. Differences are one or two seconds."}
          </p>
          <h2>{locale === "es" ? "Qué hacer con el resultado" : "What to do with the result"}</h2>
          <ul>
            <li>
              {locale === "es"
                ? "Si estás a menos de cinco kilómetros del centro de la franja, no te muevas: lo que ganarías no compensa el riesgo de atasco."
                : "If you are within five kilometres of the centreline, do not move: what you would gain does not justify the risk of traffic."}
            </li>
            <li>
              {locale === "es"
                ? "Si el resultado dice que no hay totalidad, no hay término medio: un 99% no se parece en nada a un 100%. Hay que entrar en la franja."
                : "If the result says no totality, there is no middle ground: 99% is nothing like 100%. You have to get inside the path."}
            </li>
            <li>
              {locale === "es"
                ? "Apunta la altura y el azimut: te dicen hacia dónde mirar y si algún edificio o monte te va a tapar."
                : "Note the altitude and azimuth: they tell you where to look and whether a building or hill will block you."}
            </li>
          </ul>
        </div>
      </Section>

      <AdSection name="footer" locale={locale} />
    </>
  );
}
