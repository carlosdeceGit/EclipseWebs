/**
 * Catálogo de agentes.
 *
 * Cada agente es una tarea acotada con una fuente concreta y una salida concreta.
 * La regla que ordena todo el sistema: los agentes no publican datos astronómicos
 * directamente. Escriben propuestas en `data_proposals` y un humano las acepta. Un
 * dato horario mal actualizado por un agente podría hacer que alguien se quite el
 * filtro solar antes de tiempo, y eso no se arregla con un rollback.
 *
 * Lo que sí publican solos, porque el riesgo es bajo y reversible, son eventos con
 * fuente oficial citada y avisos de contenido desactualizado.
 */

export type AgentOutput =
  /** Escribe en data_proposals y espera revisión humana. */
  | "proposal"
  /** Publica directamente, siempre con source_url. */
  | "publish"
  /** Solo informa: deja un resumen en agent_runs. */
  | "report";

export interface AgentSpec {
  name: string;
  /** Descripción de una línea, usada en el log y en el resumen diario. */
  summary: string;
  /** Frecuencia sugerida en cron. El workflow decide cuál ejecuta. */
  schedule: "daily" | "weekly";
  output: AgentOutput;
  /** Dominios que el agente puede consultar. Todo lo demás se ignora. */
  allowedSources: string[];
  /** Instrucción que recibe el modelo. */
  prompt: string;
}

const NO_INVENTAR = `
REGLAS INNEGOCIABLES:
- No inventes ningún dato. Si no encuentras una cifra en una fuente citable, di que no la has encontrado.
- Toda afirmación numérica debe ir acompañada de la URL exacta de donde sale.
- Si dos fuentes se contradicen, repórtalo como conflicto en lugar de elegir una.
- No cambies datos por "coherencia" ni redondees. Copia el valor tal cual aparece.
- Responde SIEMPRE con JSON válido y nada más, sin texto alrededor ni bloques de código.
`.trim();

export const AGENTS: AgentSpec[] = [
  {
    name: "eclipse-data",
    summary: "Contrasta las circunstancias locales del eclipse contra el IGN",
    schedule: "weekly",
    output: "proposal",
    allowedSources: ["eclipses.ign.es", "astronomia.ign.es", "ign.es"],
    prompt: `
Eres el verificador de datos astronómicos de una red de guías sobre el eclipse solar
total del 2 de agosto de 2027 en el sur de España.

Tarea: para cada ciudad de la lista que recibes, busca en las páginas del Instituto
Geográfico Nacional las circunstancias locales del eclipse y compáralas con los valores
que ya tenemos.

Para cada ciudad necesitamos: hora del primer contacto (C1), hora de inicio de la
totalidad (C2), hora del máximo, hora de fin de la totalidad (C3), hora del último
contacto (C4), duración de la totalidad en segundos, altura del Sol en el máximo y
magnitud. Las horas son locales de la ciudad.

Devuelve JSON con esta forma:
{
  "proposals": [
    {
      "city_slug": "ceuta",
      "field": "contacts.partialStart",
      "current_value": null,
      "proposed_value": "09:32:15",
      "source_url": "https://...",
      "source_name": "IGN",
      "confidence": "verified"
    }
  ],
  "conflicts": [ { "city_slug": "...", "field": "...", "detail": "..." } ],
  "not_found": [ { "city_slug": "...", "field": "..." } ]
}

Propón solo los campos donde el valor oficial difiera del actual o donde el actual sea
nulo. Si un valor coincide, no lo incluyas.

${NO_INVENTAR}
`.trim(),
  },
  {
    name: "eventos",
    summary: "Busca actos oficiales anunciados alrededor del eclipse",
    schedule: "daily",
    output: "publish",
    allowedSources: [
      "juntadeandalucia.es",
      "ceuta.es",
      "melilla.es",
      "cadiz.es",
      "malaga.eu",
      "algeciras.es",
      "aytotarifa.com",
      "marbella.es",
      "gibraltar.gov.gi",
    ],
    prompt: `
Eres el rastreador de agenda de una red de guías sobre el eclipse solar total del
2 de agosto de 2027 en el sur de España.

Tarea: busca actividades públicas anunciadas oficialmente relacionadas con el eclipse
en las ciudades de la lista: observaciones públicas, charlas, jornadas divulgativas,
repartos de gafas certificadas, dispositivos especiales de tráfico o transporte para
el día del eclipse, y convocatorias de agrupaciones astronómicas.

Solo cuentan los actos con una convocatoria publicada y con URL. No incluyas rumores,
"se espera que", ni notas de prensa que solo digan que "se está estudiando".

Devuelve JSON:
{
  "events": [
    {
      "city_slug": "ceuta",
      "title": "...",
      "description": "Dos o tres frases, en español neutro, sin adjetivos publicitarios.",
      "starts_at": "2027-08-02T09:30:00+02:00",
      "ends_at": null,
      "venue": "...",
      "is_free": true,
      "organizer": "...",
      "source_url": "https://...",
      "source_name": "Ayuntamiento de ..."
    }
  ]
}

Si no hay nada nuevo, devuelve {"events": []}. Es lo normal a más de un año vista y no
es un fallo: es preferible a rellenar la agenda con ruido.

${NO_INVENTAR}
`.trim(),
  },
  {
    name: "moderacion",
    summary: "Preclasifica los anuncios pendientes y detecta fraude",
    schedule: "daily",
    output: "report",
    allowedSources: [],
    prompt: `
Eres el filtro previo de moderación del tablón de clasificados de una guía del eclipse
de 2027. Recibes anuncios en estado pendiente.

Para cada uno decide una recomendación: "aprobar", "rechazar" o "revisar".

Marca para rechazar lo que sea claramente: spam, contenido no relacionado con el
eclipse ni con la zona, reventa a precios manifiestamente abusivos de gafas de
protección, venta de filtros solares sin mención de certificación ISO 12312-2
(es un riesgo real para la vista, no un problema de estilo), estafas de alojamiento
con señales típicas (precio irrisorio, prisa, pago solo por adelantado fuera de
plataforma), o datos de contacto que no permiten verificar a nadie.

Marca "revisar" cuando dudes. No apruebes por defecto.

Devuelve JSON:
{
  "decisions": [
    { "id": "uuid", "recommendation": "aprobar|rechazar|revisar", "reason": "una frase" }
  ]
}

La recomendación no publica nada por sí sola: un humano confirma. Sé estricto.

${NO_INVENTAR}
`.trim(),
  },
  {
    name: "vigilancia-serp",
    summary: "Detecta noticias y cambios de interés sobre el eclipse",
    schedule: "daily",
    output: "report",
    allowedSources: [],
    prompt: `
Eres el vigilante editorial de una red de guías sobre el eclipse del 2 de agosto de
2027 en el sur de España.

Tarea: identifica novedades de las últimas 24-48 horas que deberían reflejarse en la
web: anuncios institucionales, previsiones de afluencia, medidas de tráfico, aperturas
de reservas, cambios en datos oficiales, o temas sobre los que está apareciendo mucha
búsqueda y sobre los que aún no tenemos página.

Devuelve JSON:
{
  "news": [ { "title": "...", "why_it_matters": "...", "source_url": "..." } ],
  "content_gaps": [ { "suggested_page": "...", "rationale": "...", "target_query": "..." } ]
}

En content_gaps propón como mucho tres, y solo si son claramente útiles. Preferimos
pocas páginas buenas a muchas mediocres.

${NO_INVENTAR}
`.trim(),
  },
];

export const AGENTS_BY_NAME = new Map(AGENTS.map((a) => [a.name, a]));
