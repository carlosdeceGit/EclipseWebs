import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Callout, Card, DataRow, Section } from "@/components/ui";
import { CITIES, formatDuration } from "@/lib/eclipse/cities";
import { ECLIPSE } from "@/lib/eclipse/event";
import { breadcrumbGraph, buildMetadata, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const d = formatDuration(city.circumstances.totalitySeconds);
  return buildMetadata({
    tenant,
    city,
    path: "/horarios",
    title: `Horarios del eclipse en ${city.name} — 2 de agosto de 2027`,
    description: `A qué hora empieza y termina el eclipse en ${city.name}${
      d ? `, con ${d} de totalidad` : ""
    }: los cinco contactos, el máximo y la duración de cada fase.`,
  });
}

export default async function HorariosPage() {
  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const c = city.circumstances;
  const duration = formatDuration(c.totalitySeconds);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbGraph(tenant, [
            { name: "Inicio", path: "/" },
            { name: "Horarios", path: "/horarios" },
          ]),
        )}
      />

      <Section
        title={`Horarios del eclipse en ${city.name}`}
        lead={`Todas las horas están en hora local de ${city.name} (${city.timeZone}). El eclipse es el lunes 2 de agosto de 2027.`}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-bold">Los cinco contactos</h2>
            <dl>
              <DataRow label="C1 · Empieza el eclipse parcial" value={c.contacts.partialStart} />
              <DataRow label="C2 · Empieza la totalidad" value={c.contacts.totalityStart} />
              <DataRow label="Máximo del eclipse" value={c.contacts.maximum} />
              <DataRow label="C3 · Termina la totalidad" value={c.contacts.totalityEnd} />
              <DataRow label="C4 · Termina el eclipse parcial" value={c.contacts.partialEnd} />
              <DataRow label="Duración de la totalidad" value={duration} />
            </dl>

            {c.confidence !== "verified" && (
              <p className="mt-5 rounded-lg p-3 text-xs" style={{ background: "hsl(var(--border) / 0.5)", color: "hsl(var(--muted))" }}>
                Algunos de estos valores todavía no están contrastados uno a uno contra la
                tabla oficial del IGN y aparecen como pendientes. No publicamos horas
                aproximadas: en un eclipse, un minuto de error es la diferencia entre
                quitarse el filtro a tiempo o hacerlo demasiado pronto. Ver{" "}
                <Link href="/fuentes" className="underline">
                  fuentes y metodología
                </Link>
                .
              </p>
            )}
          </Card>

          <div className="space-y-6">
            <Callout title="Ventana de totalidad en España">
              Entre las {ECLIPSE.spainTotalityWindow.from} y las {ECLIPSE.spainTotalityWindow.to},
              hora peninsular. La franja avanza de oeste a este, así que Cádiz entra en
              totalidad antes que Málaga o Melilla.
            </Callout>
            <AdSlot name="sidebar" className="hidden lg:flex" />
          </div>
        </div>
      </Section>

      <Section title="Qué pasa en cada momento">
        <div className="prose-eclipse max-w-3xl">
          <p>
            Entre C1 y C2 pasa algo más de una hora en la que el Sol se va comiendo poco a
            poco. Sin filtro no notarás casi nada hasta el último cuarto de hora: el ojo
            compensa la pérdida de luz muy bien. Los últimos cinco minutos antes de la
            totalidad son los que cambian de verdad, con la luz volviéndose gris metálica y
            la temperatura bajando.
          </p>
          <p>
            El instante de C2 es el que hay que tener claro. Es cuando aparece el anillo de
            diamante y, justo después, cuando ya se puede mirar sin filtro. Y el de C3, el
            momento de volver a ponérselo, sin esperar a ver qué pasa.
          </p>
        </div>
      </Section>

      <Section>
        <AdSlot name="inArticle" />
      </Section>

      <Section
        title="Horarios en otras localidades"
        lead="La franja avanza de oeste a este: las localidades atlánticas entran en totalidad antes que las mediterráneas."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[38rem] text-left text-sm">
            <thead>
              <tr style={{ color: "hsl(var(--muted))" }}>
                <th className="pb-3 font-medium">Localidad</th>
                <th className="pb-3 font-medium">Provincia</th>
                <th className="pb-3 font-medium">Empieza la totalidad</th>
                <th className="pb-3 text-right font-medium">Duración</th>
              </tr>
            </thead>
            <tbody>
              {CITIES.filter((x) => x.circumstances.inTotality).map((x) => (
                <tr key={x.slug} className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="py-3 font-semibold">
                    <Link href={`/ciudades/${x.slug}`} className="hover:underline">
                      {x.name}
                    </Link>
                  </td>
                  <td className="py-3" style={{ color: "hsl(var(--muted))" }}>
                    {x.province}
                  </td>
                  <td className="py-3 tabular-nums" style={{ color: "hsl(var(--muted))" }}>
                    {x.circumstances.contacts.totalityStart ?? "—"}
                  </td>
                  <td className="py-3 text-right tabular-nums">
                    {formatDuration(x.circumstances.totalitySeconds) ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
