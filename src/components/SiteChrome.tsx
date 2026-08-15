import Link from "next/link";
import { CookieSettingsLink } from "./CookieConsent";
import { allCities } from "@/lib/eclipse/cities";
import { TENANTS, type Tenant } from "@/lib/tenants";
import type { CityWithCircumstances, Locale } from "@/lib/eclipse/types";
import { getDictionary } from "@/i18n/dictionary";
import { localePath } from "@/i18n/config";

const LEGAL_LINKS: Record<Locale, [string, string][]> = {
  es: [
    ["/aviso-legal", "Aviso legal"],
    ["/privacidad", "Privacidad"],
    ["/cookies", "Cookies"],
    ["/fuentes", "Fuentes y metodología"],
    ["/anunciate", "Anúnciate"],
  ],
  en: [
    ["/aviso-legal", "Legal notice"],
    ["/privacidad", "Privacy"],
    ["/cookies", "Cookies"],
    ["/fuentes", "Sources and method"],
    ["/anunciate", "Advertise"],
  ],
};

/** Retirar el consentimiento tiene que ser tan fácil como darlo, y estar siempre a mano. */
const CONSENT_LABEL: Record<Locale, string> = {
  es: "Configurar cookies",
  en: "Cookie settings",
};

export function Header({
  tenant,
  city,
  locale,
  path,
}: {
  tenant: Tenant;
  city: CityWithCircumstances;
  locale: Locale;
  /** Camino interno actual, para que el selector de idioma no pierda la página. */
  path: string;
}) {
  const t = getDictionary(locale);
  const other: Locale = locale === "es" ? "en" : "es";

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--bg) / 0.85)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href={localePath(locale, "/")} className="flex items-center gap-2 font-bold">
          <span
            className="inline-block h-5 w-5 rounded-full"
            style={{ background: "hsl(var(--accent))", boxShadow: "0 0 18px hsl(var(--accent) / 0.7)" }}
            aria-hidden="true"
          />
          <span>{tenant.brand}</span>
        </Link>

        <nav className="ml-auto hidden gap-4 text-sm xl:flex" aria-label={t.common.sections}>
          {t.nav.slice(1).map((item) => (
            <Link
              key={item.href}
              href={localePath(locale, item.href)}
              className="hover:underline"
              style={{ color: "hsl(var(--muted))" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 xl:ml-0">
          <Link
            href={localePath(other, path)}
            hrefLang={other}
            className="text-sm hover:underline"
            style={{ color: "hsl(var(--muted))" }}
          >
            {t.common.switchLanguage}
          </Link>
          <Link
            href={localePath(locale, "/anunciate")}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold"
            style={{ background: "hsl(var(--accent))", color: "hsl(224 44% 8%)" }}
          >
            {t.common.advertise}
          </Link>
        </div>
      </div>

      <nav
        className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-4 pb-2 text-sm xl:hidden"
        aria-label={t.common.sections}
      >
        {t.nav.slice(1).map((item) => (
          <Link
            key={item.href}
            href={localePath(locale, item.href)}
            className="whitespace-nowrap"
            style={{ color: "hsl(var(--muted))" }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <p className="sr-only">
        {locale === "es"
          ? `Guía del eclipse solar total del 2 de agosto de 2027 en ${city.name}.`
          : `Guide to the total solar eclipse of 2 August 2027 in ${city.nameEn ?? city.name}.`}
      </p>
    </header>
  );
}

export function Footer({ tenant, locale }: { tenant: Tenant; locale: Locale }) {
  const t = getDictionary(locale);
  const otherSites = TENANTS.filter((x) => x.domain !== tenant.domain);

  return (
    <footer className="mt-20 border-t" style={{ borderColor: "hsl(var(--border))" }}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="mb-3 font-semibold">{tenant.brand}</h2>
          <p className="text-sm" style={{ color: "hsl(var(--muted))" }}>
            {t.footer.tagline}
          </p>
        </div>

        <div>
          <h2 className="mb-3 font-semibold">{t.common.sections}</h2>
          <ul className="space-y-1.5 text-sm">
            {t.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={localePath(locale, item.href)}
                  style={{ color: "hsl(var(--muted))" }}
                  className="hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 font-semibold">{t.common.otherCities}</h2>
          <ul className="space-y-1.5 text-sm">
            {otherSites.map((x) => (
              <li key={x.domain}>
                <a href={`https://${x.domain}`} style={{ color: "hsl(var(--muted))" }} className="hover:underline">
                  {x.brand}
                </a>
              </li>
            ))}
            <li>
              <Link
                href={localePath(locale, "/ciudades")}
                style={{ color: "hsl(var(--muted))" }}
                className="hover:underline"
              >
                {t.common.viewAllLocalities} ({allCities().length})
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 font-semibold">{t.common.legal}</h2>
          <ul className="space-y-1.5 text-sm">
            {LEGAL_LINKS[locale].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={localePath(locale, href)}
                  style={{ color: "hsl(var(--muted))" }}
                  className="hover:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsLink label={CONSENT_LABEL[locale]} />
            </li>
          </ul>
        </div>
      </div>

      <div
        className="border-t px-4 py-6 text-center text-xs"
        style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted))" }}
      >
        {t.footer.warning} · {tenant.domain}
      </div>
    </footer>
  );
}
