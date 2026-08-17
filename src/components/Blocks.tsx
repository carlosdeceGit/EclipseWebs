import { Figure } from "@/components/art";
import { Callout } from "@/components/ui";
import type { Block } from "@/content/articles";
import type { CityWithCircumstances, Locale } from "@/lib/eclipse/types";

/**
 * Renderizador de bloques de contenido.
 *
 * Lo comparten las guías (`/guia`, `/seguridad`…) y el blog, que usan el mismo
 * vocabulario de bloques. Tener un solo renderizador es lo que garantiza que una
 * tabla se vea igual en los dos sitios y que añadir un tipo de bloque nuevo aparezca
 * en todas partes a la vez.
 */

/**
 * Negrita con `**...**` dentro de un texto.
 *
 * El contenido se escribe en TypeScript, no en Markdown, así que el renderizador no
 * interpreta nada por su cuenta. Pero remarcar una frase —«el filtro se pone al
 * primer destello»— es lo único que la prosa de estas guías necesita de verdad, y
 * hasta ahora los asteriscos se imprimían tal cual en las páginas que ya los usaban.
 *
 * Solo esta marca. Un renderizador de Markdown completo aquí sería una dependencia y
 * una superficie de escape de HTML a cambio de una cursiva.
 *
 * Se exporta porque el párrafo de entrada de un post se dibuja fuera de este
 * renderizador —tiene su propio tamaño— y también admite negrita.
 */
export function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );
}

/** Ancla estable para los encabezados, para poder enlazar a una sección concreta. */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function renderBlock(
  block: Block,
  i: number,
  city: CityWithCircumstances,
  locale: Locale,
) {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={i} id={headingId(block.text)}>
          {block.text}
        </h2>
      );
    case "h3":
      return <h3 key={i}>{block.text}</h3>;
    case "p":
      return <p key={i}>{inline(block.text)}</p>;
    case "ul":
      return (
        <ul key={i}>
          {block.items.map((item, j) => (
            <li key={j}>{inline(item)}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={i}>
          {block.items.map((item, j) => (
            <li key={j}>{inline(item)}</li>
          ))}
        </ol>
      );
    case "figure":
      return (
        <Figure
          key={i}
          art={block.art}
          caption={block.caption}
          city={city}
          locale={locale}
          className="my-8"
        />
      );
    case "table":
      return (
        <div key={i} className="my-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ color: "hsl(var(--muted))" }}>
                {block.head.map((h) => (
                  <th key={h} className="pb-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  {row.map((cell, c) => (
                    <td key={c} className="py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <div key={i} className="my-6">
          <Callout title={block.title}>{inline(block.text)}</Callout>
        </div>
      );
    case "faq":
      return (
        <div key={i} className="my-6 space-y-3">
          {block.items.map((item) => (
            <details
              key={item.q}
              className="rounded-2xl border p-5"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface))" }}
            >
              <summary className="cursor-pointer font-semibold">{item.q}</summary>
              <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
                {inline(item.a)}
              </p>
            </details>
          ))}
        </div>
      );
  }
}

/**
 * Serie de bloques.
 *
 * `offset` existe porque las páginas parten el cuerpo en dos para colar el anuncio
 * intercalado, y las claves de React tienen que seguir siendo únicas al reanudar.
 */
export function Blocks({
  blocks,
  city,
  locale,
  offset = 0,
}: {
  blocks: Block[];
  city: CityWithCircumstances;
  locale: Locale;
  offset?: number;
}) {
  return <>{blocks.map((b, i) => renderBlock(b, i + offset, city, locale))}</>;
}
