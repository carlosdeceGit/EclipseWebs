"use client";

import Script from "next/script";
import { useCallback, useEffect, useState } from "react";
import {
  CONSENT_OPEN_EVENT,
  readConsent,
  writeConsent,
  type ConsentState,
  type ConsentValue,
} from "@/lib/consent";
import type { Locale } from "@/lib/eclipse/types";

const COPY = {
  es: {
    title: "Cookies",
    body: "Usamos cookies técnicas, necesarias para que la web funcione. Nos gustaría usar además cookies de publicidad para mostrar anuncios y medir su rendimiento, y eso solo lo hacemos si nos dices que sí.",
    accept: "Aceptar todas",
    reject: "Solo las necesarias",
    policy: "Política de cookies",
    settingsTitle: "Preferencias de cookies",
    technical: "Cookies técnicas",
    technicalDesc: "Mantienen tu sesión, recuerdan tu idioma y guardan esta misma decisión. No se pueden desactivar porque sin ellas la web no funciona.",
    technicalAlways: "Siempre activas",
    advertising: "Cookies de publicidad",
    advertisingDesc: "Google AdSense las usa para mostrar anuncios y medir su rendimiento. Si las rechazas, la web funciona igual y los anuncios simplemente son menos relevantes.",
    save: "Guardar preferencias",
    close: "Cerrar",
    currentGranted: "Ahora mismo están aceptadas.",
    currentDenied: "Ahora mismo están rechazadas.",
  },
  en: {
    title: "Cookies",
    body: "We use technical cookies, which are needed for the site to work. We would also like to use advertising cookies to show ads and measure their performance, and we only do that if you say yes.",
    accept: "Accept all",
    reject: "Necessary only",
    policy: "Cookie policy",
    settingsTitle: "Cookie preferences",
    technical: "Technical cookies",
    technicalDesc: "They keep your session, remember your language and store this very decision. They cannot be switched off because the site does not work without them.",
    technicalAlways: "Always on",
    advertising: "Advertising cookies",
    advertisingDesc: "Google AdSense uses them to serve ads and measure their performance. If you decline, the site works exactly the same and the ads are simply less relevant.",
    save: "Save preferences",
    close: "Close",
    currentGranted: "They are currently accepted.",
    currentDenied: "They are currently declined.",
  },
} as const;

/**
 * Banner y panel de consentimiento.
 *
 * Monta el script de AdSense solo cuando hay un sí explícito, así que mientras no
 * se acepte no se descarga nada de Google ni se instala ninguna cookie de terceros.
 * Ese es el punto entero del componente: si el script viviera en el layout, el
 * banner sería decorativo.
 */
export function CookieConsent({
  locale,
  adsenseClientId,
  policyHref,
}: {
  locale: Locale;
  /** Null mientras AdSense no esté configurado: entonces no hay nada que consentir. */
  adsenseClientId: string | null;
  policyHref: string;
}) {
  const t = COPY[locale];
  const [state, setState] = useState<ConsentState | null>(null);
  /** null = aún no sabemos (primer render); false = decidido; true = mostrar. */
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [draft, setDraft] = useState<ConsentValue>("denied");

  useEffect(() => {
    const stored = readConsent();
    setState(stored);
    setDraft(stored?.advertising ?? "denied");
    // Sin AdSense configurado no hay ninguna cookie no esencial, así que preguntar
    // sería pedir permiso para nada.
    if (!stored && adsenseClientId) setShowBanner(true);
  }, [adsenseClientId]);

  useEffect(() => {
    const open = () => {
      setDraft(readConsent()?.advertising ?? "denied");
      setShowSettings(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  const decide = useCallback((advertising: ConsentValue) => {
    setState(writeConsent(advertising));
    setShowBanner(false);
    setShowSettings(false);
  }, []);

  const adsAllowed = state?.advertising === "granted" && Boolean(adsenseClientId);

  return (
    <>
      {adsAllowed && (
        <Script
          async
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
        />
      )}

      {showBanner && !showSettings && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={t.title}
          className="fixed inset-x-0 bottom-0 z-[100] border-t p-4 shadow-2xl backdrop-blur"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface) / 0.98)" }}
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="font-semibold">{t.title}</p>
              <p className="mt-1 text-sm" style={{ color: "hsl(var(--muted))" }}>
                {t.body}{" "}
                <a href={policyHref} className="underline">
                  {t.policy}
                </a>
              </p>
            </div>
            {/*
              Los dos botones tienen el mismo peso visual a propósito: la AEPD
              considera que un rechazo escondido o menos accesible invalida el
              consentimiento.
            */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => decide("denied")}
                className="rounded-lg border px-4 py-2.5 text-sm font-semibold"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                {t.reject}
              </button>
              <button
                type="button"
                onClick={() => decide("granted")}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold"
                style={{ background: "hsl(var(--accent))", color: "hsl(224 44% 8%)" }}
              >
                {t.accept}
              </button>
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="rounded-lg px-4 py-2.5 text-sm underline"
                style={{ color: "hsl(var(--muted))" }}
              >
                {t.settingsTitle}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div
          className="fixed inset-0 z-[110] flex items-end justify-center p-4 sm:items-center"
          style={{ background: "hsl(224 44% 4% / 0.7)" }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.settingsTitle}
            className="w-full max-w-lg rounded-2xl border p-6"
            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface))" }}
          >
            <h2 className="text-lg font-bold">{t.settingsTitle}</h2>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl border p-4" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{t.technical}</span>
                  <span className="text-xs" style={{ color: "hsl(var(--muted))" }}>
                    {t.technicalAlways}
                  </span>
                </div>
                <p className="mt-1.5 text-sm" style={{ color: "hsl(var(--muted))" }}>
                  {t.technicalDesc}
                </p>
              </div>

              <div className="rounded-xl border p-4" style={{ borderColor: "hsl(var(--border))" }}>
                <label className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{t.advertising}</span>
                  <input
                    type="checkbox"
                    checked={draft === "granted"}
                    onChange={(e) => setDraft(e.target.checked ? "granted" : "denied")}
                    className="h-5 w-5"
                  />
                </label>
                <p className="mt-1.5 text-sm" style={{ color: "hsl(var(--muted))" }}>
                  {t.advertisingDesc}
                </p>
                {state && (
                  <p className="mt-2 text-xs" style={{ color: "hsl(var(--muted))" }}>
                    {state.advertising === "granted" ? t.currentGranted : t.currentDenied}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => decide(draft)}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold"
                style={{ background: "hsl(var(--accent))", color: "hsl(224 44% 8%)" }}
              >
                {t.save}
              </button>
              <a
                href={policyHref}
                className="rounded-lg border px-4 py-2.5 text-sm font-semibold"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                {t.policy}
              </a>
              {state && (
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="rounded-lg px-4 py-2.5 text-sm underline"
                  style={{ color: "hsl(var(--muted))" }}
                >
                  {t.close}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Enlace del pie que reabre el panel. Retirar el consentimiento debe ser fácil. */
export function CookieSettingsLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT))}
      className="hover:underline"
      style={{ color: "hsl(var(--muted))" }}
    >
      {label}
    </button>
  );
}
