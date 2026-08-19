import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSection, AdSlot } from "@/components/AdSlot";
import { adSlotEnabled } from "@/lib/ads";
import { Countdown } from "@/components/Countdown";
import { EclipseTimeline } from "@/components/EclipseTimeline";
import { HomeLocator, type HomeLocatorLabels, type LocatorFallback } from "@/components/HomeLocator";
import { Badge, Callout, Card, DataRow, Datum, Section, TrustStrip, buttonStyle } from "@/components/ui";
import {
  citiesByTotality,
  cityName,
  formatDuration,
  formatObscuration,
  toLocalTime,
} from "@/lib/eclipse/cities";
import { buildMetadata, cityGraph, datasetGraph, faqGraph, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";
import { HOME_FAQ } from "@/content/faq";
import { editorialArticlesFor } from "@/content/articles";
import { getDictionary } from "@/i18n/dictionary";
import { navGroups } from "@/i18n/navigation";
import { isLocale, localePath } from "@/i18n/config";

/*
  Textos de la portada que no están todavía en el diccionario global.

  Son de esta página y solo de esta página; los que cruzan al widget de cliente
  además no pueden ser funciones. Se suben al diccionario cuando alguno haga
  falta en otro sitio.
*/
const COPY = {
  es: {
    startsLabel: "Empieza la totalidad",
    durationLabel: "Duración",
    coveredLabel: "Disco solar cubierto",
    maximumLabel: "Máximo del eclipse",
    sunAt: (deg: string) => `Sol a ${deg}° sobre el horizonte`,
    trust:
      "Calculado con los elementos besselianos de la NASA y validado contra las tablas del IGN en cada despliegue.",
    trustLink: "Cómo lo calculamos",
    addToCalendar: "Añadir a mi calendario",
    addToCalendarNote:
      "Descarga la cita con las horas de esta ciudad y dos avisos: uno el día antes y otro un cuarto de hora antes del primer contacto.",
    timelineTitle: "Cuánto dura cada fase",
    timelineLead:
      "El eclipse entero dura casi tres horas. La totalidad —el único momento en el que se puede mirar sin filtro— es la astilla naranja.",
    timelineLink: "Los cinco contactos, segundo a segundo",
    safetyTitle: "Antes de nada: los ojos",
    safetyMore: "Guía de seguridad completa",
    glassesMore: "Cómo distinguir unas gafas certificadas",
    dataTitle: "Todos los datos, dato a dato",
    exploreTitle: "Todo lo demás",
    exploreLead: "Agrupado igual que en el menú, para que no haya que buscar dos veces.",
    localTitle: "Solo en esta web",
    locator: {
      eyebrow: "Tu punto exacto",
      title: "¿Y desde donde yo voy a estar?",
      lead: "La duración cambia kilómetro a kilómetro. Estas son las cifras de la ciudad; pulsa y las recalculamos para tus coordenadas exactas.",
      cta: "Calcular en mi ubicación",
      locating: "Localizando…",
      error: "No hemos podido obtener tu ubicación. Puedes introducir las coordenadas a mano en el localizador.",
      showingCity: "Datos de",
      showingYou: "Datos de tu ubicación",
      durationLabel: "Tu totalidad",
      startsLabel: "Empieza a las",
      coveredLabel: "Disco cubierto",
      betterThanCity: "Desde aquí ganas {seconds} s respecto al centro de la ciudad.",
      worseThanCity: "Desde aquí pierdes {seconds} s respecto al centro de la ciudad.",
      sameAsCity: "Prácticamente lo mismo que en el centro de la ciudad.",
      moveAdvice: "Estás a unos {km} km del centro de la franja.",
      onCenterline: "Estás prácticamente en el centro de la franja. No te muevas.",
      noTotality: "Desde aquí no hay totalidad: el Sol no llega a cubrirse del todo.",
      openFull: "Localizador completo",
      openViewer: "¿Me lo tapa un edificio?",
      privacy: "Tus coordenadas se envían para calcular y no se guardan.",
    },
  },
  en: {
    startsLabel: "Totality begins",
    durationLabel: "Duration",
    coveredLabel: "Solar disc covered",
    maximumLabel: "Maximum eclipse",
    sunAt: (deg: string) => `Sun ${deg}° above the horizon`,
    trust:
      "Computed from NASA Besselian elements and validated against Spain's IGN tables on every deploy.",
    trustLink: "How we compute it",
    addToCalendar: "Add to my calendar",
    addToCalendarNote:
      "Downloads the event with this city's timings and two alerts: one the day before and one a quarter of an hour before first contact.",
    timelineTitle: "How long each phase lasts",
    timelineLead:
      "The whole eclipse runs for almost three hours. Totality — the only moment you can look without a filter — is the orange sliver.",
    timelineLink: "The five contacts, second by second",
    safetyTitle: "First things first: your eyes",
    safetyMore: "Full safety guide",
    glassesMore: "How to tell certified glasses apart",
    dataTitle: "Every figure, one by one",
    exploreTitle: "Everything else",
    exploreLead: "Grouped exactly as in the menu, so nothing has to be looked for twice.",
    localTitle: "Only on this site",
    locator: {
      eyebrow: "Your exact spot",
      title: "And from where I will actually be?",
      lead: "Length changes kilometre by kilometre. These are the city's figures; tap and we recompute them for your exact coordinates.",
      cta: "Compute at my location",
      locating: "Locating…",
      error: "We could not get your location. You can enter coordinates by hand in the locator.",
      showingCity: "Figures for",
      showingYou: "Figures for your location",
      durationLabel: "Your totality",
      startsLabel: "Begins at",
      coveredLabel: "Disc covered",
      betterThanCity: "From here you gain {seconds} s over the city centre.",
      worseThanCity: "From here you lose {seconds} s against the city centre.",
      sameAsCity: "Practically the same as the city centre.",
      moveAdvice: "You are about {km} km from the centre of the path.",
      onCenterline: "You are practically on the centre line. Do not move.",
      noTotality: "There is no totality from here: the Sun is never fully covered.",
      openFull: "Full locator",
      openViewer: "Will a building block it?",
      privacy: "Your coordinates are sent to compute and are not stored.",
    },
  },
} as const;

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
          : `El 2 de agosto de 2027 se verá un eclipse parcial desde ${name}, con el ${formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)} del Sol cubierto. Dónde ir para ver la totalidad.`
        : city.eclipse.isTotal
          ? `${name} sees ${duration} of totality on 2 August 2027, from ${city.localTimes.totalityStart} to ${city.localTimes.totalityEnd}. Exact timings, viewpoints, accommodation, events and directory.`
          : `On 2 August 2027 ${name} sees a partial eclipse with ${formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)} of the Sun covered. Where to go for totality.`,
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const t = getDictionary(locale);
  const copy = COPY[locale];
  const name = cityName(city, locale);
  const duration = formatDuration(city.eclipse.totalitySeconds, locale);
  const ranking = citiesByTotality().slice(0, 10);
  const faq = HOME_FAQ[locale];

  // Sin segundos: en un titular, los segundos de la hora de contacto son ruido.
  // La cifra al segundo está en la tabla de datos y en /horarios.
  const startShort =
    toLocalTime(city.eclipse.totalityStart ?? city.eclipse.maximum, city.timeZone, false) ??
    city.localTimes.maximum;

  /*
    Las guías exclusivas de esta ciudad van las primeras: son las que este dominio
    tiene y ningún otro de la red, así que son también el enlace interno que más
    conviene reforzar. Sin ellas aquí serían páginas huérfanas.
  */
  const localCards: [string, string, string][] = editorialArticlesFor(city.slug)
    .filter((a) => a.cities)
    .map((a) => {
      const content = a.content[locale](city, tenant);
      return [`/${a.slug}`, content.shortTitle ?? content.title, content.description];
    });

  const fallback: LocatorFallback = {
    cityName: name,
    isTotal: city.eclipse.isTotal,
    duration: duration ?? "",
    totalitySeconds: city.eclipse.totalitySeconds,
    obscuration: formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal),
    totalityStart: city.localTimes.totalityStart,
    maximum: city.localTimes.maximum,
  };

  const locatorLabels: HomeLocatorLabels = { ...copy.locator };
  const hasSidebarAd = adSlotEnabled("sidebar");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(cityGraph(tenant, city, locale))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqGraph(faq))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(datasetGraph(tenant, locale))} />

      {/*
        Portada.

        El orden es deliberado y responde a la escalera de preguntas con la que
        llega quien busca este eclipse: cuándo pasa, cuánto dura, desde dónde lo
        veo yo y qué necesito para no hacerme daño. Las cifras van **por delante**
        de la prosa: en móvil, el párrafo de datos duros ocupaba seis líneas antes
        del primer número.
      */}
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-10 sm:pt-14">
        <Badge>{t.home.badge}</Badge>

        <h1 className="mt-4 font-black" style={{ fontSize: "var(--step-4)", lineHeight: 1.02 }}>
          {locale === "es" ? "Eclipse solar total" : "Total solar eclipse"}
          <br />
          <span style={{ color: "hsl(var(--accent))" }}>
            {locale === "es" ? `en ${name}` : `in ${name}`}
          </span>
        </h1>

        {/* Las tres cifras que trae buscando todo el mundo, en el tamaño que les
            corresponde por importancia. */}
        <div className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {city.eclipse.isTotal && duration ? (
            <>
              <Datum label={copy.startsLabel} value={startShort} note={t.common.localTime} />
              <Datum label={copy.durationLabel} value={duration} />
              <Datum
                label={copy.coveredLabel}
                value={formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)}
                note={copy.sunAt(city.eclipse.sunAltitudeDeg.toFixed(0))}
              />
            </>
          ) : (
            <>
              <Datum label={copy.maximumLabel} value={city.localTimes.maximum} note={t.common.localTime} />
              <Datum
                label={copy.coveredLabel}
                value={formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)}
                note={copy.sunAt(city.eclipse.sunAltitudeDeg.toFixed(0))}
              />
            </>
          )}
        </div>

        <div className="mt-7">
          <TrustStrip>
            {copy.trust}{" "}
            <Link href={localePath(locale, "/fuentes")} className="underline" style={{ color: "hsl(var(--muted))" }}>
              {copy.trustLink}
            </Link>
          </TrustStrip>
        </div>

        {/*
          El primer párrafo es el que copian los motores generativos, así que
          carga los datos duros por delante: qué, dónde, cuándo y cuánto dura.
          Sigue estando arriba, pero ya no es lo primero que se ve.
        */}
        <p className="mt-6 max-w-3xl" style={{ color: "hsl(var(--muted))", fontSize: "var(--step-1)" }}>
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
                  {formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)}
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
                {formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)}
              </strong>{" "}
              of the solar disc covered at{" "}
              <strong style={{ color: "hsl(var(--text))" }}>{city.localTimes.maximum}</strong>. {city.hook.en}
            </>
          )}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href={localePath(locale, "/horarios")} {...buttonStyle("primary")}>
            {t.home.ctaTimes}
          </Link>
          {/*
            El .ics es el único gancho de retención que no depende de una lista de
            correo: quien entra hoy no vuelve solo dentro de once meses, pero su
            teléfono sí le avisa. Va sin `next/link` a propósito: es una descarga,
            no una navegación de cliente.
          */}
          <a href={`/calendar.ics?lang=${locale}`} download {...buttonStyle("ghost")}>
            {copy.addToCalendar}
          </a>
        </div>

        <p className="mt-3 text-xs" style={{ color: "hsl(var(--faint))" }}>
          {copy.addToCalendarNote}
        </p>

        <div className="mt-8 max-w-xl">
          <Countdown labels={t.countdown} variant="inline" />
        </div>
      </section>

      {/* Cuánto dura cada fase, dibujado a escala. Va inmediatamente después del
          hero porque responde con una imagen la pregunta más buscada. */}
      <Section title={copy.timelineTitle} lead={copy.timelineLead}>
        <div className="max-w-4xl">
          <EclipseTimeline city={city} locale={locale} />
          <p className="mt-5">
            <Link
              href={localePath(locale, "/horarios")}
              className="underline"
              style={{ color: "hsl(var(--accent))" }}
            >
              {copy.timelineLink}
            </Link>
          </p>
        </div>
      </Section>

      {/*
        El localizador, embebido y en el primer scroll. Es la pregunta que ninguna
        otra web española del eclipse responde, y hasta ahora vivía detrás de un
        enlace ciego entre otras once tarjetas iguales.
      */}
      <Section tone="feature">
        <HomeLocator
          locale={locale}
          fallback={fallback}
          labels={locatorLabels}
          fullHref={localePath(locale, "/localizador")}
          viewerHref={localePath(locale, "/visor")}
        />
      </Section>

      {/*
        Seguridad ocular, arriba y en rojo.

        En el eclipse de 2024, «my eyes hurt» fue tendencia el día siguiente. Un
        consejo que llega en la posición nueve llega tarde: aquí va antes que el
        alojamiento, que los eventos y que cualquier anuncio.
      */}
      <Section title={copy.safetyTitle}>
        <div className="grid gap-5 lg:grid-cols-2">
          <Callout title={t.safety.title} tone="danger">
            {t.safety.body}
          </Callout>
          <div className="flex flex-col justify-center gap-3">
            <Link href={localePath(locale, "/seguridad")} {...buttonStyle("ghost")}>
              {copy.safetyMore}
            </Link>
            <Link href={localePath(locale, "/gafas-de-eclipse")} {...buttonStyle("ghost")}>
              {copy.glassesMore}
            </Link>
          </div>
        </div>
      </Section>

      {/* El primer anuncio no aparece hasta aquí: por delante van las respuestas,
          no el inventario. */}
      <AdSection name="header" locale={locale} />

      {/*
        La columna lateral solo existe si hay anuncio que servir. La regla del
        proyecto es que un hueco sin configurar no se dibuja; con una rejilla de
        tres columnas fija, el hueco desaparecía pero la columna vacía se quedaba
        y la tarjeta de datos se veía descentrada sin motivo.
      */}
      <Section title={copy.dataTitle}>
        <div className={`grid gap-6 ${hasSidebarAd ? "lg:grid-cols-3" : ""}`}>
          <Card className={hasSidebarAd ? "lg:col-span-2" : ""}>
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
                value={formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)}
                locale={locale}
              />
              <DataRow label={t.data.coordinates} value={`${city.lat.toFixed(4)}, ${city.lon.toFixed(4)}`} locale={locale} />
            </dl>
            <p className="mt-4 text-xs" style={{ color: "hsl(var(--faint))" }}>
              {copy.trust}{" "}
              <Link href={localePath(locale, "/fuentes")} className="underline">
                {t.common.sources}
              </Link>
            </p>
          </Card>

          {hasSidebarAd && (
            <div className="space-y-6">
              <AdSlot name="sidebar" locale={locale} className="hidden lg:flex" />
            </div>
          )}
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
                  <td className="num py-3" style={{ color: "hsl(var(--muted))" }}>
                    {c.localTimes.totalityStart}
                  </td>
                  <td className="num py-3 text-right font-semibold">
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

      <AdSection name="inArticle" locale={locale} />

      {/* Las guías exclusivas del dominio, destacadas y con su propio titular: son
          lo que esta web tiene y las demás de la red no. */}
      {localCards.length > 0 && (
        <Section title={copy.localTitle}>
          <div className="grid gap-4 sm:grid-cols-2">
            {localCards.map(([href, title, desc]) => (
              <Link key={href} href={localePath(locale, href)}>
                <Card interactive className="h-full">
                  <h3 className="font-semibold" style={{ fontSize: "var(--step-1)" }}>
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm" style={{ color: "hsl(var(--muted))" }}>
                    {desc}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/*
        El resto del contenido, agrupado igual que en el menú.

        Antes eran doce tarjetas idénticas: una parrilla homogénea comunica «todo
        importa lo mismo», que es justo lo contrario de lo que queremos decir.
        Aquí las herramientas ya han tenido su sección propia y esto es el índice.
      */}
      <Section title={copy.exploreTitle} lead={copy.exploreLead}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {navGroups(locale).map((group) => (
            <div key={group.id}>
              <h3 className="datum-label" style={{ color: "hsl(var(--accent))" }}>
                {group.label}
              </h3>
              <ul className="mt-3 space-y-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={localePath(locale, item.href)} className="group block">
                      <span className="font-semibold group-hover:underline">{item.label}</span>
                      {item.hint && (
                        <span className="mt-0.5 block text-sm" style={{ color: "hsl(var(--muted))" }}>
                          {item.hint}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t.home.faqTitle}>
        <div className="space-y-3">
          {faq.map((item) => (
            <details
              key={item.q}
              className="card-interactive rounded-2xl border p-5"
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

      <AdSection name="footer" locale={locale} />
    </>
  );
}
