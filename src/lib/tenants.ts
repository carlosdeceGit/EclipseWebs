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
  /**
   * Imagen de fondo del hero.
   *
   * Es opcional y el hero está diseñado para verse bien sin ella: mientras no
   * exista se dibuja una corona en SVG. Cuando haya archivo, se pone aquí y ya.
   *
   * `credit` es obligatorio en cuanto la imagen no sea un dibujo propio. La regla
   * 9 del proyecto dice que no publicamos imágenes de las que no tengamos los
   * derechos, y una imagen generada tiene que decir que lo es: el eclipse aún no
   * ha ocurrido, así que cualquier imagen realista es necesariamente inventada y
   * presentarla como documento sería exactamente el tipo de cosa que esta red no
   * hace.
   *
   * `focal` es el `background-position`: el punto de la imagen que nunca se debe
   * recortar. En un cielo con el Sol arriba a la derecha, algo como "70% 30%".
   */
  hero?: {
    src: string;
    credit: string;
    focal?: string;
  };
}

/**
 * Dominios en propiedad.
 *
 * El orden importa poco salvo para el pie de página, donde se listan como red.
 */
export const TENANTS: Tenant[] = [
  {
    // El .es es el dominio canónico de Ceuta porque es el que está publicado. El
    // .com sirve el mismo contenido y debe redirigir aquí desde el panel de
    // Vercel; si algún día se prefiere el .com, basta con intercambiar estas dos
    // líneas y todos los canonical, hreflang y sitemaps se recolocan solos.
    domain: "ceutaeclipse.es",
    aliases: ["ceutaeclipse.com", "www.ceutaeclipse.es", "www.ceutaeclipse.com"],
    citySlug: "ceuta",
    brand: "Ceuta Eclipse",
    accentHsl: "28 96% 56%",
    hero: {
      src: "/hero/ceuta.webp",
      credit:
        "Ilustración generada con IA a partir del paisaje real de Ceuta y el Estrecho. El eclipse del 2 de agosto de 2027 todavía no ha ocurrido: no es una fotografía.",
      focal: "52% 38%",
    },
  },
  {
    // Canónico el .es, que es el dominio en propiedad. El .com se deja declarado
    // como alias: si algún día se adquiere, sirve el mismo contenido y canonicaliza
    // aquí sin tocar código. Un alias que no resuelve no cuesta nada.
    domain: "eclipsecadiz.es",
    aliases: ["eclipsecadiz.com", "www.eclipsecadiz.es", "www.eclipsecadiz.com"],
    citySlug: "cadiz",
    brand: "Eclipse Cádiz",
    accentHsl: "45 96% 52%",
  },
  {
    domain: "eclipsetarifa.es",
    aliases: ["eclipsetarifa.com", "www.eclipsetarifa.es", "www.eclipsetarifa.com"],
    citySlug: "tarifa",
    brand: "Eclipse Tarifa",
    accentHsl: "260 84% 62%",
  },
  {
    domain: "eclipsegibraltar.com",
    aliases: ["eclipsegibraltar.es", "www.eclipsegibraltar.com", "www.eclipsegibraltar.es"],
    citySlug: "gibraltar",
    brand: "Eclipse Gibraltar",
    accentHsl: "0 84% 58%",
  },
];

/**
 * Plantilla del tenant por defecto.
 *
 * Sirve para lo que no es un dominio de la red: `localhost`, las URLs
 * `*.vercel.app` de preview y producción, y cualquier host desconocido.
 *
 * `domain` es un marcador y **nunca se usa tal cual**: `resolveTenant()` lo
 * sustituye por el host real de la petición. El motivo es concreto y costó un bug
 * en producción: si aquí figura un dominio fijo, todas las URLs canónicas, el
 * sitemap y el llms.txt de los despliegues de preview apuntan a ese dominio. Si
 * además resulta que no es nuestro, estaríamos regalándole a un tercero todas las
 * señales de canonicalización.
 */
const HUB_TEMPLATE: Omit<Tenant, "domain" | "aliases"> = {
  citySlug: "ceuta",
  brand: "Eclipse 2027",
  accentHsl: "28 96% 56%",
  /*
    El hub habla de Ceuta —es su `citySlug`—, así que lleva su misma imagen. No es
    un detalle estético: los despliegues de previsualización de Vercel salen por un
    host `*.vercel.app`, que cae aquí. Sin esta línea, cualquiera que revise un
    cambio del hero en una preview vería el estado sin imagen y concluiría que no
    funciona.
  */
  hero: {
    src: "/hero/ceuta.webp",
    credit:
      "Ilustración generada con IA a partir del paisaje real de Ceuta y el Estrecho. El eclipse del 2 de agosto de 2027 todavía no ha ocurrido: no es una fotografía.",
    focal: "52% 38%",
  },
};

/** Tenant de reserva para cuando no hay Host que valga (renderizado sin petición). */
export const HUB_TENANT: Tenant = {
  ...HUB_TEMPLATE,
  domain: "localhost:3000",
  aliases: [],
};

const BY_HOST = new Map<string, Tenant>();
for (const t of TENANTS) {
  BY_HOST.set(t.domain, t);
  for (const alias of t.aliases) BY_HOST.set(alias, t);
}

/**
 * Resuelve el tenant a partir del Host de la petición.
 *
 * Si el host no es de la red, devuelve el tenant genérico **con ese mismo host**
 * como dominio, de modo que la web se canonicaliza a sí misma allí donde esté
 * servida en vez de apuntar a un dominio ajeno.
 */
export function resolveTenant(host: string | null | undefined): Tenant {
  if (!host) return HUB_TENANT;

  const normalized = host.toLowerCase().trim();
  const known =
    BY_HOST.get(normalized) ??
    BY_HOST.get(normalized.replace(/^www\./, "")) ??
    BY_HOST.get(normalized.split(":")[0]);
  if (known) return known;

  return { ...HUB_TEMPLATE, domain: normalized, aliases: [] };
}

/** Cierto cuando el host no corresponde a ningún dominio de la red. */
export function isHub(tenant: Tenant): boolean {
  return !TENANTS.some((t) => t.domain === tenant.domain);
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
