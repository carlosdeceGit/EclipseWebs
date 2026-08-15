import Link from "next/link";
import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { Countdown } from "@/components/Countdown";
import { Badge, Callout, Card, DataRow, Section } from "@/components/ui";
import { citiesByTotality, formatDuration } from "@/lib/eclipse/cities";
import { ECLIPSE } from "@/lib/eclipse/event";
import { buildMetadata, cityGraph, faqGraph, jsonLd } from "@/lib/seo";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity } from "@/lib/tenants";
import { HOME_FAQ } from "@/content/faq";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const duration = formatDuration(city.circumstances.totalitySeconds);

  return buildMetadata({
    tenant,
    city,
    path: "/",
    title: `Eclipse solar total en ${city.name} — 2 de agosto de 2027`,
    description: duration
      ? `${city.name} verá ${duration} de totalidad el 2 de agosto de 2027. Horarios, mejores miradores, alojamiento, eventos y directorio de negocios.`
      : `Todo sobre el eclipse solar total del 2 de agosto de 2027 en ${city.name}: horarios, miradores, alojamiento, eventos y directorio de negocios.`,
  });
}

export default async function HomePage() {
  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const duration = formatDuration(city.circumstances.totalitySeconds);
  const ranking = citiesByTotality().slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(cityGraph(tenant, city))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqGraph(HOME_FAQ))} />

      <section className="mx-auto max-w-6xl px-4 pb-4 pt-12 sm:pt-16">
        <Badge>2 de agosto de 2027 · {ECLIPSE.weekdayEs}</Badge>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
          Eclipse solar total
          <br />
          en {city.name}
        </h1>

        {/*
          El primer párrafo es el que copian los motores generativos, así que carga
          los datos duros por delante: qué, dónde, cuándo y cuánto dura.
        */}
        <p className="mt-5 max-w-2xl text-lg" style={{ color: "hsl(var(--muted))" }}>
          El <strong style={{ color: "hsl(var(--text))" }}>lunes 2 de agosto de 2027</strong> la Luna
          tapará por completo el Sol sobre {city.name}
          {duration ? (
            <>
              {" "}durante <strong style={{ color: "hsl(var(--text))" }}>{duration}</strong>
            </>
          ) : null}
          . En el sur de España la totalidad ocurre entre las{" "}
          <strong style={{ color: "hsl(var(--text))" }}>
            {ECLIPSE.spainTotalityWindow.from} y las {ECLIPSE.spainTotalityWindow.to}
          </strong>{" "}
          (hora peninsular), con el Sol alto, entre {ECLIPSE.sunAltitudeRangeDeg.min}° y{" "}
          {ECLIPSE.sunAltitudeRangeDeg.max}° sobre el horizonte. {city.hook}
        </p>

        <div className="mt-8 max-w-xl">
          <Countdown />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/horarios"
            className="rounded-xl px-5 py-3 font-semibold"
            style={{ background: "hsl(var(--accent))", color: "hsl(224 44% 8%)" }}
          >
            Ver horarios exactos
          </Link>
          <Link
            href="/donde-verlo"
            className="rounded-xl border px-5 py-3 font-semibold"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            Mejores sitios para verlo
          </Link>
        </div>
      </section>

      <Section>
        <AdSlot name="header" />
      </Section>

      <Section title={`El eclipse en ${city.name}, dato a dato`}>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <dl>
              <DataRow label="Fecha" value="lunes 2 de agosto de 2027" />
              <DataRow label="¿Totalidad?" value={city.circumstances.inTotality ? "Sí, dentro de la franja" : "Solo eclipse parcial"} />
              <DataRow label="Duración de la totalidad" value={duration} />
              <DataRow label="Inicio de la totalidad" value={city.circumstances.contacts.totalityStart} note="hora local" />
              <DataRow label="Fin de la totalidad" value={city.circumstances.contacts.totalityEnd} note="hora local" />
              <DataRow label="Inicio del eclipse parcial" value={city.circumstances.contacts.partialStart} />
              <DataRow label="Fin del eclipse parcial" value={city.circumstances.contacts.partialEnd} />
              <DataRow
                label="Altura del Sol"
                value={city.circumstances.sunAltitudeDeg ? `${city.circumstances.sunAltitudeDeg}°` : null}
              />
              <DataRow label="Coordenadas" value={`${city.lat.toFixed(4)}, ${city.lon.toFixed(4)}`} />
            </dl>
            <p className="mt-4 text-xs" style={{ color: "hsl(var(--muted))" }}>
              Fuente: {city.circumstances.sources.map((s) => s.name).join(", ")}. Los campos
              marcados como pendientes se publican en cuanto se contrastan contra la tabla
              oficial. Ver <Link href="/fuentes" className="underline">fuentes y metodología</Link>.
            </p>
          </Card>

          <div className="space-y-6">
            <Callout title="Lo que no debes hacer">
              Mirar al Sol sin gafas de eclipse certificadas <strong>ISO 12312-2</strong> en
              ningún momento de la fase parcial. Las gafas de sol normales, los negativos y
              los cristales ahumados no sirven.{" "}
              <Link href="/seguridad" className="underline">
                Guía de seguridad
              </Link>
            </Callout>
            <AdSlot name="sidebar" className="hidden lg:flex" />
          </div>
        </div>
      </Section>

      <Section
        title="Dónde dura más el eclipse"
        lead="La duración de la totalidad cambia mucho en pocos kilómetros: cuanto más cerca del centro de la franja, más tiempo de oscuridad."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr style={{ color: "hsl(var(--muted))" }}>
                <th className="pb-3 font-medium">Localidad</th>
                <th className="pb-3 font-medium">Provincia</th>
                <th className="pb-3 text-right font-medium">Totalidad</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((c) => (
                <tr key={c.slug} className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="py-3 font-semibold">
                    <Link href={`/ciudades/${c.slug}`} className="hover:underline">
                      {c.name}
                    </Link>
                    {c.slug === city.slug && (
                      <span className="ml-2">
                        <Badge>estás aquí</Badge>
                      </span>
                    )}
                  </td>
                  <td className="py-3" style={{ color: "hsl(var(--muted))" }}>
                    {c.province}
                  </td>
                  <td className="py-3 text-right tabular-nums">
                    {formatDuration(c.circumstances.totalitySeconds) ?? (
                      <span className="italic" style={{ color: "hsl(var(--muted))" }}>
                        por confirmar
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          <Link href="/ciudades" className="underline" style={{ color: "hsl(var(--accent))" }}>
            Ver todas las localidades de la franja
          </Link>
        </p>
      </Section>

      <Section>
        <AdSlot name="inArticle" />
      </Section>

      <Section title="Planifica tu eclipse">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["/horarios", "Horarios minuto a minuto", "Los cinco contactos, la hora del máximo y cuánto dura cada fase."],
            ["/donde-verlo", "Dónde verlo", "Miradores, playas y puntos altos con horizonte despejado."],
            ["/alojamiento", "Alojamiento", "Qué queda libre, precios y por qué conviene reservar ya."],
            ["/eventos", "Eventos y observaciones", "Actividades de agrupaciones astronómicas y ayuntamientos."],
            ["/como-llegar", "Cómo llegar", "Ferris, aeropuertos, carreteras y el atasco previsible del día 2."],
            ["/clima", "Probabilidad de cielo despejado", "Qué dice la climatología de agosto en la zona."],
            ["/seguridad", "Seguridad ocular", "Filtros certificados, dónde comprarlos y cómo comprobarlos."],
            ["/fotografia", "Fotografiar el eclipse", "Filtros, ajustes y la lista de tomas que da tiempo a hacer."],
            ["/directorio", "Directorio de negocios", "Hoteles, restaurantes y servicios de la ciudad."],
          ].map(([href, title, desc]) => (
            <Link key={href} href={href}>
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

      <Section title="Preguntas frecuentes">
        <div className="space-y-3">
          {HOME_FAQ.map((item) => (
            <details key={item.q} className="rounded-2xl border p-5" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface))" }}>
              <summary className="cursor-pointer font-semibold">{item.q}</summary>
              <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Section>

      <Section>
        <AdSlot name="footer" />
      </Section>
    </>
  );
}
