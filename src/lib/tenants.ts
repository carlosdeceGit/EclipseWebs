import { CITIES_BY_SLUG } from "./eclipse/cities";
import type { City } from "./eclipse/types";

/**
 * Un tenant es un dominio de la red. Todos comparten código y despliegue; lo único
 * que cambia es la ciudad de la que hablan y el color de marca.
 *
 * Para añadir un dominio: apuntarlo a Vercel, añadir la entrada aquí y desplegar.
 * No hace falta tocar nada más.
 */
export interface Tenant {
  /** Dominio principal, sin protocolo ni www. */
  domain: string;
  /** Dominios que redirigen o sirven el mismo tenant (p. ej. el .es). */
  aliases: string[];
  citySlug: string;
  /** Nombre de marca mostrado en la cabecera. */
  brand: string;
  /** Tono de color de acento en HSL, para diferenciar visualmente cada web. */
  accentHsl: string;
  /** ID de AdSense propio del dominio, si se gestiona por separado. */
  adsenseClientId?: string;
}

export const TENANTS: Tenant[] = [
  {
    domain: "ceutaeclipse.com",
    aliases: ["ceutaeclipse.es", "www.ceutaeclipse.com", "www.ceutaeclipse.es"],
    citySlug: "ceuta",
    brand: "Ceuta Eclipse",
    accentHsl: "28 96% 56%",
  },
  {
    domain: "melillaeclipse.com",
    aliases: ["melillaeclipse.es", "www.melillaeclipse.com"],
    citySlug: "melilla",
    brand: "Melilla Eclipse",
    accentHsl: "199 92% 52%",
  },
  {
    domain: "algeciraseclipse.com",
    aliases: ["algeciraseclipse.es", "www.algeciraseclipse.com"],
    citySlug: "algeciras",
    brand: "Algeciras Eclipse",
    accentHsl: "162 84% 40%",
  },
  {
    domain: "cadizeclipse.com",
    aliases: ["cadizeclipse.es", "www.cadizeclipse.com"],
    citySlug: "cadiz",
    brand: "Cádiz Eclipse",
    accentHsl: "45 96% 52%",
  },
  {
    domain: "tarifaeclipse.com",
    aliases: ["tarifaeclipse.es", "www.tarifaeclipse.com"],
    citySlug: "tarifa",
    brand: "Tarifa Eclipse",
    accentHsl: "260 84% 62%",
  },
  {
    domain: "gibraltareclipse.com",
    aliases: ["www.gibraltareclipse.com"],
    citySlug: "gibraltar",
    brand: "Gibraltar Eclipse",
    accentHsl: "0 84% 58%",
  },
  {
    domain: "marbellaeclipse.com",
    aliases: ["www.marbellaeclipse.com"],
    citySlug: "marbella",
    brand: "Marbella Eclipse",
    accentHsl: "330 80% 58%",
  },
];

/** Tenant por defecto: el portal general que agrega toda la red. */
export const HUB_TENANT: Tenant = {
  domain: "eclipseandalucia.com",
  aliases: ["localhost:3000", "localhost", "www.eclipseandalucia.com"],
  citySlug: "ceuta",
  brand: "Eclipse 2027",
  accentHsl: "28 96% 56%",
};

const BY_HOST = new Map<string, Tenant>();
for (const t of [...TENANTS, HUB_TENANT]) {
  BY_HOST.set(t.domain, t);
  for (const alias of t.aliases) BY_HOST.set(alias, t);
}

/**
 * Resuelve el tenant a partir del Host de la petición.
 *
 * Acepta el puerto en desarrollo y las URLs de preview de Vercel, que caen al hub
 * para que un despliegue de prueba siga siendo navegable.
 */
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

/** Indica si el tenant es el portal agregador y no una web de ciudad. */
export function isHub(tenant: Tenant): boolean {
  return tenant.domain === HUB_TENANT.domain;
}

export function tenantCity(tenant: Tenant): City {
  const city = CITIES_BY_SLUG.get(tenant.citySlug);
  if (!city) throw new Error(`Tenant ${tenant.domain} apunta a una ciudad inexistente: ${tenant.citySlug}`);
  return city;
}

export function tenantOrigin(tenant: Tenant): string {
  if (tenant.domain.startsWith("localhost")) return `http://${tenant.domain}`;
  return `https://${tenant.domain}`;
}
