import { notFound } from "next/navigation";
import { LoginForm } from "./LoginForm";
import {
  approveEvent,
  approveListing,
  changeTier,
  logout,
  rejectEvent,
  rejectListing,
  restoreEvent,
  restoreListing,
} from "./actions";
import { adminConfigured, isAdmin } from "@/lib/admin/auth";
import { dbStatus } from "@/lib/db/supabase";
import {
  moderationAvailable,
  pendingCounts,
  pendingEvents,
  pendingListings,
  recentDecisions,
  recentEventDecisions,
  type ModerationRow,
  type PendingEvent,
} from "@/lib/db/moderation";
import { CLASSIFIED_CATEGORIES, DIRECTORY_CATEGORIES } from "@/lib/db/listings";
import { CITIES_BY_SLUG } from "@/lib/eclipse/cities";

// El panel siempre lee del momento: una caché aquí significaría moderar dos veces
// lo mismo o no ver lo que acaba de entrar.
export const dynamic = "force-dynamic";

const CATEGORY_LABEL = new Map<string, string>(
  [...DIRECTORY_CATEGORIES, ...CLASSIFIED_CATEGORIES].map((c) => [c.slug, `${c.icon} ${c.label.es}`]),
);

const TIER_LABEL: Record<string, string> = {
  free: "Gratis",
  featured: "Destacado",
  sponsor: "Patrocinador",
};

function cityLabel(slug: string): string {
  return CITIES_BY_SLUG.get(slug)?.name ?? slug;
}

function when(value: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  }).format(new Date(value));
}

const surface = {
  borderColor: "hsl(var(--border))",
  background: "hsl(var(--surface))",
} as const;

const ghost = {
  borderColor: "hsl(var(--border-strong))",
} as const;

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border p-6 text-sm" style={{ ...surface, color: "hsl(var(--muted))" }}>
      {children}
    </p>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: "hsl(var(--faint))" }}>
      {children}
    </p>
  );
}

/** Ficha de un anuncio, con todo lo que hace falta para decidir sin salir de aquí. */
function ListingCard({ row, decided }: { row: ModerationRow; decided?: boolean }) {
  return (
    <article className="rounded-2xl border p-5" style={surface}>
      <Meta>
        <span
          className="rounded-full px-2 py-0.5 font-semibold"
          style={{ background: "hsl(var(--accent) / 0.15)", color: "hsl(var(--accent))" }}
        >
          {row.kind === "directory" ? "Directorio" : "Clasificado"}
        </span>
        <span>{cityLabel(row.city_slug)}</span>
        <span>{CATEGORY_LABEL.get(row.category) ?? row.category}</span>
        <span>{when(row.created_at)}</span>
        {row.tier !== "free" && <span style={{ color: "hsl(var(--accent))" }}>{TIER_LABEL[row.tier]}</span>}
        {decided && (
          <span style={{ color: row.status === "approved" ? "hsl(var(--success))" : "hsl(var(--danger))" }}>
            {row.status === "approved" ? "Aprobado" : "Rechazado"}
          </span>
        )}
      </Meta>

      <h3 className="mt-2 font-semibold" style={{ fontSize: "var(--step-1)" }}>
        {row.title}
      </h3>

      <p className="mt-2 whitespace-pre-wrap text-sm" style={{ color: "hsl(var(--muted))" }}>
        {row.description}
      </p>

      <Meta>
        {row.price !== null && <span>{row.price} €</span>}
        {row.contact_email && <span>{row.contact_email}</span>}
        {row.contact_phone && <span>{row.contact_phone}</span>}
        {row.website && (
          <a href={row.website} target="_blank" rel="nofollow noopener" className="underline">
            {row.website}
          </a>
        )}
        {/* La IP no se guarda en claro, solo su hash. Verlo repetido entre fichas
            es lo que delata a quien inunda el tablón. */}
        {row.ip_hash && <span title="hash de la IP">#{row.ip_hash.slice(0, 8)}</span>}
      </Meta>

      {row.moderation_note && (
        <p className="mt-3 text-xs" style={{ color: "hsl(var(--danger))" }}>
          Nota: {row.moderation_note}
        </p>
      )}

      {decided ? (
        <form action={restoreListing.bind(null, row.id)} className="mt-4">
          <button
            type="submit"
            className="tap inline-flex items-center rounded-xl border px-4 text-sm font-semibold"
            style={ghost}
          >
            Devolver a pendiente
          </button>
        </form>
      ) : (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <form action={approveListing.bind(null, row.id)}>
            <button
              type="submit"
              className="tap inline-flex items-center rounded-xl px-4 text-sm font-semibold"
              style={{ background: "hsl(var(--success))", color: "hsl(var(--on-accent))" }}
            >
              Aprobar
            </button>
          </form>

          <form action={rejectListing.bind(null, row.id)} className="flex items-end gap-2">
            <label className="text-xs" style={{ color: "hsl(var(--faint))" }}>
              <span className="mb-1 block">Motivo (opcional)</span>
              <input
                name="note"
                className="rounded-lg border px-2 py-1.5 text-sm"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--bg))", color: "hsl(var(--text))" }}
              />
            </label>
            <button
              type="submit"
              className="tap inline-flex items-center rounded-xl border px-4 text-sm font-semibold"
              style={{ borderColor: "hsl(var(--danger))", color: "hsl(var(--danger))" }}
            >
              Rechazar
            </button>
          </form>

          {/* El nivel se cambia aparte de aprobar: subir a destacado va después
              de cobrar, y mezclarlo con el visto bueno es regalarlo por descuido. */}
          {row.kind === "directory" && (
            <form action={changeTier.bind(null, row.id)} className="flex items-end gap-2">
              <label className="text-xs" style={{ color: "hsl(var(--faint))" }}>
                <span className="mb-1 block">Nivel</span>
                <select
                  name="tier"
                  defaultValue={row.tier}
                  className="rounded-lg border px-2 py-1.5 text-sm"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--bg))", color: "hsl(var(--text))" }}
                >
                  {Object.entries(TIER_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="tap inline-flex items-center rounded-xl border px-3 text-sm"
                style={ghost}
              >
                Guardar
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  );
}

function EventCard({ row, decided }: { row: PendingEvent; decided?: boolean }) {
  return (
    <article className="rounded-2xl border p-5" style={surface}>
      <Meta>
        <span
          className="rounded-full px-2 py-0.5 font-semibold"
          style={{ background: "hsl(var(--accent) / 0.15)", color: "hsl(var(--accent))" }}
        >
          Evento
        </span>
        <span>{cityLabel(row.city_slug)}</span>
        <span>{when(row.starts_at)}</span>
        {row.is_free && <span>Gratis</span>}
        {decided && (
          <span style={{ color: row.status === "approved" ? "hsl(var(--success))" : "hsl(var(--danger))" }}>
            {row.status === "approved" ? "Aprobado" : "Rechazado"}
          </span>
        )}
      </Meta>

      <h3 className="mt-2 font-semibold" style={{ fontSize: "var(--step-1)" }}>
        {row.title}
      </h3>

      {row.description && (
        <p className="mt-2 whitespace-pre-wrap text-sm" style={{ color: "hsl(var(--muted))" }}>
          {row.description}
        </p>
      )}

      <Meta>
        {row.venue && <span>{row.venue}</span>}
        {row.organizer && <span>{row.organizer}</span>}
        {/*
          El enlace de la convocatoria es lo que hay que abrir antes de aprobar:
          sin fuente comprobable no se publica, y esa regla es la misma para lo
          que envía una persona y para lo que encuentra el agente.
        */}
        <a href={row.source_url} target="_blank" rel="nofollow noopener" className="underline">
          Comprobar la convocatoria
        </a>
      </Meta>

      {decided ? (
        <form action={restoreEvent.bind(null, row.id)} className="mt-4">
          <button
            type="submit"
            className="tap inline-flex items-center rounded-xl border px-4 text-sm font-semibold"
            style={ghost}
          >
            Devolver a pendiente
          </button>
        </form>
      ) : (
        <div className="mt-4 flex flex-wrap gap-3">
          <form action={approveEvent.bind(null, row.id)}>
            <button
              type="submit"
              className="tap inline-flex items-center rounded-xl px-4 text-sm font-semibold"
              style={{ background: "hsl(var(--success))", color: "hsl(var(--on-accent))" }}
            >
              Aprobar
            </button>
          </form>
          <form action={rejectEvent.bind(null, row.id)}>
            <button
              type="submit"
              className="tap inline-flex items-center rounded-xl border px-4 text-sm font-semibold"
              style={{ borderColor: "hsl(var(--danger))", color: "hsl(var(--danger))" }}
            >
              Rechazar
            </button>
          </form>
        </div>
      )}
    </article>
  );
}

function Check({ ok }: { ok: boolean }) {
  return (
    <span aria-hidden="true" style={{ color: ok ? "hsl(var(--success))" : "hsl(var(--danger))" }}>
      {ok ? "✓" : "✗"}
    </span>
  );
}

/** Cabecera del panel. Lleva el botón de salir, que tiene que existir siempre. */
function Header({ summary }: { summary: string }) {
  return (
    <header className="flex flex-wrap items-center gap-4">
      <h1 className="font-black" style={{ fontSize: "var(--step-3)" }}>
        Moderación
      </h1>
      <p className="text-sm" style={{ color: "hsl(var(--muted))" }}>
        {summary}
      </p>
      <form action={logout} className="ml-auto">
        <button type="submit" className="tap inline-flex items-center rounded-xl border px-4 text-sm" style={ghost}>
          Salir
        </button>
      </form>
    </header>
  );
}

export default async function AdminPage() {
  // Sin contraseña configurada el panel no existe. Devolver 404 en vez de un
  // formulario dice menos: quien lo encuentre por casualidad no sabrá que hay
  // nada aquí.
  if (!adminConfigured()) notFound();

  if (!(await isAdmin())) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
        <h1 className="font-black" style={{ fontSize: "var(--step-3)" }}>
          Moderación
        </h1>
        <p className="mb-6 mt-2 text-sm" style={{ color: "hsl(var(--muted))" }}>
          Panel interno de la red del eclipse.
        </p>
        <LoginForm />
      </main>
    );
  }

  if (!moderationAvailable()) {
    /*
      Diagnóstico en vez de un «no hay base de datos» a secas.

      Con la integración de Vercel inyectando las variables sola, el fallo típico
      no es que falten todas: es que falta una, o que apuntan a otro proyecto de
      Supabase. Enseñar qué llegó —sin enseñar ninguna clave— ahorra el rato de
      ir probando.
    */
    const status = dbStatus();
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Header summary="sin conexión con la base de datos" />
        <p className="mt-8" style={{ color: "hsl(var(--muted))" }}>
          El panel lee y escribe con la clave de service role, que es la única que ve lo que todavía está
          pendiente. Ahora mismo el entorno tiene esto:
        </p>
        <ul className="mt-5 space-y-2 text-sm">
          <li>
            <Check ok={Boolean(status.url)} /> URL del proyecto:{" "}
            {status.url ? <code>{status.url}</code> : <em>sin definir</em>}
          </li>
          <li>
            <Check ok={status.hasAnonKey} /> Clave pública (anon o publishable)
          </li>
          <li>
            <Check ok={status.hasServiceKey} /> Clave de service role
          </li>
        </ul>
        <p className="mt-6 text-sm" style={{ color: "hsl(var(--faint))" }}>
          {status.presentNames.length > 0 ? (
            <>Variables definidas: {status.presentNames.map((n) => <code key={n}>{n} </code>)}</>
          ) : (
            "No hay ninguna variable de Supabase definida en este entorno."
          )}
        </p>
        <p className="mt-4 text-sm" style={{ color: "hsl(var(--faint))" }}>
          Comprueba también que el host de arriba es el del proyecto correcto: con varios proyectos en la
          cuenta, la integración puede haber enlazado otro.
        </p>
      </main>
    );
  }

  const [counts, listings, events, decided, decidedEvents] = await Promise.all([
    pendingCounts(),
    pendingListings(),
    pendingEvents(),
    recentDecisions(20),
    recentEventDecisions(20),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Header
        summary={`${counts.listings} anuncio${counts.listings === 1 ? "" : "s"} y ${counts.events} evento${
          counts.events === 1 ? "" : "s"
        } esperando`}
      />

      <section className="mt-10">
        <h2 className="font-bold" style={{ fontSize: "var(--step-2)" }}>
          Anuncios pendientes
        </h2>
        <div className="mt-5 space-y-4">
          {listings.length === 0 ? (
            <Empty>Nada pendiente. Cuando alguien dé de alta algo desde /publicar, aparecerá aquí.</Empty>
          ) : (
            listings.map((row) => <ListingCard key={row.id} row={row} />)
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-bold" style={{ fontSize: "var(--step-2)" }}>
          Eventos pendientes
        </h2>
        <div className="mt-5 space-y-4">
          {events.length === 0 ? (
            <Empty>
              Nada pendiente. Aquí caen tanto los actos que envía la gente como los que encuentra el agente de
              eventos.
            </Empty>
          ) : (
            events.map((row) => <EventCard key={row.id} row={row} />)
          )}
        </div>
      </section>

      {(decided.length > 0 || decidedEvents.length > 0) && (
        <section className="mt-12">
          <h2 className="font-bold" style={{ fontSize: "var(--step-2)" }}>
            Decidido últimamente
          </h2>
          <p className="mt-1 text-sm" style={{ color: "hsl(var(--faint))" }}>
            Para deshacer un error sin tener que entrar en la base de datos.
          </p>
          <div className="mt-5 space-y-4">
            {decided.map((row) => (
              <ListingCard key={row.id} row={row} decided />
            ))}
            {decidedEvents.map((row) => (
              <EventCard key={row.id} row={row} decided />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
