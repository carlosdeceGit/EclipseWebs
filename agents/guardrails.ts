import type { AgentSpec, Capability } from "./agents";

/**
 * Validación determinista de lo que produce un agente.
 *
 * Todo lo que devuelve el modelo pasa por aquí antes de tocar la base de datos.
 * La diferencia con pedírselo en el prompt es sustancial: el prompt es una petición
 * y esto es una barrera. Un modelo puede ignorar una instrucción; no puede saltarse
 * una función que se ejecuta después de él.
 */

export class GuardrailError extends Error {}

/** Comprueba que el agente tiene concedida la capacidad que va a ejercer. */
export function assertCapability(agent: AgentSpec, capability: Capability): void {
  if (!agent.capabilities.includes(capability)) {
    throw new GuardrailError(`El agente ${agent.name} no tiene la capacidad ${capability}`);
  }
}

/** Recorta a `maxWrites` y avisa. Un agente desbocado no debe inundar la web. */
export function capBatch<T>(agent: AgentSpec, items: T[], label: string): T[] {
  if (items.length <= agent.maxWrites) return items;
  console.warn(
    `[${agent.name}] ${items.length} ${label} supera el tope de ${agent.maxWrites}; se recorta`,
  );
  return items.slice(0, agent.maxWrites);
}

/**
 * Una URL es aceptable si es https y su host está entre las fuentes permitidas.
 *
 * Sin esto, basta con que una página maliciosa aparezca en una búsqueda para que un
 * agente acabe citándola como si fuera oficial.
 */
export function isAllowedSource(url: string, allowedSources: string[]): boolean {
  if (allowedSources.length === 0) return true;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    return allowedSources.some((domain) => host === domain || host.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

export interface EventCandidate {
  city_slug: string;
  title: string;
  description?: string;
  starts_at: string;
  ends_at?: string | null;
  venue?: string;
  is_free?: boolean;
  organizer?: string;
  source_url: string;
  source_name?: string;
}

/** Ventana admisible para un evento del eclipse: nada antes de hoy, nada tras 2027. */
const EVENT_WINDOW = {
  from: Date.now(),
  to: Date.parse("2027-12-31T23:59:59Z"),
};

/**
 * Filtra eventos y explica cada descarte.
 *
 * Se comprueba lo que el modelo no puede garantizar por sí mismo: que la ciudad
 * existe en nuestro registro, que la fuente es de un dominio permitido y que la
 * fecha cae en una ventana con sentido.
 */
export function validateEvents(
  agent: AgentSpec,
  candidates: unknown[],
  knownCitySlugs: Set<string>,
): { valid: EventCandidate[]; rejected: { candidate: unknown; reason: string }[] } {
  const valid: EventCandidate[] = [];
  const rejected: { candidate: unknown; reason: string }[] = [];

  for (const raw of candidates) {
    const c = raw as Partial<EventCandidate>;

    if (!c || typeof c !== "object") {
      rejected.push({ candidate: raw, reason: "no es un objeto" });
      continue;
    }
    if (!c.city_slug || !knownCitySlugs.has(c.city_slug)) {
      rejected.push({ candidate: raw, reason: `city_slug desconocido: ${c.city_slug}` });
      continue;
    }
    if (!c.title || c.title.trim().length < 3 || c.title.length > 200) {
      rejected.push({ candidate: raw, reason: "título ausente o de longitud inverosímil" });
      continue;
    }
    if (!c.source_url || !isAllowedSource(c.source_url, agent.allowedSources)) {
      rejected.push({ candidate: raw, reason: `fuente no permitida: ${c.source_url}` });
      continue;
    }

    const startsAt = c.starts_at ? Date.parse(c.starts_at) : NaN;
    if (!Number.isFinite(startsAt)) {
      rejected.push({ candidate: raw, reason: "starts_at no es una fecha válida" });
      continue;
    }
    // Un día de margen hacia atrás: los actos que empezaron ayer y siguen hoy valen.
    if (startsAt < EVENT_WINDOW.from - 86_400_000 || startsAt > EVENT_WINDOW.to) {
      rejected.push({ candidate: raw, reason: `fecha fuera de ventana: ${c.starts_at}` });
      continue;
    }

    valid.push({
      city_slug: c.city_slug,
      title: c.title.trim(),
      description: c.description?.trim() || undefined,
      starts_at: new Date(startsAt).toISOString(),
      ends_at: c.ends_at ? new Date(Date.parse(c.ends_at)).toISOString() : null,
      venue: c.venue?.trim() || undefined,
      is_free: c.is_free ?? true,
      organizer: c.organizer?.trim() || undefined,
      source_url: c.source_url,
      source_name: c.source_name?.trim() || undefined,
    });
  }

  return { valid: capBatch(agent, valid, "eventos"), rejected };
}

export type ModerationDecision = "aprobar" | "rechazar" | "revisar";

export interface ModerationCandidate {
  id: string;
  decision: ModerationDecision;
  reason: string;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Filtra decisiones de moderación.
 *
 * Solo se aceptan decisiones sobre anuncios que estaban realmente pendientes: sin
 * esta comprobación, un id inventado podría reactivar un anuncio ya rechazado.
 */
export function validateModeration(
  agent: AgentSpec,
  candidates: unknown[],
  pendingIds: Set<string>,
): { valid: ModerationCandidate[]; rejected: { candidate: unknown; reason: string }[] } {
  const valid: ModerationCandidate[] = [];
  const rejected: { candidate: unknown; reason: string }[] = [];

  for (const raw of candidates) {
    const c = raw as Partial<ModerationCandidate>;

    if (!c?.id || !UUID.test(c.id)) {
      rejected.push({ candidate: raw, reason: "id ausente o no es un UUID" });
      continue;
    }
    if (!pendingIds.has(c.id)) {
      rejected.push({ candidate: raw, reason: "el anuncio no estaba pendiente" });
      continue;
    }
    if (c.decision !== "aprobar" && c.decision !== "rechazar" && c.decision !== "revisar") {
      rejected.push({ candidate: raw, reason: `decisión inválida: ${c.decision}` });
      continue;
    }

    valid.push({ id: c.id, decision: c.decision, reason: (c.reason ?? "").slice(0, 500) });
  }

  return { valid: capBatch(agent, valid, "decisiones"), rejected };
}
