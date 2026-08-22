import { createHmac, timingSafeEqual, createHash } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Puerta del panel de moderación.
 *
 * El panel escribe con la clave de service role, que salta RLS: si fuese
 * alcanzable sin autenticar, cualquiera podría aprobarse su propio anuncio o
 * borrar el directorio entero. Así que la puerta es lo primero que se construye,
 * no lo último.
 *
 * Es una contraseña única en una variable de entorno y no un sistema de cuentas
 * a propósito: hoy modera una sola persona. Cuando haya más de una, esto se
 * sustituye por Supabase Auth y el panel no cambia — solo cambia `isAdmin()`.
 */
const COOKIE = "eclipse_admin";
const PURPOSE = "eclipse-admin-session-v1";

/** Ocho horas: una sesión de trabajo, no un acceso permanente. */
const TTL_MS = 8 * 60 * 60 * 1000;

/** El panel solo existe si hay contraseña. Sin ella devuelve 404. */
export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function secret(): string {
  const value = process.env.ADMIN_PASSWORD;
  if (!value) throw new Error("ADMIN_PASSWORD no está configurada");
  return value;
}

function sign(expiry: number): string {
  return createHmac("sha256", secret()).update(`${PURPOSE}:${expiry}`).digest("hex");
}

/**
 * Comparación en tiempo constante.
 *
 * `timingSafeEqual` revienta si los búferes miden distinto, así que se comparan
 * los digest y no las cadenas: siempre 32 bytes, venga lo que venga por el
 * formulario, y de paso no se filtra la longitud de la contraseña.
 */
function equal(a: string, b: string): boolean {
  return timingSafeEqual(
    createHash("sha256").update(a).digest(),
    createHash("sha256").update(b).digest(),
  );
}

export function checkPassword(candidate: string): boolean {
  if (!candidate || !adminConfigured()) return false;
  return equal(candidate, secret());
}

/** Valor de la cookie: caducidad en claro más su firma. */
export function newSessionValue(): { value: string; maxAge: number } {
  const expiry = Date.now() + TTL_MS;
  return { value: `${expiry}.${sign(expiry)}`, maxAge: Math.floor(TTL_MS / 1000) };
}

function validSession(raw: string | undefined): boolean {
  if (!raw || !adminConfigured()) return false;
  const [expiryRaw, signature] = raw.split(".");
  const expiry = Number(expiryRaw);
  // La caducidad se comprueba **antes** que la firma para no gastar el HMAC en
  // una cookie ya vencida, y después igualmente se verifica la firma: sin ella,
  // cualquiera se pondría una fecha futura y entraría.
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;
  if (!signature) return false;
  return equal(signature, sign(expiry));
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return validSession(store.get(COOKIE)?.value);
}

export const ADMIN_COOKIE = COOKIE;
