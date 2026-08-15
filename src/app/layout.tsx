import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Footer, Header } from "@/components/SiteChrome";
import { adsenseClientId } from "@/lib/ads";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity, tenantOrigin } from "@/lib/tenants";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await currentTenant();
  return {
    metadataBase: new URL(tenantOrigin(tenant)),
    title: {
      default: `${tenant.brand} — Eclipse solar total del 2 de agosto de 2027`,
      template: `%s | ${tenant.brand}`,
    },
    description:
      "Horarios, mapas, alojamiento, eventos y directorio de negocios para el eclipse solar total del 2 de agosto de 2027 en el sur de España.",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const adsense = adsenseClientId();

  return (
    <html lang="es" style={{ ["--accent" as string]: tenant.accentHsl }}>
      <body className="sky min-h-screen">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:px-3 focus:py-2"
          style={{ background: "hsl(var(--accent))", color: "hsl(224 44% 8%)" }}
        >
          Saltar al contenido
        </a>
        <Header tenant={tenant} city={city} />
        <main id="contenido">{children}</main>
        <Footer tenant={tenant} />
        {adsense && (
          <Script
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense}`}
          />
        )}
      </body>
    </html>
  );
}
