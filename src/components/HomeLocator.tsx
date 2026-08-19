"use client";

import { useState } from "react";
import type { Locale } from "@/lib/eclipse/types";

/** Sustituye marcadores `{clave}`. El diccionario que cruza al cliente no lleva funciones. */
function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);
}

export interface LocatorFallback {
  cityName: string;
  isTotal: boolean;
  /** Ya formateada: "4 min 48 s". Vacía si no hay totalidad. */
  duration: string;
  totalitySeconds: number;
  obscuration: string;
  totalityStart: string | null;
  maximum: string;
}

export interface HomeLocatorLabels {
  eyebrow: string;
  title: string;
  lead: string;
  cta: string;
  locating: string;
  error: string;
  showingCity: string;
  showingYou: string;
  durationLabel: string;
  startsLabel: string;
  coveredLabel: string;
  /** {seconds} */
  betterThanCity: string;
  /** {seconds} */
  worseThanCity: string;
  sameAsCity: string;
  /** {km} */
  moveAdvice: string;
  onCenterline: string;
  noTotality: string;
  openFull: string;
  openViewer: string;
  privacy: string;
}

interface Result {
  isTotal: boolean;
  totalitySeconds: number;
  obscuration: number;
  kmToCenterline: number | null;
  contactsLocal: { totalityStart: string | null; maximum: string | null };
}

function formatDuration(seconds: number, locale: Locale): string {
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  const min = locale === "es" ? "min" : "min";
  return s === 0 ? `${m} ${min}` : `${m} ${min} ${s} s`;
}

/**
 * El localizador, en la home.
 *
 * Responde en la propia portada la pregunta que ninguna web española del eclipse
 * responde —«¿y desde donde yo voy a estar?»— sin obligar a navegar a otra
 * página. Antes vivía detrás de un enlace ciego entre otras once tarjetas
 * iguales.
 *
 * Arranca **con los datos de la ciudad del dominio ya puestos**. Un widget que
 * empieza vacío pidiendo permiso de ubicación no enseña para qué sirve, y es la
 * forma más rápida de que ese permiso se deniegue.
 */
export function HomeLocator({
  locale,
  fallback,
  labels,
  fullHref,
  viewerHref,
}: {
  locale: Locale;
  fallback: LocatorFallback;
  labels: HomeLocatorLabels;
  fullHref: string;
  viewerHref: string;
}) {
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function locate() {
    if (!navigator.geolocation) {
      setError(labels.error);
      return;
    }
    setBusy(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Madrid";
        try {
          const response = await fetch(
            `/api/circumstances?lat=${latitude}&lon=${longitude}&tz=${encodeURIComponent(tz)}`,
          );
          if (!response.ok) throw new Error("bad request");
          setResult((await response.json()) as Result);
        } catch {
          setError(labels.error);
        } finally {
          setBusy(false);
        }
      },
      () => {
        setBusy(false);
        setError(labels.error);
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }

  const showing = result
    ? {
        isTotal: result.isTotal,
        duration: formatDuration(result.totalitySeconds, locale),
        obscuration: `${(result.obscuration * 100).toFixed(1)} %`,
        start: result.contactsLocal.totalityStart ?? result.contactsLocal.maximum ?? "—",
      }
    : {
        isTotal: fallback.isTotal,
        duration: fallback.duration,
        obscuration: fallback.obscuration,
        start: fallback.totalityStart ?? fallback.maximum,
      };

  // La comparación es lo que convierte un número en una decisión: saber que
  // ganas o pierdes medio minuto respecto a la ciudad es lo que hace que alguien
  // se plantee moverse.
  const delta = result ? Math.round(result.totalitySeconds - fallback.totalitySeconds) : 0;

  return (
    <div>
      <p className="datum-label" style={{ color: "hsl(var(--accent))" }}>
        {labels.eyebrow}
      </p>
      <h2 className="mt-2 font-bold" style={{ fontSize: "var(--step-3)" }}>
        {labels.title}
      </h2>
      <p className="mt-2 max-w-2xl" style={{ color: "hsl(var(--muted))" }}>
        {labels.lead}
      </p>

      <div className="mt-7 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-end">
        <div aria-live="polite">
          <p className="datum-label">
            {showing.isTotal ? labels.durationLabel : labels.coveredLabel}
          </p>
          <p className="datum mt-1">
            <span className="tabular">{showing.isTotal ? showing.duration : showing.obscuration}</span>
          </p>
          <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
            {showing.isTotal ? (
              <>
                {labels.startsLabel}{" "}
                <strong className="tabular" style={{ color: "hsl(var(--text))" }}>
                  {showing.start}
                </strong>
              </>
            ) : (
              labels.noTotality
            )}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm" style={{ color: "hsl(var(--faint))" }}>
            {result ? labels.showingYou : `${labels.showingCity} ${fallback.cityName}`}
          </p>

          {result && (
            <p className="text-sm font-semibold">
              {delta > 2
                ? fill(labels.betterThanCity, { seconds: String(delta) })
                : delta < -2
                  ? fill(labels.worseThanCity, { seconds: String(Math.abs(delta)) })
                  : labels.sameAsCity}
            </p>
          )}

          {result && result.kmToCenterline !== null && (
            <p className="text-sm" style={{ color: "hsl(var(--muted))" }}>
              {result.kmToCenterline < 5
                ? labels.onCenterline
                : fill(labels.moveAdvice, { km: result.kmToCenterline.toFixed(0) })}
            </p>
          )}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={locate}
          disabled={busy}
          className="tap inline-flex items-center justify-center rounded-xl px-5 font-semibold transition hover:brightness-110 disabled:opacity-60"
          style={{
            background: "hsl(var(--accent))",
            color: "hsl(var(--on-accent))",
            boxShadow: "0 0.5rem 1.5rem hsl(var(--accent) / 0.25)",
          }}
        >
          {busy ? labels.locating : labels.cta}
        </button>
        <a
          href={fullHref}
          className="tap inline-flex items-center justify-center rounded-xl border px-5 font-semibold"
          style={{ borderColor: "hsl(var(--border-strong))" }}
        >
          {labels.openFull}
        </a>
        <a
          href={viewerHref}
          className="tap inline-flex items-center justify-center rounded-xl border px-5 font-semibold"
          style={{ borderColor: "hsl(var(--border-strong))" }}
        >
          {labels.openViewer}
        </a>
      </div>

      {error && (
        <p className="mt-3 text-sm" role="alert" style={{ color: "hsl(var(--danger))" }}>
          {error}
        </p>
      )}

      <p className="mt-4 text-xs" style={{ color: "hsl(var(--faint))" }}>
        {labels.privacy}
      </p>
    </div>
  );
}
