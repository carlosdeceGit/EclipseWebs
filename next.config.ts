import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Las imágenes de negocios y eventos llegan de Supabase Storage o de la propia web
  // del anunciante, así que dejamos el patrón abierto a https y controlamos el origen
  // en el momento de la moderación.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async headers() {
    return [
      {
        // Los crawlers de IA (GPTBot, ClaudeBot, PerplexityBot...) y los de buscadores
        // leen mejor una respuesta cacheable y estable.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // El visor solar del localizador necesita cámara y sensores de orientación,
          // y la geolocalización la usa el propio localizador. Se conceden solo al
          // propio dominio: ningún iframe de terceros —el de la publicidad, sin ir
          // más lejos— hereda estos permisos.
          //
          // Declarar la política no activa nada: el navegador sigue pidiendo permiso
          // al usuario para cada una. Lo que hace es que sin ella algunos navegadores
          // los denieguen de antemano.
          {
            key: "Permissions-Policy",
            value:
              "camera=(self), geolocation=(self), accelerometer=(self), gyroscope=(self), magnetometer=(self), microphone=()",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
