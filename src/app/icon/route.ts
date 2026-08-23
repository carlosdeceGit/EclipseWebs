import { resolveTenant } from "@/lib/tenants";

/**
 * Favicon por dominio.
 *
 * Antes no había ninguno: `/favicon.ico` devolvía 404 en cada carga, la pestaña
 * del navegador salía en blanco y en los resultados de móvil de Google, donde el
 * icono va pegado al título, esta web era la única sin marca.
 *
 * Es el mismo disco del eclipse que la cabecera, y sale del acento del tenant:
 * un icono fijo obligaría a un archivo por dominio y a acordarse de regenerarlo
 * al añadir el quinto. En SVG porque a 16 px un PNG del disco con su corona se
 * ve sucio, y porque así se define una vez y vale para cualquier tamaño.
 *
 * El fondo va opaco a propósito. Un icono transparente desaparece contra la
 * barra de pestañas oscura del propio navegador, que es justo donde se mira.
 */
export function GET(request: Request) {
  const tenant = resolveTenant(request.headers.get("host"));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="hsl(230 30% 8%)"/>
  <circle cx="16" cy="16" r="11" fill="hsl(${tenant.accentHsl} / 0.22)"/>
  <circle cx="16" cy="16" r="7" fill="hsl(${tenant.accentHsl})"/>
</svg>`;

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml",
      // Un día de caché en el navegador y una semana en el borde: el icono solo
      // cambia si cambia el acento del dominio, cosa que no pasa nunca.
      "cache-control": "public, max-age=86400, s-maxage=604800, immutable",
    },
  });
}
