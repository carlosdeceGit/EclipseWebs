import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { EventCandidate, ModerationCandidate } from "./guardrails";

/**
 * Persistencia de los agentes.
 *
 * Usa la service role key porque escribe en tablas sin política pública. Si no está
 * configurada, todo se degrada a no-op y el agente sigue sirviendo para inspeccionar
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
  result: {
    ok: boolean;
    summary: string;
    itemsCreated?: number;
    itemsUpdated?: number;
    error?: string;
  },
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
      items_updated: result.itemsUpdated ?? 0,
      error: result.error ?? null,
    })
    .eq("id", id);
}

/**
 * Registro de acciones individuales.
 *
 * `agent_runs` dice que un agente corrió; esto dice qué hizo. Es lo que permite
 * auditar a posteriori por qué se publicó o se rechazó algo concreto, que en un
 * sistema que actúa solo es la diferencia entre poder confiar en él o no.
 */
export async function logActions(
  runId: string | null,
  agent: string,
  actions: { action: string; targetId?: string | null; detail: string; ok: boolean }[],
): Promise<void> {
  const db = client();
  if (!db || actions.length === 0) return;

  const { error } = await db.from("agent_actions").insert(
    actions.map((a) => ({
      run_id: runId,
      agent,
      action: a.action,
      target_id: a.targetId ?? null,
      detail: a.detail.slice(0, 2000),
      ok: a.ok,
    })),
  );
  if (error) console.error("[store] no se pudieron registrar las acciones:", error.message);
}

/**
 * Publica eventos ya validados.
 *
 * Entran como `approved`: el agente actúa por su cuenta. Lo que los hace publicables
 * no es una revisión humana sino que hayan pasado los guardarraíles, que exigen
 * fuente oficial, ciudad conocida y fecha con sentido. El índice único de la tabla
 * evita duplicados entre pasadas diarias.
 */
export async function publishEvents(events: EventCandidate[]): Promise<number> {
  const db = client();
  if (!db || events.length === 0) return 0;

  const { error, count } = await db.from("events").upsert(
    events.map((e) => ({ ...e, status: "approved" as const })),
    { onConflict: "city_slug,title,starts_at", ignoreDuplicates: true, count: "exact" },
  );

  if (error) {
    console.error("[store] eventos fallidos:", error.message);
    return 0;
  }
  return count ?? 0;
}

/** Anuncios a la espera de moderación, con lo mínimo para poder juzgarlos. */
export async function pendingListings(): Promise<
  { id: string; kind: string; category: string; title: string; description: string }[]
> {
  const db = client();
  if (!db) return [];

  const { data, error } = await db
    .from("listings")
    .select("id, kind, category, title, description, price, contact_email, contact_phone, website, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error("[store] no se pudieron leer los pendientes:", error.message);
    return [];
  }
  return (data ?? []) as never;
}

const STATUS_BY_DECISION = {
  aprobar: "approved",
  rechazar: "rejected",
  revisar: "pending",
} as const;

/**
 * Aplica las decisiones de moderación.
 *
 * "revisar" deja el anuncio como estaba pero anota el motivo, para que quien lo mire
 * después sepa por qué el agente no se atrevió.
 */
export async function applyModeration(decisions: ModerationCandidate[]): Promise<number> {
  const db = client();
  if (!db || decisions.length === 0) return 0;

  let applied = 0;
  for (const d of decisions) {
    const { error } = await db
      .from("listings")
      .update({
        status: STATUS_BY_DECISION[d.decision],
        moderation_note: `[agente] ${d.decision}: ${d.reason}`,
      })
      .eq("id", d.id)
      // Solo se toca lo que sigue pendiente: si una persona ya decidió mientras
      // corría el agente, su decisión manda.
      .eq("status", "pending");

    if (error) {
      console.error(`[store] moderación fallida para ${d.id}:`, error.message);
      continue;
    }
    applied++;
  }
  return applied;
}
