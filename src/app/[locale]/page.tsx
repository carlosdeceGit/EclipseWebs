import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { Countdown } from "@/components/Countdown";
import { Badge, Callout, Card, DataRow, Section } from "@/components/ui";
import { citiesByTotality, cityName, formatDuration } from "@/lib/eclipse/cities";
import { ECLIPSE } from "@/lib/eclipse/event";
import { buildMetadata, cityGraph, datasetGraph, faqGraph, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";
import { HOME_FAQ } from "@/content/faq";
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
  const duration = formatDuration(city.eclipse.totalitySeconds, locale);

  return buildMetadata({
    tenant,
    city,
    locale,
    path: "/",
    title:
      locale === "es"
        ? `Eclipse solar total en ${name} — 2 de agosto de 2027`
        : `Total solar eclipse in ${name} — 2 August 2027`,
    description:
      locale === "es"
        ? city.eclipse.isTotal
          ? `${name} verá ${duration} de totalidad el 2 de agosto de 2027, de ${city.localTimes.totalityStart} a ${city.localTimes.totalityEnd}. Horarios exactos, miradores, alojamiento, eventos y directorio.`
          : `El 2 de agosto de 2027 se verá un eclipse parcial desde ${name}, con el ${(city.eclipse.obscuration * 100).toFixed(0)}% del Sol cubierto. Dónde ir para ver la totalidad.`
        : city.eclipse.isTotal
          ? `${name} sees ${duration} of totality on 2 August 2027, from ${city.localTimes.totalityStart} to ${city.localTimes.totalityEnd}. Exact timings, viewpoints, accommodation, events and directory.`
          : `On 2 August 2027 ${name} sees a partial eclipse with ${(city.eclipse.obscuration * 100).toFixed(0)}% of the Sun covered. Where to go for totality.`,
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const t = getDictionary(locale);
  const name = cityName(city, locale);
  const duration = formatDuration(city.eclipse.totalitySeconds, locale);
  const ranking = citiesByTotality().slice(0, 10);
  const faq = HOME_FAQ[locale];

  const planCards: [string, string, string][] =
    locale === "es"
      ? [
          ["/localizador", "Localizador", "Tus horas exactas en tus coordenadas, no las del centro del pueblo."],
          ["/horarios", "Horarios minuto a minuto", "Los cinco contactos, la hora del máximo y cuánto dura cada fase."],
          ["/donde-verlo", "Dónde verlo", "Cómo elegir el punto: horizonte, altura, accesos y salida."],
          ["/alojamiento", "Alojamiento", "Qué queda libre, qué precios esperar y por qué reservar ya."],
          ["/eventos", "Eventos y observaciones", "Actividades de agrupaciones astronómicas y ayuntamientos."],
          ["/como-llegar", "Cómo llegar", "Ferris, aeropuertos, carreteras y el atasco previsible del día 2."],
          ["/clima", "Probabilidad de cielo despejado", "Qué dice la climatología de agosto y el efecto del levante."],
          ["/seguridad", "Seguridad ocular", "Filtros certificados, cómo comprobarlos y cuándo quitárselos."],
          ["/gafas-de-eclipse", "Gafas de eclipse", "Qué certificación exige España y cómo detectar una falsificación."],
          ["/fotografia", "Fotografiar el eclipse", "Filtros, ajustes y la lista de tomas que da tiempo a hacer."],
          ["/directorio", "Directorio de negocios", "Hoteles, restaurantes y servicios de la ciudad."],
          ["/fuentes", "Fuentes y metodología", "Cómo calculamos las horas y contra qué las validamos."],
        ]
      : [
          ["/localizador", "Locator", "Your exact timings at your coordinates, not the town centre's."],
          ["/horarios", "Minute-by-minute timings", "The five contacts, maximum eclipse and how long each phase lasts."],
          ["/donde-verlo", "Where to watch", "Choosing a spot: horizon, height, access and getting out."],
          ["/alojamiento", "Where to stay", "What is left, what prices to expect and why to book now."],
          ["/eventos", "Events and public viewings", "Activities from astronomy societies and councils."],
          ["/como-llegar", "Getting there", "Ferries, airports, roads and the traffic to expect."],
          ["/clima", "Chance of clear skies", "What August climatology says and the levante effect."],
          ["/seguridad", "Eye safety", "Certified filters, how to check them and when to remove them."],
          ["/gafas-de-eclipse", "Eclipse glasses", "What certification the EU requires and how to spot a fake."],
          ["/fotografia", "Photographing it", "Filters, settings and the shots you actually have time for."],
          ["/directorio", "Business directory", "Hotels, restaurants and services in the city."],
          ["/fuentes", "Sources and method", "How we compute the timings and what we validate against."],
        ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(cityGraph(tenant, city, locale))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqGraph(faq))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(datasetGraph(tenant, locale))} />

      <section className="mx-auto max-w-6xl px-4 pb-4 pt-12 sm:pt-16">
        <Badge>{t.home.badge}</Badge>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
          {locale === "es" ? "Eclipse solar total" : "Total solar eclipse"}
          <br />
          {locale === "es" ? `en ${name}` : `in ${name}`}
        </h1>

        {/*
          El primer párrafo es el que copian los motores generativos, así que carga
          los datos duros por delante: qué, dónde, cuándo y cuánto dura.
        */}
        <p className="mt-5 max-w-2xl text-lg" style={{ color: "hsl(var(--muted))" }}>
          {locale === "es" ? (
            city.eclipse.isTotal ? (
              <>
                El <strong style={{ color: "hsl(var(--text))" }}>lunes 2 de agosto de 2027</strong> la
                Luna tapará por completo el Sol sobre {name} durante{" "}
                <strong style={{ color: "hsl(var(--text))" }}>{duration}</strong>, entre las{" "}
                <strong style={{ color: "hsl(var(--text))" }}>{city.localTimes.totalityStart}</strong> y
                las <strong style={{ color: "hsl(var(--text))" }}>{city.localTimes.totalityEnd}</strong>{" "}
                hora local, con el Sol a {city.eclipse.sunAltitudeDeg.toFixed(0)}° sobre el horizonte.{" "}
                {city.hook.es}
              </>
            ) : (
              <>
                El <strong style={{ color: "hsl(var(--text))" }}>lunes 2 de agosto de 2027</strong> se
                verá desde {name} un eclipse parcial, con un máximo del{" "}
                <strong style={{ color: "hsl(var(--text))" }}>
                  {(city.eclipse.obscuration * 100).toFixed(0)}%
                </strong>{" "}
                del disco solar cubierto a las{" "}
                <strong style={{ color: "hsl(var(--text))" }}>{city.localTimes.maximum}</strong>. {city.hook.es}
              </>
            )
          ) : city.eclipse.isTotal ? (
            <>
              On <strong style={{ color: "hsl(var(--text))" }}>Monday 2 August 2027</strong> the Moon
              will completely cover the Sun over {name} for{" "}
              <strong style={{ color: "hsl(var(--text))" }}>{duration}</strong>, between{" "}
              <strong style={{ color: "hsl(var(--text))" }}>{city.localTimes.totalityStart}</strong> and{" "}
              <strong style={{ color: "hsl(var(--text))" }}>{city.localTimes.totalityEnd}</strong> local
              time, with the Sun {city.eclipse.sunAltitudeDeg.toFixed(0)}° above the horizon. {city.hook.en}
            </>
          ) : (
            <>
              On <strong style={{ color: "hsl(var(--text))" }}>Monday 2 August 2027</strong> {name} will
              see a partial eclipse, peaking at{" "}
              <strong style={{ color: "hsl(var(--text))" }}>
                {(city.eclipse.obscuration * 100).toFixed(0)}%
              </strong>{" "}
              of the solar disc covered at{" "}
              <strong style={{ color: "hsl(var(--text))" }}>{city.localTimes.maximum}</strong>. {city.hook.en}
            </>
          )}
        </p>

        <div className="mt-8 max-w-xl">
          <Countdown labels={t.countdown} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={localePath(locale, "/horarios")}
            className="rounded-xl px-5 py-3 font-semibold"
            style={{ background: "hsl(var(--accent))", color: "hsl(224 44% 8%)" }}
          >
            {t.home.ctaTimes}
          </Link>
          <Link
            href={localePath(locale, "/localizador")}
            className="rounded-xl border px-5 py-3 font-semibold"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            {t.home.ctaWhere}
          </Link>
        </div>
      </section>

      <Section>
        <AdSlot name="header" locale={locale} />
      </Section>

      <Section title={t.home.dataTitle(name)}>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <dl>
              <DataRow label={t.data.date} value={t.data.dateValue} locale={locale} />
              <DataRow
                label={t.data.totality}
                value={city.eclipse.isTotal ? t.data.yesInPath : t.data.noPartialOnly}
                locale={locale}
              />
              <DataRow label={t.data.duration} value={duration} locale={locale} />
              <DataRow label={t.data.partialStart} value={city.localTimes.partialStart} note={t.common.localTime} locale={locale} />
              <DataRow label={t.data.totalityStart} value={city.localTimes.totalityStart} note={t.common.localTime} locale={locale} />
              <DataRow label={t.data.maximum} value={city.localTimes.maximum} note={t.common.localTime} locale={locale} />
              <DataRow label={t.data.totalityEnd} value={city.localTimes.totalityEnd} note={t.common.localTime} locale={locale} />
              <DataRow label={t.data.partialEnd} value={city.localTimes.partialEnd} note={t.common.localTime} locale={locale} />
              <DataRow label={t.data.sunAltitude} value={`${city.eclipse.sunAltitudeDeg.toFixed(1)}°`} locale={locale} />
              <DataRow label={t.data.sunAzimuth} value={`${city.eclipse.sunAzimuthDeg.toFixed(0)}°`} locale={locale} />
              <DataRow label={t.data.magnitude} value={city.eclipse.magnitude.toFixed(3)} locale={locale} />
              <DataRow
                label={t.data.obscuration}
                value={`${(city.eclipse.obscuration * 100).toFixed(1)}%`}
                locale={locale}
              />
              <DataRow label={t.data.coordinates} value={`${city.lat.toFixed(4)}, ${city.lon.toFixed(4)}`} locale={locale} />
            </dl>
            <p className="mt-4 text-xs" style={{ color: "hsl(var(--muted))" }}>
              {locale === "es"
                ? "Calculado con elementos besselianos de la NASA y validado contra las tablas del IGN."
                : "Computed from NASA Besselian elements and validated against Spain's IGN tables."}{" "}
              <Link href={localePath(locale, "/fuentes")} className="underline">
                {t.common.sources}
              </Link>
            </p>
          </Card>

          <div className="space-y-6">
            <Callout title={t.safety.title}>
              {t.safety.body}{" "}
              <Link href={localePath(locale, "/seguridad")} className="underline">
                {t.safety.link}
              </Link>
            </Callout>
            <AdSlot name="sidebar" locale={locale} className="hidden lg:flex" />
          </div>
        </div>
      </Section>

      <Section title={t.home.rankingTitle} lead={t.home.rankingLead}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr style={{ color: "hsl(var(--muted))" }}>
                <th className="pb-3 font-medium">{t.data.locality}</th>
                <th className="pb-3 font-medium">{t.data.province}</th>
                <th className="pb-3 font-medium">{t.data.totalityStart.replace(/^C2 · /, "")}</th>
                <th className="pb-3 text-right font-medium">{t.data.duration}</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((c) => (
                <tr key={c.slug} className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="py-3 font-semibold">
                    <Link href={localePath(locale, `/ciudades/${c.slug}`)} className="hover:underline">
                      {cityName(c, locale)}
                    </Link>
                    {c.slug === city.slug && (
                      <span className="ml-2">
                        <Badge>{t.common.youAreHere}</Badge>
                      </span>
                    )}
                  </td>
                  <td className="py-3" style={{ color: "hsl(var(--muted))" }}>
                    {c.province}
                  </td>
                  <td className="py-3 tabular-nums" style={{ color: "hsl(var(--muted))" }}>
                    {c.localTimes.totalityStart}
                  </td>
                  <td className="py-3 text-right font-semibold tabular-nums">
                    {formatDuration(c.eclipse.totalitySeconds, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          <Link href={localePath(locale, "/ciudades")} className="underline" style={{ color: "hsl(var(--accent))" }}>
            {t.common.viewAllLocalities}
          </Link>
        </p>
      </Section>

      <Section>
        <AdSlot name="inArticle" locale={locale} />
      </Section>

      <Section title={t.home.planTitle}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {planCards.map(([href, title, desc]) => (
            <Link key={href} href={localePath(locale, href)}>
              <Card className="h-full transition hover:brightness-125">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm" style={{ color: "hsl(var(--muted))" }}>
                  {desc}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Section title={t.home.faqTitle}>
        <div className="space-y-3">
          {faq.map((item) => (
            <details
              key={item.q}
              className="rounded-2xl border p-5"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface))" }}
            >
              <summary className="cursor-pointer font-semibold">{item.q}</summary>
              <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Section>

      <Section>
        <AdSlot name="footer" locale={locale} />
      </Section>
    </>
  );
}
