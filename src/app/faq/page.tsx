import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { Section } from "@/components/ui";
import { HOME_FAQ, SAFETY_FAQ } from "@/content/faq";
import { buildMetadata, faqGraph, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  return buildMetadata({
    tenant,
    city,
    path: "/faq",
    title: `Preguntas frecuentes sobre el eclipse en ${city.name}`,
    description: `Respuestas directas a las dudas más habituales sobre el eclipse solar total del 2 de agosto de 2027 en ${city.name}: horarios, seguridad, alojamiento y dónde verlo.`,
  });
}

export default async function FaqPage() {
  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const all = [...HOME_FAQ, ...SAFETY_FAQ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqGraph(all))} />

      <Section
        title={`Preguntas frecuentes sobre el eclipse en ${city.name}`}
        lead="Respuestas cortas y directas. Si buscas el detalle, cada una enlaza con la guía correspondiente."
      >
        <div className="max-w-3xl space-y-8">
          <div>
            <h2 className="mb-4 text-xl font-bold">El eclipse</h2>
            <div className="space-y-3">
              {HOME_FAQ.map((item) => (
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
          </div>

          <AdSlot name="inArticle" />

          <div>
            <h2 className="mb-4 text-xl font-bold">Seguridad ocular</h2>
            <div className="space-y-3">
              {SAFETY_FAQ.map((item) => (
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
          </div>
        </div>
      </Section>
    </>
  );
}
