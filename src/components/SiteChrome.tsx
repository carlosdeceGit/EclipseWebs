import Link from "next/link";
import { CookieSettingsLink } from "./CookieConsent";
import { EclipseMark } from "./Icon";
import { BottomNav as NavBar, Header as NavHeader, type NavStrings } from "./SiteNav";
import { consentMode } from "@/lib/ads";
import { allCities } from "@/lib/eclipse/cities";
import { TENANTS, type Tenant } from "@/lib/tenants";
import type { CityWithCircumstances, Locale } from "@/lib/eclipse/types";
import { getDictionary } from "@/i18n/dictionary";
import { localePath } from "@/i18n/config";
import { navGroups } from "@/i18n/navigation";

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

/**
 * Lo que la navegación necesita del servidor, reducido a texto.
 *
 * El header y el menú corren en el cliente —ver `SiteNav.tsx`—, así que lo que
 * cruza la frontera tiene que ser serializable y conviene que sea poco: aquí se
 * resuelven el diccionario, el registro de tenants y el nombre de la ciudad, y
 * al navegador solo viajan las cadenas resultantes.
 */
function navStrings(tenant: Tenant, city: CityWithCircumstances, locale: Locale): NavStrings {
  const t = getDictionary(locale);
  return {
    brand: tenant.brand,
    cityName: locale === "en" ? (city.nameEn ?? city.name) : city.name,
    sections: t.common.sections,
    advertise: t.common.advertise,
    otherCities: t.common.otherCities,
    sites: TENANTS.filter((x) => x.domain !== tenant.domain).map((x) => ({
      domain: x.domain,
      brand: x.brand,
    })),
  };
}

export function Header({
  tenant,
  city,
  locale,
}: {
  tenant: Tenant;
  city: CityWithCircumstances;
  locale: Locale;
}) {
  return <NavHeader locale={locale} strings={navStrings(tenant, city, locale)} />;
}

export function BottomNav({
  tenant,
  city,
  locale,
}: {
  tenant: Tenant;
  city: CityWithCircumstances;
  locale: Locale;
}) {
  return <NavBar locale={locale} strings={navStrings(tenant, city, locale)} />;
}

export function Footer({ tenant, locale }: { tenant: Tenant; locale: Locale }) {
  const t = getDictionary(locale);
  const otherSites = TENANTS.filter((x) => x.domain !== tenant.domain);
  const groups = navGroups(locale);

  return (
    <footer className="mt-20 border-t" style={{ borderColor: "hsl(var(--border))" }}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <EclipseMark />
            {tenant.brand}
          </h2>
          <p className="text-sm" style={{ color: "hsl(var(--muted))" }}>
            {t.footer.tagline}
          </p>
        </div>

        {/* Los mismos cuatro grupos del menú. El pie es además la red de seguridad
            del panel: si un navegador no soporta `popover`, aquí están todos los
            enlaces igualmente. */}
        {groups.map((group) => (
          <div key={group.id}>
            <h2 className="mb-3 font-semibold">{group.label}</h2>
            <ul className="space-y-1.5 text-sm">
              {group.items.map((item) => (
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
        ))}
      </div>

      <div
        className="mx-auto grid max-w-6xl gap-8 border-t px-4 py-8 sm:grid-cols-2"
        style={{ borderColor: "hsl(var(--border))" }}
      >
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
              <CookieSettingsLink
                label={CONSENT_LABEL[locale]}
                mode={consentMode()}
                policyHref={localePath(locale, "/cookies")}
              />
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
