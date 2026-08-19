import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Callout, Card, PageHeader, Section } from "@/components/ui";
import { PublishForm } from "./PublishForm";
import type { PublishKind } from "./actions";
import { cityName } from "@/lib/eclipse/cities";
import { breadcrumbGraph, buildMetadata, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";
import { OWN_AD_PRICING } from "@/lib/ads";
import { isLocale, localePath } from "@/i18n/config";

const COPY = {
  es: {
    h1: "Publica lo tuyo",
    lead: (city: string) =>
      `Si tienes un alojamiento, organizas una observación o montas una actividad para el eclipse en ${city}, puedes darlo de alta aquí. El alta básica es gratuita, la revisamos a mano y se publica en el directorio de la ciudad.`,
    title: (city: string) => `Publica tu alojamiento, evento o actividad en ${city}`,
    description: (city: string) =>
      `Da de alta gratis tu alojamiento, tu evento o tu actividad para el eclipse del 2 de agosto de 2027 en ${city}. Revisión manual y publicación en el directorio de la ciudad.`,
    whyTitle: "Por qué merece la pena",
    why: [
      "Quien llega a esta web ya ha decidido venir a ver el eclipse: busca dónde dormir, dónde comer y qué hacer esos días. No hay que convencerle de nada.",
      "El directorio se ordena por cercanía al eclipse, no por puja: una ficha gratuita aparece igual que las demás en su categoría.",
      "Es una audiencia con fecha de caducidad. El 3 de agosto de 2027 se acaba, así que cuanto antes esté publicado, más días trabaja.",
    ],
    rulesTitle: "Qué revisamos antes de publicar",
    rules: [
      "Que el negocio, el alojamiento o el acto exista de verdad y esté donde dice estar.",
      "Que haya un contacto que funcione: si nadie responde, la ficha no sirve a nadie.",
      "Que los eventos traigan un enlace comprobable. Es la misma regla que se le exige al agente que rellena la agenda solo.",
      "Que no se venda material de observación sin certificación europea. Esa no se negocia.",
    ],
    payTitle: "¿Y si quiero destacar?",
    payLead:
      "La ficha básica es gratis y no caduca. Destacar o patrocinar una ciudad es opcional y tiene precio cerrado.",
    payLink: "Ver precios y qué incluye cada nivel",
    dirLink: "Ver el directorio de la ciudad",
    safetyTitle: "Si vendes gafas de eclipse, léete esto antes",
    safetyBody:
      "En España unas gafas de eclipse son un EPI de categoría II: necesitan marcado CE respaldado por un certificado de examen UE de tipo de un organismo notificado. «ISO 12312-2» a secas no basta. Rechazamos las fichas que anuncien filtros sin ese respaldo, aunque el producto se venda en cualquier sitio.",
    safetyLink: "Qué certificación exige España",
  },
  en: {
    h1: "List yours",
    lead: (city: string) =>
      `If you have somewhere to stay, are running a public viewing or organising an activity for the eclipse in ${city}, you can add it here. Basic listings are free, reviewed by hand and published in the city directory.`,
    title: (city: string) => `List your accommodation, event or activity in ${city}`,
    description: (city: string) =>
      `Add your accommodation, event or activity for the 2 August 2027 eclipse in ${city} for free. Reviewed by hand and published in the city directory.`,
    whyTitle: "Why it is worth it",
    why: [
      "People who reach this site have already decided to come and see the eclipse: they are looking for where to sleep, where to eat and what to do. Nobody needs convincing.",
      "The directory is ordered by relevance to the eclipse, not by bidding: a free listing sits alongside the rest in its category.",
      "This audience has an expiry date. It ends on 3 August 2027, so the sooner it is published, the more days it works.",
    ],
    rulesTitle: "What we check before publishing",
    rules: [
      "That the business, the accommodation or the event actually exists and is where it says it is.",
      "That there is a contact that works: if nobody answers, the listing helps no one.",
      "That events come with a checkable link. It is the same rule the agent that fills the agenda has to follow.",
      "That no observing gear is sold without European certification. That one is not negotiable.",
    ],
    payTitle: "What if I want to stand out?",
    payLead:
      "The basic listing is free and does not expire. Featuring or sponsoring a city is optional and has a fixed price.",
    payLink: "See prices and what each tier includes",
    dirLink: "See the city directory",
    safetyTitle: "If you sell eclipse glasses, read this first",
    safetyBody:
      "In Spain eclipse glasses are category II PPE: they need CE marking backed by an EU type-examination certificate from a notified body. «ISO 12312-2» on its own is not enough. We reject listings advertising filters without that backing, however widely the product is sold.",
    safetyLink: "What certification Spain requires",
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
    path: "/publicar",
    title: copy.title(name),
    description: copy.description(name),
  });
}

/** El tipo puede venir preseleccionado desde el directorio o desde la home. */
function parseKind(value: string | undefined): PublishKind {
  return value === "evento" || value === "particular" ? value : "negocio";
}

export default async function PublishPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { locale } = await params;
  const { tipo } = await searchParams;
  if (!isLocale(locale)) notFound();

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const name = cityName(city, locale);
  const copy = COPY[locale];
  const free = OWN_AD_PRICING[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbGraph(tenant, locale, [
            { name: tenant.brand, path: "/" },
            { name: copy.h1, path: "/publicar" },
          ]),
        )}
      />

      <PageHeader eyebrow={name} title={copy.h1} lead={copy.lead(name)} />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div>
            <PublishForm locale={locale} initialKind={parseKind(tipo)} />
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="font-semibold">{copy.whyTitle}</h2>
              <ul className="mt-3 space-y-3 text-sm" style={{ color: "hsl(var(--muted))" }}>
                {copy.why.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>

            <Card>
              <h2 className="font-semibold">{copy.rulesTitle}</h2>
              <ul className="mt-3 space-y-3 text-sm" style={{ color: "hsl(var(--muted))" }}>
                {copy.rules.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>

            {/*
              La advertencia sobre las gafas va aquí y no solo en la guía: es el
              punto exacto en el que alguien podría dar de alta una ficha para
              vender filtros sin certificar, y avisarlo después ya es tarde.
            */}
            <Callout title={copy.safetyTitle} tone="danger">
              {copy.safetyBody}{" "}
              <Link href={localePath(locale, "/gafas-de-eclipse")} className="underline">
                {copy.safetyLink}
              </Link>
            </Callout>

            <Card>
              <h2 className="font-semibold">{copy.payTitle}</h2>
              <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
                {copy.payLead} {free.name[locale]}: {free.period[locale]}.
              </p>
              <p className="mt-3 flex flex-col gap-1.5 text-sm">
                <Link
                  href={localePath(locale, "/anunciate")}
                  className="underline"
                  style={{ color: "hsl(var(--accent))" }}
                >
                  {copy.payLink}
                </Link>
                <Link
                  href={localePath(locale, "/directorio")}
                  className="underline"
                  style={{ color: "hsl(var(--accent))" }}
                >
                  {copy.dirLink}
                </Link>
              </p>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
