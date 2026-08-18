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
import type { ConsentMode } from "@/lib/ads";
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
  mode = "own",
}: {
  locale: Locale;
  /** Null mientras AdSense no esté configurado: entonces no hay nada que consentir. */
  adsenseClientId: string | null;
  policyHref: string;
  mode?: ConsentMode;
}) {
  const t = COPY[locale];
  const [state, setState] = useState<ConsentState | null>(null);
  /** null = aún no sabemos (primer render); false = decidido; true = mostrar. */
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [draft, setDraft] = useState<ConsentValue>("denied");

  /**
   * Con el CMP de Google al mando, este componente deja de preguntar.
   *
   * Preguntar dos veces por lo mismo no solo es molesto: deja al visitante sin
   * saber cuál de las dos decisiones manda. Aquí manda la de Google, que es la
   * certificada y la que emite la señal TCF que Google exige.
   */
  const googleCmp = mode === "google" && Boolean(adsenseClientId);

  useEffect(() => {
    if (googleCmp) return;
    const stored = readConsent();
    setState(stored);
    setDraft(stored?.advertising ?? "denied");
    // Sin AdSense configurado no hay ninguna cookie no esencial, así que preguntar
    // sería pedir permiso para nada.
    if (!stored && adsenseClientId) setShowBanner(true);
  }, [adsenseClientId, googleCmp]);

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
      {/*
        En modo Google el script se carga sin esperar, porque el mensaje de
        consentimiento viaja dentro de él: bloquearlo sería impedir que se pregunte.
        En modo propio sigue esperando al sí explícito, como hasta ahora.
      */}
      {(googleCmp || adsAllowed) && (
        <Script
          async
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
        />
      )}

      {!googleCmp && showBanner && !showSettings && (
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

      {!googleCmp && showSettings && (
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

/**
 * Enlace del pie que reabre el panel de consentimiento.
 *
 * Retirar el consentimiento tiene que ser tan fácil como darlo, así que este enlace
 * no puede quedarse nunca sin hacer nada. En modo Google llama a la API de
 * revocación de su CMP; si el CMP todavía no ha cargado, se encola; y si no hay CMP
 * en absoluto —bloqueador de anuncios, mensaje despublicado— cae a la política de
 * cookies, que explica cómo gestionarlas. Un botón muerto aquí sería un
 * incumplimiento en sí mismo.
 */
export function CookieSettingsLink({
  label,
  mode = "own",
  policyHref = "/cookies",
}: {
  label: string;
  mode?: ConsentMode;
  policyHref?: string;
}) {
  const open = useCallback(() => {
    if (mode !== "google") {
      window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
      return;
    }

    const fc = (window as unknown as { googlefc?: GoogleFundingChoices }).googlefc;
    if (fc?.showRevocationMessage) {
      fc.showRevocationMessage();
      return;
    }
    if (fc?.callbackQueue) {
      fc.callbackQueue.push({
        CONSENT_DATA_READY: () =>
          (window as unknown as { googlefc?: GoogleFundingChoices }).googlefc?.showRevocationMessage?.(),
      });
      return;
    }
    window.location.href = policyHref;
  }, [mode, policyHref]);

  return (
    <button type="button" onClick={open} className="hover:underline" style={{ color: "hsl(var(--muted))" }}>
      {label}
    </button>
  );
}

/** Lo poco que usamos de la API del CMP de Google (Funding Choices). */
interface GoogleFundingChoices {
  showRevocationMessage?: () => void;
  callbackQueue?: { push: (cb: { CONSENT_DATA_READY: () => void }) => void };
}
