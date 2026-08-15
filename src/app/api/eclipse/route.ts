import { CITIES, formatDuration } from "@/lib/eclipse/cities";
import { ECLIPSE } from "@/lib/eclipse/event";

/**
 * API pública con los datos del eclipse.
 *
 * Abierta a propósito y con CORS permisivo (ver next.config.ts): que otros la usen
 * genera enlaces y menciones, que es exactamente lo que necesitamos. Devuelve la
 * confianza de cada dato para que nadie publique como firme algo que no lo es.
 */
export async function GET() {
  return Response.json(
    {
      event: {
        name: "Eclipse solar total del 2 de agosto de 2027",
        date: ECLIPSE.dateISO,
        maximumUTC: ECLIPSE.isoDateTimeUTC,
        spainTotalityWindowCEST: ECLIPSE.spainTotalityWindow,
        sunAltitudeRangeDeg: ECLIPSE.sunAltitudeRangeDeg,
        totalityMunicipalities: ECLIPSE.totalityMunicipalities,
      },
      cities: CITIES.map((c) => ({
        slug: c.slug,
        name: c.name,
        province: c.province,
        country: c.country,
        timeZone: c.timeZone,
        coordinates: { lat: c.lat, lon: c.lon },
        inTotality: c.circumstances.inTotality,
        totalitySeconds: c.circumstances.totalitySeconds,
        totalityHuman: formatDuration(c.circumstances.totalitySeconds),
        contacts: c.circumstances.contacts,
        confidence: c.circumstances.confidence,
        sources: c.circumstances.sources,
      })),
      meta: {
        license: "Uso libre citando la fuente y enlazando al dominio de origen.",
        notice:
          "Los campos con confidence distinto de 'verified' no están contrastados contra la fuente oficial y no deben usarse para decidir cuándo retirar un filtro solar.",
        generatedAt: new Date().toISOString(),
      },
    },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
