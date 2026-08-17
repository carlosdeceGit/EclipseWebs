import type { ReactNode } from "react";
import type { CityWithCircumstances, Locale } from "@/lib/eclipse/types";

/**
 * Piezas comunes de las ilustraciones.
 *
 * Todas las ilustraciones del blog son SVG dibujado a mano, sin imágenes externas ni
 * fuentes remotas. Tres razones, en orden de importancia:
 *
 *  1. Son nuestras. No hay licencia que revisar, ni una foto de banco de imágenes
 *     que aparezca idéntica en la web de la competencia.
 *  2. No hay petición de red que fallar ni que pagar: el dibujo viaja dentro del HTML
 *     y se ve nítido en cualquier pantalla.
 *  3. Heredan el color de acento del tenant, así que la misma ilustración se ve
 *     coherente en cada dominio de la red sin generar un archivo por ciudad.
 *
 * Lo que estas ilustraciones NO son: fotografías de Ceuta. Cuando haya fotos propias
 * o con licencia, el sitio para colgarlas es el campo `photo` de cada post, y el
 * diseño ya reserva su hueco.
 */

export interface ArtProps {
  city: CityWithCircumstances;
  locale: Locale;
}

/** Paleta compartida, en variables CSS para que siga al tema y al tenant. */
export const C = {
  accent: "hsl(var(--accent))",
  accentSoft: "hsl(var(--accent) / 0.25)",
  text: "hsl(var(--text))",
  muted: "hsl(var(--muted))",
  border: "hsl(var(--border))",
  surface: "hsl(var(--surface))",
  sea: "hsl(205 42% 16%)",
  land: "hsl(220 18% 19%)",
  landHi: "hsl(220 16% 26%)",
  night: "#0a0f1e",
} as const;

/**
 * Lienzo de una ilustración.
 *
 * `id` prefija los identificadores de los degradados: varias ilustraciones conviven
 * en la misma página y dos `<linearGradient>` con el mismo id se pisan, que es un
 * error silencioso y desconcertante de depurar.
 */
export function Canvas({
  label,
  children,
  height = 450,
  defs,
}: {
  label: string;
  children: ReactNode;
  height?: number;
  defs?: ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 800 ${height}`}
      role="img"
      aria-label={label}
      className="block w-full"
      style={{ borderRadius: "0.75rem", background: C.night }}
    >
      {defs && <defs>{defs}</defs>}
      {children}
    </svg>
  );
}

/** Degradado de cielo. Devuelve el elemento y se referencia por su id. */
export function SkyGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#070b16" />
      <stop offset="55%" stopColor="#141c34" />
      <stop offset="100%" stopColor="#26203a" />
    </linearGradient>
  );
}

/** Sol eclipsado: disco negro, corona y el resplandor del cromo alrededor. */
export function EclipsedSun({
  cx,
  cy,
  r,
  rays = true,
}: {
  cx: number;
  cy: number;
  r: number;
  rays?: boolean;
}) {
  return (
    <g>
      {rays && (
        <>
          <circle cx={cx} cy={cy} r={r * 2.6} fill={C.accent} opacity={0.07} />
          <circle cx={cx} cy={cy} r={r * 1.8} fill={C.accent} opacity={0.12} />
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const inner = r * 1.12;
            const outer = r * (i % 2 === 0 ? 2.1 : 1.6);
            return (
              <line
                key={i}
                x1={cx + Math.cos(a) * inner}
                y1={cy + Math.sin(a) * inner}
                x2={cx + Math.cos(a) * outer}
                y2={cy + Math.sin(a) * outer}
                stroke={C.accent}
                strokeWidth={1.4}
                opacity={0.5}
                strokeLinecap="round"
              />
            );
          })}
        </>
      )}
      <circle cx={cx} cy={cy} r={r * 1.06} fill={C.accent} opacity={0.9} />
      <circle cx={cx} cy={cy} r={r} fill={C.night} />
    </g>
  );
}

/** Sol parcialmente cubierto, con la Luna desplazada. Para diagramas de fases. */
export function PartialSun({
  cx,
  cy,
  r,
  /** 0 = disco entero, 1 = totalidad. */
  cover,
  id,
}: {
  cx: number;
  cy: number;
  r: number;
  cover: number;
  id: string;
}) {
  const dx = (1 - cover) * r * 2.05;
  return (
    <g>
      <mask id={id}>
        <rect x={cx - r * 2} y={cy - r * 2} width={r * 4} height={r * 4} fill="black" />
        <circle cx={cx} cy={cy} r={r} fill="white" />
        <circle cx={cx - dx} cy={cy - r * 0.18} r={r * 1.02} fill="black" />
      </mask>
      <circle cx={cx} cy={cy} r={r} fill={C.accent} opacity={0.18} />
      <circle cx={cx} cy={cy} r={r} fill={C.accent} mask={`url(#${id})`} />
    </g>
  );
}

export function Label({
  x,
  y,
  children,
  size = 15,
  weight = 500,
  anchor = "start",
  color = C.muted,
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  weight?: number;
  anchor?: "start" | "middle" | "end";
  color?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      textAnchor={anchor}
      fill={color}
      style={{ fontFamily: "var(--font-sans, sans-serif)" }}
    >
      {children}
    </text>
  );
}

/** Punto de mapa con su nombre. */
export function Pin({
  x,
  y,
  name,
  highlight = false,
  anchor = "start",
  dy = -12,
}: {
  x: number;
  y: number;
  name: string;
  highlight?: boolean;
  anchor?: "start" | "middle" | "end";
  dy?: number;
}) {
  const dx = anchor === "end" ? -10 : anchor === "middle" ? 0 : 10;
  return (
    <g>
      {highlight && <circle cx={x} cy={y} r={11} fill={C.accent} opacity={0.25} />}
      <circle cx={x} cy={y} r={highlight ? 5.5 : 3.5} fill={highlight ? C.accent : C.muted} />
      <Label
        x={x + dx}
        y={y + dy + 8}
        anchor={anchor}
        size={highlight ? 16 : 14}
        weight={highlight ? 700 : 500}
        color={highlight ? C.text : C.muted}
      >
        {name}
      </Label>
    </g>
  );
}

/** Nota al pie dentro del propio dibujo, para lo que no es a escala. */
export function Disclaimer({ text, y = 434 }: { text: string; y?: number }) {
  return (
    <Label x={790} y={y} anchor="end" size={12} color="hsl(var(--muted) / 0.65)">
      {text}
    </Label>
  );
}
