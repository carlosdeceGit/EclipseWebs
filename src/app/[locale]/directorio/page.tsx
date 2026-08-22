import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSection } from "@/components/AdSlot";
import { EventCard } from "@/components/EventCard";
import { ListingCard } from "@/components/ListingCard";
import { Badge, Callout, Card, PageHeader, Section, buttonStyle } from "@/components/ui";
import { DIRECTORY_CATEGORIES, getListings, type Listing } from "@/lib/db/listings";
import { getEvents, type EclipseEvent } from "@/lib/db/events";
import { buildMetadata } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";
import { cityName } from "@/lib/eclipse/cities";
import { isLocale, localePath } from "@/i18n/config";
import type { Locale } from "@/lib/eclipse/types";

export const revalidate = 600;

/**
 * Filtros del directorio.
 *
 * `eventos` no es una categoría de la tabla de anuncios: es una pestaña que lee
 * la tabla de actos, que hasta ahora no la leía ninguna página de la web. Se
 * presenta junto a las demás porque para quien busca «qué hago en la ciudad»
 * un hotel, una ruta guiada y una observación pública son la misma pregunta.
 */
const EVENTS_FILTER = "eventos";

const COPY = {
  es: {
    h1: (city: string) => `Qué hay en ${city} para el eclipse`,
    lead: "Alojamiento, eventos y actividades de la ciudad para los días del eclipse. El alta básica es gratuita y todo pasa por revisión manual antes de publicarse.",
    title: (city: string) => `Alojamiento, eventos y actividades para el eclipse en ${city}`,
    description: (city: string) =>
      `Dónde dormir, qué observaciones y actividades hay y qué negocios de ${city} están preparados para el eclipse del 2 de agosto de 2027. Alta gratuita.`,
    all: "Todo",
    events: "Eventos y observaciones",
    publish: "Publica lo tuyo",
    publishHint: "Gratis, revisado a mano y publicado en unas horas.",
    sectionStay: "Dónde dormir",
    sectionEvents: "Agenda de la ciudad",
    sectionDo: "Qué hacer",
    sectionRest: "Otros negocios",
    seeAllEvents: "Ver la agenda completa",
    emptyTitle: "Abierto y todavía vacío",
    emptyBody: (city: string) =>
      `Estamos dando de alta lo primero de ${city}. Si tienes un alojamiento, organizas una observación o montas cualquier actividad útil para quien venga al eclipse, ser de los primeros tiene premio: llevas casi un año de ventaja para posicionar tu ficha.`,
    emptyEvents: (city: string) =>
      `Todavía no hay actos publicados en ${city}. Se irán llenando conforme los ayuntamientos y las agrupaciones astronómicas cierren sus programas — y si organizas uno, puedes darlo de alta ya.`,
    publishEvent: "Publicar un evento",
    publishStay: "Dar de alta un alojamiento",
    faqTitle: "¿Dudas antes de venir?",
    faqBody:
      "Las preguntas que llegan una y otra vez —a qué hora hay que estar, si hacen falta gafas, qué pasa si hay nubes, dónde aparcar— están respondidas juntas y en corto.",
    faqLink: "Ver las preguntas frecuentes",
    whyTitle: "El 2 de agosto de 2027 llegan visitantes que no volverán",
    whyBody:
      "La franja de totalidad es estrecha y el eclipse dura minutos, pero la gente se queda días. Aparecer donde buscan alojamiento, comida y actividades es la diferencia entre vivir el eclipse y facturarlo.",
    tierTitle: "Ficha básica",
    tierBody: "Nombre, categoría, contacto y enlace a tu web. Sin coste ni permanencia.",
    tierLink: "Ver niveles y precios",
  },
  en: {
    h1: (city: string) => `What is on in ${city} for the eclipse`,
    lead: "Accommodation, events and activities in the city for the eclipse days. Basic listings are free and everything is reviewed by hand before publication.",
    title: (city: string) => `Accommodation, events and activities for the eclipse in ${city}`,
    description: (city: string) =>
      `Where to stay, which public viewings and activities are on, and which businesses in ${city} are ready for the 2 August 2027 eclipse. Free listing.`,
    all: "Everything",
    events: "Events and viewings",
    publish: "List yours",
    publishHint: "Free, reviewed by hand and published within hours.",
    sectionStay: "Where to sleep",
    sectionEvents: "City agenda",
    sectionDo: "What to do",
    sectionRest: "Other businesses",
    seeAllEvents: "See the full agenda",
    emptyTitle: "Open and still empty",
    emptyBody: (city: string) =>
      `We are adding the first entries in ${city}. If you have accommodation, are running a public viewing or organising any activity useful to eclipse visitors, being early pays: you get almost a year's head start on ranking.`,
    emptyEvents: (city: string) =>
      `No events published in ${city} yet. They will fill up as councils and astronomy societies close their programmes — and if you are organising one, you can add it now.`,
    publishEvent: "List an event",
    publishStay: "List accommodation",
    faqTitle: "Questions before you come?",
    faqBody:
      "The questions that come up again and again — what time to be there, whether glasses are needed, what happens if it is cloudy, where to park — are answered together and briefly.",
    faqLink: "See the FAQ",
    whyTitle: "On 2 August 2027 visitors arrive who will not return",
    whyBody:
      "The path is narrow and the eclipse lasts minutes, but people stay for days. Appearing where they search for accommodation, food and activities is the difference between watching the eclipse and earning from it.",
    tierTitle: "Basic listing",
    tierBody: "Name, category, contact details and a link to your site. No cost, no commitment.",
    tierLink: "See tiers and prices",
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
  const copy = COPY[locale];

  return buildMetadata({
    tenant,
    city,
    locale,
    path: "/directorio",
    title: copy.title(name),
    description: copy.description(name),
  });
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="tap inline-flex items-center rounded-full border px-3.5 text-sm transition"
      style={{
        borderColor: active ? "hsl(var(--accent))" : "hsl(var(--border))",
        background: active ? "hsl(var(--accent) / 0.15)" : "transparent",
        color: active ? "hsl(var(--accent))" : "hsl(var(--muted))",
      }}
    >
      {children}
    </Link>
  );
}

function Grid({ listings, locale }: { listings: Listing[]; locale: Locale }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((l) => (
        <ListingCard key={l.id} listing={l} locale={locale} />
      ))}
    </div>
  );
}

function EventGrid({
  events,
  locale,
  timeZone,
}: {
  events: EclipseEvent[];
  locale: Locale;
  timeZone: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((e) => (
        <EventCard key={e.id} event={e} locale={locale} timeZone={timeZone} />
      ))}
    </div>
  );
}

export default async function DirectoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cat?: string }>;
}) {
  const { locale } = await params;
  const { cat } = await searchParams;
  if (!isLocale(locale)) notFound();

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const name = cityName(city, locale);
  const copy = COPY[locale];

  const showingEvents = cat === EVENTS_FILTER;
  const base = localePath(locale, "/directorio");

  // Con una categoría concreta solo se pide esa; sin categoría se pide todo y se
  // reparte en secciones, que es lo que convierte un listado plano en algo que se
  // puede recorrer.
  const [listings, events] = await Promise.all([
    showingEvents
      ? Promise.resolve([] as Listing[])
      : getListings({ kind: "directory", citySlug: city.slug, category: cat }),
    getEvents({ citySlug: city.slug, limit: showingEvents ? 50 : 6 }),
  ]);

  const stay = listings.filter((l) => l.category === "alojamiento");
  const doing = listings.filter((l) => l.category === "actividades");
  const rest = listings.filter((l) => l.category !== "alojamiento" && l.category !== "actividades");
  const grouped = !cat;

  return (
    <>
      <PageHeader eyebrow={name} title={copy.h1(name)} lead={copy.lead}>
        <div className="flex flex-wrap gap-3">
          <Link href={localePath(locale, "/publicar")} {...buttonStyle("primary")}>
            {copy.publish}
          </Link>
          <span className="self-center text-sm" style={{ color: "hsl(var(--faint))" }}>
            {copy.publishHint}
          </span>
        </div>
      </PageHeader>

      <Section>
        <div className="mb-8 flex flex-wrap gap-2">
          <Chip href={base} active={!cat}>
            {copy.all}
          </Chip>
          <Chip href={`${base}?cat=${EVENTS_FILTER}`} active={showingEvents}>
            📅 {copy.events}
          </Chip>
          {DIRECTORY_CATEGORIES.map((c) => (
            <Chip key={c.slug} href={`${base}?cat=${c.slug}`} active={cat === c.slug}>
              {c.icon} {c.label[locale]}
            </Chip>
          ))}
        </div>

        {showingEvents ? (
          events.length > 0 ? (
            <EventGrid events={events} locale={locale} timeZone={city.timeZone} />
          ) : (
            <Card>
              <h2 className="font-bold">{copy.emptyTitle}</h2>
              <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
                {copy.emptyEvents(name)}
              </p>
              <Link
                href={`${localePath(locale, "/publicar")}?tipo=evento`}
                {...buttonStyle("primary")}
                className={`${buttonStyle("primary").className} mt-5`}
              >
                {copy.publishEvent}
              </Link>
            </Card>
          )
        ) : grouped ? (
          <div className="space-y-12">
            {stay.length > 0 && (
              <div>
                <h2 className="font-bold" style={{ fontSize: "var(--step-2)" }}>
                  {copy.sectionStay}
                </h2>
                <div className="mt-5">
                  <Grid listings={stay} locale={locale} />
                </div>
              </div>
            )}

            {events.length > 0 && (
              <div>
                <h2 className="font-bold" style={{ fontSize: "var(--step-2)" }}>
                  {copy.sectionEvents}
                </h2>
                <div className="mt-5">
                  <EventGrid events={events} locale={locale} timeZone={city.timeZone} />
                </div>
                <p className="mt-5">
                  <Link
                    href={`${base}?cat=${EVENTS_FILTER}`}
                    className="underline"
                    style={{ color: "hsl(var(--accent))" }}
                  >
                    {copy.seeAllEvents}
                  </Link>
                </p>
              </div>
            )}

            {doing.length > 0 && (
              <div>
                <h2 className="font-bold" style={{ fontSize: "var(--step-2)" }}>
                  {copy.sectionDo}
                </h2>
                <div className="mt-5">
                  <Grid listings={doing} locale={locale} />
                </div>
              </div>
            )}

            {rest.length > 0 && (
              <div>
                <h2 className="font-bold" style={{ fontSize: "var(--step-2)" }}>
                  {copy.sectionRest}
                </h2>
                <div className="mt-5">
                  <Grid listings={rest} locale={locale} />
                </div>
              </div>
            )}

            {listings.length === 0 && events.length === 0 && (
              <Card>
                <h2 className="font-bold">{copy.emptyTitle}</h2>
                <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
                  {copy.emptyBody(name)}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`${localePath(locale, "/publicar")}?tipo=negocio`} {...buttonStyle("primary")}>
                    {copy.publishStay}
                  </Link>
                  <Link href={`${localePath(locale, "/publicar")}?tipo=evento`} {...buttonStyle("ghost")}>
                    {copy.publishEvent}
                  </Link>
                </div>
              </Card>
            )}
          </div>
        ) : listings.length > 0 ? (
          <Grid listings={listings} locale={locale} />
        ) : (
          <Card>
            <h2 className="font-bold">{copy.emptyTitle}</h2>
            <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
              {copy.emptyBody(name)}
            </p>
            <Link
              href={localePath(locale, "/publicar")}
              {...buttonStyle("primary")}
              className={`${buttonStyle("primary").className} mt-5`}
            >
              {copy.publish}
            </Link>
          </Card>
        )}
      </Section>

      <AdSection name="listing" locale={locale} />

      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          <Callout title={copy.whyTitle}>{copy.whyBody}</Callout>

          <Card>
            <div className="flex items-center gap-2">
              <Badge>{locale === "es" ? "Gratis" : "Free"}</Badge>
              <h2 className="font-bold">{copy.tierTitle}</h2>
            </div>
            <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
              {copy.tierBody}
            </p>
            <p className="mt-4 flex flex-col gap-1.5 text-sm">
              <Link
                href={localePath(locale, "/publicar")}
                className="underline"
                style={{ color: "hsl(var(--accent))" }}
              >
                {copy.publish}
              </Link>
              <Link
                href={localePath(locale, "/anunciate")}
                className="underline"
                style={{ color: "hsl(var(--accent))" }}
              >
                {copy.tierLink}
              </Link>
            </p>
          </Card>

          {/* Las preguntas frecuentes, enlazadas desde donde de verdad surgen las
              dudas prácticas: mientras se decide dónde dormir y qué hacer. */}
          <Card>
            <h2 className="font-bold">{copy.faqTitle}</h2>
            <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
              {copy.faqBody}
            </p>
            <p className="mt-4 text-sm">
              <Link href={localePath(locale, "/faq")} className="underline" style={{ color: "hsl(var(--accent))" }}>
                {copy.faqLink}
              </Link>
            </p>
          </Card>
        </div>
      </Section>
    </>
  );
}
