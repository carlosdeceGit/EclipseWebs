import type { MetadataRoute } from "next";
import { ARTICLES } from "@/content/articles";
import { CITIES } from "@/lib/eclipse/cities";
import { currentTenant } from "@/lib/tenant-context";
import { tenantOrigin } from "@/lib/tenants";

/**
 * Sitemap por dominio.
 *
 * Cada tenant publica el suyo con su propio origen: un sitemap que listara URLs de
 * otros dominios sería ignorado por Google.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tenant = await currentTenant();
  const origin = tenantOrigin(tenant);
  const now = new Date();

  const staticPaths: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["/", 1, "daily"],
    ["/horarios", 0.9, "weekly"],
    ["/ciudades", 0.8, "weekly"],
    ["/directorio", 0.8, "daily"],
    ["/clasificados", 0.8, "daily"],
    ["/clasificados/nuevo", 0.4, "monthly"],
    ["/anunciate", 0.5, "monthly"],
    ["/faq", 0.7, "weekly"],
    ["/aviso-legal", 0.1, "yearly"],
    ["/privacidad", 0.1, "yearly"],
    ["/cookies", 0.1, "yearly"],
    ["/contacto", 0.3, "yearly"],
  ];

  return [
    ...staticPaths.map(([path, priority, changeFrequency]) => ({
      url: `${origin}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...ARTICLES.map((a) => ({
      url: `${origin}/${a.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...CITIES.map((c) => ({
      url: `${origin}/ciudades/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: c.circumstances.inTotality ? 0.7 : 0.5,
    })),
  ];
}
