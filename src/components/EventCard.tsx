import { Badge, Card } from "./ui";
import type { EclipseEvent } from "@/lib/db/events";
import type { Locale } from "@/lib/eclipse/types";
import { INTL_LOCALE } from "@/i18n/config";

const TEXT: Record<Locale, { free: string; source: string; at: string }> = {
  es: { free: "Gratis", source: "Convocatoria", at: "en" },
  en: { free: "Free", source: "Listing", at: "at" },
};

/**
 * Un acto de la agenda.
 *
 * La fecha se formatea en la zona horaria de la ciudad, no en la del visitante:
 * un acto en Ceuta a las 20:00 es a las 20:00 aunque lo esté leyendo alguien
 * desde Londres, y mostrarle las 19:00 sería mentirle sobre a qué hora tiene que
 * presentarse.
 *
 * El enlace a la fuente lleva `nofollow` porque no respondemos del sitio ajeno,
 * pero **no** `sponsored`: no es un enlace comercial, es la prueba de que el acto
 * existe. Marcarlo como pagado cuando no lo es es tan incorrecto como lo
 * contrario.
 */
export function EventCard({
  event,
  locale,
  timeZone,
}: {
  event: EclipseEvent;
  locale: Locale;
  timeZone: string;
}) {
  const starts = new Date(event.starts_at);
  const date = new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  }).format(starts);
  const t = TEXT[locale];

  return (
    <Card interactive className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2">
        <p className="datum-label" style={{ color: "hsl(var(--accent))" }}>
          {date}
        </p>
        {event.is_free && <Badge tone="muted">{t.free}</Badge>}
      </div>

      <h3 className="mt-2 font-semibold" style={{ fontSize: "var(--step-1)" }}>
        {event.title}
      </h3>

      {event.venue && (
        <p className="mt-1 text-sm" style={{ color: "hsl(var(--muted))" }}>
          {t.at} {event.venue}
        </p>
      )}

      {event.description && (
        <p className="mt-3 text-sm" style={{ color: "hsl(var(--muted))" }}>
          {event.description.length > 220 ? `${event.description.slice(0, 220)}…` : event.description}
        </p>
      )}

      <div className="mt-auto pt-4 text-sm">
        {event.organizer && (
          <p style={{ color: "hsl(var(--faint))" }}>{event.organizer}</p>
        )}
        <a
          href={event.source_url}
          target="_blank"
          rel="nofollow noopener"
          className="underline"
          style={{ color: "hsl(var(--accent))" }}
        >
          {event.source_name ?? t.source}
        </a>
      </div>
    </Card>
  );
}
