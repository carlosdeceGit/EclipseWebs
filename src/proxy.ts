import { NextResponse, type NextRequest } from "next/server";

/**
 * Propaga el host original a los Server Components.
 *
 * Next no expone el Host de forma fiable en todas las rutas, y la resolución de
 * tenant depende de él, así que lo fijamos en una cabecera propia. En Next 16 este
 * archivo se llama `proxy` (antes `middleware`).
 */
export default function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const headers = new Headers(request.headers);
  headers.set("x-eclipse-host", host);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico)$).*)"],
};
