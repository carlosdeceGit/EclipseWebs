import type { MetadataRoute } from "next";
import { ARTICLES } from "@/content/articles";
import { CITIES } from "@/lib/eclipse/cities";
import { currentTenant } from "@/lib/tenant-context";
import { tenantOrigin } from "@/lib/tenants";
import { LOCALES, localePath } from "@/i18n/config";

/**
 * Sitemap por dominio, con las dos versiones de idioma enlazadas entre sí.
 *
 * Cada URL declara sus alternates: es la forma que recomienda Google de comunicar
 * el hreflang desde el sitemap, y evita depender solo de las etiquetas del head.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tenant = await currentTenant();
  const origin = tenantOrigin(tenant);
  const now = new Date();

  const paths: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["/", 1, "daily"],
    ["/horarios", 0.9, "weekly"],
    ["/localizador", 0.9, "weekly"],
    ["/ciudades", 0.8, "weekly"],
    ["/directorio", 0.8, "daily"],
    ["/clasificados", 0.8, "daily"],
    ["/clasificados/nuevo", 0.4, "monthly"],
    ["/anunciate", 0.5, "monthly"],
    ["/faq", 0.7, "weekly"],
    ...ARTICLES.map(
      (a) =>
        [`/${a.slug}`, a.legal ? 0.2 : 0.8, a.legal ? "yearly" : "weekly"] as [
          string,
          number,
          MetadataRoute.Sitemap[number]["changeFrequency"],
        ],
    ),
    ...CITIES.map(
      (c) => [`/ciudades/${c.slug}`, 0.7, "weekly"] as [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]],
    ),
  ];

  return paths.flatMap(([path, priority, changeFrequency]) =>
    LOCALES.map((locale) => ({
      url: `${origin}${localePath(locale, path)}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${origin}${localePath(l, path)}`]),
        ),
      },
    })),
  );
}
