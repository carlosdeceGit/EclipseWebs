import type { Metadata } from "next";
import { ECLIPSE } from "./eclipse/event";
import { cityName, formatDuration, formatObscuration, provinceName } from "./eclipse/cities";
import type { City, CityWithCircumstances, Locale } from "./eclipse/types";
import { tenantOrigin, type Tenant } from "./tenants";
import { HTML_LANG, OG_LOCALE, localePath } from "@/i18n/config";

/**
 * Metadatos por página.
 *
 * El título lleva siempre ciudad y fecha porque las consultas reales son del tipo
 * "eclipse Ceuta 2027 hora", y la descripción antepone el dato duro a cualquier
 * reclamo, que es lo que hace que un motor generativo cite la página.
 */
export function buildMetadata(opts: {
  tenant: Tenant;
  city: City;
  locale: Locale;
  title: string;
  description: string;
  /** Camino interno, sin prefijo de idioma. */
  path: string;
  /**
   * Titular para la imagen de compartición.
   *
   * Sin él, la OG es la portada genérica de la ciudad, que es lo correcto para la
   * home y las páginas de datos. Los posts del blog sí lo pasan: dieciséis enlaces
   * compartidos con la misma imagen se leen como uno repetido.
   */
  ogTitle?: string;
  /** Fechas del artículo, para `article:published_time` de Open Graph. */
  published?: string;
  modified?: string;
}): Metadata {
  const { tenant, city, locale, title, description, path, ogTitle, published, modified } = opts;
  const origin = tenantOrigin(tenant);
  const url = `${origin}${localePath(locale, path)}`;
  const fullTitle = `${title} | ${tenant.brand}`;
  const ogImage =
    `${origin}/og?city=${city.slug}&locale=${locale}` +
    (ogTitle ? `&title=${encodeURIComponent(ogTitle)}` : "");

  return {
    metadataBase: new URL(origin),
    // El icono se genera por dominio en `/icon`: ver esa ruta. `shortcut` cubre a
    // los navegadores que siguen pidiendo `/favicon.ico` por su cuenta.
    icons: { icon: "/icon", shortcut: "/icon", apple: "/icon" },
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
      // Ahora sí hay versión inglesa real, así que el hreflang apunta a páginas que
      // existen. x-default va al español, que es el idioma principal del proyecto.
      languages: {
        es: `${origin}${localePath("es", path)}`,
        en: `${origin}${localePath("en", path)}`,
        "x-default": `${origin}${localePath("es", path)}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: tenant.brand,
      locale: OG_LOCALE[locale],
      ...(published
        ? { type: "article" as const, publishedTime: published, modifiedTime: modified ?? published }
        : { type: "website" as const }),
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    other: {
      "geo.position": `${city.lat};${city.lon}`,
      "geo.placename": city.name,
      "geo.region": `${city.country}-${city.province}`,
    },
  };
}

/** Bloque JSON-LD listo para inyectar. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

/**
 * Grafo de entidades de la ciudad: el evento, el lugar y la web.
 *
 * Se emite en la home y en las fichas de ciudad. Google usa `Event` para los rich
 * results, y los motores generativos se apoyan en `about` y en las cifras del
 * `description` para desambiguar de qué eclipse y de qué ciudad se habla.
 */
export function cityGraph(tenant: Tenant, city: CityWithCircumstances, locale: Locale) {
  const origin = tenantOrigin(tenant);
  const duration = formatDuration(city.eclipse.totalitySeconds, locale);
  const name = cityName(city, locale);

  const description =
    locale === "es"
      ? city.eclipse.isTotal
        ? `El eclipse solar total del 2 de agosto de 2027 será visible desde ${name} con ${duration} de totalidad, entre las ${city.localTimes.totalityStart} y las ${city.localTimes.totalityEnd} hora local.`
        : `El 2 de agosto de 2027 se verá un eclipse parcial desde ${name}, con un ${formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)} del disco solar cubierto.`
      : city.eclipse.isTotal
        ? `The total solar eclipse of 2 August 2027 will be visible from ${name} with ${duration} of totality, between ${city.localTimes.totalityStart} and ${city.localTimes.totalityEnd} local time.`
        : `On 2 August 2027 a partial eclipse will be visible from ${name}, with ${formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)} of the solar disc covered.`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: origin,
        name: tenant.brand,
        inLanguage: HTML_LANG[locale],
        publisher: { "@id": `${origin}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: tenant.brand,
        url: origin,
      },
      {
        "@type": "Event",
        "@id": `${origin}/#eclipse-${city.slug}`,
        name:
          locale === "es"
            ? `Eclipse solar total del 2 de agosto de 2027 en ${name}`
            : `Total solar eclipse of 2 August 2027 in ${name}`,
        description,
        startDate: city.eclipse.partialStart?.toISOString() ?? ECLIPSE.isoDateTimeUTC,
        endDate: city.eclipse.partialEnd?.toISOString() ?? ECLIPSE.isoDateTimeUTC,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        isAccessibleForFree: true,
        location: {
          "@type": "Place",
          name,
          address: {
            "@type": "PostalAddress",
            addressLocality: name,
            addressRegion: provinceName(city, locale),
            addressCountry: city.country,
          },
          geo: { "@type": "GeoCoordinates", latitude: city.lat, longitude: city.lon },
        },
        about: {
          "@type": "Thing",
          name:
            locale === "es"
              ? "Eclipse solar del 2 de agosto de 2027"
              : "Solar eclipse of 2 August 2027",
          sameAs: "https://en.wikipedia.org/wiki/Solar_eclipse_of_August_2,_2027",
        },
        organizer: { "@id": `${origin}/#organization` },
      },
    ],
  };
}

/**
 * Ficha de un post del blog.
 *
 * `BlogPosting` es lo que permite que Google muestre fecha y autoría, y lo que un
 * motor generativo usa para saber que está citando un artículo con fecha y no una
 * página estática. La imagen apunta a la OG generada al vuelo: es una URL real que
 * devuelve un PNG de 1200×630, no un marcador.
 */
export function blogPostingGraph(opts: {
  tenant: Tenant;
  city: City;
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  published: string;
  updated?: string;
}) {
  const { tenant, city, locale, slug, title, description, published, updated } = opts;
  const origin = tenantOrigin(tenant);
  const url = `${origin}${localePath(locale, `/blog/${slug}`)}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    headline: title,
    description,
    inLanguage: HTML_LANG[locale],
    datePublished: published,
    dateModified: updated ?? published,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: {
      "@type": "ImageObject",
      url: `${origin}/og?city=${city.slug}&locale=${locale}&title=${encodeURIComponent(title)}`,
      width: 1200,
      height: 630,
    },
    author: { "@id": `${origin}/#organization` },
    publisher: { "@id": `${origin}/#organization` },
    isPartOf: {
      "@type": "Blog",
      "@id": `${origin}${localePath(locale, "/blog")}#blog`,
      name: locale === "es" ? `Blog de ${tenant.brand}` : `${tenant.brand} blog`,
    },
    about: {
      "@type": "Thing",
      name:
        locale === "es"
          ? "Eclipse solar del 2 de agosto de 2027"
          : "Solar eclipse of 2 August 2027",
      sameAs: "https://en.wikipedia.org/wiki/Solar_eclipse_of_August_2,_2027",
    },
    spatialCoverage: {
      "@type": "Place",
      name: cityName(city, locale),
      geo: { "@type": "GeoCoordinates", latitude: city.lat, longitude: city.lon },
    },
  };
}

/**
 * El blog como colección.
 *
 * Se emite en el índice. `ItemList` con las URLs en orden es lo que hace que un
 * crawler entienda el índice como una lista de artículos y no como una página
 * cualquiera con enlaces.
 */
export function blogGraph(
  tenant: Tenant,
  locale: Locale,
  posts: { slug: string; title: string; description: string; published: string }[],
) {
  const origin = tenantOrigin(tenant);
  const url = `${origin}${localePath(locale, "/blog")}`;

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${url}#blog`,
    url,
    name: locale === "es" ? `Blog de ${tenant.brand}` : `${tenant.brand} blog`,
    inLanguage: HTML_LANG[locale],
    publisher: { "@id": `${origin}/#organization` },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      "@id": `${origin}${localePath(locale, `/blog/${p.slug}`)}#post`,
      headline: p.title,
      description: p.description,
      datePublished: p.published,
      url: `${origin}${localePath(locale, `/blog/${p.slug}`)}`,
    })),
  };
}

export function faqGraph(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function breadcrumbGraph(
  tenant: Tenant,
  locale: Locale,
  trail: { name: string; path: string }[],
) {
  const origin = tenantOrigin(tenant);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${origin}${localePath(locale, item.path)}`,
    })),
  };
}

/**
 * Tabla de duraciones como `Dataset`.
 *
 * Es la forma de que un motor generativo entienda que la tabla es un conjunto de
 * datos citable y no una lista decorativa.
 */
export function datasetGraph(tenant: Tenant, locale: Locale) {
  const origin = tenantOrigin(tenant);
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name:
      locale === "es"
        ? "Circunstancias locales del eclipse del 2 de agosto de 2027 por localidad"
        : "Local circumstances of the 2 August 2027 eclipse by location",
    description:
      locale === "es"
        ? "Duración de la totalidad, horas de contacto, magnitud y altura del Sol calculadas con elementos besselianos de la NASA y validadas contra el IGN."
        : "Length of totality, contact times, magnitude and solar altitude computed from NASA Besselian elements and validated against Spain's IGN.",
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: { "@id": `${origin}/#organization` },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${origin}/api/eclipse`,
      },
    ],
  };
}
