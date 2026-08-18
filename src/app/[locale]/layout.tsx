import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { Footer, Header } from "@/components/SiteChrome";
import { CookieConsent } from "@/components/CookieConsent";
import { adsActive, adsenseClientId } from "@/lib/ads";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity, tenantOrigin } from "@/lib/tenants";
import { getDictionary } from "@/i18n/dictionary";
import { HTML_LANG, LOCALES, isLocale, localePath } from "@/i18n/config";

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
  const adsenseAccount = adsenseClientId();

  return {
    metadataBase: new URL(tenantOrigin(tenant)),
    /**
     * Etiqueta de verificación de propiedad de AdSense.
     *
     * Google ofrece tres métodos para verificar un dominio y éste es, junto con el
     * de `ads.txt`, uno de los dos compatibles con nuestro consentimiento previo:
     * un `<meta>` es HTML inerte, no hace ninguna petición ni instala nada. El que
     * no vale es el «fragmento de código de AdSense», que carga el script de Google
     * en todas las páginas antes de que el visitante haya decidido nada.
     *
     * Sale del mismo identificador que `ads.txt`, así que no hay dos sitios donde
     * mantenerlo, y no se emite mientras no haya cuenta configurada.
     */
    ...(adsenseAccount ? { other: { "google-adsense-account": adsenseAccount } } : {}),
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
  // Solo se le pasa el cliente al banner cuando hay un bloque que servir. Con la
  // cuenta recién dada de alta y ningún bloque creado todavía, `ads.txt` ya publica
  // el identificador —que es lo que Google necesita para verificar el dominio— pero
  // no se pregunta nada al visitante ni se carga nada de Google.
  const adsense = adsActive() ? adsenseClientId() : null;

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
        {/*
          El script de AdSense lo monta este componente, no el layout: mientras no
          haya un sí explícito no se descarga nada de Google ni se instala ninguna
          cookie de terceros. Si estuviera aquí, el banner sería decorativo.
        */}
        <CookieConsent
          locale={locale}
          adsenseClientId={adsense}
          policyHref={localePath(locale, "/cookies")}
        />
      </body>
    </html>
  );
}
