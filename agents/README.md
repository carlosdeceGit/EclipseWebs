# Sistema de agentes

Cuatro agentes mantienen la red al día. **Actúan por su cuenta**: publican, moderan y
auditan sin esperar aprobación. Corren desde GitHub Actions
(`.github/workflows/agents.yml`) y también en local.

| Agente | Frecuencia | Capacidades | Qué hace |
| --- | --- | --- | --- |
| `auditor-datos` | semanal | `report:issue` | Compara nuestras horas calculadas con las del IGN y abre incidencia si algo se sale de tolerancia |
| `eventos` | diaria | `publish:events` | Busca actos oficiales y **los publica** |
| `moderacion` | diaria | `moderate:listings` | Aprueba o rechaza anuncios pendientes y **aplica la decisión** |
| `vigilancia` | diaria | `report:issue` | Detecta noticias y huecos de contenido; abre incidencia si es urgente |

## Cómo se hace segura la autonomía

No con un humano revisando cada acción, sino con barreras que se ejecutan **después** del
modelo y no dependen de que este se porte bien:

1. **Capacidades explícitas.** Cada agente declara lo que puede hacer. `assertCapability()`
   lo comprueba antes de cada escritura. Un agente sin `publish:events` no publica aunque
   devuelva eventos.
2. **Fuentes acotadas.** `allowedSources` limita la búsqueda web a dominios oficiales, y
   `isAllowedSource()` vuelve a comprobar cada URL antes de guardarla. Sin esto, basta con
   que una página maliciosa aparezca en una búsqueda para que acabe citada como oficial.
3. **Validación determinista.** `guardrails.ts` descarta eventos con ciudad desconocida,
   fecha imposible o fuente no permitida, y decisiones de moderación sobre anuncios que no
   estaban pendientes. El prompt es una petición; esto es una barrera.
4. **Topes por ejecución.** `maxWrites` limita el daño de un agente desbocado.
5. **Auditoría completa.** `agent_runs` registra que un agente corrió; `agent_actions`
   registra qué hizo y por qué, acción por acción.
6. **La persona gana.** La moderación solo actúa sobre filas que siguen en `pending`: si
   alguien decidió mientras corría el agente, su decisión manda.

## Los datos astronómicos no los escribe nadie

Antes había un agente que proponía horarios. Ya no hace falta: las circunstancias se
**calculan** con elementos besselianos (`src/lib/eclipse/besselian.ts`) y se validan
contra el IGN y la NASA antes de cada despliegue.

Así que el agente de datos hace lo contrario de lo que hacía: en vez de darnos cifras,
**audita las nuestras**. Si encuentra una diferencia mayor de 10 segundos con el IGN, o un
desacuerdo sobre si un municipio está en la franja, abre una incidencia en GitHub para que
lo mire una persona.

El workflow ejecuta `scripts/validate-eclipse.ts` antes que los agentes: si el cálculo no
valida, no tiene sentido auditar nada contra él y la ejecución se detiene.

## Uso

```bash
npm run agents:list                  # ver el catálogo y las capacidades
npm run agents:run -- --daily        # los diarios
npm run agents:run -- --weekly       # los semanales
npm run agents:run -- eventos --dry  # uno solo, sin escribir nada
```

## Variables de entorno

| Variable | Para qué |
| --- | --- |
| `ANTHROPIC_API_KEY` | Ejecutar los agentes. Sin ella se omiten con un aviso. |
| `NEXT_PUBLIC_SUPABASE_URL` | Destino de eventos, moderación y registro. |
| `SUPABASE_SERVICE_ROLE_KEY` | Escribir en tablas sin política pública. **Nunca en el cliente.** |
| `AGENT_MODEL` | Modelo a usar. Por defecto `claude-sonnet-5`. |

Sin las de Supabase todo se degrada a no-op y `--dry` sigue sirviendo para ver la salida.

## Incidencias

El ejecutor decide qué merece una incidencia y la deja escrita en `agent-issues.json`;
el workflow es quien la publica con `gh issue create`. Separar las dos cosas mantiene el
código de los agentes sin credenciales de GitHub.

## Añadir un agente

1. Añade su `AgentSpec` en `agents/agents.ts`, con `capabilities` mínimas y
   `allowedSources` acotado.
2. Si necesita contexto propio, añádelo en `buildContext()` de `agents/run.ts`.
3. Si escribe algo nuevo, añade su validador en `agents/guardrails.ts` **antes** de
   escribir la función de `store.ts`. El validador no es opcional.

El prompt debe terminar pidiendo JSON estricto y repitiendo que es correcto devolver
listas vacías: un agente que siente que debe entregar algo, inventa.

## Revisar lo que han hecho

```sql
-- Últimas ejecuciones
select agent, started_at, ok, summary, items_created, items_updated
from agent_runs order by started_at desc limit 20;

-- Qué publicó o moderó, y por qué
select a.created_at, a.agent, a.action, a.detail, a.ok
from agent_actions a order by a.created_at desc limit 50;

-- Eventos publicados por un agente, con su fuente
select city_slug, title, starts_at, source_url from events
where status = 'approved' order by created_at desc;
```
