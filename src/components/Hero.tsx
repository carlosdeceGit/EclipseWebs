import Link from "next/link";
import { Countdown } from "./Countdown";
import { TrustStrip, buttonStyle } from "./ui";
import type { CityWithCircumstances, Locale } from "@/lib/eclipse/types";
import type { Tenant } from "@/lib/tenants";
import { cityName, formatObscuration, toLocalTime } from "@/lib/eclipse/cities";
import { getDictionary } from "@/i18n/dictionary";
import { localePath } from "@/i18n/config";

const TEXT: Record<
  Locale,
  {
    titleTop: string;
    titleIn: (city: string) => string;
    starts: string;
    duration: string;
    covered: string;
    maximum: string;
    sunAt: (deg: string) => string;
    ctaViewer: string;
    ctaWhere: (city: string) => string;
    trust: string;
    trustLink: string;
    illustration: string;
  }
> = {
  es: {
    titleTop: "Eclipse solar total",
    titleIn: (city) => `en ${city}`,
    starts: "Empieza la totalidad",
    duration: "Duración",
    covered: "Disco solar cubierto",
    maximum: "Máximo del eclipse",
    sunAt: (deg) => `Sol a ${deg}° sobre el horizonte`,
    ctaViewer: "¿Se verá desde tu sitio?",
    ctaWhere: (city) => `Dónde verlo en ${city}`,
    trust:
      "Calculado con los elementos besselianos de la NASA y validado contra las tablas del IGN en cada despliegue.",
    trustLink: "Cómo lo calculamos",
    illustration: "Ilustración propia. El eclipse todavía no ha ocurrido: no es una fotografía.",
  },
  en: {
    titleTop: "Total solar eclipse",
    titleIn: (city) => `in ${city}`,
    starts: "Totality begins",
    duration: "Duration",
    covered: "Solar disc covered",
    maximum: "Maximum eclipse",
    sunAt: (deg) => `Sun ${deg}° above the horizon`,
    ctaViewer: "Will you see it from your spot?",
    ctaWhere: (city) => `Where to watch in ${city}`,
    trust:
      "Computed from NASA Besselian elements and validated against Spain's IGN tables on every deploy.",
    trustLink: "How we compute it",
    illustration: "Our own illustration. The eclipse has not happened yet: this is not a photograph.",
  },
};

/**
 * Corona dibujada, para cuando no hay imagen de fondo.
 *
 * No es un relleno provisional: es el estado por defecto de los cuatro dominios
 * mientras no haya una imagen propia de cada ciudad, y tiene que aguantar por sí
 * solo. Hereda el acento del tenant, así que Ceuta sale naranja y Tarifa violeta
 * sin generar un archivo por ciudad.
 */
function CoronaArt() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/*
        En móvil la corona se va casi entera fuera del encuadre y baja de opacidad.
        Centrada y a plena luz quedaba **detrás del titular**, y el texto blanco
        sobre el anillo naranja dejaba de leerse: un fondo bonito que se come su
        propio contenido no es un fondo bonito.
      */}
      <svg
        className="absolute right-[-42%] top-[-4%] h-[26rem] w-[26rem] max-w-none opacity-40 sm:right-[-24%] sm:h-[32rem] sm:w-[32rem] sm:opacity-60 lg:right-[2%] lg:top-[-8%] lg:h-[40rem] lg:w-[40rem] lg:opacity-95"
        viewBox="0 0 400 400"
        fill="none"
      >
        <defs>
          <radialGradient id="hero-corona">
            <stop offset="28%" stopColor="hsl(var(--accent) / 0.85)" />
            <stop offset="42%" stopColor="hsl(var(--accent) / 0.28)" />
            <stop offset="70%" stopColor="hsl(var(--accent) / 0.06)" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0)" />
          </radialGradient>
          <radialGradient id="hero-inner">
            <stop offset="70%" stopColor="hsl(var(--accent) / 0)" />
            <stop offset="88%" stopColor="hsl(var(--accent) / 0.95)" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0)" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="200" r="200" fill="url(#hero-corona)" />
        <circle cx="200" cy="200" r="86" fill="url(#hero-inner)" />
        {/* El disco lunar: el negro del centro es lo que hace que se lea como un
            eclipse y no como un sol cualquiera. */}
        <circle cx="200" cy="200" r="66" fill="hsl(var(--bg))" />
        <circle cx="200" cy="200" r="66" fill="none" stroke="hsl(var(--accent) / 0.55)" strokeWidth="1.5" />
      </svg>

      {/* El mismo velo que lleva la imagen: funde el hero con la página por abajo
          y asegura el contraste del texto por arriba. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--bg) / 0.35) 0%, hsl(var(--bg) / 0) 30%, hsl(var(--bg) / 0.6) 85%, hsl(var(--bg)) 100%)",
        }}
      />
    </div>
  );
}

/**
 * Portada.
 *
 * El orden responde a la escalera de preguntas con la que llega quien busca este
 * eclipse: qué es y dónde, cuánto dura, y qué hago con eso. Las cifras van en una
 * barra elevada con separadores y no sueltas sobre el fondo — sueltas flotaban
 * sin pertenecer a nada.
 *
 * Los dos botones son las dos preguntas reales: si se verá desde donde vas a
 * estar, y a qué mirador ir. Ninguno dice «saber más».
 */
export function Hero({
  tenant,
  city,
  locale,
}: {
  tenant: Tenant;
  city: CityWithCircumstances;
  locale: Locale;
}) {
  const t = getDictionary(locale);
  const text = TEXT[locale];
  const name = cityName(city, locale);
  const duration = t.data.duration && city.eclipse.isTotal ? city.eclipse.totalitySeconds : 0;
  const image = tenant.hero;

  // Sin segundos en el titular: la cifra al segundo está en la tabla y en /horarios.
  const startShort =
    toLocalTime(city.eclipse.totalityStart ?? city.eclipse.maximum, city.timeZone, false) ??
    city.localTimes.maximum;

  const stats: { label: string; value: string; note?: string }[] = city.eclipse.isTotal
    ? [
        { label: text.starts, value: startShort, note: t.common.localTime },
        {
          label: text.duration,
          value: formatDurationShort(duration, locale),
        },
        {
          label: text.covered,
          value: formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal),
          note: text.sunAt(city.eclipse.sunAltitudeDeg.toFixed(0)),
        },
      ]
    : [
        { label: text.maximum, value: city.localTimes.maximum, note: t.common.localTime },
        {
          label: text.covered,
          value: formatObscuration(city.eclipse.obscuration, city.eclipse.isTotal),
          note: text.sunAt(city.eclipse.sunAltitudeDeg.toFixed(0)),
        },
      ];

  return (
    <section className="hero">
      {image ? (
        <>
          <div
            className="hero-media"
            role="img"
            aria-label={image.credit}
            style={{
              backgroundImage: `url(${image.src})`,
              ["--hero-focal" as string]: image.focal ?? "60% 35%",
            }}
          />
          <div className="hero-scrim" />
        </>
      ) : (
        <CoronaArt />
      )}

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:pt-16 lg:pb-14 lg:pt-24">
        <div className="max-w-3xl">
          <p
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold"
            style={{
              borderColor: "hsl(var(--accent) / 0.35)",
              background: "hsl(var(--accent) / 0.12)",
              color: "hsl(var(--accent))",
            }}
          >
            <span className="corona inline-block h-2 w-2 rounded-full" style={{ background: "hsl(var(--accent))" }} />
            {t.home.badge}
          </p>

          <h1 className="mt-5 font-black" style={{ fontSize: "var(--step-4)", lineHeight: 1.0 }}>
            {text.titleTop}
            <br />
            <span style={{ color: "hsl(var(--accent))" }}>{text.titleIn(name)}</span>
          </h1>

          <p className="mt-6" style={{ color: "hsl(var(--muted))", fontSize: "var(--step-1)" }}>
            {city.hook[locale]}
          </p>
        </div>

        <div className="hero-stats mt-10">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="datum-label">{stat.label}</p>
              <p className="datum mt-1.5" style={{ fontSize: "var(--step-3)" }}>
                <span className="tabular">{stat.value}</span>
              </p>
              {stat.note && (
                <p className="mt-1.5 text-sm" style={{ color: "hsl(var(--faint))" }}>
                  {stat.note}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {/* El icono de cámara ata el botón a la entrada «Visor 360º» del header:
              sin él, la pregunta no dice a dónde lleva. */}
          <Link href={localePath(locale, "/visor")} {...buttonStyle("primary")}>
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.2-2h8.2l1.2 2h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5Z" />
              <circle cx="12" cy="13" r="3.2" />
            </svg>
            {text.ctaViewer}
          </Link>
          <Link href={localePath(locale, "/donde-verlo")} {...buttonStyle("ghost")}>
            {text.ctaWhere(name)}
          </Link>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Countdown labels={t.countdown} variant="inline" />
          <TrustStrip>
            {text.trust}{" "}
            <Link href={localePath(locale, "/fuentes")} className="underline" style={{ color: "hsl(var(--muted))" }}>
              {text.trustLink}
            </Link>
          </TrustStrip>
        </div>

        {/* Crédito de la imagen. La regla 9 del proyecto no admite imágenes sin
            derechos ni sin crédito, y una imagen generada tiene que decir que lo
            es: el eclipse no ha ocurrido todavía. */}
        {image && (
          <p className="mt-6 text-xs" style={{ color: "hsl(var(--faint))" }}>
            {image.credit}
          </p>
        )}
      </div>
    </section>
  );
}

/** Duración compacta para el hero: "4 min 48 s" sin punto final ni adornos. */
function formatDurationShort(seconds: number, locale: Locale): string {
  const total = Math.round(seconds);
  if (total <= 0) return locale === "es" ? "sin totalidad" : "no totality";
  const m = Math.floor(total / 60);
  const s = total % 60;
  return s === 0 ? `${m} min` : `${m} min ${s} s`;
}
