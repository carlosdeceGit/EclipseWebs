"use client";

import { useState } from "react";
import type { Locale } from "@/lib/eclipse/types";
import { SolarARViewer } from "../localizador/SolarARViewer";

export interface ViewerDefaults {
  cityName: string;
  sunAzimuthDeg: number;
  sunAltitudeDeg: number;
  maximumTime: string;
  timeZone: string;
}

interface Refined {
  sunAzimuthDeg: number;
  sunAltitudeDeg: number;
  maximumTime: string;
  timeZone: string;
  /** Coordenadas redondeadas, solo para enseñar sobre qué punto se está calculando. */
  label: string;
}

export interface ViewerLabels {
  useMyLocation: string;
  locating: string;
  error: string;
  usingCity: string;
  usingPoint: string;
  refineHint: string;
}

/**
 * Visor de cámara con su propia página.
 *
 * La diferencia con el localizador es de encuadre, no de cálculo: aquí se abre
 * con los datos de la ciudad del dominio **ya puestos**, de modo que la cámara
 * funciona en el primer toque. Pedir permiso de ubicación antes de haber
 * enseñado nada es la forma más rápida de que lo denieguen.
 *
 * Afinar con el GPS es opcional y mejora el resultado unas décimas de grado.
 */
export function ViewerClient({
  locale,
  defaults,
  labels,
}: {
  locale: Locale;
  defaults: ViewerDefaults;
  labels: ViewerLabels;
}) {
  const [refined, setRefined] = useState<Refined | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError(labels.error);
      return;
    }
    setBusy(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || defaults.timeZone;
        try {
          const response = await fetch(
            `/api/circumstances?lat=${latitude}&lon=${longitude}&tz=${encodeURIComponent(tz)}`,
          );
          if (!response.ok) throw new Error("bad request");
          const data = (await response.json()) as {
            sunAzimuthDeg: number;
            sunAltitudeDeg: number;
            contactsLocal: { maximum: string | null; timeZone: string };
          };
          if (!data.contactsLocal.maximum) throw new Error("no maximum");
          setRefined({
            sunAzimuthDeg: data.sunAzimuthDeg,
            sunAltitudeDeg: data.sunAltitudeDeg,
            maximumTime: data.contactsLocal.maximum,
            timeZone: data.contactsLocal.timeZone,
            label: `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
          });
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

  const active = refined ?? defaults;

  return (
    <div className="space-y-5">
      <SolarARViewer
        locale={locale}
        sunAzimuthDeg={active.sunAzimuthDeg}
        sunAltitudeDeg={active.sunAltitudeDeg}
        maximumTime={active.maximumTime}
        timeZone={active.timeZone}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={busy}
          className="tap inline-flex items-center rounded-xl border px-4 font-semibold disabled:opacity-60"
          style={{ borderColor: "hsl(var(--border-strong))" }}
        >
          {busy ? labels.locating : labels.useMyLocation}
        </button>
        <p className="text-sm" style={{ color: "hsl(var(--muted))" }}>
          {refined ? `${labels.usingPoint} ${refined.label}` : `${labels.usingCity} ${defaults.cityName}`}
        </p>
      </div>

      <p className="text-sm" style={{ color: "hsl(var(--faint))" }}>
        {labels.refineHint}
      </p>

      {error && (
        <p className="text-sm" role="alert" style={{ color: "hsl(var(--danger))" }}>
          {error}
        </p>
      )}
    </div>
  );
}
