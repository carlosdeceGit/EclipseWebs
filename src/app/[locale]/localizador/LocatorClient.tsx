"use client";

import { useState } from "react";
import type { Locale } from "@/lib/eclipse/types";
import type { Dictionary } from "@/i18n/dictionary";
import { SolarARViewer } from "./SolarARViewer";

/**
 * Sustituye marcadores `{clave}` en una plantilla.
 *
 * El diccionario que llega a este componente no puede llevar funciones, porque
 * cruza la frontera servidor/cliente, así que las cadenas con valores usan
 * marcadores y se resuelven aquí.
 */
function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);
}

interface Result {
  isTotal: boolean;
  isPartial: boolean;
  totalitySeconds: number;
  obscuration: number;
  sunAltitudeDeg: number;
  sunAzimuthDeg: number;
  kmToCenterline: number | null;
  contactsLocal: {
    timeZone: string;
    partialStart: string | null;
    totalityStart: string | null;
    maximum: string | null;
    totalityEnd: string | null;
    partialEnd: string | null;
  };
}

export interface Preset {
  slug: string;
  name: string;
  lat: number;
  lon: number;
  timeZone: string;
}

function compassPoint(azimuth: number, locale: Locale): string {
  const es = ["norte", "noreste", "este", "sureste", "sur", "suroeste", "oeste", "noroeste"];
  const en = ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"];
  const names = locale === "es" ? es : en;
  return names[Math.round(azimuth / 45) % 8];
}

function formatDuration(seconds: number): string {
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return s === 0 ? `${m} min` : `${m} min ${s} s`;
}

/**
 * Localizador.
 *
 * Toda la respuesta sale del endpoint /api/circumstances, que resuelve el eclipse
 * para unas coordenadas cualesquiera. No guardamos la posición: se envía, se
 * calcula y se devuelve.
 */
export function LocatorClient({
  locale,
  t,
  labels,
  presets,
}: {
  locale: Locale;
  /** Solo el bloque del localizador: cadenas planas, sin funciones. */
  t: Dictionary["locator"];
  /** Etiquetas de los contactos, ya resueltas en el servidor. */
  labels: { partialStart: string; totalityStart: string; maximum: string; totalityEnd: string; partialEnd: string; sunAltitude: string };
  presets: Preset[];
}) {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [timeZone, setTimeZone] = useState("Europe/Madrid");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function compute(nextLat: number, nextLon: number, tz: string) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/circumstances?lat=${nextLat}&lon=${nextLon}&tz=${encodeURIComponent(tz)}`,
      );
      if (!response.ok) throw new Error("bad request");
      setResult((await response.json()) as Result);
    } catch {
      setError(t.errorRange);
      setResult(null);
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsedLat = Number(lat.replace(",", "."));
    const parsedLon = Number(lon.replace(",", "."));
    if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLon) || Math.abs(parsedLat) > 90 || Math.abs(parsedLon) > 180) {
      setError(t.errorRange);
      return;
    }
    void compute(parsedLat, parsedLon, timeZone);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError(t.errorGeolocation);
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude.toFixed(5));
        setLon(longitude.toFixed(5));
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Madrid";
        setTimeZone(tz);
        void compute(latitude, longitude, tz);
      },
      () => {
        setBusy(false);
        setError(t.errorGeolocation);
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }

  const inputStyle = {
    borderColor: "hsl(var(--border))",
    background: "hsl(var(--bg))",
    color: "hsl(var(--text))",
  };

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={useMyLocation}
            disabled={busy}
            className="rounded-xl px-5 py-3 font-semibold disabled:opacity-60"
            style={{ background: "hsl(var(--accent))", color: "hsl(224 44% 8%)" }}
          >
            {busy ? t.locating : t.useMyLocation}
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">{t.latitude}</span>
            <input
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              inputMode="decimal"
              placeholder="36.0143"
              className="w-full rounded-lg border px-3 py-2"
              style={inputStyle}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">{t.longitude}</span>
            <input
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              inputMode="decimal"
              placeholder="-5.6044"
              className="w-full rounded-lg border px-3 py-2"
              style={inputStyle}
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="self-end rounded-lg border px-5 py-2 font-semibold disabled:opacity-60"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            {t.calculate}
          </button>
        </div>

        <div>
          <p className="mb-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
            {t.orPickCity}
          </p>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => {
                  setLat(p.lat.toFixed(4));
                  setLon(p.lon.toFixed(4));
                  setTimeZone(p.timeZone);
                  void compute(p.lat, p.lon, p.timeZone);
                }}
                className="rounded-full border px-3 py-1.5 text-sm"
                style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted))" }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm" role="alert" style={{ color: "hsl(0 84% 68%)" }}>
            {error}
          </p>
        )}
      </form>

      {result && (
        <div
          className="rounded-2xl border p-6"
          style={{ borderColor: "hsl(var(--accent))", background: "hsl(var(--surface))" }}
        >
          <p className="text-2xl font-black" style={{ color: "hsl(var(--accent))" }}>
            {result.isTotal
              ? fill(t.resultTotal, { duration: formatDuration(result.totalitySeconds) })
              : fill(t.resultPartial, { percent: `${(result.obscuration * 100).toFixed(1)}%` })}
          </p>

          <dl className="mt-5 grid gap-x-8 sm:grid-cols-2">
            {(
              [
                [labels.partialStart, result.contactsLocal.partialStart],
                [labels.totalityStart, result.contactsLocal.totalityStart],
                [labels.maximum, result.contactsLocal.maximum],
                [labels.totalityEnd, result.contactsLocal.totalityEnd],
                [labels.partialEnd, result.contactsLocal.partialEnd],
                [labels.sunAltitude, `${result.sunAltitudeDeg}°`],
              ] as [string, string | null][]
            )
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-4 border-b py-2"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <dt className="text-sm" style={{ color: "hsl(var(--muted))" }}>
                    {label}
                  </dt>
                  <dd className="font-semibold tabular-nums">{value}</dd>
                </div>
              ))}
          </dl>

          <p className="mt-4 text-sm" style={{ color: "hsl(var(--muted))" }}>
            {t.whereToLook}:{" "}
            <strong style={{ color: "hsl(var(--text))" }}>
              {compassPoint(result.sunAzimuthDeg, locale)} ({result.sunAzimuthDeg}°)
            </strong>
            , {locale === "es" ? "a" : "at"} {result.sunAltitudeDeg}° {t.aboveHorizon}.{" "}
            {result.contactsLocal.timeZone}
          </p>

          {result.kmToCenterline !== null && (
            <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
              {result.kmToCenterline < 5
                ? t.onCenterline
                : fill(t.moveAdvice, { km: result.kmToCenterline.toFixed(0) })}
            </p>
          )}
        </div>
      )}

      {/* El visor de cámara solo aparece con un resultado en la mano: sin azimut, sin
          altura y sin hora del máximo no hay nada que apuntar. Si el Sol está bajo el
          horizonte tampoco tiene sentido abrir la cámara. */}
      {result && result.contactsLocal.maximum && result.sunAltitudeDeg > 0 && (
        <SolarARViewer
          locale={locale}
          sunAzimuthDeg={result.sunAzimuthDeg}
          sunAltitudeDeg={result.sunAltitudeDeg}
          maximumTime={result.contactsLocal.maximum}
          timeZone={result.contactsLocal.timeZone}
        />
      )}
    </div>
  );
}
