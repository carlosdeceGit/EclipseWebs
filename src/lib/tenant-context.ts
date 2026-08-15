import { headers } from "next/headers";
import { resolveTenant, tenantCity, type Tenant } from "./tenants";
import type { City } from "./eclipse/types";

/**
 * Lee el tenant de la petición actual en un Server Component.
 *
 * El middleware ya ha dejado el host resuelto en `x-eclipse-host`, pero caemos al
 * `host` estándar para que las rutas que no pasan por el middleware (sitemap,
 * robots, handlers de API) sigan funcionando.
 */
export async function currentTenant(): Promise<Tenant> {
  const h = await headers();
  return resolveTenant(h.get("x-eclipse-host") ?? h.get("host"));
}

export async function currentCity(): Promise<City> {
  return tenantCity(await currentTenant());
}
