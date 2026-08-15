/**
 * Ejecutor de agentes.
 *
 *   npm run agents:list                  lista los agentes disponibles
 *   npm run agents:run -- --daily        ejecuta los diarios
 *   npm run agents:run -- --weekly       ejecuta los semanales
 *   npm run agents:run -- eventos        ejecuta uno concreto
 *   npm run agents:run -- eventos --dry  no escribe nada, solo enseña la salida
 *
 * Corre desde GitHub Actions (.github/workflows/agents.yml) y también en local.
 */

import Anthropic from "@anthropic-ai/sdk";
import { writeFileSync } from "node:fs";
import { AGENTS, AGENTS_BY_NAME, type AgentSpec } from "./agents";
import { allCities } from "../src/lib/eclipse/cities";
import {
  assertCapability,
  validateEvents,
  validateModeration,
  type EventCandidate,
} from "./guardrails";
import { applyModeration, finishRun, logActions, pendingListings, publishEvents, startRun } from "./store";

const MODEL = process.env.AGENT_MODEL ?? "claude-sonnet-5";

interface RunOptions {
  dryRun: boolean;
}

/** Incidencias que el ejecutor deja escritas para que el workflow las publique. */
interface Issue {
  title: string;
  body: string;
  labels: string[];
}

const issues: Issue[] = [];

function parseArgs(argv: string[]) {
  const flags = new Set(argv.filter((a) => a.startsWith("--")));
  return {
    list: flags.has("--list"),
    daily: flags.has("--daily"),
    weekly: flags.has("--weekly"),
    dryRun: flags.has("--dry") || flags.has("--dry-run"),
    names: argv.filter((a) => !a.startsWith("--")),
  };
}

/** Contexto que se le pasa al agente además de su prompt. */
async function buildContext(agent: AgentSpec): Promise<string | null> {
  const cities = allCities();
  const today = new Date().toISOString().slice(0, 10);

  switch (agent.name) {
    case "auditor-datos":
      return `Hoy es ${today}. Estas son NUESTRAS cifras calculadas, que debes auditar:\n${JSON.stringify(
        cities.map((c) => ({
          slug: c.slug,
          name: c.name,
          province: c.province,
          lat: c.lat,
          lon: c.lon,
          inTotality: c.eclipse.isTotal,
          totalitySeconds: Math.round(c.eclipse.totalitySeconds * 10) / 10,
          localTimes: c.localTimes,
          timeZone: c.timeZone,
        })),
        null,
        2,
      )}`;

    case "eventos":
      return `Hoy es ${today}. Localidades a vigilar (usa estos slugs exactos):\n${JSON.stringify(
        cities.map(({ slug, name, province }) => ({ slug, name, province })),
        null,
        2,
      )}`;

    case "moderacion": {
      const pending = await pendingListings();
      if (pending.length === 0) return null;
      return `Anuncios pendientes de moderar:\n${JSON.stringify(pending, null, 2)}`;
    }

    default:
      return `Hoy es ${today}. Localidades del proyecto: ${cities.map((c) => c.name).join(", ")}.`;
  }
}

/** Extrae el JSON de la respuesta aunque el modelo lo envuelva en un bloque. */
function parseJson(text: string): Record<string, unknown> {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  return JSON.parse(fenced ? fenced[1] : trimmed) as Record<string, unknown>;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

async function runAgent(agent: AgentSpec, opts: RunOptions): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error(`[${agent.name}] falta ANTHROPIC_API_KEY, se omite`);
    return;
  }

  const context = await buildContext(agent);
  if (context === null) {
    console.log(`[${agent.name}] nada que hacer`);
    return;
  }

  const runId = opts.dryRun ? null : await startRun(agent.name);
  const client = new Anthropic({ apiKey });
  console.log(`[${agent.name}] ejecutando…`);

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 12000,
      system: agent.prompt,
      // La búsqueda va acotada a los dominios oficiales: sin esto el agente acaba
      // citando blogs que copian mal las tablas del IGN.
      tools: agent.allowedSources.length
        ? [
            {
              type: "web_search_20250305",
              name: "web_search",
              max_uses: 15,
              allowed_domains: agent.allowedSources,
            } as never,
          ]
        : undefined,
      messages: [{ role: "user", content: context }],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    const result = parseJson(text);

    if (opts.dryRun) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    const summary = await applyResult(agent, result, runId);
    console.log(`[${agent.name}] ${summary}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[${agent.name}] error:`, message);
    await finishRun(runId, { ok: false, summary: "", error: message });
    process.exitCode = 1;
  }
}

/** Aplica lo que ha devuelto el agente, pasando siempre por los guardarraíles. */
async function applyResult(
  agent: AgentSpec,
  result: Record<string, unknown>,
  runId: string | null,
): Promise<string> {
  const knownSlugs = new Set(allCities().map((c) => c.slug));
  let created = 0;
  let updated = 0;
  const notes: string[] = [];

  if (agent.capabilities.includes("publish:events")) {
    assertCapability(agent, "publish:events");
    const { valid, rejected } = validateEvents(agent, asArray(result.events), knownSlugs);
    created = await publishEvents(valid as EventCandidate[]);
    notes.push(`eventos publicados: ${created}, descartados: ${rejected.length}`);
    await logActions(runId, agent.name, [
      ...valid.map((e) => ({
        action: "publish:event",
        detail: `${e.city_slug} · ${e.title} · ${e.source_url}`,
        ok: true,
      })),
      ...rejected.map((r) => ({
        action: "reject:event",
        detail: r.reason,
        ok: false,
      })),
    ]);
  }

  if (agent.capabilities.includes("moderate:listings")) {
    assertCapability(agent, "moderate:listings");
    const pendingIds = new Set((await pendingListings()).map((l) => l.id));
    const { valid, rejected } = validateModeration(agent, asArray(result.decisions), pendingIds);
    updated = await applyModeration(valid);
    notes.push(`anuncios moderados: ${updated}, decisiones inválidas: ${rejected.length}`);
    await logActions(
      runId,
      agent.name,
      valid.map((d) => ({
        action: `moderate:${d.decision}`,
        targetId: d.id,
        detail: d.reason,
        ok: true,
      })),
    );
  }

  if (agent.capabilities.includes("report:issue")) {
    const discrepancies = asArray(result.discrepancies);
    const urgentNews = asArray(result.news).filter(
      (n) => (n as { urgency?: string }).urgency === "alta",
    );
    const comparisons = asArray(result.comparisons);

    if (comparisons.length > 0) {
      notes.push(`comparaciones con el IGN: ${comparisons.length}`);
    }

    if (discrepancies.length > 0) {
      issues.push({
        title: `Auditoría de datos: ${discrepancies.length} discrepancia(s) con el IGN`,
        body: [
          "El agente auditor ha encontrado diferencias entre nuestras cifras calculadas y las publicadas por el IGN que superan la tolerancia.",
          "",
          "Cada una hay que revisarla a mano: puede ser un punto de referencia distinto dentro del municipio, o un error real nuestro.",
          "",
          "```json",
          JSON.stringify(discrepancies, null, 2),
          "```",
        ].join("\n"),
        labels: ["datos", "auditoría"],
      });
      notes.push(`discrepancias: ${discrepancies.length}`);
    }

    if (urgentNews.length > 0) {
      issues.push({
        title: `Vigilancia: ${urgentNews.length} novedad(es) urgente(s)`,
        body: ["```json", JSON.stringify(urgentNews, null, 2), "```"].join("\n"),
        labels: ["contenido"],
      });
      notes.push(`novedades urgentes: ${urgentNews.length}`);
    }

    const gaps = asArray(result.content_gaps);
    if (gaps.length > 0) notes.push(`huecos de contenido propuestos: ${gaps.length}`);
  }

  const summary = notes.join(" · ") || "sin cambios";
  await finishRun(runId, { ok: true, summary, itemsCreated: created, itemsUpdated: updated });
  return summary;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.list) {
    for (const a of AGENTS) {
      console.log(
        `${a.name.padEnd(16)} ${a.schedule.padEnd(8)} ${a.capabilities.join(",").padEnd(38)} ${a.summary}`,
      );
    }
    return;
  }

  let selected: AgentSpec[];
  if (args.names.length > 0) {
    selected = args.names.map((n) => {
      const agent = AGENTS_BY_NAME.get(n);
      if (!agent) throw new Error(`Agente desconocido: ${n}`);
      return agent;
    });
  } else if (args.weekly) {
    selected = AGENTS.filter((a) => a.schedule === "weekly");
  } else {
    selected = AGENTS.filter((a) => a.schedule === "daily");
  }

  // En serie a propósito: son pocos, tocan la misma base de datos y así el log se
  // lee de arriba abajo cuando algo falla en Actions.
  for (const agent of selected) {
    await runAgent(agent, { dryRun: args.dryRun });
  }

  // El workflow lee este archivo y abre las incidencias. Separar "decidir" de
  // "publicar la incidencia" mantiene el ejecutor sin credenciales de GitHub.
  if (issues.length > 0 && !args.dryRun) {
    writeFileSync("agent-issues.json", JSON.stringify(issues, null, 2));
    console.log(`${issues.length} incidencia(s) pendiente(s) de abrir`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
