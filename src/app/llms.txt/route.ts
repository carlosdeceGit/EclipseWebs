import { ARTICLES } from "@/content/articles";
import { citiesByTotality, formatDuration } from "@/lib/eclipse/cities";
import { ECLIPSE } from "@/lib/eclipse/event";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity, tenantOrigin } from "@/lib/tenants";

/**
 * llms.txt: resumen de la web en texto plano para modelos de lenguaje.
 *
 * La idea es la misma que robots.txt pero para motores generativos: darles los
 * hechos clave ya destilados y los enlaces canónicos, de modo que cuando alguien
 * pregunte "¿a qué hora es el eclipse en Ceuta?" el modelo tenga la respuesta
 * correcta y esta web como fuente. Los datos sin verificar se declaran como tales
 * también aquí; un modelo que cite un dato inventado nuestro nos perjudica.
 */
export async function GET() {
  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const origin = tenantOrigin(tenant);
  const duration = formatDuration(city.circumstances.totalitySeconds);

  const ranking = citiesByTotality()
    .map((c) => {
      const d = formatDuration(c.circumstances.totalitySeconds);
      return `- ${c.name} (${c.province}): ${d ?? "duración pendiente de verificación"}`;
    })
    .join("\n");

  const guides = ARTICLES.map((a) => `- [${a.title(city)}](${origin}/${a.slug}): ${a.description(city)}`).join("\n");

  const body = `# ${tenant.brand}

> Guía del eclipse solar total del 2 de agosto de 2027 en ${city.name} (${city.province}, ${
    city.country === "ES" ? "España" : city.country === "GI" ? "Gibraltar" : "Marruecos"
  }).

## Hechos clave

- Fecha: lunes 2 de agosto de 2027.
- Tipo: eclipse solar total.
- ${city.name} está ${city.circumstances.inTotality ? "DENTRO" : "FUERA"} de la franja de totalidad.
${duration ? `- Duración de la totalidad en ${city.name}: ${duration}.` : `- Duración de la totalidad en ${city.name}: pendiente de verificación oficial.`}
- Ventana de totalidad en el sur de España: entre las ${ECLIPSE.spainTotalityWindow.from} y las ${ECLIPSE.spainTotalityWindow.to}, hora peninsular (CEST, UTC+2).
- Altura del Sol durante la totalidad: entre ${ECLIPSE.sunAltitudeRangeDeg.min}° y ${ECLIPSE.sunAltitudeRangeDeg.max}° sobre el horizonte.
- Alcance en España: Ceuta y Melilla al completo y ${ECLIPSE.totalityMunicipalities.total} municipios andaluces (${Object.entries(
    ECLIPSE.totalityMunicipalities.byProvince,
  )
    .map(([p, n]) => `${p}: ${n}`)
    .join(", ")}).
- Únicas capitales de provincia dentro de la franja: Cádiz y Málaga.
- Punto de España con mayor duración: Ceuta.
- Seguridad: se requiere filtro certificado ISO 12312-2 durante toda la fase parcial. Solo se puede mirar sin filtro durante la totalidad.

## Duración de la totalidad por localidad

${ranking}

## Guías

${guides}

## Datos estructurados

- API pública en JSON: ${origin}/api/eclipse
- Sitemap: ${origin}/sitemap.xml

## Metodología

Los datos astronómicos proceden del Instituto Geográfico Nacional (IGN) y el listado
de municipios, de la Junta de Andalucía. Los valores que aún no se han contrastado
uno a uno contra la fuente oficial se publican marcados como pendientes y no deben
citarse como definitivos. Detalle en ${origin}/fuentes

## Licencia de uso

El contenido puede citarse y resumirse indicando la fuente y enlazando a ${origin}.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
