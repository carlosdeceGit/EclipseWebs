"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminConfigured, checkPassword, isAdmin, newSessionValue } from "@/lib/admin/auth";
import {
  setEventStatus,
  setListingStatus,
  setListingTier,
} from "@/lib/db/moderation";
import type { ListingTier } from "@/lib/db/listings";

export interface LoginState {
  error: string | null;
}

/** Un intento fallido cuesta un segundo. No es un antifraude, es un freno. */
function slowDown(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  if (!adminConfigured()) return { error: "El panel no está configurado en este entorno." };

  const password = typeof form.get("password") === "string" ? String(form.get("password")) : "";
  if (!checkPassword(password)) {
    await slowDown();
    return { error: "Contraseña incorrecta." };
  }

  const { value, maxAge } = newSessionValue();
  const store = await cookies();
  store.set(ADMIN_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    // En producción la cookie no viaja por HTTP en claro. En local sí, o no
    // habría manera de entrar sin certificado.
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge,
  });
  revalidatePath("/admin");
  return { error: null };
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete({ name: ADMIN_COOKIE, path: "/admin" });
  revalidatePath("/admin");
}

/**
 * Toda acción de escritura vuelve a comprobar la sesión.
 *
 * Una acción de servidor es un endpoint HTTP como cualquier otro: que la página
 * que la dibuja esté protegida no protege la acción. Sin esta comprobación,
 * bastaría con conocer su identificador para aprobar anuncios sin entrar.
 */
async function guard(): Promise<boolean> {
  return adminConfigured() && (await isAdmin());
}

/*
  Todas las acciones reciben el identificador por `bind` y el `FormData` del
  formulario que las dispara. Así cada botón del panel es un `<form>` de verdad:
  sin estado de cliente, sin `onClick`, y funcionando aunque el JavaScript no
  llegue a cargar.
*/
export async function approveListing(id: string, _form: FormData): Promise<void> {
  if (!(await guard())) return;
  await setListingStatus(id, "approved");
  revalidatePath("/admin");
}

export async function rejectListing(id: string, form: FormData): Promise<void> {
  if (!(await guard())) return;
  const note = typeof form.get("note") === "string" ? String(form.get("note")).trim() : "";
  await setListingStatus(id, "rejected", note);
  revalidatePath("/admin");
}

export async function restoreListing(id: string, _form: FormData): Promise<void> {
  if (!(await guard())) return;
  await setListingStatus(id, "pending");
  revalidatePath("/admin");
}

const TIERS: ListingTier[] = ["free", "featured", "sponsor"];

export async function changeTier(id: string, form: FormData): Promise<void> {
  if (!(await guard())) return;
  const raw = String(form.get("tier") ?? "");
  // El nivel llega de un `select`, pero un `select` es solo una sugerencia del
  // navegador: lo que llega por HTTP puede ser cualquier cosa.
  const tier = TIERS.find((t) => t === raw);
  if (!tier) return;
  await setListingTier(id, tier);
  revalidatePath("/admin");
}

export async function approveEvent(id: string, _form: FormData): Promise<void> {
  if (!(await guard())) return;
  await setEventStatus(id, "approved");
  revalidatePath("/admin");
}

export async function rejectEvent(id: string, _form: FormData): Promise<void> {
  if (!(await guard())) return;
  await setEventStatus(id, "rejected");
  revalidatePath("/admin");
}

export async function restoreEvent(id: string, _form: FormData): Promise<void> {
  if (!(await guard())) return;
  await setEventStatus(id, "pending");
  revalidatePath("/admin");
}
