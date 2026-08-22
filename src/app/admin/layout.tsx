import type { Metadata } from "next";
import "../globals.css";

/**
 * Raíz propia del panel.
 *
 * Vive fuera de `[locale]` a propósito: no tiene versión en inglés, no tiene
 * tenant, no lleva el header de la web ni el banner de cookies, y no debe
 * aparecer en el sitemap ni en el `hreflang` de nadie. Es una herramienta
 * interna, no una página de la red.
 */
export const metadata: Metadata = {
  title: "Moderación",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen" style={{ background: "hsl(var(--bg))", color: "hsl(var(--text))" }}>
        {children}
      </body>
    </html>
  );
}
