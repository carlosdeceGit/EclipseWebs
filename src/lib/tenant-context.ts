import { headers } from "next/headers";
import { resolveTenant, tenantCity, type Tenant } from "./tenants";
import type { CityWithCircumstances, Locale } from "./eclipse/types";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";

/**
 * Lee el tenant de la petición actual en un Server Component.
 *
 * El proxy ya ha dejado el host resuelto en `x-eclipse-host`, pero caemos al `host`
 * estándar para que las rutas que no pasan por él (sitemap, robots, handlers de
 * API) sigan funcionando.
 */
export async function currentTenant(): Promise<Tenant> {
  const h = await headers();
  return resolveTenant(h.get("x-eclipse-host") ?? h.get("host"));
}

export async function currentCity(): Promise<CityWithCircumstances> {
  return tenantCity(await currentTenant());
}

/**
 * Idioma de la petición.
 *
 * Las páginas lo reciben por parámetro de ruta; esto es para los handlers que no
 * tienen segmento de idioma y necesitan saberlo de todos modos.
 */
export async function currentLocale(): Promise<Locale> {
  const h = await headers();
  const value = h.get("x-eclipse-locale") ?? "";
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Camino interno de la petición, sin prefijo de idioma y empezando por `/`.
 *
 * Lo deja el proxy. Existe porque un layout de App Router no recibe la ruta y el
 * selector de idioma la necesita para no mandar a la home desde cualquier página.
 * Cae a `/` si la cabecera no está, que es lo que ocurre en las rutas que no
 * pasan por el proxy.
 */
export async function currentPath(): Promise<string> {
  const h = await headers();
  const value = h.get("x-eclipse-path") ?? "/";
  return value.startsWith("/") ? value : `/${value}`;
}
