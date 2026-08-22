import { publicClient } from "./supabase";

/**
 * Agenda de actos del eclipse.
 *
 * La tabla existía desde el principio —la llena el agente `eventos` a partir de
 * convocatorias de fuentes permitidas— pero no había ni una página que la
 * leyera. Esto es esa lectura, más el alta manual desde `/publicar` para que un
 * ayuntamiento o una agrupación astronómica pueda anunciar lo suyo sin esperar a
 * que el agente lo encuentre.
 */
export interface EclipseEvent {
  id: string;
  city_slug: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  venue: string | null;
  address: string | null;
  lat: number | null;
  lon: number | null;
  is_free: boolean;
  organizer: string | null;
  /** De dónde sale la convocatoria. Sin fuente no se publica. */
  source_url: string;
  source_name: string | null;
}

/**
 * Actos aprobados de una ciudad, del más próximo al más lejano.
 *
 * Se descartan los que ya han pasado. El corte se hace contra el momento de la
 * consulta y no contra el día del eclipse a propósito: durante los meses previos
 * habrá charlas y observaciones divulgativas que caducan por su cuenta.
 */
export async function getEvents(opts: {
  citySlug: string;
  limit?: number;
  /** Incluir los ya celebrados. Solo para páginas de archivo. */
  includePast?: boolean;
}): Promise<EclipseEvent[]> {
  const supabase = publicClient();
  if (!supabase) return [];

  let query = supabase
    .from("events")
    .select("*")
    .eq("city_slug", opts.citySlug)
    .eq("status", "approved")
    .order("starts_at", { ascending: true })
    .limit(opts.limit ?? 50);

  if (!opts.includePast) query = query.gte("starts_at", new Date().toISOString());

  const { data, error } = await query;
  if (error) {
    console.error("[events] consulta fallida:", error.message);
    return [];
  }
  return (data ?? []) as EclipseEvent[];
}

export async function countEvents(citySlug: string): Promise<number> {
  const supabase = publicClient();
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("city_slug", citySlug)
    .eq("status", "approved")
    .gte("starts_at", new Date().toISOString());

  if (error) return 0;
  return count ?? 0;
}
