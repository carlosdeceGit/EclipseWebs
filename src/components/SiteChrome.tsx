import Link from "next/link";
import { CITIES } from "@/lib/eclipse/cities";
import { TENANTS, type Tenant } from "@/lib/tenants";
import type { City } from "@/lib/eclipse/types";

export const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/horarios", label: "Horarios" },
  { href: "/donde-verlo", label: "Dónde verlo" },
  { href: "/alojamiento", label: "Alojamiento" },
  { href: "/eventos", label: "Eventos" },
  { href: "/directorio", label: "Directorio" },
  { href: "/clasificados", label: "Clasificados" },
  { href: "/guia", label: "Guía" },
  { href: "/faq", label: "Preguntas" },
];

export function Header({ tenant, city }: { tenant: Tenant; city: City }) {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--bg) / 0.85)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span
            className="inline-block h-5 w-5 rounded-full"
            style={{ background: "hsl(var(--accent))", boxShadow: "0 0 18px hsl(var(--accent) / 0.7)" }}
            aria-hidden="true"
          />
          <span>{tenant.brand}</span>
        </Link>
        <nav className="ml-auto hidden gap-4 text-sm lg:flex" aria-label="Principal">
          {NAV.slice(1).map((item) => (
            <Link key={item.href} href={item.href} className="hover:underline" style={{ color: "hsl(var(--muted))" }}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/anunciate"
          className="ml-auto rounded-lg px-3 py-1.5 text-sm font-semibold lg:ml-0"
          style={{ background: "hsl(var(--accent))", color: "hsl(224 44% 8%)" }}
        >
          Anúnciate
        </Link>
      </div>
      <nav className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-4 pb-2 text-sm lg:hidden" aria-label="Principal móvil">
        {NAV.slice(1).map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap" style={{ color: "hsl(var(--muted))" }}>
            {item.label}
          </Link>
        ))}
      </nav>
      <p className="sr-only">
        Guía del eclipse solar total del 2 de agosto de 2027 en {city.name}.
      </p>
    </header>
  );
}

export function Footer({ tenant }: { tenant: Tenant }) {
  const otherSites = TENANTS.filter((t) => t.domain !== tenant.domain);

  return (
    <footer className="mt-20 border-t" style={{ borderColor: "hsl(var(--border))" }}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="mb-3 font-semibold">{tenant.brand}</h2>
          <p className="text-sm" style={{ color: "hsl(var(--muted))" }}>
            Guía independiente del eclipse solar total del 2 de agosto de 2027. Los datos
            astronómicos proceden del Instituto Geográfico Nacional.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-semibold">Secciones</h2>
          <ul className="space-y-1.5 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} style={{ color: "hsl(var(--muted))" }} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-semibold">Otras ciudades</h2>
          <ul className="space-y-1.5 text-sm">
            {otherSites.map((t) => (
              <li key={t.domain}>
                <a
                  href={`https://${t.domain}`}
                  style={{ color: "hsl(var(--muted))" }}
                  className="hover:underline"
                >
                  {t.brand}
                </a>
              </li>
            ))}
            <li>
              <Link href="/ciudades" style={{ color: "hsl(var(--muted))" }} className="hover:underline">
                Ver las {CITIES.length} localidades
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-semibold">Legal</h2>
          <ul className="space-y-1.5 text-sm">
            {[
              ["/aviso-legal", "Aviso legal"],
              ["/privacidad", "Privacidad"],
              ["/cookies", "Cookies"],
              ["/fuentes", "Fuentes y metodología"],
              ["/anunciate", "Anúnciate"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} style={{ color: "hsl(var(--muted))" }} className="hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className="border-t px-4 py-6 text-center text-xs"
        style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted))" }}
      >
        Nunca mires al Sol sin filtro solar certificado ISO 12312-2, salvo durante la
        fase de totalidad. · {tenant.domain}
      </div>
    </footer>
  );
}
