# Sistema de agentes

Cuatro agentes mantienen la red al día. Corren desde GitHub Actions
(`.github/workflows/agents.yml`) y también en local.

| Agente | Frecuencia | Salida | Qué hace |
| --- | --- | --- | --- |
| `eclipse-data` | semanal | propuesta | Contrasta horas y duraciones contra el IGN |
| `eventos` | diaria | publica (pendiente) | Busca actos oficiales anunciados |
| `moderacion` | diaria | informe | Preclasifica los clasificados pendientes |
| `vigilancia-serp` | diaria | informe | Detecta noticias y huecos de contenido |

## La regla que ordena el diseño

**Ningún agente escribe datos astronómicos directamente.** `eclipse-data` deja
propuestas en la tabla `data_proposals` con su fuente, y una persona las acepta antes
de que toquen el dataset.

No es prudencia excesiva. Las horas de contacto determinan cuándo es seguro quitarse
el filtro solar; un valor mal actualizado de forma automática podría causar un daño
ocular permanente y no se arregla revirtiendo un commit. Los eventos, en cambio, se
publican solos porque exigen `source_url` y el peor caso es una actividad mal
transcrita.

## Uso

```bash
npm run agents:list                # ver el catálogo
npm run agents:run -- --daily      # los diarios
npm run agents:run -- --weekly     # los semanales
npm run agents:run -- eventos --dry  # uno solo, sin escribir nada
```

## Variables de entorno

| Variable | Para qué |
| --- | --- |
| `ANTHROPIC_API_KEY` | Ejecutar los agentes. Sin ella se omiten con un aviso. |
| `NEXT_PUBLIC_SUPABASE_URL` | Destino de propuestas, eventos y registro de ejecuciones. |
| `SUPABASE_SERVICE_ROLE_KEY` | Escribir en tablas sin política pública. **Nunca en el cliente.** |
| `AGENT_MODEL` | Modelo a usar. Por defecto `claude-sonnet-5`. |

Sin las de Supabase todo se degrada a no-op y `--dry` sigue sirviendo para ver la
salida por consola.

## Añadir un agente

1. Añade su `AgentSpec` en `agents/agents.ts`, con `allowedSources` acotado a las
   fuentes oficiales que puede consultar.
2. Si necesita contexto propio, añádelo en `buildContext()` de `agents/run.ts`.
3. Si escribe en base de datos, añade la función correspondiente en `agents/store.ts`
   validando siempre que llegue `source_url`.

El prompt debe terminar pidiendo JSON estricto y repitiendo las reglas de no
inventar: es lo que evita que un agente rellene huecos por su cuenta.

## Revisar las propuestas

```sql
select city_slug, field, current_value, proposed_value, source_url
from data_proposals
where status = 'pending'
order by created_at desc;
```

Al aceptar una, se edita `src/lib/eclipse/cities.ts` con el valor y se sube la
confianza del campo a `verified`. El dataset vive en el repositorio a propósito: así
cada cambio en un dato astronómico queda en el historial de git, con autor y fecha.
