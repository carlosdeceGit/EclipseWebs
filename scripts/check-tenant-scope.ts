import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

/**
 * Comprueba que ninguna web de la red puede servir datos de otra ciudad.
 *
 * El aislamiento entre dominios lo garantiza el tipo `TenantScope` en tiempo de
 * compilación, pero TypeScript no impide que alguien vaya directo al cliente de
 * Supabase y escriba su propia consulta. Esto es la barrera de después: reglas
 * deterministas sobre el código, no sobre la intención. Misma idea que
 * `agents/guardrails.ts`.
 *
 * Corre en CI. Si falla, hay una vía por la que Cádiz podría ver lo de Tarifa.
 */

/** Ficheros a los que se les permite nombrar las tablas por ciudad, y por qué. */
const ALLOWED = new Map([
  ["src/lib/db/listings.ts", "capa pública: filtra por ciudad en un único punto"],
  ["agents/store.ts", "agentes: trabajan en toda la red, con sus propios guardarraíles"],
  ["src/app/[locale]/clasificados/nuevo/actions.ts", "alta: sella la ciudad del tenant en el servidor"],
]);

/** Tablas cuyas filas pertenecen a una ciudad concreta. */
const SCOPED_TABLES = ["listings", "events"];

/** Este fichero habla de las tablas para poder vigilarlas; no las consulta. */
const SELF = "scripts/check-tenant-scope.ts";

/**
 * Quita las líneas de comentario antes de buscar.
 *
 * Se hace por líneas y no con una expresión sobre todo el fichero porque un `//`
 * dentro de una URL truncaría código real y crearía un falso negativo, que en una
 * comprobación de seguridad es mucho peor que un falso positivo.
 */
function code(source: string): string {
  return source
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      return !t.startsWith("//") && !t.startsWith("*") && !t.startsWith("/*");
    })
    .join("\n");
}

function read(path: string): string {
  return code(readFileSync(path, "utf8"));
}

function sourceFiles(): string[] {
  return execFileSync(
    "find",
    ["src", "agents", "scripts", "-type", "f", "(", "-name", "*.ts", "-o", "-name", "*.tsx", ")"],
    { encoding: "utf8" },
  )
    .split("\n")
    .filter(Boolean)
    .sort();
}

const results: { name: string; problems: string[] }[] = [];

function rule(name: string, check: () => string[]) {
  results.push({ name, problems: check() });
}

// --- Regla 1 -----------------------------------------------------------------

rule(`Solo ${ALLOWED.size} ficheros tocan las tablas por ciudad`, () => {
  const problems: string[] = [];
  for (const file of sourceFiles()) {
    if (file === SELF || ALLOWED.has(file)) continue;
    const src = read(file);
    for (const table of SCOPED_TABLES) {
      if (src.includes(`from("${table}")`)) {
        problems.push(`${file} consulta "${table}" directamente; usa la capa de src/lib/db/.`);
      }
    }
  }
  return problems;
});

// --- Regla 2 -----------------------------------------------------------------

rule("La capa pública consulta la tabla una vez, con ciudad y estado", () => {
  const src = read("src/lib/db/listings.ts");
  const calls = src.match(/from\("listings"\)/g) ?? [];
  if (calls.length !== 1) {
    return [`hay ${calls.length} llamadas a from("listings"); debe haber exactamente una.`];
  }

  // El filtro tiene que ir en la misma cadena que el from, no más lejos: pegado,
  // no se puede perder en una refactorización que reordene el fichero.
  const chain = src.slice(src.indexOf('from("listings")'));
  const statement = chain.slice(0, chain.indexOf(";"));

  const problems: string[] = [];
  if (!statement.includes('.eq("city_slug"')) {
    problems.push('la consulta no aplica .eq("city_slug", …) en la misma cadena.');
  }
  if (!statement.includes('.eq("status", "approved")')) {
    problems.push("la consulta no restringe a status = approved: publicaría anuncios sin moderar.");
  }
  return problems;
});

// --- Regla 3 -----------------------------------------------------------------

rule("getListings() y countListings() exigen un TenantScope", () => {
  const src = read("src/lib/db/listings.ts");
  return ["getListings", "countListings"]
    .filter((fn) => {
      const from = src.indexOf(`export async function ${fn}(`);
      if (from === -1) return true;
      return !src.slice(from, src.indexOf(")", from)).includes("TenantScope");
    })
    .map((fn) => `${fn}() no recibe TenantScope: con un string suelto se puede pedir otra ciudad.`);
});

// --- Regla 4 -----------------------------------------------------------------

rule("Los ámbitos solo se emiten desde el tenant de la petición", () => {
  const src = read("src/lib/db/scope.ts");
  const problems: string[] = [];

  const exported = src.match(/export (?:async )?function (\w+)/g) ?? [];
  if (exported.length !== 2) {
    problems.push(`scope.ts exporta ${exported.length} funciones; solo debe haber currentScope y scopeOf.`);
  }
  if (!src.includes("tenantCity(await currentTenant())") || !src.includes("tenantCity(tenant)")) {
    problems.push("algún emisor de ámbito no deriva la ciudad del tenant.");
  }
  return problems;
});

// --- Regla 5 -----------------------------------------------------------------

rule("El alta de clasificados sella la ciudad en el servidor", () => {
  const src = read("src/app/[locale]/clasificados/nuevo/actions.ts");
  const ok = src.includes("city_slug: city.slug") && src.includes("await currentCity()");
  return ok
    ? []
    : ["la ciudad no se toma del tenant en el servidor: un formulario manipulado publicaría en otra web."];
});

// --- Resultado ---------------------------------------------------------------

console.log("Aislamiento entre dominios de la red\n");
for (const { name, problems } of results) {
  console.log(`${problems.length === 0 ? "✓" : "✗"} ${name}`);
  for (const p of problems) console.log(`    ${p}`);
}

const failed = results.filter((r) => r.problems.length > 0).length;
if (failed > 0) {
  console.error(`\n${failed} regla(s) incumplida(s). Una ciudad podría ver datos de otra.`);
  process.exit(1);
}

console.log("\nTodas las comprobaciones pasan: cada dominio solo puede leer lo suyo.");
