"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, EclipseMark } from "./Icon";
import type { Locale } from "@/lib/eclipse/types";
import { LOCALES, LOCALE_LABELS, localePath } from "@/i18n/config";
import { HEADER_NAV, MOBILE_NAV, isActivePath, navGroups } from "@/i18n/navigation";

/**
 * La navegación, en el cliente.
 *
 * Es lo único de la envoltura que corre en el navegador, y corre ahí por un
 * motivo concreto: **un layout de App Router no se vuelve a renderizar al
 * navegar entre páginas del mismo segmento**. Con el camino llegando como
 * propiedad desde el layout, el header conservaba el de la página por la que se
 * entró: el conmutador de idioma seguía apuntando a la home después de haber
 * navegado a una guía —cambiar de idioma te sacaba de la página— y el apartado
 * marcado como activo era el de antes. Se veía solo al navegar por dentro; una
 * recarga lo tapaba, que es lo que hizo que pasara desapercibido.
 *
 * `usePathname()` sí cambia en cada navegación, así que es la única fuente
 * fiable. La cabecera `x-eclipse-path` que alimentaba al servidor se ha
 * quitado del proxy: prometía una frescura que no podía cumplir.
 *
 * Aquí solo llegan datos serializables —marca, etiquetas y la taxonomía—: el
 * diccionario completo, el registro de tenants y el cálculo de las 35
 * localidades se quedan en el servidor, que es donde deben quedarse.
 */

/**
 * El camino público de la página actual, sin prefijo de idioma.
 *
 * Normaliza los dos prefijos a propósito. En español el proxy reescribe
 * `/seguridad` a `/es/seguridad`, así que durante el renderizado del servidor el
 * enrutador ve `/es/seguridad` mientras que en el navegador la URL es
 * `/seguridad`. Quitando el prefijo, los dos lados producen exactamente lo
 * mismo y no hay discrepancia de hidratación.
 */
function useSitePath(): string {
  const pathname = usePathname() ?? "/";
  for (const prefix of ["/es", "/en"]) {
    if (pathname === prefix) return "/";
    if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  }
  return pathname;
}

/** Etiqueta del grupo del conmutador. «English» servía como enlace, no como título. */
const LANGUAGE_LABEL: Record<Locale, string> = { es: "Idioma", en: "Language" };

const MENU_LABEL: Record<Locale, { open: string; close: string; title: string; publish: string }> = {
  es: { open: "Menú", close: "Cerrar", title: "Todas las secciones", publish: "Publicar" },
  en: { open: "Menu", close: "Close", title: "All sections", publish: "List yours" },
};

/** El identificador lo comparten el botón del header y el de la barra inferior. */
const MENU_ID = "site-menu";

/** Lo que la envoltura del servidor le pasa a la navegación. Todo serializable. */
export interface NavStrings {
  brand: string;
  /** Nombre de la ciudad del tenant, ya en el idioma de la página. */
  cityName: string;
  /** Etiqueta accesible de las tres navegaciones. */
  sections: string;
  advertise: string;
  otherCities: string;
  /** Los demás dominios de la red: solo dominio y marca. */
  sites: { domain: string; brand: string }[];
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
function LocaleToggle({ locale }: { locale: Locale }) {
  const path = useSitePath();

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
export function Header({ locale, strings }: { locale: Locale; strings: NavStrings }) {
  const path = useSitePath();
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
            <span className="whitespace-nowrap">{strings.brand}</span>
          </Link>

          {/* Los cuatro apartados fijos, siempre visibles a partir de tableta. En
              móvil los cubre la barra inferior, que está más a mano. */}
          <nav className="ml-2 hidden items-center gap-1 md:flex" aria-label={strings.sections}>
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
            <LocaleToggle locale={locale} />

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

      <SiteMenu locale={locale} strings={strings} />

      <p className="sr-only">
        {locale === "es"
          ? `Guía del eclipse solar total del 2 de agosto de 2027 en ${strings.cityName}.`
          : `Guide to the total solar eclipse of 2 August 2027 in ${strings.cityName}.`}
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
function SiteMenu({ locale, strings }: { locale: Locale; strings: NavStrings }) {
  const path = useSitePath();
  const menu = MENU_LABEL[locale];
  const groups = navGroups(locale);

  return (
    <div id={MENU_ID} popover="auto" className="site-menu" aria-label={menu.title}>
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center gap-3">
          <EclipseMark />
          <span className="font-bold">{strings.brand}</span>
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
          <LocaleToggle locale={locale} />
          <Link href={localePath(locale, "/publicar")} style={{ color: "hsl(var(--muted))" }}>
            {menu.publish}
          </Link>
          <Link href={localePath(locale, "/anunciate")} style={{ color: "hsl(var(--muted))" }}>
            {strings.advertise}
          </Link>
          <span style={{ color: "hsl(var(--faint))" }}>{strings.otherCities}:</span>
          {strings.sites.map((x) => (
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
export function BottomNav({ locale, strings }: { locale: Locale; strings: NavStrings }) {
  const path = useSitePath();
  const menu = MENU_LABEL[locale];
  const items = MOBILE_NAV[locale];

  return (
    <nav
      className="bottom-nav fixed inset-x-0 bottom-0 z-40 md:hidden"
      aria-label={strings.sections}
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

