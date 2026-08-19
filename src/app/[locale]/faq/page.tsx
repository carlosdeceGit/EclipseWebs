import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { PageHeader, Section } from "@/components/ui";
import { HOME_FAQ, SAFETY_FAQ } from "@/content/faq";
import { buildMetadata, faqGraph, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";
import { cityName } from "@/lib/eclipse/cities";
import { isLocale } from "@/i18n/config";

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
    path: "/faq",
    title:
      locale === "es"
        ? `Preguntas frecuentes sobre el eclipse en ${name}`
        : `Frequently asked questions about the eclipse in ${name}`,
    description:
      locale === "es"
        ? `Respuestas directas a las dudas más habituales sobre el eclipse solar total del 2 de agosto de 2027 en ${name}: horarios, seguridad, alojamiento y dónde verlo.`
        : `Direct answers to the most common questions about the total solar eclipse of 2 August 2027 in ${name}: timings, safety, accommodation and where to watch.`,
  });
}

function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
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
  );
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const name = cityName(city, locale);
  const general = HOME_FAQ[locale];
  const safety = SAFETY_FAQ[locale];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(faqGraph([...general, ...safety]))}
      />

      <PageHeader
        title={
          locale === "es"
            ? `Preguntas frecuentes sobre el eclipse en ${name}`
            : `Frequently asked questions about the eclipse in ${name}`
        }
        lead={
          locale === "es"
            ? "Respuestas cortas y directas. Si buscas el detalle, cada tema tiene su guía completa."
            : "Short, direct answers. For the detail, each topic has its own full guide."
        }
      />
      <Section>
        <div className="max-w-3xl space-y-8">
          <div>
            <h2 className="mb-4 text-xl font-bold">{locale === "es" ? "El eclipse" : "The eclipse"}</h2>
            <FaqList items={general} />
          </div>

          <AdSlot name="inArticle" locale={locale} />

          <div>
            <h2 className="mb-4 text-xl font-bold">{locale === "es" ? "Seguridad ocular" : "Eye safety"}</h2>
            <FaqList items={safety} />
          </div>
        </div>
      </Section>
    </>
  );
}
