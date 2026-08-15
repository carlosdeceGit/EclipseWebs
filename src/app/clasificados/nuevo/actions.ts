"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { CLASSIFIED_CATEGORIES } from "@/lib/db/listings";
import { adminClient } from "@/lib/db/supabase";
import { currentCity } from "@/lib/tenant-context";

export interface FormState {
  ok: boolean;
  message: string;
  /** Errores por campo, para pintarlos junto al input correspondiente. */
  errors?: Record<string, string>;
}

const MAX_LEN = { title: 120, description: 4000 } as const;
const VALID_CATEGORIES = new Set<string>(CLASSIFIED_CATEGORIES.map((c) => c.slug));

function str(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Alta de un clasificado.
 *
 * Entra siempre como `pending`: nada se publica sin pasar por moderación. La IP se
 * guarda solo como hash, que basta para detectar a quien inunda el tablón sin
 * necesidad de almacenar un dato personal en claro.
 */
export async function createClassified(_prev: FormState, form: FormData): Promise<FormState> {
  // Honeypot: un campo invisible que solo rellenan los bots. Devolvemos éxito para
  // no darles señal de que han sido detectados.
  if (str(form, "website_url")) return { ok: true, message: "Anuncio recibido." };

  const errors: Record<string, string> = {};
  const title = str(form, "title");
  const description = str(form, "description");
  const category = str(form, "category");
  const email = str(form, "contact_email");
  const phone = str(form, "contact_phone");
  const priceRaw = str(form, "price");
  const acceptTerms = form.get("accept_terms") === "on";

  if (title.length < 3 || title.length > MAX_LEN.title) {
    errors.title = `El título debe tener entre 3 y ${MAX_LEN.title} caracteres.`;
  }
  if (description.length < 10 || description.length > MAX_LEN.description) {
    errors.description = `La descripción debe tener entre 10 y ${MAX_LEN.description} caracteres.`;
  }
  if (!VALID_CATEGORIES.has(category)) {
    errors.category = "Elige una categoría de la lista.";
  }
  if (!email && !phone) {
    errors.contact_email = "Deja al menos un contacto: email o teléfono.";
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    errors.contact_email = "Ese email no parece válido.";
  }
  if (!acceptTerms) {
    errors.accept_terms = "Tienes que aceptar las condiciones para publicar.";
  }

  let price: number | null = null;
  if (priceRaw) {
    const parsed = Number(priceRaw.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1_000_000) {
      errors.price = "El precio debe ser un número positivo.";
    } else {
      price = Math.round(parsed * 100) / 100;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Revisa los campos marcados.", errors };
  }

  const supabase = adminClient();
  if (!supabase) {
    return {
      ok: false,
      message:
        "El tablón todavía no está conectado a la base de datos. Configura SUPABASE_SERVICE_ROLE_KEY para activarlo.",
    };
  }

  const city = await currentCity();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const ipHash = ip ? createHash("sha256").update(`${ip}:eclipse`).digest("hex") : null;

  const { error } = await supabase.from("listings").insert({
    kind: "classified",
    status: "pending",
    tier: "free",
    city_slug: city.slug,
    category,
    title,
    description,
    price,
    contact_email: email || null,
    contact_phone: phone || null,
    ip_hash: ipHash,
  });

  if (error) {
    console.error("[clasificados] alta fallida:", error.message);
    return { ok: false, message: "No hemos podido guardar el anuncio. Inténtalo de nuevo." };
  }

  return {
    ok: true,
    message: "Anuncio recibido. Lo revisamos y, si todo está en orden, se publica en unas horas.",
  };
}
