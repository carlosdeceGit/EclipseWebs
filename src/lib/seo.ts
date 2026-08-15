import type { Metadata } from "next";
import { ECLIPSE } from "./eclipse/event";
import { formatDuration } from "./eclipse/cities";
import type { City } from "./eclipse/types";
import { tenantOrigin, type Tenant } from "./tenants";

/**
 * Metadatos por página.
 *
 * El título lleva siempre ciudad + fecha porque las consultas reales son del tipo
 * "eclipse Ceuta 2027 hora", y la descripción antepone el dato duro (duración,
 * hora) al reclamo, que es lo que hace que un motor generativo cite la página.
 */
export function buildMetadata(opts: {
  tenant: Tenant;
  city: City;
  title: string;
  description: string;
  path: string;
  locale?: "es" | "en";
}): Metadata {
  const { tenant, city, title, description, path, locale = "es" } = opts;
  const origin = tenantOrigin(tenant);
  const url = `${origin}${path}`;
  const fullTitle = `${title} | ${tenant.brand}`;

  return {
    metadataBase: new URL(origin),
    title: fullTitle,
    description,
    // Sin `languages`: declarar un hreflang="en" apuntando a /en cuando esas páginas
    // todavía no existen es peor que no declarar nada, porque Google acaba viendo
    // alternates que devuelven 404. Se añade cuando se publique la versión inglesa.
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: tenant.brand,
      locale: locale === "es" ? "es_ES" : "en_GB",
      type: "website",
      images: [{ url: `${origin}/og?city=${city.slug}`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    other: {
      // Señales explícitas para motores generativos y agregadores.
      "article:published_time": new Date().toISOString(),
      "geo.position": `${city.lat};${city.lon}`,
      "geo.placename": city.name,
      "geo.region": `${city.country}-${city.province}`,
    },
  };
}

/** Bloque JSON-LD listo para inyectar. */
export function jsonLd(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}

/**
 * Grafo de entidades de la ciudad: el evento, el lugar y la web.
 *
 * Se emite en la home de cada dominio. Google usa `Event` para los rich results y
 * los motores generativos se apoyan en `about`/`sameAs` para desambiguar de qué
 * eclipse y de qué ciudad se habla.
 */
export function cityGraph(tenant: Tenant, city: City) {
  const origin = tenantOrigin(tenant);
  const duration = formatDuration(city.circumstances.totalitySeconds);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: origin,
        name: tenant.brand,
        inLanguage: "es-ES",
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
        "@id": `${origin}/#eclipse`,
        name: `Eclipse solar total del 2 de agosto de 2027 en ${city.name}`,
        description: duration
          ? `El eclipse solar total del 2 de agosto de 2027 será visible desde ${city.name} con ${duration} de totalidad.`
          : `El eclipse solar total del 2 de agosto de 2027 será visible desde ${city.name}.`,
        startDate: ECLIPSE.isoDateTimeUTC,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        isAccessibleForFree: true,
        location: {
          "@type": "Place",
          name: city.name,
          address: {
            "@type": "PostalAddress",
            addressLocality: city.name,
            addressRegion: city.province,
            addressCountry: city.country,
          },
          geo: { "@type": "GeoCoordinates", latitude: city.lat, longitude: city.lon },
        },
        about: {
          "@type": "Thing",
          name: "Eclipse solar total del 2 de agosto de 2027",
          sameAs: "https://es.wikipedia.org/wiki/Eclipse_solar_del_2_de_agosto_de_2027",
        },
        organizer: { "@id": `${origin}/#organization` },
      },
    ],
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

export function breadcrumbGraph(tenant: Tenant, trail: { name: string; path: string }[]) {
  const origin = tenantOrigin(tenant);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${origin}${item.path}`,
    })),
  };
}
