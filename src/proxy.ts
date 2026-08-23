import { NextResponse, type NextRequest } from "next/server";

/**
 * Resuelve tenant e idioma antes de que la petición llegue a los Server Components.
 *
 * Hace dos cosas:
 *  1. Propaga el Host original en una cabecera propia, porque Next no lo expone de
 *     forma fiable en todas las rutas y la resolución de tenant depende de él.
 *  2. Reescribe las rutas sin prefijo de idioma a /es, de modo que el español viva
 *     en URLs limpias sin redirección y el inglés bajo /en. La reescritura es
 *     interna: la URL que ve el usuario y la que indexa Google no cambian.
 *
 * Hubo un tercer cometido —propagar el camino en `x-eclipse-path` para que el
 * conmutador de idioma conservara la página— y se quitó porque no podía
 * funcionar: un layout de App Router no se vuelve a renderizar al navegar entre
 * páginas del mismo segmento, así que ese valor quedaba congelado en cuanto el
 * usuario pinchaba un enlace. Ahora la navegación lee el camino en el cliente
 * con `usePathname()`; está explicado en `components/SiteNav.tsx`.
 */
export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  const headers = new Headers(request.headers);
  headers.set("x-eclipse-host", host);

  // Los archivos servidos en la raíz por convención no llevan idioma. `ads.txt` es
  // de los que menos margen tienen: Google lo busca exactamente en la raíz del
  // dominio y un 404 o una redirección ahí se traducen en inventario sin vender.
  const isRootAsset =
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/llms.txt" ||
    pathname === "/ads.txt" ||
    pathname === "/calendar.ics" ||
    pathname === "/blog/rss.xml";

  // El panel de moderación no tiene idioma ni tenant: modera una persona para
  // los cuatro dominios. Si pasara por la reescritura acabaría en /es/admin, que
  // no existe.
  if (
    isRootAsset ||
    pathname.startsWith("/api/") ||
    pathname === "/og" ||
    pathname === "/icon" ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  ) {
    return NextResponse.next({ request: { headers } });
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    headers.set("x-eclipse-locale", "en");
    return NextResponse.next({ request: { headers } });
  }

  headers.set("x-eclipse-locale", "es");
  const url = request.nextUrl.clone();
  url.pathname = `/es${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico)$).*)"],
};
