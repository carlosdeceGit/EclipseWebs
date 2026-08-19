import Link from "next/link";
import { CookieSettingsLink } from "./CookieConsent";
import { consentMode } from "@/lib/ads";
import { allCities } from "@/lib/eclipse/cities";
import { TENANTS, type Tenant } from "@/lib/tenants";
import type { CityWithCircumstances, Locale } from "@/lib/eclipse/types";
import { getDictionary } from "@/i18n/dictionary";
import { LOCALES, LOCALE_LABELS, localePath } from "@/i18n/config";
import { HEADER_NAV, MOBILE_NAV, isActivePath, navGroups, type MobileDestination } from "@/i18n/navigation";

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

/** Etiqueta del grupo del conmutador. «English» servía como enlace, no como título. */
const LANGUAGE_LABEL: Record<Locale, string> = { es: "Idioma", en: "Language" };

const MENU_LABEL: Record<Locale, { open: string; close: string; title: string; publish: string }> = {
  es: { open: "Menú", close: "Cerrar", title: "Todas las secciones", publish: "Publicar" },
  en: { open: "Menu", close: "Close", title: "All sections", publish: "List yours" },
};

/** El identificador lo comparten el botón del header y el de la barra inferior. */
const MENU_ID = "site-menu";

/*
  Iconos.

  Se dibujan a mano y en línea por la misma razón que las ilustraciones del blog:
  heredan `currentColor`, así que se tiñen solos con el acento del tenant, y no
  añaden ni una petición de red ni una dependencia que auditar.
*/
function Icon({ name, className = "h-5 w-5" }: { name: MobileDestination["icon"]; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }
  if (name === "pin") {
    return (
      <svg {...common}>
        <path d="M12 21s7-5.4 7-10.5A7 7 0 0 0 5 10.5C5 15.6 12 21 12 21Z" />
        <circle cx="12" cy="10.5" r="2.5" />
      </svg>
    );
  }
  if (name === "camera") {
    return (
      <svg {...common}>
        <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.2-2h8.2l1.2 2h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5Z" />
        <circle cx="12" cy="13" r="3.2" />
      </svg>
    );
  }
  if (name === "book") {
    return (
      <svg {...common}>
        <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2.5 2.5 0 0 1 2 1 2.5 2.5 0 0 1 2-1h4.5A1.5 1.5 0 0 1 20 5.5v12a1.5 1.5 0 0 1-1.5 1.5H14a2.5 2.5 0 0 0-2 1 2.5 2.5 0 0 0-2-1H5.5A1.5 1.5 0 0 1 4 17.5Z" />
        <path d="M12 5v14" />
      </svg>
    );
  }
  if (name === "pen") {
    return (
      <svg {...common}>
        <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17Z" />
        <path d="M15 6.5 17.5 9" />
      </svg>
    );
  }
  if (name === "tag") {
    return (
      <svg {...common}>
        <path d="M4 11V5a1 1 0 0 1 1-1h6l8 8-7 7-8-8Z" />
        <circle cx="8.5" cy="8.5" r="1.2" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

/**
 * Conmutador de idioma.
 *
 * Es un control segmentado con los dos códigos y no una bandera suelta: una
 * bandera identifica un país, no una lengua, y para quien busca en inglés desde
 * Marruecos o desde Irlanda la bandera correcta no existe. Enseñar las dos
 * opciones a la vez, con la activa marcada, además dice de un vistazo que la web
 * está en dos idiomas — cosa que un solo enlace «English» no dice.
 *
 * Cada mitad apunta a la traducción de **esta** página, no a la home.
 */
function LocaleToggle({ locale, path }: { locale: Locale; path: string }) {
  return (
    <div
      className="flex shrink-0 items-center rounded-full border p-0.5 text-xs font-bold"
      style={{ borderColor: "hsl(var(--border-strong))" }}
      role="group"
      aria-label={LANGUAGE_LABEL[locale]}
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={localePath(code, path)}
            hrefLang={code}
            aria-current={active ? "true" : undefined}
            // El texto visible son dos letras; el nombre accesible, el idioma
            // entero. «es» a secas no le dice nada a quien lo escucha.
            aria-label={LOCALE_LABELS[code]}
            className="flex min-h-[1.9rem] items-center rounded-full px-2.5 uppercase transition"
            style={{
              background: active ? "hsl(var(--accent))" : undefined,
              color: active ? "hsl(var(--on-accent))" : "hsl(var(--muted))",
            }}
          >
            {code}
          </Link>
        );
      })}
    </div>
  );
}

/** El disco del eclipse. Es la marca, y late muy despacio. */
function EclipseMark() {
  return (
    <span
      className="corona inline-block h-5 w-5 shrink-0 rounded-full"
      style={{ background: "hsl(var(--accent))" }}
      aria-hidden="true"
    />
  );
}

/**
 * Cabecera.
 *
 * Es una isla flotante de una sola fila que se contrae al bajar. Sustituye a un
 * header de dos filas que en móvil ocupaba unos 110 px permanentes —la segunda
 * era una tira de once enlaces con scroll horizontal de la que solo se veían
 * tres, y de la que nadie llegaba al final.
 *
 * Lo que queda arriba son las tres herramientas propias: horarios, punto exacto
 * y visor de cámara. Es la decisión de jerarquía del rediseño: lo que esta red
 * tiene y ninguna otra web del eclipse tiene, se ve siempre. El resto de la
 * taxonomía —cuatro grupos— vive en un único panel a pantalla completa que
 * abren tanto el botón del header como el de la barra inferior.
 */
export function Header({
  tenant,
  city,
  locale,
  path,
}: {
  tenant: Tenant;
  city: CityWithCircumstances;
  locale: Locale;
  /** Camino interno actual, para marcar la sección activa y conservar la página al cambiar de idioma. */
  path: string;
}) {
  const t = getDictionary(locale);
  const tools = HEADER_NAV[locale];
  const menu = MENU_LABEL[locale];

  return (
    <>
      {/*
        Progreso de lectura. Es una animación dirigida por scroll: no hay listener,
        no hay trabajo en el hilo principal y donde no hay soporte no se dibuja.
      */}
      <div className="read-progress" aria-hidden="true" />

      <header className="header-scrim sticky top-0 z-50 px-3 pt-3">
        <div className="header-island mx-auto flex max-w-6xl items-center gap-3 rounded-2xl px-3 py-2.5 sm:px-4">
          <Link
            href={localePath(locale, "/")}
            className="tap flex items-center gap-2 font-bold"
            aria-current={path === "/" ? "page" : undefined}
          >
            <EclipseMark />
            <span className="whitespace-nowrap">{tenant.brand}</span>
          </Link>

          {/* Los cuatro apartados fijos, siempre visibles a partir de tableta. En
              móvil los cubre la barra inferior, que está más a mano. */}
          <nav className="ml-2 hidden items-center gap-1 md:flex" aria-label={t.common.sections}>
            {tools.map((item) => {
              const active = isActivePath(path, item.href);
              return (
                <Link
                  key={item.href}
                  href={localePath(locale, item.href)}
                  aria-current={active ? "page" : undefined}
                  className="tap flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium"
                  style={{
                    color: active ? "hsl(var(--text))" : "hsl(var(--muted))",
                    background: active ? "hsl(var(--surface-2))" : undefined,
                  }}
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <LocaleToggle locale={locale} path={path} />

            {/* «Publicar» y no «Anúnciate»: quien tiene un apartamento libre o
                monta una observación no se ve a sí mismo comprando publicidad, y
                el alta básica de las tres cosas es gratis. */}
            <Link
              href={localePath(locale, "/publicar")}
              className="tap hidden items-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-sm font-semibold lg:inline-flex"
              style={{ background: "hsl(var(--accent))", color: "hsl(var(--on-accent))" }}
            >
              <Icon name="tag" className="h-4 w-4" />
              {menu.publish}
            </Link>

            <button
              type="button"
              popoverTarget={MENU_ID}
              className="tap flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border px-3 text-sm font-medium"
              style={{ borderColor: "hsl(var(--border-strong))", color: "hsl(var(--text))" }}
            >
              <Icon name="menu" className="h-4 w-4" />
              <span className="hidden sm:inline">{menu.open}</span>
            </button>
          </div>
        </div>
      </header>

      <SiteMenu locale={locale} path={path} tenant={tenant} />

      <p className="sr-only">
        {locale === "es"
          ? `Guía del eclipse solar total del 2 de agosto de 2027 en ${city.name}.`
          : `Guide to the total solar eclipse of 2 August 2027 in ${city.nameEn ?? city.name}.`}
      </p>
    </>
  );
}

/**
 * Panel de navegación completo.
 *
 * Una sola taxonomía para las dos pantallas: los mismos cuatro grupos en móvil y
 * en escritorio. Que el menú de móvil y el de escritorio agrupen distinto es el
 * fallo clásico de este patrón — obliga a aprender dos webs.
 */
function SiteMenu({ locale, path, tenant }: { locale: Locale; path: string; tenant: Tenant }) {
  const t = getDictionary(locale);
  const menu = MENU_LABEL[locale];
  const groups = navGroups(locale);
  const otherSites = TENANTS.filter((x) => x.domain !== tenant.domain);

  return (
    <div id={MENU_ID} popover="auto" className="site-menu" aria-label={menu.title}>
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center gap-3">
          <EclipseMark />
          <span className="font-bold">{tenant.brand}</span>
          <button
            type="button"
            popoverTarget={MENU_ID}
            popoverTargetAction="hide"
            className="tap ml-auto flex items-center rounded-xl border px-4 text-sm font-medium"
            style={{ borderColor: "hsl(var(--border-strong))" }}
          >
            {menu.close}
          </button>
        </div>

        <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <nav key={group.id} aria-label={group.label}>
              <h2 className="datum-label" style={{ color: "hsl(var(--accent))" }}>
                {group.label}
              </h2>
              <ul className="mt-3 space-y-1">
                {group.items.map((item) => {
                  const active = isActivePath(path, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={localePath(locale, item.href)}
                        aria-current={active ? "page" : undefined}
                        className="block rounded-xl px-3 py-2 transition"
                        style={{
                          background: active ? "hsl(var(--surface-2))" : undefined,
                        }}
                      >
                        <span className="flex items-center gap-2 font-medium">
                          {item.label}
                          {item.tool && (
                            <span
                              className="rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                              style={{
                                background: "hsl(var(--accent) / 0.15)",
                                color: "hsl(var(--accent))",
                              }}
                            >
                              {locale === "es" ? "herramienta" : "tool"}
                            </span>
                          )}
                        </span>
                        {item.hint && (
                          <span className="mt-0.5 block text-sm" style={{ color: "hsl(var(--faint))" }}>
                            {item.hint}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        <div
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-6 text-sm"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <LocaleToggle locale={locale} path={path} />
          <Link href={localePath(locale, "/publicar")} style={{ color: "hsl(var(--muted))" }}>
            {menu.publish}
          </Link>
          <Link href={localePath(locale, "/anunciate")} style={{ color: "hsl(var(--muted))" }}>
            {t.common.advertise}
          </Link>
          <span style={{ color: "hsl(var(--faint))" }}>{t.common.otherCities}:</span>
          {otherSites.map((x) => (
            <a key={x.domain} href={`https://${x.domain}`} style={{ color: "hsl(var(--muted))" }}>
              {x.brand}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Barra inferior de móvil.
 *
 * Cuatro destinos y ni uno más: por debajo de unos 44 px de ancho por destino el
 * pulgar deja de acertar. Tres son las herramientas propias y el cuarto abre el
 * mismo panel que el botón del header.
 *
 * No se oculta al hacer scroll a propósito. Esta web se consulta de pie y en la
 * calle: un menú que desaparece obliga a un gesto extra justo cuando menos
 * apetece hacerlo.
 */
export function BottomNav({ locale, path }: { locale: Locale; path: string }) {
  const menu = MENU_LABEL[locale];
  const items = MOBILE_NAV[locale];

  return (
    <nav
      className="bottom-nav fixed inset-x-0 bottom-0 z-40 md:hidden"
      aria-label={getDictionary(locale).common.sections}
    >
      <ul className="mx-auto flex max-w-lg items-stretch">
        {items.map((item) => {
          const active = isActivePath(path, item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={localePath(locale, item.href)}
                aria-current={active ? "page" : undefined}
                className="tap flex flex-col items-center justify-center gap-1 px-0.5 py-2 text-center text-[10px] font-medium leading-tight"
                style={{ color: active ? "hsl(var(--accent))" : "hsl(var(--muted))" }}
              >
                <Icon name={item.icon} className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
        <li className="flex-1">
          <button
            type="button"
            popoverTarget={MENU_ID}
            className="tap flex w-full flex-col items-center justify-center gap-1 px-0.5 py-2 text-center text-[10px] font-medium leading-tight"
            style={{ color: "hsl(var(--muted))" }}
          >
            <Icon name="menu" className="h-5 w-5" />
            {menu.open}
          </button>
        </li>
      </ul>
    </nav>
  );
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
