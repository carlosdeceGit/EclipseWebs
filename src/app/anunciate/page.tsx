import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Callout, Card, Section } from "@/components/ui";
import { OWN_AD_PRICING } from "@/lib/ads";
import { CITIES } from "@/lib/eclipse/cities";
import { buildMetadata } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { TENANTS, tenantCity } from "@/lib/tenants";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  return buildMetadata({
    tenant,
    city,
    path: "/anunciate",
    title: `Anúnciate en ${tenant.brand}`,
    description: `Llega a quien viaja a ${city.name} para el eclipse del 2 de agosto de 2027. Ficha gratuita en el directorio, fichas destacadas y patrocinio de ciudad.`,
  });
}

export default async function AnunciatePage() {
  const tenant = await currentTenant();
  const city = tenantCity(tenant);

  return (
    <>
      <Section
        title={`Anúnciate en ${tenant.brand}`}
        lead={`Quien llega a esta web ya ha decidido venir a ver el eclipse: busca dónde dormir, dónde comer, cómo llegar y qué hacer en ${city.name} esos días. Es una audiencia pequeña, muy concentrada en el tiempo y con intención de gasto altísima.`}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {OWN_AD_PRICING.map((plan) => (
            <Card key={plan.id} className="flex h-full flex-col">
              <h2 className="font-bold">{plan.name}</h2>
              <p className="mt-3">
                <span className="text-3xl font-black" style={{ color: "hsl(var(--accent))" }}>
                  {plan.price === 0 ? "Gratis" : `${plan.price} €`}
                </span>
                {plan.price > 0 && (
                  <span className="ml-2 text-xs" style={{ color: "hsl(var(--muted))" }}>
                    {plan.period}
                  </span>
                )}
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span style={{ color: "hsl(var(--accent))" }}>·</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.price === 0 ? "/clasificados/nuevo" : "/contacto"}
                className="mt-5 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold"
                style={
                  plan.price === 0
                    ? { border: "1px solid hsl(var(--border))" }
                    : { background: "hsl(var(--accent))", color: "hsl(224 44% 8%)" }
                }
              >
                {plan.price === 0 ? "Darme de alta" : "Contratar"}
              </Link>
            </Card>
          ))}
        </div>

        <p className="mt-6 text-xs" style={{ color: "hsl(var(--muted))" }}>
          Precios sin IVA. Los enlaces salientes de las fichas comerciales llevan el atributo
          <code className="mx-1">sponsored</code>, como exige Google: es una condición
          innegociable para no comprometer el posicionamiento de la web ni el tuyo.
        </p>
      </Section>

      <Section title="Por qué aquí y no en un portal grande">
        <div className="grid gap-6 lg:grid-cols-2">
          <Callout title="Intención, no volumen">
            No competimos en tráfico con un portal de viajes. Competimos en momento: alguien
            que busca &laquo;dónde ver el eclipse en {city.name}&raquo; está a un paso de
            reservar. Ahí una ficha bien puesta rinde más que miles de impresiones sueltas.
          </Callout>
          <Callout title="Ventana corta, decisión temprana">
            El eclipse es el 2 de agosto de 2027 y no se repite. Las reservas se cierran con
            mucha antelación, así que el año que va desde ahora hasta la fecha es donde se
            decide todo. Después, esta audiencia desaparece de golpe.
          </Callout>
        </div>
      </Section>

      <Section
        title="La red completa"
        lead="Cada ciudad de la franja tiene su propio dominio. Puedes anunciarte en una o contratar varias."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TENANTS.map((t) => {
            const c = CITIES.find((x) => x.slug === t.citySlug);
            return (
              <Card key={t.domain}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{t.brand}</span>
                  {t.domain === tenant.domain && <Badge>aquí</Badge>}
                </div>
                <p className="mt-1 text-xs" style={{ color: "hsl(var(--muted))" }}>
                  {t.domain} · {c?.province}
                </p>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section title="Contacto comercial">
        <Card>
          <p style={{ color: "hsl(var(--muted))" }}>
            Escríbenos contando qué negocio tienes y en qué ciudad, y te decimos qué encaja.
            Si organizas una actividad gratuita y divulgativa —una agrupación astronómica, un
            colegio, un ayuntamiento— no pagas nada: eso entra en{" "}
            <Link href="/eventos" className="underline" style={{ color: "hsl(var(--accent))" }}>
              la agenda
            </Link>{" "}
            por su cuenta.
          </p>
        </Card>
      </Section>
    </>
  );
}
