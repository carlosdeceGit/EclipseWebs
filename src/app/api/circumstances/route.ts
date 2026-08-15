import { circumstancesAt, distanceToCenterlineKm } from "@/lib/eclipse/besselian";
import { toLocalTime } from "@/lib/eclipse/cities";

/**
 * Circunstancias del eclipse para unas coordenadas cualesquiera.
 *
 * Es el motor del localizador y, de paso, una API pública útil: cualquiera puede
 * consultarla para su punto exacto, y eso genera enlaces. El cálculo es puro y
 * rápido, así que no hace falta caché por coordenada; sí cacheamos en el borde
 * porque la respuesta para unas coordenadas dadas no cambia nunca.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  const altitudeM = Number(searchParams.get("alt") ?? "0");
  const timeZone = searchParams.get("tz") || "Europe/Madrid";

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return Response.json(
      { error: "Parámetros lat y lon obligatorios, con lat en [-90,90] y lon en [-180,180]." },
      { status: 400 },
    );
  }

  const eclipse = circumstancesAt({
    lat,
    lon,
    altitudeM: Number.isFinite(altitudeM) ? altitudeM : 0,
  });

  // Solo tiene sentido preguntarse por el centro de la franja si hay eclipse.
  const kmToCenterline = eclipse.isPartial ? distanceToCenterlineKm({ lat, lon, altitudeM }) : null;

  return Response.json(
    {
      query: { lat, lon, altitudeM, timeZone },
      isTotal: eclipse.isTotal,
      isPartial: eclipse.isPartial,
      totalitySeconds: Math.round(eclipse.totalitySeconds * 10) / 10,
      obscuration: Math.round(eclipse.obscuration * 10000) / 10000,
      magnitude: Math.round(eclipse.magnitude * 10000) / 10000,
      sunAltitudeDeg: Math.round(eclipse.sunAltitudeDeg * 10) / 10,
      sunAzimuthDeg: Math.round(eclipse.sunAzimuthDeg * 10) / 10,
      kmToCenterline: kmToCenterline === null ? null : Math.round(kmToCenterline * 10) / 10,
      contactsUTC: {
        partialStart: eclipse.partialStart?.toISOString() ?? null,
        totalityStart: eclipse.totalityStart?.toISOString() ?? null,
        maximum: eclipse.maximum.toISOString(),
        totalityEnd: eclipse.totalityEnd?.toISOString() ?? null,
        partialEnd: eclipse.partialEnd?.toISOString() ?? null,
      },
      contactsLocal: {
        timeZone,
        partialStart: toLocalTime(eclipse.partialStart, timeZone),
        totalityStart: toLocalTime(eclipse.totalityStart, timeZone),
        maximum: toLocalTime(eclipse.maximum, timeZone),
        totalityEnd: toLocalTime(eclipse.totalityEnd, timeZone),
        partialEnd: toLocalTime(eclipse.partialEnd, timeZone),
      },
      method:
        "Elementos besselianos NASA/GSFC resueltos según el Explanatory Supplement. Validado contra IGN y NASA.",
      warning:
        "No uses estas horas para decidir cuándo retirar el filtro solar. Guíate por lo que ves: filtro fuera cuando desaparece el último rayo, filtro puesto al primer destello.",
    },
    { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
  );
}
