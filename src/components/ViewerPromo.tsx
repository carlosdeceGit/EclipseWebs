import Link from "next/link";
import { buttonStyle } from "./ui";
import type { CityWithCircumstances, Locale } from "@/lib/eclipse/types";
import { cityName, toLocalTime } from "@/lib/eclipse/cities";
import { localePath } from "@/i18n/config";

const TEXT: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    lead: (city: string, time: string) => string;
    azimuth: string;
    altitude: string;
    cta: string;
    secondary: string;
    note: string;
    cardinals: [string, string, string, string, string, string, string, string];
    caption: string;
  }
> = {
  es: {
    eyebrow: "Visor 360º",
    title: "¿Me lo tapa ese edificio?",
    lead: (city, time) =>
      `Apunta con la cámara del móvil desde donde vayas a estar y te marcamos el punto exacto del cielo en el que estará el Sol a las ${time}, el máximo del eclipse en ${city}. Es lo único que responde si desde ese balcón concreto se va a interponer un edificio, una grúa o un monte.`,
    azimuth: "Mira hacia",
    altitude: "A esta altura",
    cta: "Abrir el Visor 360º",
    secondary: "Calcular mi punto exacto",
    note: "Funciona en el móvil, con y sin brújula. La cámara no graba nada: la imagen se pinta y se descarta.",
    cardinals: ["N", "NE", "E", "SE", "S", "SO", "O", "NO"],
    caption: "Esquema orientativo, no a escala. El azimut y la altura sí salen del cálculo.",
  },
  en: {
    eyebrow: "360º viewer",
    title: "Will that building block it?",
    lead: (city, time) =>
      `Point your phone's camera from where you plan to stand and we mark the exact spot in the sky where the Sun will be at ${time}, maximum eclipse in ${city}. It is the only thing that answers whether a building, a crane or a hillside will get in the way from that particular balcony.`,
    azimuth: "Look towards",
    altitude: "At this height",
    cta: "Open the 360º viewer",
    secondary: "Compute my exact spot",
    note: "Works on a phone, with or without a compass. The camera records nothing: the image is painted and discarded.",
    cardinals: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
    caption: "Schematic, not to scale. The azimuth and altitude do come from the computation.",
  },
};

function cardinal(azimuth: number, locale: Locale): string {
  return TEXT[locale].cardinals[Math.round(azimuth / 45) % 8];
}

/**
 * Escena del visor.
 *
 * Un horizonte con edificios y el Sol colocado **a la altura que le corresponde**
 * según el cálculo besseliano. No es decoración: alguien que mire este dibujo ya
 * sabe si el Sol le va a quedar por encima o por debajo de los tejados de
 * enfrente, que es exactamente la duda que trae.
 *
 * Se declara esquema dentro del propio dibujo, como el resto de ilustraciones de
 * la red, porque la perspectiva y el tamaño de los edificios sí son inventados.
 */
function ViewerScene({ city, locale }: { city: CityWithCircumstances; locale: Locale }) {
  const t = TEXT[locale];
  const altitude = city.eclipse.sunAltitudeDeg;
  const azimuth = city.eclipse.sunAzimuthDeg;

  const horizon = 196;
  const top = 26;
  // 0° queda en el horizonte y 90° en el borde superior del encuadre.
  const sunY = horizon - (Math.min(Math.max(altitude, 0), 90) / 90) * (horizon - top);
  const sunX = 200;

  return (
    <svg
      viewBox="0 0 400 250"
      className="h-auto w-full"
      role="img"
      aria-label={
        locale === "es"
          ? `Esquema del cielo: el Sol a ${altitude.toFixed(0)} grados de altura, mirando hacia el azimut ${azimuth.toFixed(0)} grados.`
          : `Sky diagram: the Sun ${altitude.toFixed(0)} degrees high, looking towards azimuth ${azimuth.toFixed(0)} degrees.`
      }
    >
      <defs>
        <linearGradient id="vp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--accent) / 0.16)" />
          <stop offset="100%" stopColor="hsl(var(--accent) / 0.02)" />
        </linearGradient>
        <radialGradient id="vp-corona">
          <stop offset="45%" stopColor="hsl(var(--accent) / 0.9)" />
          <stop offset="100%" stopColor="hsl(var(--accent) / 0)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="400" height={horizon} rx="10" fill="url(#vp-sky)" />

      {/* Skyline. Alturas arbitrarias: lo que importa es la relación con el Sol. */}
      <path
        d={`M0 ${horizon} L0 168 L34 168 L34 150 L62 150 L62 176 L96 176 L96 140 L128 140 L128 172 L166 172
            L166 158 L196 158 L196 180 L232 180 L232 146 L262 146 L262 174 L300 174 L300 162 L338 162
            L338 178 L370 178 L370 156 L400 156 L400 ${horizon} Z`}
        fill="hsl(var(--surface-3))"
      />

      {/* Retícula del visor alrededor del objetivo. */}
      <circle cx={sunX} cy={sunY} r="34" fill="none" stroke="hsl(var(--text) / 0.35)" strokeWidth="1.5" strokeDasharray="5 5" />
      <path
        d={`M${sunX - 46} ${sunY} h18 M${sunX + 28} ${sunY} h18 M${sunX} ${sunY - 46} v18 M${sunX} ${sunY + 28} v18`}
        stroke="hsl(var(--text) / 0.35)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* El Sol eclipsado: disco negro con la corona alrededor. */}
      <circle cx={sunX} cy={sunY} r="20" fill="url(#vp-corona)" />
      <circle cx={sunX} cy={sunY} r="10" fill="hsl(var(--bg))" stroke="hsl(var(--accent))" strokeWidth="1.5" />

      {/* Línea de horizonte y cinta de la brújula. */}
      <line x1="0" y1={horizon} x2="400" y2={horizon} stroke="hsl(var(--border-strong))" strokeWidth="1.5" />

      <g fontSize="11" fill="hsl(var(--faint))" fontFamily="inherit">
        {/* Separadas 45°: más juntas, dos marcas caían en el mismo cardinal y la
            cinta leía «NE NE 95° SE SE», que no orienta a nadie. */}
        {[-90, -45, 0, 45, 90].map((offset) => {
          const x = sunX + offset * 1.6;
          const bearing = (((azimuth + offset) % 360) + 360) % 360;
          const isTarget = offset === 0;
          return (
            <g key={offset}>
              <line
                x1={x}
                y1={horizon + 6}
                x2={x}
                y2={horizon + (isTarget ? 18 : 12)}
                stroke={isTarget ? "hsl(var(--accent))" : "hsl(var(--border-strong))"}
                strokeWidth={isTarget ? 2 : 1}
              />
              <text
                x={x}
                y={horizon + 34}
                textAnchor="middle"
                fill={isTarget ? "hsl(var(--accent))" : "hsl(var(--faint))"}
                fontWeight={isTarget ? 700 : 400}
              >
                {isTarget ? `${bearing.toFixed(0)}°` : cardinal(bearing, locale)}
              </text>
            </g>
          );
        })}
      </g>

      <text x="200" y={246} textAnchor="middle" fontSize="9.5" fill="hsl(var(--faint))" fontFamily="inherit">
        {t.caption}
      </text>
    </svg>
  );
}

/**
 * El Visor 360º en la portada.
 *
 * Es la función más diferencial de la red y la que ninguna otra web del eclipse
 * tiene, así que ocupa una sección entera con su propio dibujo en vez de una
 * tarjeta más. El titular es la pregunta del usuario, no el nombre de la
 * tecnología: nadie busca «realidad aumentada», busca si desde su terraza se
 * verá.
 */
export function ViewerPromo({ city, locale }: { city: CityWithCircumstances; locale: Locale }) {
  const t = TEXT[locale];
  const name = cityName(city, locale);
  const maximumShort =
    toLocalTime(city.eclipse.maximum, city.timeZone, false) ?? city.localTimes.maximum;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <div>
        <p className="datum-label" style={{ color: "hsl(var(--accent))" }}>
          {t.eyebrow}
        </p>
        <h2 className="mt-2 font-black" style={{ fontSize: "var(--step-3)", lineHeight: 1.05 }}>
          {t.title}
        </h2>
        <p className="mt-4" style={{ color: "hsl(var(--muted))", fontSize: "var(--step-1)" }}>
          {t.lead(name, maximumShort)}
        </p>

        <div className="mt-7 flex flex-wrap gap-x-10 gap-y-5">
          <div>
            <p className="datum-label">{t.azimuth}</p>
            <p className="datum mt-1" style={{ fontSize: "var(--step-3)" }}>
              <span className="tabular">{city.eclipse.sunAzimuthDeg.toFixed(0)}°</span>
              <span className="unit"> {cardinal(city.eclipse.sunAzimuthDeg, locale)}</span>
            </p>
          </div>
          <div>
            <p className="datum-label">{t.altitude}</p>
            <p className="datum mt-1" style={{ fontSize: "var(--step-3)" }}>
              <span className="tabular">{city.eclipse.sunAltitudeDeg.toFixed(0)}°</span>
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={localePath(locale, "/visor")} {...buttonStyle("primary")}>
            {t.cta}
          </Link>
          <Link href={localePath(locale, "/localizador")} {...buttonStyle("ghost")}>
            {t.secondary}
          </Link>
        </div>

        <p className="mt-4 text-sm" style={{ color: "hsl(var(--faint))" }}>
          {t.note}
        </p>
      </div>

      <div
        className="rounded-2xl border p-4"
        style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface) / 0.6)" }}
      >
        <ViewerScene city={city} locale={locale} />
      </div>
    </div>
  );
}
