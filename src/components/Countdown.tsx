"use client";

import { useEffect, useState } from "react";
import { ECLIPSE_TIMESTAMP_MS } from "@/lib/eclipse/event";

function split(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export interface CountdownLabels {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  label: string;
}

/**
 * Cuenta atrás al instante del eclipse.
 *
 * Antes de montar muestra huecos en lugar de una cifra calculada en el servidor:
 * el reloj del servidor y el del navegador nunca coinciden al segundo, y renderizar
 * un número distinto en cada lado provoca un error de hidratación.
 */
export function Countdown({
  labels,
  variant = "block",
}: {
  labels: CountdownLabels;
  /**
   * `inline` es la de la portada: una sola línea que acompaña al dato grande sin
   * competir con él. A once meses vista la cuenta atrás es contexto, no
   * protagonista; el protagonista es cuánto va a durar la totalidad.
   */
  variant?: "block" | "inline";
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = now === null ? null : split(ECLIPSE_TIMESTAMP_MS - now);
  const keys = ["days", "hours", "minutes", "seconds"] as const;

  if (variant === "inline") {
    return (
      <p
        className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm"
        role="timer"
        aria-label={labels.label}
        style={{ color: "hsl(var(--muted))" }}
      >
        {keys.map((key, i) => (
          <span key={key} className="flex items-baseline gap-1">
            <span
              className="text-lg font-bold tabular-nums"
              style={{ color: i === 0 ? "hsl(var(--accent))" : "hsl(var(--text))" }}
            >
              {parts ? String(parts[key]).padStart(2, "0") : "––"}
            </span>
            {labels[key]}
          </span>
        ))}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3" role="timer" aria-label={labels.label}>
      {keys.map((key) => (
        <div
          key={key}
          className="rounded-xl border px-2 py-3 text-center sm:px-4"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface))" }}
        >
          <div
            className="font-bold tabular-nums"
            style={{ color: "hsl(var(--accent))", fontSize: "var(--step-3)", lineHeight: 1 }}
          >
            {parts ? String(parts[key]).padStart(2, "0") : "––"}
          </div>
          <div className="datum-label mt-1.5">{labels[key]}</div>
        </div>
      ))}
    </div>
  );
}
