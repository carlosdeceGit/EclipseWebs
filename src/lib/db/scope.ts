import { currentTenant } from "../tenant-context";
import { tenantCity, type Tenant } from "../tenants";

/**
 * Ámbito de datos de una petición: la ciudad del dominio que la está sirviendo.
 *
 * Existe para que en ceutaeclipse.es no se pueda ver, ni por accidente, lo que
 * pertenece a otra ciudad. Antes el aislamiento vivía en la consulta —un
 * `.eq("city_slug", …)` escrito a mano en cada sitio—, y eso funciona hasta que
 * alguien añade una consulta y se le olvida: no falla, simplemente muestra de más,
 * que es la peor forma de fallar.
 *
 * El tipo va con marca (`brand`) a propósito. Un `TenantScope` no se puede
 * construir a partir de un string cualquiera: solo lo emiten las dos funciones de
 * este módulo, y las dos derivan la ciudad del `Host` de la petición. Es la misma
 * idea que los guardarraíles de los agentes: una barrera que corre después de la
 * buena intención, no en lugar de ella.
 */
declare const tenantScopeBrand: unique symbol;

export interface TenantScope {
  readonly citySlug: string;
  readonly [tenantScopeBrand]: "tenant-scope";
}

function mint(citySlug: string): TenantScope {
  return { citySlug } as TenantScope;
}

/** Ámbito del tenant que sirve esta petición. */
export async function currentScope(): Promise<TenantScope> {
  return mint(tenantCity(await currentTenant()).slug);
}

/**
 * Ámbito de un tenant ya resuelto.
 *
 * Para las páginas, que normalmente ya han llamado a `currentTenant()` y no
 * necesitan volver a leer las cabeceras.
 */
export function scopeOf(tenant: Tenant): TenantScope {
  return mint(tenantCity(tenant).slug);
}
