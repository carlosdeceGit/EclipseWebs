import type { Tenant } from "./tenants";

/**
 * Datos identificativos del titular.
 *
 * La LSSI (art. 10) obliga a que un sitio con actividad económica publique de forma
 * permanente y de fácil acceso el nombre o razón social, el NIF, el domicilio y un
 * medio de contacto directo. AdSense también revisa esta información al aprobar un
 * dominio, así que sin ella no hay publicidad.
 *
 * Están centralizados aquí en vez de repetidos en cada página legal para que un
 * cambio de domicilio o de correo se haga en un único sitio y se propague a los
 * cuatro dominios y a los dos idiomas.
 */
export const LEGAL_ENTITY = {
  name: "Carlos Delgado",
  taxIdLabel: { es: "DNI", en: "Spanish tax ID (DNI)" },
  taxId: "48968028Q",
  address: "Calle González Besada 9, Ceuta, España",
  addressEn: "Calle González Besada 9, Ceuta, Spain",
  country: "ES",
} as const;

/**
 * Correo de contacto del dominio.
 *
 * Se deriva del propio dominio en lugar de fijar una dirección personal: cada web
 * de la red enseña su propio buzón, que es lo que espera quien la visita, y evita
 * publicar una cuenta privada en cuatro sitios distintos.
 *
 * Hace falta dar de alta estos buzones (o un redirección) en cada dominio antes de
 * publicar.
 */
export function contactEmail(tenant: Tenant): string {
  return `contacto@${tenant.domain}`;
}
