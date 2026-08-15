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
export function Countdown({ labels }: { labels: CountdownLabels }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = now === null ? null : split(ECLIPSE_TIMESTAMP_MS - now);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3" role="timer" aria-label={labels.label}>
      {(["days", "hours", "minutes", "seconds"] as const).map((key) => (
        <div
          key={key}
          className="rounded-xl border px-2 py-3 text-center sm:px-4"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface))" }}
        >
          <div className="text-2xl font-bold tabular-nums sm:text-4xl" style={{ color: "hsl(var(--accent))" }}>
            {parts ? String(parts[key]).padStart(2, "0") : "––"}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-widest sm:text-xs" style={{ color: "hsl(var(--muted))" }}>
            {labels[key]}
          </div>
        </div>
      ))}
    </div>
  );
}
