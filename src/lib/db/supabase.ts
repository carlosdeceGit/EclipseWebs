import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Acceso a Supabase.
 *
 * El proyecto tiene que poder compilar y desplegarse sin base de datos: durante los
 * primeros meses la mayor parte del valor está en el contenido estático, y no
 * queremos que un despliegue falle porque todavía no hay proyecto de Supabase. Por
 * eso los clientes devuelven `null` si faltan las variables y las funciones de
 * consulta caen a datos vacíos.
 *
 * ## Por qué se aceptan dos nombres para cada variable
 *
 * La integración oficial de Vercel con Supabase inyecta las credenciales sola, pero
 * los nombres que usa han cambiado entre versiones: unas veces con prefijo
 * `NEXT_PUBLIC_` y otras sin él. Aceptar ambos es una línea por variable y evita el
 * fallo más tonto posible —el directorio vacío en producción porque la clave estaba
 * puesta con otro nombre—, que además es difícil de diagnosticar porque no rompe
 * nada: simplemente no hay datos. `agents/store.ts` ya lo hacía así.
 *
 * Ninguna de estas credenciales llega al navegador: el cliente «público» solo se usa
 * desde componentes de servidor. El prefijo `NEXT_PUBLIC_` aquí no aporta nada y se
 * conserva por compatibilidad con lo que ya hubiera configurado.
 */
function env(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  return undefined;
}

/*
  Se leen dentro de cada función y no en el ámbito del módulo: así el valor sale del
  entorno de ejecución en cada llamada, en vez de quedar congelado en el primer
  arranque del proceso.
*/
function url(): string | undefined {
  return env("NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL");
}

function anonKey(): string | undefined {
  return env(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_ANON_KEY",
    // Nombre de las claves publicables nuevas, por si la integración usa ése.
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_PUBLISHABLE_KEY",
  );
}

function serviceKey(): string | undefined {
  return env("SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY");
}

/** Cliente público, sujeto a las políticas RLS. Solo lee lo publicado y aprobado. */
export function publicClient(): SupabaseClient | null {
  const base = url();
  const key = anonKey();
  if (!base || !key) return null;
  return createClient(base, key, { auth: { persistSession: false } });
}

/**
 * Cliente con service role. Salta RLS, así que solo se usa en el servidor: alta de
 * anuncios pendientes de moderación, panel de moderación y trabajos de los agentes.
 */
export function adminClient(): SupabaseClient | null {
  const base = url();
  const key = serviceKey();
  if (!base || !key) return null;
  return createClient(base, key, { auth: { persistSession: false } });
}

export function dbConfigured(): boolean {
  return Boolean(url() && anonKey());
}

/**
 * Qué credenciales hay puestas, sin revelar ninguna.
 *
 * Lo usa el panel de moderación para decir **cuál** falta en vez de un genérico
 * «no hay base de datos». Con la integración de Vercel inyectando las variables
 * sola, el fallo típico no es que falten todas: es que falta una, o que apuntan a
 * otro proyecto de Supabase. Enseñar el nombre de la variable que sí llegó y el
 * host al que apunta convierte diez minutos de tanteo en una mirada.
 *
 * Devuelve el host, no la URL entera, y jamás una clave.
 */
export function dbStatus(): {
  url: string | null;
  hasAnonKey: boolean;
  hasServiceKey: boolean;
  /** Nombres de variable que sí están definidos, para ver cuál usó la integración. */
  presentNames: string[];
} {
  const base = url();
  let host: string | null = null;
  if (base) {
    try {
      host = new URL(base).host;
    } catch {
      // Una URL mal escrita también es un diagnóstico útil: se enseña tal cual.
      host = base;
    }
  }

  const candidates = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_SECRET_KEY",
  ];

  return {
    url: host,
    hasAnonKey: Boolean(anonKey()),
    hasServiceKey: Boolean(serviceKey()),
    presentNames: candidates.filter((name) => Boolean(process.env[name])),
  };
}
