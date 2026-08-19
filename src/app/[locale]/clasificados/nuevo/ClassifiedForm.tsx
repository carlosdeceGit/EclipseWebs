"use client";

import { useActionState } from "react";
import { createClassified, type FormState } from "./actions";
import { CLASSIFIED_CATEGORIES } from "@/lib/db/listings";
import type { Locale } from "@/lib/eclipse/types";

const initialState: FormState = { ok: false, message: "" };

const COPY = {
  es: {
    title: "Título",
    titleHint: "Sé concreto: lo que ofreces y dónde.",
    titlePlaceholder: "Habitación doble a 10 min de la playa, del 31 al 3",
    category: "Categoría",
    choose: "Elige una…",
    description: "Descripción",
    descriptionHint: "Cuenta las condiciones, las fechas exactas y qué incluye. Cuanto más claro, menos preguntas.",
    price: "Precio en euros (opcional)",
    priceHint: "Déjalo vacío si no aplica o si es a convenir.",
    email: "Email de contacto",
    phone: "Teléfono (opcional)",
    honeypot: "No rellenes este campo",
    terms: "Confirmo que el anuncio es real, que puedo cumplir lo que ofrezco y acepto las condiciones de publicación.",
    submit: "Publicar anuncio",
    sending: "Enviando…",
    receivedTitle: "Recibido",
  },
  en: {
    title: "Title",
    titleHint: "Be specific: what you offer and where.",
    titlePlaceholder: "Double room 10 min from the beach, 31 July to 3 August",
    category: "Category",
    choose: "Choose one…",
    description: "Description",
    descriptionHint: "Explain the terms, the exact dates and what is included. The clearer it is, the fewer questions you get.",
    price: "Price in euros (optional)",
    priceHint: "Leave empty if not applicable or negotiable.",
    email: "Contact email",
    phone: "Phone (optional)",
    honeypot: "Do not fill in this field",
    terms: "I confirm this listing is genuine, that I can deliver what I offer, and I accept the publication terms.",
    submit: "Post ad",
    sending: "Sending…",
    receivedTitle: "Received",
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
        <span className="mt-1 block text-xs" style={{ color: "hsl(0 84% 68%)" }} role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

export function ClassifiedForm({ locale }: { locale: Locale }) {
  const [state, formAction, pending] = useActionState(createClassified, initialState);
  const c = COPY[locale];

  if (state.ok) {
    return (
      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: "hsl(var(--accent))", background: "hsl(var(--surface))" }}
      >
        <h2 className="text-lg font-bold">{c.receivedTitle}</h2>
        <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />

      <Field label={c.title} error={state.errors?.title} hint={c.titleHint}>
        <input
          name="title"
          required
          maxLength={120}
          placeholder={c.titlePlaceholder}
          className="w-full rounded-lg border px-3 py-2"
          style={inputStyle}
        />
      </Field>

      <Field label={c.category} error={state.errors?.category}>
        <select name="category" required className="w-full rounded-lg border px-3 py-2" style={inputStyle}>
          <option value="">{c.choose}</option>
          {CLASSIFIED_CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.label[locale]}
            </option>
          ))}
        </select>
      </Field>

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

      <Field label={c.price} error={state.errors?.price} hint={c.priceHint}>
        <input
          name="price"
          inputMode="decimal"
          placeholder="80"
          className="w-full rounded-lg border px-3 py-2"
          style={inputStyle}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={c.email} error={state.errors?.contact_email}>
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
          <span className="mt-1 block text-xs" style={{ color: "hsl(0 84% 68%)" }} role="alert">
            {state.errors.accept_terms}
          </span>
        )}
      </div>

      {state.message && !state.ok && (
        <p className="text-sm" style={{ color: "hsl(0 84% 68%)" }} role="alert">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl px-5 py-3 font-semibold disabled:opacity-60"
        style={{ background: "hsl(var(--accent))", color: "hsl(var(--on-accent))" }}
      >
        {pending ? c.sending : c.submit}
      </button>
    </form>
  );
}
