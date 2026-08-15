import { allCities, formatDuration } from "@/lib/eclipse/cities";
import { ECLIPSE } from "@/lib/eclipse/event";
import { DELTA_T_SECONDS, ELEMENTS } from "@/lib/eclipse/besselian";

/**
 * API pública con los datos del eclipse en todas las localidades del registro.
 *
 * Abierta a propósito y con CORS permisivo (ver next.config.ts): que otros la usen
 * genera enlaces y menciones, que es exactamente lo que necesitamos. Declara el
 * método y el margen de error para que nadie republique las cifras como si fueran
 * infinitamente precisas.
 */
export async function GET() {
  return Response.json(
    {
      event: {
        name: "Eclipse solar total del 2 de agosto de 2027",
        date: ECLIPSE.dateISO,
        greatestEclipseUTC: "2027-08-02T10:06:37.7Z",
        greatestDurationSeconds: 383.2,
        spainTotalityWindowCEST: ECLIPSE.spainTotalityWindow,
        totalityMunicipalities: ECLIPSE.totalityMunicipalities,
      },
      cities: allCities().map((c) => ({
        slug: c.slug,
        name: c.name,
        nameEn: c.nameEn ?? c.name,
        province: c.province,
        country: c.country,
        timeZone: c.timeZone,
        coordinates: { lat: c.lat, lon: c.lon, altitudeM: c.altitudeM ?? 0 },
        inTotality: c.eclipse.isTotal,
        totalitySeconds: Math.round(c.eclipse.totalitySeconds * 10) / 10,
        totalityHuman: formatDuration(c.eclipse.totalitySeconds),
        obscuration: Math.round(c.eclipse.obscuration * 10000) / 10000,
        magnitude: Math.round(c.eclipse.magnitude * 10000) / 10000,
        sunAltitudeDeg: Math.round(c.eclipse.sunAltitudeDeg * 10) / 10,
        sunAzimuthDeg: Math.round(c.eclipse.sunAzimuthDeg * 10) / 10,
        contactsUTC: {
          partialStart: c.eclipse.partialStart?.toISOString() ?? null,
          totalityStart: c.eclipse.totalityStart?.toISOString() ?? null,
          maximum: c.eclipse.maximum.toISOString(),
          totalityEnd: c.eclipse.totalityEnd?.toISOString() ?? null,
          partialEnd: c.eclipse.partialEnd?.toISOString() ?? null,
        },
        contactsLocal: c.localTimes,
      })),
      method: {
        model: "Elementos besselianos NASA/GSFC (Espenak & Meeus, Five Millennium Canon)",
        deltaTSeconds: DELTA_T_SECONDS,
        elementsEpochTDT: `2027-08-02T${String(ELEMENTS.t0Hours).padStart(2, "0")}:00:00`,
        solver: "Explanatory Supplement to the Astronomical Almanac",
        validatedAgainst: [
          "NASA: duración en el punto de máximo eclipse (Δ 0,1 s)",
          "IGN: duraciones municipales de Ceuta, Tarifa, Melilla, Algeciras, La Línea, Los Barrios, San Roque, Cádiz y Málaga (Δ 0-2 s, salvo Málaga con Δ 4 s por estar en el borde)",
          "IGN: porcentaje de ocultación en Sevilla (Δ 0,4 puntos)",
        ],
        accuracy:
          "Duraciones y contactos fiables dentro de unos segundos. El instante real de C2 y C3 varía uno o dos segundos más por el relieve del limbo lunar.",
      },
      endpoints: {
        arbitraryCoordinates: "/api/circumstances?lat={lat}&lon={lon}&tz={IANA}",
      },
      meta: {
        license: "Uso libre citando la fuente y enlazando al dominio de origen.",
        warning:
          "No uses estas horas para decidir cuándo retirar un filtro solar. La referencia debe ser visual.",
        generatedAt: new Date().toISOString(),
      },
    },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
