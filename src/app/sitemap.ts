import type { MetadataRoute } from "next";
import { articlesFor } from "@/content/articles";
import { postsForCity } from "@/content/blog";
import { CITIES } from "@/lib/eclipse/cities";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity, tenantOrigin } from "@/lib/tenants";
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
  // Cada dominio declara solo las guías que realmente sirve: las exclusivas de otra
  // ciudad devuelven 404 aquí y anunciarlas sería declarar URLs rotas.
  const articles = articlesFor(tenantCity(tenant).slug);

  // Solo los posts de la ciudad de este dominio. Anunciar en el sitemap de un
  // dominio URLs que ese dominio devuelve como 404 es la forma más rápida de
  // gastarse el presupuesto de rastreo en nada.
  const posts = postsForCity(tenant.citySlug);

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
    ...(posts.length > 0
      ? ([["/blog", 0.8, "weekly"]] as [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][])
      : []),
    ...posts.map(
      (p) =>
        [`/blog/${p.slug}`, 0.7, "monthly"] as [
          string,
          number,
          MetadataRoute.Sitemap[number]["changeFrequency"],
        ],
    ),
    ...articles.map(
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
