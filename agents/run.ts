/**
 * Ejecutor de agentes.
 *
 *   npm run agents:list                 lista los agentes disponibles
 *   npm run agents:run -- --daily       ejecuta los diarios
 *   npm run agents:run -- eventos       ejecuta uno concreto
 *   npm run agents:run -- eventos --dry no escribe en la base de datos
 *
 * Está pensado para correr desde GitHub Actions (ver .github/workflows), pero
 * funciona igual en local con las variables de entorno puestas.
 */

import Anthropic from "@anthropic-ai/sdk";
import { AGENTS, AGENTS_BY_NAME, type AgentSpec } from "./agents";
import { CITIES } from "../src/lib/eclipse/cities";
import { finishRun, insertEvents, insertProposals, pendingListings, startRun } from "./store";

const MODEL = process.env.AGENT_MODEL ?? "claude-sonnet-5";

interface RunOptions {
  dryRun: boolean;
}

function parseArgs(argv: string[]) {
  const flags = new Set(argv.filter((a) => a.startsWith("--")));
  const names = argv.filter((a) => !a.startsWith("--"));
  return {
    list: flags.has("--list"),
    daily: flags.has("--daily"),
    weekly: flags.has("--weekly"),
    dryRun: flags.has("--dry") || flags.has("--dry-run"),
    names,
  };
}

/** Contexto que se le pasa al agente además de su prompt. */
async function buildContext(agent: AgentSpec): Promise<string> {
  const cities = CITIES.map((c) => ({
    slug: c.slug,
    name: c.name,
    province: c.province,
    country: c.country,
    timeZone: c.timeZone,
    lat: c.lat,
    lon: c.lon,
    current: c.circumstances,
  }));

  switch (agent.name) {
    case "eclipse-data":
      return `Ciudades y valores actuales:\n${JSON.stringify(cities, null, 2)}`;
    case "eventos":
      return `Ciudades a vigilar:\n${JSON.stringify(
        cities.map(({ slug, name, province }) => ({ slug, name, province })),
        null,
        2,
      )}\n\nHoy es ${new Date().toISOString().slice(0, 10)}.`;
    case "moderacion": {
      const pending = await pendingListings();
      if (pending.length === 0) return "NO_HAY_PENDIENTES";
      return `Anuncios pendientes:\n${JSON.stringify(pending, null, 2)}`;
    }
    default:
      return `Ciudades del proyecto: ${cities.map((c) => c.name).join(", ")}. Hoy es ${new Date()
        .toISOString()
        .slice(0, 10)}.`;
  }
}

/** Extrae el JSON de la respuesta aunque el modelo lo envuelva en un bloque. */
function parseJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : trimmed;
  return JSON.parse(candidate);
}

async function runAgent(agent: AgentSpec, opts: RunOptions): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error(`[${agent.name}] falta ANTHROPIC_API_KEY, se omite`);
    return;
  }

  const context = await buildContext(agent);
  if (context === "NO_HAY_PENDIENTES") {
    console.log(`[${agent.name}] nada que hacer`);
    return;
  }

  const runId = opts.dryRun ? null : await startRun(agent.name);
  const client = new Anthropic({ apiKey });
  console.log(`[${agent.name}] ejecutando…`);

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 8000,
      system: agent.prompt,
      // La búsqueda web va acotada a los dominios de la fuente oficial: sin esto el
      // agente acaba citando blogs que copian mal las tablas del IGN.
      tools: agent.allowedSources.length
        ? [
            {
              type: "web_search_20250305",
              name: "web_search",
              max_uses: 12,
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

    const result = parseJson(text) as Record<string, unknown[]>;
    const summary = Object.entries(result)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.length : 0}`)
      .join(", ");

    console.log(`[${agent.name}] ${summary}`);

    if (opts.dryRun) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    let created = 0;
    if (agent.name === "eclipse-data" && Array.isArray(result.proposals)) {
      created = await insertProposals(agent.name, result.proposals as never[]);
    } else if (agent.name === "eventos" && Array.isArray(result.events)) {
      created = await insertEvents(result.events as never[]);
    }

    await finishRun(runId, { ok: true, summary, itemsCreated: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[${agent.name}] error:`, message);
    await finishRun(runId, { ok: false, summary: "", error: message });
    process.exitCode = 1;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.list) {
    for (const a of AGENTS) {
      console.log(`${a.name.padEnd(16)} ${a.schedule.padEnd(8)} ${a.output.padEnd(9)} ${a.summary}`);
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
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
