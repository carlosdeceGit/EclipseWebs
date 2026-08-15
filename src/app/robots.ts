import type { MetadataRoute } from "next";
import { currentTenant } from "@/lib/tenant-context";
import { tenantOrigin } from "@/lib/tenants";

/**
 * robots.txt por dominio.
 *
 * Los crawlers de IA se permiten a propósito. El modelo de negocio depende de que
 * ChatGPT, Perplexity, Claude y Gemini citen estas páginas cuando alguien pregunte
 * por el eclipse: bloquearlos ahorraría ancho de banda y costaría el canal de
 * captación que más va a crecer de aquí a 2027.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const tenant = await currentTenant();
  const origin = tenantOrigin(tenant);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // El formulario y los filtros no aportan nada al índice y diluyen el crawl.
        disallow: ["/api/", "/clasificados/nuevo", "/*?cat="],
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-User",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "CCBot",
          "Bytespider",
          "meta-externalagent",
        ],
        allow: "/",
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
