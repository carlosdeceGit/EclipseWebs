import { adsenseClientId } from "@/lib/ads";

/**
 * ads.txt por dominio.
 *
 * AdSense no paga por inventario que no pueda autorizar: si el dominio no publica
 * un `ads.txt` válido, el panel muestra el aviso de «archivo ads.txt no encontrado»
 * y una parte del inventario deja de venderse. El archivo declara quién está
 * autorizado a vender publicidad de este dominio, y con AdSense es una sola línea.
 *
 * Se genera en vez de guardarse como archivo estático por dos razones: cada tenant
 * puede tener su propio identificador de publisher, y mientras no haya ninguno
 * configurado es mejor devolver 404 que publicar un archivo vacío o con un
 * marcador, que Google interpretaría como un ads.txt inválido.
 */
export async function GET() {
  const client = adsenseClientId();
  if (!client) {
    return new Response("Not found", { status: 404, headers: { "Content-Type": "text/plain" } });
  }

  // El ID de cliente viaja como `ca-pub-XXXXXXXXXXXXXXXX`; en ads.txt va sin el
  // prefijo `ca-`. Confundirlos es el error más habitual y deja el archivo inválido.
  const publisher = client.replace(/^ca-/, "");

  // f08c47fec0942fa0 es el TAG-ID de Google, idéntico para todos los publishers.
  const lines = [`google.com, ${publisher}, DIRECT, f08c47fec0942fa0`];

  // Hueco para cuando entre una segunda red (Ezoic, Mediavine) o un intercambio
  // directo: sus líneas se añaden por variable de entorno, separadas por `;` o por
  // saltos de línea, sin tocar el código.
  const extra = process.env.ADS_TXT_EXTRA;
  if (extra) {
    for (const line of extra.split(/[;\n]/)) {
      const clean = line.trim();
      if (clean) lines.push(clean);
    }
  }

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
