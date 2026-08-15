"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { CLASSIFIED_CATEGORIES } from "@/lib/db/listings";
import { adminClient } from "@/lib/db/supabase";
import { currentCity } from "@/lib/tenant-context";
import { isLocale } from "@/i18n/config";
import type { Locale } from "@/lib/eclipse/types";

export interface FormState {
  ok: boolean;
  message: string;
  /** Errores por campo, para pintarlos junto al input correspondiente. */
  errors?: Record<string, string>;
}

const MAX_LEN = { title: 120, description: 4000 } as const;
const VALID_CATEGORIES = new Set<string>(CLASSIFIED_CATEGORIES.map((c) => c.slug));

const MESSAGES = {
  es: {
    title: `El título debe tener entre 3 y ${MAX_LEN.title} caracteres.`,
    description: `La descripción debe tener entre 10 y ${MAX_LEN.description} caracteres.`,
    category: "Elige una categoría de la lista.",
    contact: "Deja al menos un contacto: email o teléfono.",
    email: "Ese email no parece válido.",
    terms: "Tienes que aceptar las condiciones para publicar.",
    price: "El precio debe ser un número positivo.",
    review: "Revisa los campos marcados.",
    noDb: "El tablón todavía no está conectado a la base de datos.",
    failed: "No hemos podido guardar el anuncio. Inténtalo de nuevo.",
    ok: "Anuncio recibido. Lo revisamos y, si todo está en orden, se publica en unas horas.",
  },
  en: {
    title: `The title must be between 3 and ${MAX_LEN.title} characters.`,
    description: `The description must be between 10 and ${MAX_LEN.description} characters.`,
    category: "Choose a category from the list.",
    contact: "Leave at least one contact: email or phone.",
    email: "That email does not look valid.",
    terms: "You must accept the terms to publish.",
    price: "The price must be a positive number.",
    review: "Please check the highlighted fields.",
    noDb: "The board is not connected to the database yet.",
    failed: "We could not save your ad. Please try again.",
    ok: "Ad received. We review it and, if everything is in order, it goes live within a few hours.",
  },
} as const;

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
  const localeRaw = str(form, "locale");
  const locale: Locale = isLocale(localeRaw) ? localeRaw : "es";
  const m = MESSAGES[locale];

  // Honeypot: un campo invisible que solo rellenan los bots. Devolvemos éxito para
  // no darles señal de que han sido detectados.
  if (str(form, "website_url")) return { ok: true, message: m.ok };

  const errors: Record<string, string> = {};
  const title = str(form, "title");
  const description = str(form, "description");
  const category = str(form, "category");
  const email = str(form, "contact_email");
  const phone = str(form, "contact_phone");
  const priceRaw = str(form, "price");
  const acceptTerms = form.get("accept_terms") === "on";

  if (title.length < 3 || title.length > MAX_LEN.title) errors.title = m.title;
  if (description.length < 10 || description.length > MAX_LEN.description) errors.description = m.description;
  if (!VALID_CATEGORIES.has(category)) errors.category = m.category;
  if (!email && !phone) errors.contact_email = m.contact;
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.contact_email = m.email;
  if (!acceptTerms) errors.accept_terms = m.terms;

  let price: number | null = null;
  if (priceRaw) {
    const parsed = Number(priceRaw.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1_000_000) {
      errors.price = m.price;
    } else {
      price = Math.round(parsed * 100) / 100;
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, message: m.review, errors };

  const supabase = adminClient();
  if (!supabase) return { ok: false, message: m.noDb };

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
    return { ok: false, message: m.failed };
  }

  return { ok: true, message: m.ok };
}
