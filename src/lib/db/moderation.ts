import { adminClient } from "./supabase";
import type { Listing, ListingTier } from "./listings";
import type { EclipseEvent } from "./events";

/**
 * Consultas del panel de moderación.
 *
 * Todas usan la clave de service role y por tanto **saltan RLS**: es la única
 * forma de ver lo que está pendiente, que es precisamente lo que las políticas
 * esconden al público. Ninguna de estas funciones se puede llamar desde un
 * componente de cliente, y ninguna se llama sin pasar antes por `isAdmin()`.
 *
 * A diferencia del resto de la web, el panel no filtra por tenant: modera una
 * sola persona para los cuatro dominios, y obligarla a entrar cuatro veces sería
 * multiplicar el trabajo por cuatro sin ganar nada.
 */
export interface ModerationRow extends Listing {
  moderation_note: string | null;
  /**
   * Hash de la IP de quien envió el anuncio. Nunca la IP en claro: para detectar
   * a quien inunda el tablón basta con ver el mismo hash repetido, y para eso no
   * hace falta guardar un dato personal.
   */
  ip_hash: string | null;
}

export interface PendingEvent extends EclipseEvent {
  status: string;
  created_at: string;
}

export function moderationAvailable(): boolean {
  return adminClient() !== null;
}

export async function pendingListings(): Promise<ModerationRow[]> {
  const db = adminClient();
  if (!db) return [];
  const { data, error } = await db
    .from("listings")
    .select("*")
    .eq("status", "pending")
    // El más antiguo primero: quien lleva más tiempo esperando, antes.
    .order("created_at", { ascending: true })
    .limit(200);
  if (error) {
    console.error("[moderación] anuncios pendientes:", error.message);
    return [];
  }
  return (data ?? []) as ModerationRow[];
}

export async function pendingEvents(): Promise<PendingEvent[]> {
  const db = adminClient();
  if (!db) return [];
  const { data, error } = await db
    .from("events")
    .select("*")
    .eq("status", "pending")
    .order("starts_at", { ascending: true })
    .limit(200);
  if (error) {
    console.error("[moderación] eventos pendientes:", error.message);
    return [];
  }
  return (data ?? []) as PendingEvent[];
}

/**
 * Lo decidido últimamente.
 *
 * Existe para poder deshacer: un rechazo por error se ve aquí y se revierte,
 * en vez de quedar enterrado en una tabla a la que solo se llega por SQL.
 */
export async function recentDecisions(limit = 30): Promise<ModerationRow[]> {
  const db = adminClient();
  if (!db) return [];
  const { data, error } = await db
    .from("listings")
    .select("*")
    .in("status", ["approved", "rejected"])
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[moderación] decisiones recientes:", error.message);
    return [];
  }
  return (data ?? []) as ModerationRow[];
}

export async function recentEventDecisions(limit = 30): Promise<PendingEvent[]> {
  const db = adminClient();
  if (!db) return [];
  const { data, error } = await db
    .from("events")
    .select("*")
    .in("status", ["approved", "rejected"])
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[moderación] eventos decididos:", error.message);
    return [];
  }
  return (data ?? []) as PendingEvent[];
}

export async function setListingStatus(
  id: string,
  status: "approved" | "rejected" | "pending",
  note?: string,
): Promise<boolean> {
  const db = adminClient();
  if (!db) return false;
  const patch: Record<string, unknown> = { status };
  if (note !== undefined) patch.moderation_note = note || null;
  const { error } = await db.from("listings").update(patch).eq("id", id);
  if (error) {
    console.error("[moderación] cambio de estado fallido:", error.message);
    return false;
  }
  return true;
}

/**
 * Nivel de pago de una ficha.
 *
 * Es lo único del panel que mueve dinero, así que vive separado del estado: se
 * sube a destacado **después** de cobrar, no como parte de aprobar. Mezclarlo
 * sería el camino directo a regalar destacados por descuido.
 */
export async function setListingTier(id: string, tier: ListingTier): Promise<boolean> {
  const db = adminClient();
  if (!db) return false;
  const { error } = await db.from("listings").update({ tier }).eq("id", id);
  if (error) {
    console.error("[moderación] cambio de nivel fallido:", error.message);
    return false;
  }
  return true;
}

export async function setEventStatus(
  id: string,
  status: "approved" | "rejected" | "pending",
): Promise<boolean> {
  const db = adminClient();
  if (!db) return false;
  const { error } = await db.from("events").update({ status }).eq("id", id);
  if (error) {
    console.error("[moderación] evento, cambio de estado fallido:", error.message);
    return false;
  }
  return true;
}

export interface ModerationCounts {
  listings: number;
  events: number;
}

export async function pendingCounts(): Promise<ModerationCounts> {
  const db = adminClient();
  if (!db) return { listings: 0, events: 0 };
  const [listings, events] = await Promise.all([
    db.from("listings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    db.from("events").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);
  return { listings: listings.count ?? 0, events: events.count ?? 0 };
}
