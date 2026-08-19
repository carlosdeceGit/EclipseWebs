import type { ReactNode } from "react";
import type { Locale } from "@/lib/eclipse/types";
import { getDictionary } from "@/i18n/dictionary";

export function Section({
  title,
  lead,
  eyebrow,
  children,
  id,
  tone = "plain",
}: {
  title?: string;
  lead?: string;
  /** Antetítulo corto en versalitas. Sitúa la sección sin robarle peso al h2. */
  eyebrow?: string;
  children: ReactNode;
  id?: string;
  /** `feature` levanta la sección sobre un panel: se usa para las herramientas. */
  tone?: "plain" | "feature";
}) {
  const inner = (
    <>
      {eyebrow && (
        <p className="datum-label mb-2" style={{ color: "hsl(var(--accent))" }}>
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="font-bold" style={{ fontSize: "var(--step-3)" }}>
          {title}
        </h2>
      )}
      {lead && (
        <p className="mt-2 max-w-3xl" style={{ color: "hsl(var(--muted))", fontSize: "var(--step-1)" }}>
          {lead}
        </p>
      )}
      <div className={title || lead || eyebrow ? "mt-6" : ""}>{children}</div>
    </>
  );

  if (tone === "feature") {
    return (
      <section id={id} className="mx-auto max-w-6xl px-4 py-8">
        <div
          className="reveal rounded-3xl border p-6 sm:p-8"
          style={{
            borderColor: "hsl(var(--border))",
            background:
              "linear-gradient(180deg, hsl(var(--accent) / 0.07), hsl(var(--surface) / 0.6) 40%)",
          }}
        >
          {inner}
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="reveal mx-auto max-w-6xl px-4 py-10">
      {inner}
    </section>
  );
}

/**
 * Cabecera de página.
 *
 * Existe porque ocho páginas no tenían ningún `<h1>`: usaban `Section`, que emite
 * un `<h2>`. Un documento sin encabezado de primer nivel obliga a quien navega con
 * lector de pantalla a deducir de qué va la página por el título del navegador, y
 * deja a los buscadores sin la señal más fuerte que hay sobre su contenido.
 *
 * Además da a todas las páginas el mismo arranque que la portada: antetítulo
 * pequeño, titular grande y entradilla legible.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  /** Datos o botones que acompañan al titular. */
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-2 pt-10 sm:pt-14">
      {eyebrow && (
        <p className="datum-label" style={{ color: "hsl(var(--accent))" }}>
          {eyebrow}
        </p>
      )}
      <h1 className="mt-2 font-black" style={{ fontSize: "var(--step-4)", lineHeight: 1.02 }}>
        {title}
      </h1>
      {lead && (
        <p className="mt-4 max-w-3xl" style={{ color: "hsl(var(--muted))", fontSize: "var(--step-1)" }}>
          {lead}
        </p>
      )}
      {children && <div className="mt-8">{children}</div>}
    </section>
  );
}

/**
 * La cifra protagonista.
 *
 * El activo diferencial de esta red no es un texto: es un número que se calcula
 * para cualquier coordenada y que casi nadie más publica. Cuando aparece, tiene
 * que ser el objeto más grande de la pantalla, con la etiqueta encima y pequeña
 * — al revés de como estaba, que era una fila más de una tabla.
 */
export function Datum({
  label,
  value,
  unit,
  note,
  size = "lg",
}: {
  label: string;
  value: string;
  /** Unidad o sufijo, que se dibuja más pequeño y en color apagado. */
  unit?: string;
  note?: string;
  size?: "lg" | "md";
}) {
  return (
    <div>
      <p className="datum-label">{label}</p>
      <p
        className="datum mt-1"
        style={{
          fontSize: size === "md" ? "var(--step-3)" : "var(--step-4)",
          // Sin esto, un valor largo —"4 min 48 s"— parte en dos líneas y
          // desalinea la nota respecto a las columnas vecinas.
          textWrap: "nowrap",
        }}
      >
        <span className="tabular">{value}</span>
        {unit && <span className="unit"> {unit}</span>}
      </p>
      {note && (
        <p className="mt-1 text-sm" style={{ color: "hsl(var(--faint))" }}>
          {note}
        </p>
      )}
    </div>
  );
}

/**
 * Franja de confianza.
 *
 * Un número de desviación convence mucho más que la palabra «riguroso», así que
 * lo que se enseña es el contraste concreto contra el IGN, no un adjetivo. Va
 * justo debajo del dato para que se lea como su procedencia.
 */
export function TrustStrip({ children }: { children: ReactNode }) {
  return (
    // El punto va dentro del flujo del texto y no como elemento flexible: en una
    // caja flexible se quedaba solo en su propia línea cuando el texto envolvía.
    <p className="text-sm" style={{ color: "hsl(var(--faint))" }}>
      <span
        aria-hidden="true"
        className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle"
        style={{ background: "hsl(var(--success))" }}
      />
      {children}
    </p>
  );
}

export function Card({
  children,
  className = "",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  /** Reacciona al puntero y al foco. Solo para tarjetas que llevan a algún sitio. */
  interactive?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${interactive ? "card-interactive" : ""} ${className}`}
      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface))" }}
    >
      {children}
    </div>
  );
}

/**
 * Dato con etiqueta.
 *
 * Si `value` es null se dice explícitamente que no hay dato en lugar de dejar un
 * hueco o poner un cero. Con el cálculo besseliano esto casi no ocurre, pero sigue
 * pasando en las localidades sin totalidad, donde C2 y C3 no existen.
 */
export function DataRow({
  label,
  value,
  note,
  locale,
}: {
  label: string;
  value: string | null;
  note?: string;
  locale: Locale;
}) {
  return (
    <div
      className="flex items-baseline justify-between gap-4 border-b py-2.5 last:border-0"
      style={{ borderColor: "hsl(var(--border))" }}
    >
      <dt className="text-sm" style={{ color: "hsl(var(--muted))" }}>
        {label}
      </dt>
      <dd className="text-right">
        {value ? (
          <span className="font-semibold tabular-nums">{value}</span>
        ) : (
          <span className="text-sm italic" style={{ color: "hsl(var(--muted))" }}>
            {getDictionary(locale).common.pending}
          </span>
        )}
        {note && value && (
          <span className="ml-2 text-xs" style={{ color: "hsl(var(--muted))" }}>
            {note}
          </span>
        )}
      </dd>
    </div>
  );
}

export function Badge({ children, tone = "accent" }: { children: ReactNode; tone?: "accent" | "muted" }) {
  const style =
    tone === "accent"
      ? { background: "hsl(var(--accent) / 0.15)", color: "hsl(var(--accent))" }
      : { background: "hsl(var(--border))", color: "hsl(var(--muted))" };
  return (
    <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold" style={style}>
      {children}
    </span>
  );
}

export function Callout({
  children,
  title,
  tone = "accent",
}: {
  children: ReactNode;
  title: string;
  /**
   * `danger` es exclusivo de la guía de seguridad ocular. Que el aviso de no
   * mirar al Sol tenga el mismo color que una nota sobre el aparcamiento es
   * precisamente lo que hace que deje de leerse.
   */
  tone?: "accent" | "danger";
}) {
  const edge = tone === "danger" ? "hsl(var(--danger))" : "hsl(var(--accent))";
  return (
    <div
      className="rounded-2xl border-l-4 p-5"
      style={{
        borderColor: edge,
        background:
          tone === "danger"
            ? "color-mix(in oklab, hsl(var(--danger)) 10%, hsl(var(--surface)))"
            : "hsl(var(--surface))",
      }}
    >
      <p className="mb-1 font-semibold" style={tone === "danger" ? { color: edge } : undefined}>
        {title}
      </p>
      <div className="text-sm" style={{ color: "hsl(var(--muted))" }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Botón visual. No es un componente de control: devuelve las clases y el estilo
 * para que quien lo use decida si es `<a>`, `<Link>` o `<button>` sin perder el
 * elemento semántico correcto por el camino.
 */
export function buttonStyle(variant: "primary" | "ghost" = "primary") {
  const base =
    "tap inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition";
  if (variant === "primary") {
    return {
      className: `${base} hover:brightness-110 active:brightness-95`,
      style: {
        background: "hsl(var(--accent))",
        color: "hsl(var(--on-accent))",
        boxShadow: "0 0.5rem 1.5rem hsl(var(--accent) / 0.25)",
      } as const,
    };
  }
  return {
    className: `${base} border hover:bg-[hsl(var(--surface-2))]`,
    style: { borderColor: "hsl(var(--border-strong))" } as const,
  };
}
