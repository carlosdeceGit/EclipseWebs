"use client";

import { useActionState } from "react";
import { createClassified, type FormState } from "./actions";
import { CLASSIFIED_CATEGORIES } from "@/lib/db/listings";

const initialState: FormState = { ok: false, message: "" };

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

export function ClassifiedForm() {
  const [state, formAction, pending] = useActionState(createClassified, initialState);

  if (state.ok) {
    return (
      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: "hsl(var(--accent))", background: "hsl(var(--surface))" }}
      >
        <h2 className="text-lg font-bold">Recibido</h2>
        <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Título" error={state.errors?.title} hint="Sé concreto: lo que ofreces y dónde.">
        <input
          name="title"
          required
          maxLength={120}
          placeholder="Habitación doble a 10 min de la playa, del 31 al 3"
          className="w-full rounded-lg border px-3 py-2"
          style={inputStyle}
        />
      </Field>

      <Field label="Categoría" error={state.errors?.category}>
        <select name="category" required className="w-full rounded-lg border px-3 py-2" style={inputStyle}>
          <option value="">Elige una…</option>
          {CLASSIFIED_CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Descripción"
        error={state.errors?.description}
        hint="Cuenta las condiciones, las fechas exactas y qué incluye. Cuanto más claro, menos preguntas."
      >
        <textarea
          name="description"
          required
          rows={6}
          maxLength={4000}
          className="w-full rounded-lg border px-3 py-2"
          style={inputStyle}
        />
      </Field>

      <Field label="Precio en euros (opcional)" error={state.errors?.price} hint="Déjalo vacío si no aplica o si es a convenir.">
        <input
          name="price"
          inputMode="decimal"
          placeholder="80"
          className="w-full rounded-lg border px-3 py-2"
          style={inputStyle}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email de contacto" error={state.errors?.contact_email}>
          <input name="contact_email" type="email" className="w-full rounded-lg border px-3 py-2" style={inputStyle} />
        </Field>
        <Field label="Teléfono (opcional)">
          <input name="contact_phone" type="tel" className="w-full rounded-lg border px-3 py-2" style={inputStyle} />
        </Field>
      </div>

      {/* Honeypot: invisible para personas, irresistible para bots. */}
      <div className="hidden" aria-hidden="true">
        <label>
          No rellenes este campo
          <input name="website_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label className="flex items-start gap-2 text-sm">
          <input name="accept_terms" type="checkbox" className="mt-1" />
          <span style={{ color: "hsl(var(--muted))" }}>
            Confirmo que el anuncio es real, que puedo cumplir lo que ofrezco y acepto las
            condiciones de publicación.
          </span>
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
        style={{ background: "hsl(var(--accent))", color: "hsl(224 44% 8%)" }}
      >
        {pending ? "Enviando…" : "Publicar anuncio"}
      </button>
    </form>
  );
}
