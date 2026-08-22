import { cityName, formatDuration, formatObscuration } from "@/lib/eclipse/cities";
import { currentTenant } from "@/lib/tenant-context";
import { tenantCity, tenantOrigin } from "@/lib/tenants";
import { isLocale, localePath } from "@/i18n/config";
import type { Locale } from "@/lib/eclipse/types";

/**
 * El eclipse, como cita de calendario.
 *
 * Es el único mecanismo de retención que tenemos que no depende de una lista de
 * correo: quien visita esta web hoy no va a volver por su cuenta dentro de once
 * meses, pero su teléfono sí le va a avisar. Y el aviso llega con la hora local
 * correcta de **su** ciudad, calculada, no redondeada.
 *
 * Vive en la raíz porque un `.ics` se descarga, no se navega: no necesita idioma
 * en la URL. El idioma del texto se pide con `?lang=en` y por defecto va en
 * español, igual que el resto de la red.
 */
function stamp(date: Date): string {
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

/**
 * Plegado de líneas de iCalendar.
 *
 * El RFC 5545 limita cada línea a 75 octetos y obliga a continuar con un espacio
 * al principio de la siguiente. Sin esto, una descripción larga rompe el archivo
 * en varios clientes de calendario — y la descripción lleva los cinco contactos.
 */
function fold(line: string): string {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;

  const parts: string[] = [];
  let current = "";
  let size = 0;
  for (const char of line) {
    const charSize = Buffer.byteLength(char, "utf8");
    // 74 y no 75: la continuación añade un espacio por delante.
    if (size + charSize > (parts.length === 0 ? 75 : 74)) {
      parts.push(current);
      current = "";
      size = 0;
    }
    current += char;
    size += charSize;
  }
  if (current) parts.push(current);
  return parts.join("\r\n ");
}

/** Escapa los caracteres que el RFC 5545 reserva dentro de un valor de texto. */
function esc(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

const COPY: Record<
  Locale,
  {
    summaryTotal: (city: string, duration: string) => string;
    summaryPartial: (city: string) => string;
    totalityLine: (duration: string) => string;
    contacts: string;
    alarmDay: string;
    alarmNow: string;
    safety: string;
    more: string;
    labels: [string, string, string, string, string];
  }
> = {
  es: {
    summaryTotal: (city, duration) => `Eclipse solar TOTAL en ${city} — ${duration} de totalidad`,
    summaryPartial: (city) => `Eclipse solar parcial en ${city}`,
    totalityLine: (duration) => `${duration} de totalidad.`,
    contacts: "Horas locales",
    alarmDay: "Mañana es el eclipse. Comprueba que tienes las gafas certificadas.",
    alarmNow: "El eclipse empieza en 15 minutos. Ponte las gafas antes de mirar.",
    safety:
      "No mires al Sol sin filtro certificado ISO 12312-2 en ningún momento de la fase parcial. Y no te fíes del reloj para quitarte el filtro: fíate de lo que ves.",
    more: "Más información",
    labels: [
      "Empieza el parcial",
      "Empieza la totalidad",
      "Máximo",
      "Termina la totalidad",
      "Termina el parcial",
    ],
  },
  en: {
    summaryTotal: (city, duration) => `TOTAL solar eclipse in ${city} — ${duration} of totality`,
    summaryPartial: (city) => `Partial solar eclipse in ${city}`,
    totalityLine: (duration) => `${duration} of totality.`,
    contacts: "Local times",
    alarmDay: "The eclipse is tomorrow. Check that you have certified glasses.",
    alarmNow: "The eclipse starts in 15 minutes. Put your glasses on before looking.",
    safety:
      "Never look at the Sun without a certified ISO 12312-2 filter at any point during the partial phase. And do not trust the clock to take the filter off: trust what you see.",
    more: "More information",
    labels: ["Partial begins", "Totality begins", "Maximum", "Totality ends", "Partial ends"],
  },
};

export async function GET(request: Request) {
  const tenant = await currentTenant();
  const city = tenantCity(tenant);
  const origin = tenantOrigin(tenant);

  const requested = new URL(request.url).searchParams.get("lang") ?? "es";
  const locale: Locale = isLocale(requested) ? requested : "es";
  const copy = COPY[locale];
  const name = cityName(city, locale);
  const duration = formatDuration(city.eclipse.totalitySeconds, locale);

  /*
    El evento cubre el eclipse entero, de C1 a C4, y no solo la totalidad. Quien
    quiera ver el primer mordisco en el disco solar tiene que estar ya colocado
    y con el filtro puesto, y ese es el momento que se pierde si el aviso llega
    con la totalidad ya empezada.
  */
  const start = city.eclipse.partialStart ?? city.eclipse.maximum;
  const end = city.eclipse.partialEnd ?? city.eclipse.maximum;

  const times: [string, string | null][] = [
    [copy.labels[0], city.localTimes.partialStart],
    [copy.labels[1], city.localTimes.totalityStart],
    [copy.labels[2], city.localTimes.maximum],
    [copy.labels[3], city.localTimes.totalityEnd],
    [copy.labels[4], city.localTimes.partialEnd],
  ];

  const description = [
    city.eclipse.isTotal && duration
      ? copy.totalityLine(duration)
      : `${formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal)}.`,
    "",
    `${copy.contacts} (${city.timeZone}):`,
    ...times.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`),
    "",
    copy.safety,
    "",
    `${copy.more}: ${origin}${localePath(locale, "/horarios")}`,
  ].join("\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${tenant.brand}//Eclipse 2027//${locale.toUpperCase()}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    // El UID es estable por ciudad e idioma: si alguien vuelve a descargar el
    // archivo, su calendario actualiza la cita en vez de duplicarla.
    `UID:eclipse-2027-08-02-${city.slug}-${locale}@${tenant.domain}`,
    `DTSTAMP:${stamp(city.eclipse.maximum)}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    fold(
      `SUMMARY:${esc(
        city.eclipse.isTotal && duration
          ? copy.summaryTotal(name, duration)
          : copy.summaryPartial(name),
      )}`,
    ),
    fold(`DESCRIPTION:${esc(description)}`),
    fold(`LOCATION:${esc(name)}`),
    `GEO:${city.lat.toFixed(4)};${city.lon.toFixed(4)}`,
    fold(`URL:${origin}${localePath(locale, "/horarios")}`),
    "TRANSP:OPAQUE",
    // Dos avisos: uno el día antes, para comprar o localizar las gafas, y otro
    // un cuarto de hora antes del primer contacto, para estar ya colocado.
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "TRIGGER:-P1D",
    fold(`DESCRIPTION:${esc(copy.alarmDay)}`),
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "TRIGGER:-PT15M",
    fold(`DESCRIPTION:${esc(copy.alarmNow)}`),
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return new Response(`${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="eclipse-2027-${city.slug}.ics"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
