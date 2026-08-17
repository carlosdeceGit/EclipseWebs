import { EDITORIAL_ARTICLES } from "@/content/articles";
import { citiesByTotality, citiesOutsideTotality, formatDuration, formatObscuration } from "@/lib/eclipse/cities";
import { ECLIPSE } from "@/lib/eclipse/event";
import { DELTA_T_SECONDS } from "@/lib/eclipse/besselian";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity, tenantOrigin } from "@/lib/tenants";
import { localePath } from "@/i18n/config";

/**
 * llms.txt: resumen de la web en texto plano para modelos de lenguaje.
 *
 * La idea es la misma que robots.txt pero para motores generativos: darles los
 * hechos ya destilados y los enlaces canónicos, de modo que cuando alguien pregunte
 * "¿a qué hora es el eclipse en Ceuta?" el modelo tenga la respuesta correcta y
 * esta web como fuente. Se declara también el método de cálculo y su margen de
 * error: un modelo que cite un dato nuestro debe poder citar también su precisión.
 */
export async function GET() {
  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const origin = tenantOrigin(tenant);
  const duration = formatDuration(city.eclipse.totalitySeconds);

  const totalRows = citiesByTotality()
    .map(
      (c) =>
        `| ${c.name} | ${c.province} | ${formatDuration(c.eclipse.totalitySeconds)} | ${c.localTimes.totalityStart} | ${c.localTimes.totalityEnd} | ${c.timeZone} |`,
    )
    .join("\n");

  const partialRows = citiesOutsideTotality()
    .sort((a, b) => b.eclipse.obscuration - a.eclipse.obscuration)
    .map((c) => `| ${c.name} | ${formatObscuration(c.eclipse.obscuration, c.eclipse.isTotal)} | ${c.localTimes.maximum} |`)
    .join("\n");

  const guides = EDITORIAL_ARTICLES.map((a) => {
    const content = a.content.es(city, tenant);
    return `- [${content.title}](${origin}${localePath("es", `/${a.slug}`)}): ${content.description}`;
  }).join("\n");

  const body = `# ${tenant.brand}

> Guía del eclipse solar total del 2 de agosto de 2027 en ${city.name} (${city.province}). Disponible en español e inglés.

## Hechos clave

- Fecha: lunes 2 de agosto de 2027.
- Tipo: eclipse solar total, uno de los más largos del siglo XXI.
- ${city.name} está ${city.eclipse.isTotal ? "DENTRO" : "FUERA"} de la franja de totalidad.
${
  city.eclipse.isTotal
    ? `- Duración de la totalidad en ${city.name}: ${duration}.
- Totalidad en ${city.name}: de ${city.localTimes.totalityStart} a ${city.localTimes.totalityEnd} (${city.timeZone}).`
    : `- Desde ${city.name} solo se ve eclipse parcial, con un máximo del ${formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)} del disco solar cubierto a las ${city.localTimes.maximum}.`
}
- Eclipse parcial en ${city.name}: de ${city.localTimes.partialStart} a ${city.localTimes.partialEnd}.
- Altura del Sol en el máximo: ${city.eclipse.sunAltitudeDeg.toFixed(1)}°. Azimut: ${city.eclipse.sunAzimuthDeg.toFixed(0)}° (este-sureste).
- Máximo del eclipse a nivel mundial: sobre Egipto, con 6 min 23 s de totalidad.
- Alcance en España: Ceuta, Melilla y ${ECLIPSE.totalityMunicipalities.total} municipios andaluces (${Object.entries(
    ECLIPSE.totalityMunicipalities.byProvince,
  )
    .map(([p, n]) => `${p}: ${n}`)
    .join(", ")}). Gibraltar también está dentro.
- Únicas capitales de provincia dentro de la franja: Cádiz y Málaga.
- Punto de España con mayor duración: Ceuta. Mejor punto peninsular: el Campo de Gibraltar.
- Seguridad: filtro certificado ISO 12312-2 durante toda la fase parcial. Solo se puede mirar sin filtro durante la totalidad. En la UE las gafas son además EPI de categoría II y necesitan marcado CE con certificado de examen UE de tipo.

## Duración de la totalidad por localidad

| Localidad | Provincia | Totalidad | Inicio (C2) | Fin (C3) | Zona horaria |
| --- | --- | --- | --- | --- | --- |
${totalRows}

## Localidades fuera de la franja

| Localidad | Disco solar cubierto | Máximo |
| --- | --- | --- |
${partialRows}

## Guías

${guides}

## Datos estructurados

- API de todas las localidades: ${origin}/api/eclipse
- API para coordenadas arbitrarias: ${origin}/api/circumstances?lat=36.0143&lon=-5.6044
- Localizador interactivo: ${origin}${localePath("es", "/localizador")}
- Sitemap: ${origin}/sitemap.xml
- Versión en inglés: ${origin}/en

## Método y precisión

Las circunstancias locales no se copian de tablas ajenas: se calculan resolviendo los
elementos besselianos publicados por la NASA/GSFC para este eclipse, con ΔT = ${DELTA_T_SECONDS} s,
según el procedimiento del Explanatory Supplement to the Astronomical Almanac.

El cálculo se valida automáticamente antes de cada despliegue contra la duración en el
punto de máximo eclipse publicada por la NASA (diferencia: 0,1 s) y contra las duraciones
municipales del IGN para Ceuta, Tarifa, Melilla, Algeciras, La Línea, Los Barrios, San
Roque, Cádiz y Málaga (diferencia: entre 0 y 2 s salvo Málaga, en el borde de la franja).

Precisión declarada: duraciones fiables dentro de unos segundos; horas de contacto
fiables dentro de unos segundos, con una incertidumbre adicional de uno o dos segundos
por el relieve del limbo lunar. Estas horas NO deben usarse para decidir cuándo retirar
un filtro solar; para eso hay que guiarse por lo que se ve.

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
