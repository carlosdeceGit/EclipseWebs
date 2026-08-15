import type { ReactNode } from "react";

export function Section({
  title,
  lead,
  children,
  id,
}: {
  title?: string;
  lead?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-10">
      {title && <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>}
      {lead && (
        <p className="mt-2 max-w-3xl" style={{ color: "hsl(var(--muted))" }}>
          {lead}
        </p>
      )}
      <div className={title || lead ? "mt-6" : ""}>{children}</div>
    </section>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${className}`}
      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--surface))" }}
    >
      {children}
    </div>
  );
}

/**
 * Dato con etiqueta. Si `value` es null se dice explícitamente que falta el dato en
 * lugar de dejar un hueco o poner un cero, que es lo que hace que una guía pierda
 * credibilidad.
 */
export function DataRow({ label, value, note }: { label: string; value: string | null; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b py-2.5 last:border-0" style={{ borderColor: "hsl(var(--border))" }}>
      <dt className="text-sm" style={{ color: "hsl(var(--muted))" }}>
        {label}
      </dt>
      <dd className="text-right">
        {value ? (
          <span className="font-semibold tabular-nums">{value}</span>
        ) : (
          <span className="text-sm italic" style={{ color: "hsl(var(--muted))" }}>
            pendiente de verificar
          </span>
        )}
        {note && (
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

export function Callout({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div
      className="rounded-2xl border-l-4 p-5"
      style={{ borderColor: "hsl(var(--accent))", background: "hsl(var(--surface))" }}
    >
      <p className="mb-1 font-semibold">{title}</p>
      <div className="text-sm" style={{ color: "hsl(var(--muted))" }}>
        {children}
      </div>
    </div>
  );
}
