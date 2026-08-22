import type { Locale } from "@/lib/eclipse/types";

/**
 * Duración de la totalidad como barra, dentro de una fila de tabla.
 *
 * Una columna de cifras se lee de una en una; una columna de barras se lee de un
 * vistazo. Es la misma información —la cifra sigue ahí al lado— pero convierte
 * una lista en una comparación, que es justo lo que viene a hacer quien mira el
 * ranking: ver cuánto se pierde bajando por la lista.
 *
 * Decisiones que vienen de la guía de visualización:
 *
 * - **Una sola serie, un solo tono.** No hay leyenda: la cabecera de la columna
 *   ya dice qué se mide.
 * - **La cifra va en color de texto, nunca en el color de la barra.** El color
 *   identifica la marca; el número es texto y se lee como texto.
 * - **Extremo redondeado y anclado al cero.** La barra empieza siempre en el
 *   mismo sitio, o las longitudes dejan de ser comparables.
 * - **El relleno va atenuado** y no a plena saturación: el acento de Cádiz es un
 *   ámbar muy claro y un bloque grande a todo color deslumbra sobre fondo oscuro.
 *
 * Es decorativa para la accesibilidad —`aria-hidden`— porque el valor exacto está
 * en la celda contigua: anunciarlo dos veces solo alarga la lectura.
 */
export function DurationBar({
  seconds,
  max,
  locale,
}: {
  seconds: number;
  /** Duración mayor de la tabla, que fija la escala. */
  max: number;
  locale: Locale;
}) {
  const fraction = max > 0 ? Math.max(seconds / max, 0) : 0;

  return (
    <span
      aria-hidden="true"
      title={locale === "es" ? "Duración relativa" : "Relative duration"}
      className="block h-1.5 w-full overflow-hidden rounded-full"
      style={{ background: "hsl(var(--border))" }}
    >
      <span
        className="block h-full rounded-full"
        style={{
          width: `${(fraction * 100).toFixed(1)}%`,
          background: "var(--accent-dim)",
        }}
      />
    </span>
  );
}
