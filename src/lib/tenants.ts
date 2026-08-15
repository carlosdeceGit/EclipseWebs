import { CITIES_BY_SLUG, resolveCity } from "./eclipse/cities";
import type { CityWithCircumstances } from "./eclipse/types";

/**
 * Un tenant es un dominio de la red. Todos comparten código y despliegue; lo único
 * que cambia es la ciudad de la que hablan y el color de marca.
 *
 * Para añadir un dominio: apuntarlo a Vercel, añadir la entrada aquí y desplegar.
 */
export interface Tenant {
  /** Dominio principal, sin protocolo ni www. */
  domain: string;
  /** Dominios que sirven el mismo tenant (el .es, el www, etc.). */
  aliases: string[];
  citySlug: string;
  brand: string;
  /** Tono de acento en HSL, para que cada web se distinga de un vistazo. */
  accentHsl: string;
  /** ID de AdSense propio del dominio, si se gestiona por separado. */
  adsenseClientId?: string;
}

/**
 * Dominios en propiedad.
 *
 * El orden importa poco salvo para el pie de página, donde se listan como red.
 */
export const TENANTS: Tenant[] = [
  {
    domain: "ceutaeclipse.com",
    aliases: ["ceutaeclipse.es", "www.ceutaeclipse.com", "www.ceutaeclipse.es"],
    citySlug: "ceuta",
    brand: "Ceuta Eclipse",
    accentHsl: "28 96% 56%",
  },
  {
    domain: "eclipsecadiz.com",
    aliases: ["www.eclipsecadiz.com"],
    citySlug: "cadiz",
    brand: "Eclipse Cádiz",
    accentHsl: "45 96% 52%",
  },
  {
    domain: "eclipsetarifa.com",
    aliases: ["www.eclipsetarifa.com"],
    citySlug: "tarifa",
    brand: "Eclipse Tarifa",
    accentHsl: "260 84% 62%",
  },
  {
    domain: "eclipsegibraltar.com",
    aliases: ["www.eclipsegibraltar.com"],
    citySlug: "gibraltar",
    brand: "Eclipse Gibraltar",
    accentHsl: "0 84% 58%",
  },
];

/**
 * Tenant por defecto: el portal general que agrega toda la red.
 *
 * También es el que sirve en local y en las URLs de preview, para que un despliegue
 * de prueba siga siendo navegable sin tocar el fichero de hosts.
 */
export const HUB_TENANT: Tenant = {
  domain: "eclipse2027.es",
  aliases: ["localhost:3000", "localhost", "www.eclipse2027.es"],
  citySlug: "ceuta",
  brand: "Eclipse 2027",
  accentHsl: "28 96% 56%",
};

const BY_HOST = new Map<string, Tenant>();
for (const t of [...TENANTS, HUB_TENANT]) {
  BY_HOST.set(t.domain, t);
  for (const alias of t.aliases) BY_HOST.set(alias, t);
}

/** Resuelve el tenant a partir del Host de la petición. */
export function resolveTenant(host: string | null | undefined): Tenant {
  if (!host) return HUB_TENANT;
  const normalized = host.toLowerCase().trim();
  return (
    BY_HOST.get(normalized) ??
    BY_HOST.get(normalized.replace(/^www\./, "")) ??
    BY_HOST.get(normalized.split(":")[0]) ??
    HUB_TENANT
  );
}

export function isHub(tenant: Tenant): boolean {
  return tenant.domain === HUB_TENANT.domain;
}

export function tenantCity(tenant: Tenant): CityWithCircumstances {
  const city = CITIES_BY_SLUG.get(tenant.citySlug);
  if (!city) throw new Error(`Tenant ${tenant.domain} apunta a una ciudad inexistente: ${tenant.citySlug}`);
  return resolveCity(city);
}

export function tenantOrigin(tenant: Tenant): string {
  if (tenant.domain.startsWith("localhost")) return `http://${tenant.domain}`;
  return `https://${tenant.domain}`;
}
