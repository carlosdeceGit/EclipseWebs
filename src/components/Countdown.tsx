"use client";

import { useEffect, useState } from "react";
import { ECLIPSE_TIMESTAMP_MS } from "@/lib/eclipse/event";

const LABELS = { dias: "días", horas: "horas", min: "min", seg: "seg" } as const;

function split(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    dias: Math.floor(total / 86400),
    horas: Math.floor((total % 86400) / 3600),
    min: Math.floor((total % 3600) / 60),
    seg: total % 60,
  };
}

/**
 * Cuenta atrás al instante del eclipse.
 *
 * Renderiza el primer frame ya calculado en cliente tras montar; antes de montar
 * muestra los mismos huecos para no provocar desajuste de hidratación entre el
 * HTML del servidor y el reloj del navegador.
 */
export function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = now === null ? null : split(ECLIPSE_TIMESTAMP_MS - now);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3" role="timer" aria-label="Cuenta atrás para el eclipse">
      {(["dias", "horas", "min", "seg"] as const).map((key) => (
        <div
          key={key}
          className="rounded-xl border px-2 py-3 text-center sm:px-4"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface))" }}
        >
          <div className="text-2xl font-bold tabular-nums sm:text-4xl" style={{ color: "hsl(var(--accent))" }}>
            {parts ? String(parts[key]).padStart(2, "0") : "––"}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-widest sm:text-xs" style={{ color: "hsl(var(--muted))" }}>
            {LABELS[key]}
          </div>
        </div>
      ))}
    </div>
  );
}
