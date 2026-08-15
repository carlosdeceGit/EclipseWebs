import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import "../globals.css";
import { Footer, Header } from "@/components/SiteChrome";
import { adsenseClientId } from "@/lib/ads";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity, tenantOrigin } from "@/lib/tenants";
import { getDictionary } from "@/i18n/dictionary";
import { HTML_LANG, LOCALES, isLocale } from "@/i18n/config";

/**
 * Layout raíz.
 *
 * Vive bajo [locale] a propósito: es el patrón de i18n de Next para que un solo
 * árbol de rutas sirva los dos idiomas. Las rutas sin idioma —robots, sitemap,
 * llms.txt, la API y la imagen OG— son route handlers y no necesitan layout.
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tenant = await currentTenant();

  return {
    metadataBase: new URL(tenantOrigin(tenant)),
    title: {
      default:
        locale === "en"
          ? `${tenant.brand} — Total solar eclipse of 2 August 2027`
          : `${tenant.brand} — Eclipse solar total del 2 de agosto de 2027`,
      template: `%s | ${tenant.brand}`,
    },
    description:
      locale === "en"
        ? "Timings, maps, accommodation, events and a business directory for the total solar eclipse of 2 August 2027 in southern Spain."
        : "Horarios, mapas, alojamiento, eventos y directorio de negocios para el eclipse solar total del 2 de agosto de 2027 en el sur de España.",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const t = getDictionary(locale);
  const adsense = adsenseClientId();

  return (
    <html lang={HTML_LANG[locale]} style={{ ["--accent" as string]: tenant.accentHsl }}>
      <body className="sky min-h-screen">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:px-3 focus:py-2"
          style={{ background: "hsl(var(--accent))", color: "hsl(224 44% 8%)" }}
        >
          {t.common.skipToContent}
        </a>
        <Header tenant={tenant} city={city} locale={locale} path="/" />
        <main id="contenido">{children}</main>
        <Footer tenant={tenant} locale={locale} />
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
