import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Acceso a Supabase.
 *
 * El proyecto tiene que poder compilar y desplegarse sin base de datos: durante los
 * primeros meses la mayor parte del valor está en el contenido estático, y no
 * queremos que un despliegue falle porque todavía no hay proyecto de Supabase. Por
 * eso los clientes devuelven `null` si faltan las variables y las funciones de
 * consulta caen a datos vacíos.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Cliente público, sujeto a las políticas RLS. Solo lee lo publicado y aprobado. */
export function publicClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

/**
 * Cliente con service role. Salta RLS, así que solo se usa en el servidor: alta de
 * anuncios pendientes de moderación y trabajos de los agentes.
 */
export function adminClient(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export function dbConfigured(): boolean {
  return Boolean(url && anonKey);
}
