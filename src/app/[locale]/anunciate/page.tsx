import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Callout, Card, PageHeader, Section } from "@/components/ui";
import { OWN_AD_PRICING } from "@/lib/ads";
import { CITIES, cityName } from "@/lib/eclipse/cities";
import { buildMetadata } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { TENANTS, tenantCity } from "@/lib/tenants";
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
    path: "/anunciate",
    title: locale === "es" ? `Anúnciate en ${tenant.brand}` : `Advertise on ${tenant.brand}`,
    description:
      locale === "es"
        ? `Llega a quien viaja a ${name} para el eclipse del 2 de agosto de 2027. Ficha gratuita en el directorio, fichas destacadas y patrocinio de ciudad.`
        : `Reach the people travelling to ${name} for the 2 August 2027 eclipse. Free directory listing, featured listings and city sponsorship.`,
  });
}

export default async function AdvertisePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const name = cityName(city, locale);

  return (
    <>
      <PageHeader
        title={locale === "es" ? `Anúnciate en ${tenant.brand}` : `Advertise on ${tenant.brand}`}
        lead={
          locale === "es"
            ? `Quien llega a esta web ya ha decidido venir a ver el eclipse: busca dónde dormir, dónde comer, cómo llegar y qué hacer en ${name} esos días. Es una audiencia pequeña, muy concentrada en el tiempo y con intención de gasto altísima.`
            : `People who reach this site have already decided to come and see the eclipse: they are looking for where to sleep, where to eat, how to get there and what to do in ${name}. A small audience, tightly concentrated in time, with very high purchase intent.`
        }
      />
      <Section>
        <div className="grid gap-4 lg:grid-cols-3">
          {OWN_AD_PRICING.map((plan) => (
            <Card key={plan.id} className="flex h-full flex-col">
              <h2 className="font-bold">{plan.name[locale]}</h2>
              <p className="mt-3">
                <span className="text-3xl font-black" style={{ color: "hsl(var(--accent))" }}>
                  {plan.price === 0 ? (locale === "es" ? "Gratis" : "Free") : `${plan.price} €`}
                </span>
                {plan.price > 0 && (
                  <span className="ml-2 text-xs" style={{ color: "hsl(var(--muted))" }}>
                    {plan.period[locale]}
                  </span>
                )}
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
                {plan.features[locale].map((f) => (
                  <li key={f} className="flex gap-2">
                    <span style={{ color: "hsl(var(--accent))" }}>·</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={localePath(locale, plan.price === 0 ? "/clasificados/nuevo" : "/contacto")}
                className="mt-5 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold"
                style={
                  plan.price === 0
                    ? { border: "1px solid hsl(var(--border))" }
                    : { background: "hsl(var(--accent))", color: "hsl(var(--on-accent))" }
                }
              >
                {plan.price === 0
                  ? locale === "es"
                    ? "Darme de alta"
                    : "List for free"
                  : locale === "es"
                    ? "Contratar"
                    : "Get in touch"}
              </Link>
            </Card>
          ))}
        </div>

        <p className="mt-6 text-xs" style={{ color: "hsl(var(--muted))" }}>
          {locale === "es"
            ? "Precios sin IVA. Los enlaces salientes de las fichas comerciales llevan el atributo sponsored, como exige Google: es una condición innegociable para no comprometer el posicionamiento de la web ni el tuyo."
            : "Prices exclude VAT. Outbound links on commercial listings carry the sponsored attribute, as Google requires: a non-negotiable condition that protects both this site's ranking and yours."}
        </p>
      </Section>

      <Section title={locale === "es" ? "Por qué aquí y no en un portal grande" : "Why here and not a big portal"}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Callout title={locale === "es" ? "Intención, no volumen" : "Intent, not volume"}>
            {locale === "es"
              ? `No competimos en tráfico con un portal de viajes. Competimos en momento: alguien que busca "dónde ver el eclipse en ${name}" está a un paso de reservar. Ahí una ficha bien puesta rinde más que miles de impresiones sueltas.`
              : `We do not compete on traffic with a travel portal. We compete on timing: somebody searching "where to see the eclipse in ${name}" is one step from booking. A well-placed listing there beats thousands of loose impressions.`}
          </Callout>
          <Callout title={locale === "es" ? "Ventana corta, decisión temprana" : "Short window, early decision"}>
            {locale === "es"
              ? "El eclipse es el 2 de agosto de 2027 y no se repite. Las reservas se cierran con mucha antelación, así que el año que va desde ahora hasta la fecha es donde se decide todo. Después, esta audiencia desaparece de golpe."
              : "The eclipse is on 2 August 2027 and does not repeat. Bookings close far in advance, so the year between now and then is where everything is decided. After that, this audience disappears overnight."}
          </Callout>
        </div>
      </Section>

      <Section
        title={locale === "es" ? "La red completa" : "The full network"}
        lead={
          locale === "es"
            ? "Cada ciudad de la franja tiene su propio dominio. Puedes anunciarte en una o contratar varias."
            : "Each city in the path has its own domain. You can advertise on one or across several."
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TENANTS.map((x) => {
            const c = CITIES.find((y) => y.slug === x.citySlug);
            return (
              <Card key={x.domain}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{x.brand}</span>
                  {x.domain === tenant.domain && <Badge>{locale === "es" ? "aquí" : "here"}</Badge>}
                </div>
                <p className="mt-1 text-xs" style={{ color: "hsl(var(--muted))" }}>
                  {x.domain} · {c?.province}
                </p>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section title={locale === "es" ? "Contacto comercial" : "Commercial enquiries"}>
        <Card>
          <p style={{ color: "hsl(var(--muted))" }}>
            {locale === "es" ? (
              <>
                Escríbenos contando qué negocio tienes y en qué ciudad, y te decimos qué encaja. Si
                organizas una actividad gratuita y divulgativa —una agrupación astronómica, un
                colegio, un ayuntamiento— no pagas nada: eso entra en{" "}
                <Link href={localePath(locale, "/eventos")} className="underline" style={{ color: "hsl(var(--accent))" }}>
                  la agenda
                </Link>{" "}
                por su cuenta.
              </>
            ) : (
              <>
                Tell us what your business is and which city, and we will say what fits. If you run a
                free outreach activity — an astronomy society, a school, a council — you pay nothing:
                that goes into{" "}
                <Link href={localePath(locale, "/eventos")} className="underline" style={{ color: "hsl(var(--accent))" }}>
                  the events listing
                </Link>{" "}
                on its own merits.
              </>
            )}
          </p>
        </Card>
      </Section>
    </>
  );
}
