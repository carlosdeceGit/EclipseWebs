"use client";

import { useActionState, useState } from "react";
import { publish, type FormState, type PublishKind } from "./actions";
import { CLASSIFIED_CATEGORIES, DIRECTORY_CATEGORIES } from "@/lib/db/listings";
import type { Locale } from "@/lib/eclipse/types";

const initialState: FormState = { ok: false, message: "" };

const COPY = {
  es: {
    kindLegend: "¿Qué quieres publicar?",
    kinds: {
      negocio: {
        label: "Un negocio o alojamiento",
        hint: "Hotel, apartamento, restaurante, actividad, tienda o servicio. Se publica en el directorio de la ciudad y no caduca.",
      },
      evento: {
        label: "Un evento con fecha",
        hint: "Observación, charla, taller o ruta. Sale en la agenda ordenado por fecha y desaparece solo cuando pasa.",
      },
      particular: {
        label: "Un anuncio entre particulares",
        hint: "Una habitación suelta, plazas en un coche, material de sobra. Caduca a los 60 días o el 3 de agosto de 2027.",
      },
    },
    title: "Título",
    titleHint: "Sé concreto: qué es y dónde.",
    placeholders: {
      negocio: "Apartamento con terraza y vistas al Estrecho",
      evento: "Observación pública del eclipse desde el Parque Marítimo",
      particular: "Habitación doble a 10 min de la playa, del 31 al 3",
    },
    category: "Categoría",
    choose: "Elige una…",
    description: "Descripción",
    descriptionHint:
      "Cuenta las condiciones, las fechas exactas y qué incluye. Cuanto más claro, menos preguntas te van a hacer.",
    startsAt: "Empieza el",
    startsAtHint: "Fecha y hora local. Si dura varias horas, dilo en la descripción.",
    venue: "Lugar (opcional)",
    venueHint: "Dónde se queda la gente: el nombre del sitio, no la dirección postal.",
    organizer: "Quién lo organiza (opcional)",
    isFree: "La entrada es gratuita",
    sourceUrl: "Enlace donde se puede comprobar",
    sourceUrlHint:
      "La convocatoria en la web del ayuntamiento, la de la agrupación o la publicación donde lo anunciáis. Es lo que nos permite verificarlo antes de publicarlo.",
    price: "Precio en euros (opcional)",
    priceHint: "Déjalo vacío si no aplica o si es a convenir.",
    website: "Web (opcional)",
    email: "Email de contacto",
    phone: "Teléfono (opcional)",
    contactHint: "Al menos uno de los dos. Es lo que verá quien quiera contactarte.",
    honeypot: "No rellenes este campo",
    terms:
      "Confirmo que lo que publico es real, que puedo cumplir lo que ofrezco y acepto las condiciones de publicación.",
    submit: "Enviar para revisión",
    sending: "Enviando…",
    receivedTitle: "Recibido",
    another: "Publicar otra cosa",
  },
  en: {
    kindLegend: "What do you want to list?",
    kinds: {
      negocio: {
        label: "A business or accommodation",
        hint: "Hotel, apartment, restaurant, activity, shop or service. It goes in the city directory and does not expire.",
      },
      evento: {
        label: "An event with a date",
        hint: "Public viewing, talk, workshop or walk. It appears in the agenda by date and drops off once it has passed.",
      },
      particular: {
        label: "A private ad",
        hint: "A spare room, seats in a car, gear you no longer need. Expires after 60 days or on 3 August 2027.",
      },
    },
    title: "Title",
    titleHint: "Be specific: what it is and where.",
    placeholders: {
      negocio: "Apartment with terrace and views over the Strait",
      evento: "Public eclipse viewing from the Parque Marítimo",
      particular: "Double room 10 min from the beach, 31 July to 3 August",
    },
    category: "Category",
    choose: "Choose one…",
    description: "Description",
    descriptionHint:
      "Explain the terms, the exact dates and what is included. The clearer it is, the fewer questions you get.",
    startsAt: "Starts on",
    startsAtHint: "Local date and time. If it runs for hours, say so in the description.",
    venue: "Venue (optional)",
    venueHint: "Where people gather: the name of the place, not the postal address.",
    organizer: "Organiser (optional)",
    isFree: "Free entry",
    sourceUrl: "Link where it can be checked",
    sourceUrlHint:
      "The listing on the council's site, the society's page or wherever you announce it. It is what lets us verify it before publishing.",
    price: "Price in euros (optional)",
    priceHint: "Leave empty if not applicable or negotiable.",
    website: "Website (optional)",
    email: "Contact email",
    phone: "Phone (optional)",
    contactHint: "At least one of the two. It is what people will use to reach you.",
    honeypot: "Do not fill in this field",
    terms:
      "I confirm this listing is genuine, that I can deliver what I offer, and I accept the publication terms.",
    submit: "Send for review",
    sending: "Sending…",
    receivedTitle: "Received",
    another: "List something else",
  },
} as const;

const inputStyle = {
  borderColor: "hsl(var(--border))",
  background: "hsl(var(--bg))",
  color: "hsl(var(--text))",
};

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && !error && (
        <span className="mt-1 block text-xs" style={{ color: "hsl(var(--muted))" }}>
          {hint}
        </span>
      )}
      {error && (
        <span className="mt-1 block text-xs" style={{ color: "hsl(var(--danger))" }} role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

const KINDS: PublishKind[] = ["negocio", "evento", "particular"];

/**
 * Alta pública, en un solo formulario.
 *
 * El tipo se elige arriba y el resto del formulario se adapta: un evento pide
 * fecha y fuente, un negocio pide web, un anuncio de particular pide precio. Es
 * un solo camino en vez de tres páginas distintas, porque la mayoría de la gente
 * no sabe de antemano si lo suyo es «directorio» o «clasificado» — y no tiene
 * por qué saberlo.
 *
 * El campo del tipo se mantiene en estado de React y no solo en el DOM para que,
 * si la acción devuelve errores, el formulario vuelva a pintarse con la misma
 * pestaña abierta en la que estaba.
 */
export function PublishForm({ locale, initialKind }: { locale: Locale; initialKind: PublishKind }) {
  const [state, formAction, pending] = useActionState(publish, initialState);
  const [kind, setKind] = useState<PublishKind>(initialKind);
  const c = COPY[locale];

  if (state.ok) {
    return (
      <div
        className="enter rounded-2xl border p-6"
        style={{ borderColor: "hsl(var(--accent))", background: "hsl(var(--surface))" }}
      >
        <h2 className="text-lg font-bold">{c.receivedTitle}</h2>
        <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
          {state.message}
        </p>
        <a
          href="?"
          className="tap mt-5 inline-flex items-center rounded-xl border px-4 font-semibold"
          style={{ borderColor: "hsl(var(--border-strong))" }}
        >
          {c.another}
        </a>
      </div>
    );
  }

  const categories = kind === "particular" ? CLASSIFIED_CATEGORIES : DIRECTORY_CATEGORIES;

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="publish_kind" value={kind} />

      <fieldset>
        <legend className="mb-3 text-sm font-medium">{c.kindLegend}</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {KINDS.map((option) => {
            const active = kind === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setKind(option)}
                aria-pressed={active}
                className="card-interactive rounded-2xl border p-4 text-left"
                style={{
                  borderColor: active ? "hsl(var(--accent))" : "hsl(var(--border))",
                  background: active ? "hsl(var(--accent) / 0.08)" : "hsl(var(--surface))",
                }}
              >
                <span className="block font-semibold">{c.kinds[option].label}</span>
                <span className="mt-1 block text-xs" style={{ color: "hsl(var(--muted))" }}>
                  {c.kinds[option].hint}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <Field label={c.title} error={state.errors?.title} hint={c.titleHint}>
        <input
          name="title"
          required
          maxLength={120}
          placeholder={c.placeholders[kind]}
          className="w-full rounded-lg border px-3 py-2"
          style={inputStyle}
        />
      </Field>

      {kind !== "evento" && (
        <Field label={c.category} error={state.errors?.category}>
          <select name="category" required className="w-full rounded-lg border px-3 py-2" style={inputStyle}>
            <option value="">{c.choose}</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.icon} {cat.label[locale]}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field label={c.description} error={state.errors?.description} hint={c.descriptionHint}>
        <textarea
          name="description"
          required
          rows={6}
          maxLength={4000}
          className="w-full rounded-lg border px-3 py-2"
          style={inputStyle}
        />
      </Field>

      {kind === "evento" && (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={c.startsAt} error={state.errors?.starts_at} hint={c.startsAtHint}>
              <input
                name="starts_at"
                type="datetime-local"
                required
                className="w-full rounded-lg border px-3 py-2"
                style={inputStyle}
              />
            </Field>
            <Field label={c.venue} hint={c.venueHint}>
              <input name="venue" className="w-full rounded-lg border px-3 py-2" style={inputStyle} />
            </Field>
          </div>

          <Field label={c.organizer}>
            <input name="organizer" className="w-full rounded-lg border px-3 py-2" style={inputStyle} />
          </Field>

          <Field label={c.sourceUrl} error={state.errors?.source_url} hint={c.sourceUrlHint}>
            <input
              name="source_url"
              type="url"
              required
              placeholder="https://…"
              className="w-full rounded-lg border px-3 py-2"
              style={inputStyle}
            />
          </Field>

          <label className="flex items-start gap-2 text-sm">
            <input name="is_free" type="checkbox" className="mt-1" defaultChecked />
            <span style={{ color: "hsl(var(--muted))" }}>{c.isFree}</span>
          </label>
        </>
      )}

      {kind === "particular" && (
        <Field label={c.price} error={state.errors?.price} hint={c.priceHint}>
          <input
            name="price"
            inputMode="decimal"
            placeholder="80"
            className="w-full rounded-lg border px-3 py-2"
            style={inputStyle}
          />
        </Field>
      )}

      {kind === "negocio" && (
        <Field label={c.website} error={state.errors?.website}>
          <input
            name="website"
            type="url"
            placeholder="https://…"
            className="w-full rounded-lg border px-3 py-2"
            style={inputStyle}
          />
        </Field>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={c.email} error={state.errors?.contact_email} hint={c.contactHint}>
          <input name="contact_email" type="email" className="w-full rounded-lg border px-3 py-2" style={inputStyle} />
        </Field>
        <Field label={c.phone}>
          <input name="contact_phone" type="tel" className="w-full rounded-lg border px-3 py-2" style={inputStyle} />
        </Field>
      </div>

      {/* Honeypot: invisible para personas, irresistible para bots. */}
      <div className="hidden" aria-hidden="true">
        <label>
          {c.honeypot}
          <input name="website_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label className="flex items-start gap-2 text-sm">
          <input name="accept_terms" type="checkbox" className="mt-1" />
          <span style={{ color: "hsl(var(--muted))" }}>{c.terms}</span>
        </label>
        {state.errors?.accept_terms && (
          <span className="mt-1 block text-xs" style={{ color: "hsl(var(--danger))" }} role="alert">
            {state.errors.accept_terms}
          </span>
        )}
      </div>

      {state.message && !state.ok && (
        <p className="text-sm" style={{ color: "hsl(var(--danger))" }} role="alert">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="tap inline-flex items-center rounded-xl px-5 font-semibold disabled:opacity-60"
        style={{ background: "hsl(var(--accent))", color: "hsl(var(--on-accent))" }}
      >
        {pending ? c.sending : c.submit}
      </button>
    </form>
  );
}
