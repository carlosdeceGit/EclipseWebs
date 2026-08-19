import type { CityWithCircumstances, Locale } from "@/lib/eclipse/types";
import { formatDuration } from "@/lib/eclipse/cities";
import { getDictionary } from "@/i18n/dictionary";

const TEXT: Record<Locale, { partial: string; totality: string; maximum: string; lasts: string; darkness: string }> = {
  es: {
    partial: "Fase parcial",
    totality: "Totalidad",
    maximum: "Máximo",
    lasts: "dura",
    darkness: "oscuridad total",
  },
  en: {
    partial: "Partial phase",
    totality: "Totality",
    maximum: "Maximum",
    lasts: "lasts",
    darkness: "total darkness",
  },
};

/**
 * Los cinco contactos, dibujados a escala.
 *
 * Responde de un vistazo la pregunta que trae casi todo el mundo —«¿a qué hora
 * es?»— y de paso la que no sabe que tiene: **cuán corta es la totalidad**. Una
 * tabla dice «2 h 40 min de parcial y 4 min 48 s de total»; esta barra enseña
 * que el trozo naranja es una astilla dentro de las casi tres horas. Es la
 * diferencia entre leer un dato y entenderlo.
 *
 * Ni una cifra está escrita a mano: las posiciones salen de restar las fechas
 * que devuelve el cálculo besseliano, así que si el cálculo se afina, el dibujo
 * se afina con él.
 */
export function EclipseTimeline({
  city,
  locale,
  className = "",
}: {
  city: CityWithCircumstances;
  locale: Locale;
  className?: string;
}) {
  const t = getDictionary(locale);
  const text = TEXT[locale];
  const { partialStart, partialEnd, totalityStart, totalityEnd, maximum } = city.eclipse;

  // Sin C1 o C4 no hay eje que dibujar. Ocurre en localidades donde el eclipse ya
  // ha empezado al salir el Sol; ahí la tabla de /horarios sigue siendo correcta.
  if (!partialStart || !partialEnd) return null;

  const span = partialEnd.getTime() - partialStart.getTime();
  const at = (date: Date) => ((date.getTime() - partialStart.getTime()) / span) * 100;

  const maxAt = at(maximum);
  const bandStart = totalityStart ? at(totalityStart) : null;
  const bandEnd = totalityEnd ? at(totalityEnd) : null;
  const duration = formatDuration(city.eclipse.totalitySeconds, locale);

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4 text-sm" style={{ color: "hsl(var(--muted))" }}>
        <span className="tabular font-semibold" style={{ color: "hsl(var(--text))" }}>
          {city.localTimes.partialStart}
        </span>
        <span className="datum-label">{text.partial}</span>
        <span className="tabular font-semibold" style={{ color: "hsl(var(--text))" }}>
          {city.localTimes.partialEnd}
        </span>
      </div>

      {/*
        El eje. Es decorativo —toda la información está en el texto de arriba y en
        la lista de abajo—, así que se oculta a los lectores de pantalla en vez de
        obligarles a recorrer una barra de divs sin contenido.
      */}
      <div
        aria-hidden="true"
        className="relative mt-3 h-14 overflow-hidden rounded-xl border"
        style={{
          borderColor: "hsl(var(--border))",
          // El degradado del cielo: claro en los extremos, negro en la totalidad.
          background: "linear-gradient(90deg, hsl(var(--surface-3)), hsl(var(--surface)) 50%, hsl(var(--surface-3)))",
        }}
      >
        {bandStart !== null && bandEnd !== null && (
          <div
            className="absolute inset-y-0"
            style={{
              left: `${bandStart}%`,
              width: `${Math.max(bandEnd - bandStart, 0.4)}%`,
              minWidth: "3px",
              background: "hsl(var(--accent))",
              boxShadow: "0 0 1.5rem hsl(var(--accent) / 0.8)",
            }}
          />
        )}

        {/* Marca del máximo. En una localidad sin totalidad es lo único que hay. */}
        <div
          className="absolute inset-y-0 w-px"
          style={{ left: `${maxAt}%`, background: "hsl(var(--text) / 0.55)" }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        {city.eclipse.isTotal && duration ? (
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: "hsl(var(--accent))" }}
            />
            <strong>{text.totality}</strong>
            <span style={{ color: "hsl(var(--muted))" }}>
              {city.localTimes.totalityStart} – {city.localTimes.totalityEnd} · {duration} {text.darkness}
            </span>
          </span>
        ) : (
          <span style={{ color: "hsl(var(--muted))" }}>
            {text.maximum} {city.localTimes.maximum}
          </span>
        )}
        <span style={{ color: "hsl(var(--faint))" }}>{t.common.localTime}</span>
      </div>
    </div>
  );
}
