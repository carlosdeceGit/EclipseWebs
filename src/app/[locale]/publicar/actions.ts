"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { CLASSIFIED_CATEGORIES, DIRECTORY_CATEGORIES } from "@/lib/db/listings";
import { adminClient } from "@/lib/db/supabase";
import { currentCity } from "@/lib/tenant-context";
import { isLocale } from "@/i18n/config";
import type { Locale } from "@/lib/eclipse/types";

/**
 * Alta pública de contenido.
 *
 * Un solo formulario para las tres cosas que alguien de la ciudad quiere
 * publicar: su negocio en el directorio, un acto con fecha en la agenda, o un
 * anuncio puntual entre particulares. Las tres entran **siempre** como
 * `pending`: nada aparece en la web sin pasar por moderación.
 *
 * Sustituye al alta que solo servía para clasificados. El motivo es de negocio:
 * quien alquila un apartamento o monta una observación no encontraba dónde
 * ponerlo, y el directorio se quedaba vacío esperando altas que nadie sabía
 * cómo hacer.
 */
export type PublishKind = "negocio" | "evento" | "particular";

export interface FormState {
  ok: boolean;
  message: string;
  /** Errores por campo, para pintarlos junto al input correspondiente. */
  errors?: Record<string, string>;
}

const MAX_LEN = { title: 120, description: 4000 } as const;

const DIRECTORY_SLUGS = new Set<string>(DIRECTORY_CATEGORIES.map((c) => c.slug));
const CLASSIFIED_SLUGS = new Set<string>(CLASSIFIED_CATEGORIES.map((c) => c.slug));

const MESSAGES = {
  es: {
    title: `El título debe tener entre 3 y ${MAX_LEN.title} caracteres.`,
    description: `La descripción debe tener entre 10 y ${MAX_LEN.description} caracteres.`,
    category: "Elige una categoría de la lista.",
    contact: "Deja al menos un contacto: email o teléfono.",
    email: "Ese email no parece válido.",
    terms: "Tienes que aceptar las condiciones para publicar.",
    price: "El precio debe ser un número positivo.",
    kind: "Elige qué quieres publicar.",
    startsAt: "Pon la fecha y la hora a la que empieza.",
    startsPast: "Esa fecha ya ha pasado.",
    startsFar: "La fecha tiene que ser anterior al 31 de agosto de 2027.",
    sourceUrl:
      "Hace falta un enlace donde se pueda comprobar el acto: la web del ayuntamiento, la de la agrupación o la publicación donde lo anunciáis.",
    website: "Esa dirección web no parece válida.",
    review: "Revisa los campos marcados.",
    noDb: "El alta todavía no está conectada a la base de datos.",
    failed: "No hemos podido guardar tu publicación. Inténtalo de nuevo.",
    duplicate: "Ese acto ya está enviado con la misma fecha. Si quieres cambiar algo, escríbenos en vez de volver a enviarlo.",
    ok: "Recibido. Lo revisamos a mano y, si todo está en orden, se publica en unas horas.",
  },
  en: {
    title: `The title must be between 3 and ${MAX_LEN.title} characters.`,
    description: `The description must be between 10 and ${MAX_LEN.description} characters.`,
    category: "Choose a category from the list.",
    contact: "Leave at least one contact: email or phone.",
    email: "That email does not look valid.",
    terms: "You must accept the terms to publish.",
    price: "The price must be a positive number.",
    kind: "Choose what you want to publish.",
    startsAt: "Set the date and time it starts.",
    startsPast: "That date is in the past.",
    startsFar: "The date must be before 31 August 2027.",
    sourceUrl:
      "We need a link where the event can be checked: the council's page, the society's site or wherever you announce it.",
    website: "That web address does not look valid.",
    review: "Please check the highlighted fields.",
    noDb: "Publishing is not connected to the database yet.",
    failed: "We could not save your submission. Please try again.",
    duplicate: "That event has already been submitted with the same date. If you need to change something, write to us instead of submitting it again.",
    ok: "Received. We review it by hand and, if everything is in order, it goes live within a few hours.",
  },
} as const;

function str(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/** Solo http y https. Un `javascript:` en un campo que luego se pinta es un XSS. */
function validUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** Nada del eclipse tiene sentido después de este día. */
const HORIZON = Date.parse("2027-08-31T23:59:59Z");

export async function publish(_prev: FormState, form: FormData): Promise<FormState> {
  const localeRaw = str(form, "locale");
  const locale: Locale = isLocale(localeRaw) ? localeRaw : "es";
  const m = MESSAGES[locale];

  // Honeypot: un campo invisible que solo rellenan los bots. Se devuelve éxito
  // para no darles señal de que han sido detectados.
  if (str(form, "website_url")) return { ok: true, message: m.ok };

  const kindRaw = str(form, "publish_kind");
  if (kindRaw !== "negocio" && kindRaw !== "evento" && kindRaw !== "particular") {
    return { ok: false, message: m.review, errors: { publish_kind: m.kind } };
  }
  const kind: PublishKind = kindRaw;

  const errors: Record<string, string> = {};
  const title = str(form, "title");
  const description = str(form, "description");
  const category = str(form, "category");
  const email = str(form, "contact_email");
  const phone = str(form, "contact_phone");
  const website = str(form, "website");

  if (title.length < 3 || title.length > MAX_LEN.title) errors.title = m.title;
  if (description.length < 10 || description.length > MAX_LEN.description) errors.description = m.description;
  if (!email && !phone) errors.contact_email = m.contact;
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.contact_email = m.email;
  if (website && !validUrl(website)) errors.website = m.website;
  if (form.get("accept_terms") !== "on") errors.accept_terms = m.terms;

  const allowed = kind === "particular" ? CLASSIFIED_SLUGS : DIRECTORY_SLUGS;
  if (kind !== "evento" && !allowed.has(category)) errors.category = m.category;

  let price: number | null = null;
  const priceRaw = str(form, "price");
  if (priceRaw) {
    const parsed = Number(priceRaw.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1_000_000) {
      errors.price = m.price;
    } else {
      price = Math.round(parsed * 100) / 100;
    }
  }

  // Campos que solo existen para los actos con fecha.
  let startsAt: string | null = null;
  const sourceUrl = str(form, "source_url");
  if (kind === "evento") {
    const raw = str(form, "starts_at");
    const parsed = Date.parse(raw);
    if (!raw || Number.isNaN(parsed)) {
      errors.starts_at = m.startsAt;
    } else if (parsed < Date.now()) {
      errors.starts_at = m.startsPast;
    } else if (parsed > HORIZON) {
      errors.starts_at = m.startsFar;
    } else {
      startsAt = new Date(parsed).toISOString();
    }
    // La fuente es obligatoria y es lo que hace verificable la agenda: es la
    // misma regla que se le exige al agente que la rellena sola.
    if (!sourceUrl || !validUrl(sourceUrl)) errors.source_url = m.sourceUrl;
  }

  if (Object.keys(errors).length > 0) return { ok: false, message: m.review, errors };

  const supabase = adminClient();
  if (!supabase) return { ok: false, message: m.noDb };

  const city = await currentCity();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const ipHash = ip ? createHash("sha256").update(`${ip}:eclipse`).digest("hex") : null;

  if (kind === "evento") {
    const { error } = await supabase.from("events").insert({
      city_slug: city.slug,
      title,
      description,
      starts_at: startsAt,
      venue: str(form, "venue") || null,
      is_free: form.get("is_free") === "on",
      organizer: str(form, "organizer") || null,
      source_url: sourceUrl,
      source_name: str(form, "organizer") || null,
      status: "pending",
    });
    if (error) {
      /*
        La tabla tiene una restricción única sobre (ciudad, título, fecha) para
        que el agente no duplique el mismo acto en cada pasada. Un envío repetido
        choca contra ella, y decirle «error, inténtalo de nuevo» a quien acaba de
        enviarlo bien es invitarle a duplicarlo otra vez.
      */
      if (error.code === "23505") return { ok: false, message: m.duplicate };
      console.error("[publicar] alta de evento fallida:", error.message);
      return { ok: false, message: m.failed };
    }
    return { ok: true, message: m.ok };
  }

  const { error } = await supabase.from("listings").insert({
    kind: kind === "negocio" ? "directory" : "classified",
    status: "pending",
    tier: "free",
    city_slug: city.slug,
    category,
    title,
    description,
    price,
    contact_email: email || null,
    contact_phone: phone || null,
    website: website || null,
    ip_hash: ipHash,
  });

  if (error) {
    console.error("[publicar] alta fallida:", error.message);
    return { ok: false, message: m.failed };
  }

  return { ok: true, message: m.ok };
}
