import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Persistencia de los agentes.
 *
 * Usa la service role key porque escribe en tablas sin política pública. Si no está
 * configurada, todo se degrada a no-op y el agente sirve igualmente para inspeccionar
 * resultados con --dry.
 */

function client(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function startRun(agent: string): Promise<string | null> {
  const db = client();
  if (!db) return null;
  const { data, error } = await db.from("agent_runs").insert({ agent }).select("id").single();
  if (error) {
    console.error("[store] no se pudo abrir la ejecución:", error.message);
    return null;
  }
  return data.id as string;
}

export async function finishRun(
  id: string | null,
  result: { ok: boolean; summary: string; itemsCreated?: number; error?: string },
): Promise<void> {
  const db = client();
  if (!db || !id) return;
  await db
    .from("agent_runs")
    .update({
      finished_at: new Date().toISOString(),
      ok: result.ok,
      summary: result.summary,
      items_created: result.itemsCreated ?? 0,
      error: result.error ?? null,
    })
    .eq("id", id);
}

export interface ProposalInput {
  city_slug: string;
  field: string;
  current_value: string | null;
  proposed_value: string;
  source_url: string;
  source_name?: string;
}

/**
 * Guarda propuestas de cambio en datos astronómicos.
 *
 * Nunca toca el dataset: solo deja la propuesta para revisión. Las que llegan sin
 * URL de fuente se descartan aquí mismo, por si el modelo se salta su propia regla.
 */
export async function insertProposals(agent: string, proposals: ProposalInput[]): Promise<number> {
  const db = client();
  if (!db) return 0;

  const valid = proposals.filter((p) => p.city_slug && p.field && p.proposed_value && p.source_url);
  if (valid.length !== proposals.length) {
    console.warn(`[store] descartadas ${proposals.length - valid.length} propuestas sin fuente`);
  }
  if (valid.length === 0) return 0;

  const { error, count } = await db
    .from("data_proposals")
    .insert(valid.map((p) => ({ ...p, agent })), { count: "exact" });

  if (error) {
    console.error("[store] propuestas fallidas:", error.message);
    return 0;
  }
  return count ?? valid.length;
}

export interface EventInput {
  city_slug: string;
  title: string;
  description?: string;
  starts_at: string;
  ends_at?: string | null;
  venue?: string;
  is_free?: boolean;
  organizer?: string;
  source_url: string;
  source_name?: string;
}

/**
 * Publica eventos encontrados por el agente.
 *
 * Entran como `pending`: el riesgo de un evento inventado es bajo, pero una agenda
 * con actos que no existen destruye la confianza de la web igual de rápido que un
 * horario mal puesto. El índice único de la tabla evita duplicados entre pasadas.
 */
export async function insertEvents(events: EventInput[]): Promise<number> {
  const db = client();
  if (!db) return 0;

  const valid = events.filter((e) => e.city_slug && e.title && e.starts_at && e.source_url);
  if (valid.length === 0) return 0;

  const { error, count } = await db
    .from("events")
    .upsert(
      valid.map((e) => ({ ...e, status: "pending" as const })),
      { onConflict: "city_slug,title,starts_at", ignoreDuplicates: true, count: "exact" },
    );

  if (error) {
    console.error("[store] eventos fallidos:", error.message);
    return 0;
  }
  return count ?? 0;
}

/** Anuncios a la espera de moderación, con lo mínimo para poder juzgarlos. */
export async function pendingListings(): Promise<unknown[]> {
  const db = client();
  if (!db) return [];

  const { data, error } = await db
    .from("listings")
    .select("id, kind, category, title, description, price, contact_email, contact_phone, website, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) {
    console.error("[store] no se pudieron leer los pendientes:", error.message);
    return [];
  }
  return data ?? [];
}
