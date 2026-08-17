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
    pathname === "/blog/rss.xml";

  if (isRootAsset || pathname.startsWith("/api/") || pathname === "/og") {
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
