import { postsForCity } from "@/content/blog";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity, tenantOrigin } from "@/lib/tenants";
import { localePath } from "@/i18n/config";

/**
 * Feed del blog, en español.
 *
 * Existe por dos razones que siguen valiendo la pena en 2027: los agregadores y las
 * newsletters automáticas siguen consumiendo RSS, y varios rastreadores lo usan para
 * detectar contenido nuevo antes de recorrer el sitemap. Cuesta veinte líneas.
 *
 * Solo incluye los posts de la ciudad del dominio, igual que el índice: el feed de
 * `eclipsecadiz.com` no puede anunciar artículos de Ceuta.
 */
export async function GET() {
  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const origin = tenantOrigin(tenant);
  const posts = postsForCity(tenant.citySlug);

  const items = posts
    .map((post) => {
      const content = post.content.es(city, tenant);
      const url = `${origin}${localePath("es", `/blog/${post.slug}`)}`;
      // Mediodía UTC para que la fecha no baile de día según la zona del lector.
      const date = new Date(`${post.published}T12:00:00Z`).toUTCString();
      return `    <item>
      <title>${xml(content.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${xml(content.description)}</description>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(`Blog de ${tenant.brand}`)}</title>
    <link>${origin}${localePath("es", "/blog")}</link>
    <atom:link href="${origin}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>${xml(`Guías y consejos para el eclipse solar total del 2 de agosto de 2027 en ${city.name}.`)}</description>
    <language>es-ES</language>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

/** Escapa lo que rompe un XML. Los títulos llevan comillas y ampersands. */
function xml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
