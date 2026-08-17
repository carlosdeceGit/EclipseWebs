import { formatDuration, getCity } from "@/lib/eclipse/cities";
import type { Article, Block } from "./types";

/**
 * Guías exclusivas de un dominio.
 *
 * Cada una trata algo que solo ocurre en su ciudad: un ferry que es el único
 * acceso, un borde de franja que se cruza en cuarenta kilómetros, un viento que
 * decide la observación, una frontera. Publicarlas en toda la red sería duplicar
 * contenido y además mentir, así que llevan `cities` y fuera de ahí devuelven 404.
 *
 * Las cifras salen del cálculo besseliano, no de una tabla escrita a mano: si
 * mañana se afinan los elementos, estas tablas se afinan solas.
 */

/** Fila de comparación de duraciones, resuelta desde el registro de ciudades. */
function durationRow(slug: string, locale: "es" | "en", note: string): string[] {
  const city = getCity(slug);
  if (!city) return [slug, "—", note];
  const name = locale === "en" ? (city.nameEn ?? city.name) : city.name;
  return [name, formatDuration(city.eclipse.totalitySeconds, locale) ?? "—", note];
}

const durationHead = {
  es: ["Localidad", "Totalidad", "Qué implica"],
  en: ["Location", "Totality", "What it means"],
};

// --- Ceuta ------------------------------------------------------------------

/** El ferry: en Ceuta no es un detalle logístico, es el eclipse entero. */
export const ferry: Article = {
  slug: "ferry",
  cities: ["ceuta"],
  content: {
    es: (city) => ({
      title: "El ferry a Ceuta el día del eclipse: el único acceso y cómo asegurarlo",
      shortTitle: "El ferry a Ceuta",
      description: `Ceuta es el mejor punto de España para el eclipse del 2 de agosto de 2027 y solo se llega por mar. Cómo planificar el cruce, qué pasa si hay levante y cuándo no merece la pena cruzar.`,
      body: [
        {
          type: "p",
          text: `Ceuta verá ${formatDuration(city.eclipse.totalitySeconds)} de totalidad el 2 de agosto de 2027, la duración más larga de toda España, con el segundo contacto a las ${city.localTimes.totalityStart} hora local. Y no hay ninguna carretera que llegue hasta aquí. Esa es la frase que resume toda la planificación: el eclipse en Ceuta no es un problema de miradores, es un problema de billete.`,
        },
        { type: "h2", text: "Por qué esto es distinto del resto de la franja" },
        {
          type: "p",
          text: `En Tarifa, en Algeciras o en Cádiz el peor escenario es un atasco: sales antes y lo resuelves. Aquí el peor escenario es no cruzar. La capacidad de los ferris del Estrecho es finita, las salidas de la mañana del 2 de agosto serán las más demandadas del año, y por encima de eso hay una variable que no controla nadie: el estado de la mar.`,
        },
        { type: "h2", text: "El levante puede dejarte en tierra" },
        {
          type: "p",
          text: `El levante es el viento dominante del Estrecho en verano y, cuando sopla fuerte, las navieras cancelan o retrasan salidas con pocas horas de aviso. Es una situación normal en agosto, no un caso extremo. Si tu plan consiste en cruzar la mañana del día 2, un levante fuerte esa madrugada te deja mirando el eclipse desde el puerto de Algeciras. Que, dicho sea de paso, tampoco está mal —Algeciras está dentro de la franja—, pero no es lo que habías planeado.`,
        },
        {
          type: "callout",
          title: "La regla que resuelve el 90% del problema",
          text: "Duerme en Ceuta la noche del 1 al 2 de agosto. Con eso, el estado de la mar deja de importar para ver el eclipse y solo afecta a la vuelta, que da igual que se retrase.",
        },
        { type: "h2", text: "Cómo asegurar el cruce" },
        {
          type: "ul",
          items: [
            "Reserva en cuanto las navieras abran ventas para agosto de 2027, y reserva ida y vuelta a la vez.",
            "Cruza el 31 de julio o el 1 de agosto, nunca el 2 por la mañana.",
            "Si puedes, cruza como pasajero sin vehículo: la plaza de coche se agota mucho antes y en Ceuta no la necesitas para nada.",
            "Vuelve el 3 o el 4, no el 2 por la tarde. Ese día todo el mundo intentará salir a la vez y además es cuando el mar suele estar peor.",
            "Ten a mano el servicio de helicóptero como alternativa, comprobando antes que sigue operativo. Tiene muy pocas plazas: es un plan B, no un plan.",
          ],
        },
        { type: "h2", text: "¿Compensa cruzar solo por la duración?" },
        {
          type: "p",
          text: `Esta es la pregunta honesta, y la respuesta depende de para qué cruzas. Ceuta gana, pero por poco frente a la orilla de enfrente:`,
        },
        {
          type: "table",
          head: durationHead.es,
          rows: [
            durationRow("ceuta", "es", "El máximo de España. Solo por mar."),
            durationRow("algeciras", "es", "El mejor punto peninsular. Por carretera y con el puerto al lado."),
            durationRow("tarifa", "es", "Por carretera, con horizonte atlántico."),
            durationRow("los-barrios", "es", "Interior del Campo de Gibraltar, menos afluencia."),
          ],
        },
        {
          type: "p",
          text: `La diferencia entre Ceuta y Algeciras es de unos veinte segundos. Si lo que buscas es exprimir la totalidad y ya estás en la Península, esos veinte segundos no justifican jugártelo a un barco. Si lo que buscas es ver el eclipse desde Ceuta —desde el Hacho, con África debajo y la Península enfrente—, entonces cruza, pero cruza el día antes.`,
        },
        { type: "h2", text: "Si vienes desde Marruecos" },
        {
          type: "p",
          text: `El paso del Tarajal es la entrada por tierra. Comprueba antes del viaje que está operativo y con qué requisitos, porque las condiciones han cambiado varias veces en los últimos años, y cuenta con controles más lentos de lo habitual ese fin de semana. Y ojo con la hora: en agosto Marruecos va una hora por detrás de España. La totalidad empieza en Ceuta a las ${city.localTimes.totalityStart} hora española, que es una hora antes en el reloj marroquí.`,
        },
      ],
    }),
    en: (city) => ({
      title: "The ferry to Ceuta on eclipse day: the only way in, and how to secure it",
      shortTitle: "The ferry to Ceuta",
      description: `Ceuta gets Spain's longest totality on 2 August 2027 and is reachable only by sea. How to plan the crossing, what happens if the levante blows, and when crossing is not worth it.`,
      body: [
        {
          type: "p",
          text: `Ceuta sees ${formatDuration(city.eclipse.totalitySeconds, "en")} of totality on 2 August 2027, the longest anywhere in Spain, with second contact at ${city.localTimes.totalityStart} local time. And no road reaches it. That single fact governs the whole plan: the eclipse in Ceuta is not a question of viewpoints, it is a question of a ferry ticket.`,
        },
        { type: "h2", text: "Why this differs from the rest of the path" },
        {
          type: "p",
          text: `In Tarifa, Algeciras or Cádiz the worst case is a traffic jam: you leave earlier and you solve it. Here the worst case is not crossing at all. Ferry capacity across the Strait is finite, the morning sailings on 2 August will be the most sought-after of the year, and above all that sits a variable nobody controls: the state of the sea.`,
        },
        { type: "h2", text: "The levante can strand you" },
        {
          type: "p",
          text: `The levante is the Strait's dominant summer wind and, when it blows hard, operators cancel or delay sailings at a few hours' notice. That is normal August behaviour, not an extreme case. If your plan is to cross on the morning of the 2nd, a strong levante overnight leaves you watching the eclipse from the port of Algeciras. Which — for the record — is not a disaster, since Algeciras is inside the path, but it is not what you planned.`,
        },
        {
          type: "callout",
          title: "The rule that solves 90% of this",
          text: "Sleep in Ceuta on the night of 1–2 August. Once you have, the state of the sea stops mattering for the eclipse and only affects the journey home, where a delay costs you nothing.",
        },
        { type: "h2", text: "How to secure the crossing" },
        {
          type: "ul",
          items: [
            "Book the moment operators open August 2027 sailings, and book both directions at once.",
            "Cross on 31 July or 1 August, never on the morning of the 2nd.",
            "Cross as a foot passenger if you can: vehicle spaces sell out far earlier and you do not need a car in Ceuta.",
            "Return on the 3rd or 4th, not the afternoon of the 2nd. That is when everyone leaves at once, and often when the sea is at its worst.",
            "Keep the helicopter service in mind as a fallback, checking first that it still operates. It has very few seats: it is a plan B, not a plan.",
          ],
        },
        { type: "h2", text: "Is the extra duration worth the crossing?" },
        {
          type: "p",
          text: `This is the honest question, and the answer depends on what you are crossing for. Ceuta wins, but not by much against the far shore:`,
        },
        {
          type: "table",
          head: durationHead.en,
          rows: [
            durationRow("ceuta", "en", "Spain's maximum. Reachable only by sea."),
            durationRow("algeciras", "en", "The best mainland spot, by road, with the port next door."),
            durationRow("tarifa", "en", "By road, with an Atlantic horizon."),
            durationRow("los-barrios", "en", "Inland Campo de Gibraltar, fewer crowds."),
          ],
        },
        {
          type: "p",
          text: `The gap between Ceuta and Algeciras is about twenty seconds. If you are squeezing every second of totality and you are already on the mainland, those twenty seconds do not justify gambling on a boat. If what you want is to see the eclipse from Ceuta — from Monte Hacho, with Africa below you and Spain opposite — then cross, but cross the day before.`,
        },
        { type: "h2", text: "Arriving from Morocco" },
        {
          type: "p",
          text: `The Tarajal crossing is the land entry. Check before travelling that it is open and on what terms, as conditions have changed several times in recent years, and expect slower controls than usual that weekend. Watch the clock too: in August Morocco runs an hour behind Spain. Totality begins in Ceuta at ${city.localTimes.totalityStart} Spanish time, which is an hour earlier on a Moroccan watch.`,
        },
      ],
    }),
  },
};

// --- Cádiz ------------------------------------------------------------------

/** Cádiz está cerca del borde norte: el dato que más cambia el plan de un gaditano. */
export const bordeDeLaFranja: Article = {
  slug: "borde-de-la-franja",
  cities: ["cadiz"],
  content: {
    es: (city) => ({
      title: "Cádiz, cerca del borde de la franja: cuánto se gana bajando al sur",
      shortTitle: "Cádiz y el borde de la franja",
      description: `Cádiz ve ${formatDuration(city.eclipse.totalitySeconds)} de totalidad, menos de la mitad que el sur de la provincia. Cuánto se gana exactamente en Chiclana, Conil, Vejer o Barbate, y cuándo compensa moverse.`,
      body: [
        {
          type: "p",
          text: `Cádiz está dentro de la franja de totalidad: el 2 de agosto de 2027 el Sol desaparecerá por completo sobre la ciudad durante ${formatDuration(city.eclipse.totalitySeconds)}, entre las ${city.localTimes.totalityStart} y las ${city.localTimes.totalityEnd}. Pero está bastante cerca del borde norte, y eso tiene una consecuencia que casi nadie cuenta: cuarenta kilómetros al sur la totalidad dura más del doble.`,
        },
        { type: "h2", text: "Por qué pasa esto" },
        {
          type: "p",
          text: `La sombra de la Luna es una elipse de unos 258 kilómetros de ancho. En el centro, la totalidad dura lo máximo; hacia los bordes se va acortando hasta desaparecer. Cádiz capital no está en el centro, está en la mitad norte, así que se lleva una fracción de la duración disponible. No es un problema de la ciudad: es geometría.`,
        },
        { type: "h2", text: "Cuánto se gana, exactamente" },
        {
          type: "p",
          text: `Estas cifras están calculadas con elementos besselianos para las coordenadas de cada localidad, no copiadas de una tabla. Puedes comprobar cualquier punto intermedio en el localizador.`,
        },
        {
          type: "table",
          head: durationHead.es,
          rows: [
            durationRow("jerez-de-la-frontera", "es", "Al norte de Cádiz: apenas roza la totalidad."),
            durationRow("el-puerto-de-santa-maria", "es", "Bahía norte, por debajo de la capital."),
            durationRow("puerto-real", "es", "Prácticamente lo mismo que Cádiz."),
            durationRow("cadiz", "es", "La capital."),
            durationRow("san-fernando", "es", "A un tren de cercanías, ya se nota."),
            durationRow("chiclana-de-la-frontera", "es", "Media hora en coche, más de medio minuto extra."),
            durationRow("conil-de-la-frontera", "es", "Costa de la Luz, cerca del minuto de ganancia."),
            durationRow("vejer-de-la-frontera", "es", "Interior, con altura y horizonte amplio."),
            durationRow("barbate", "es", "Más de un minuto y medio por encima de Cádiz."),
          ],
        },
        { type: "h2", text: "¿Entonces hay que irse de Cádiz?" },
        {
          type: "p",
          text: `Depende de qué te importe más, y las dos respuestas son legítimas. Si nunca has visto un eclipse total, la diferencia entre dos minutos largos y cuatro es real: cuatro minutos dan tiempo a mirar la corona, bajar los ojos, ver el horizonte iluminado en 360°, mirar otra vez y todavía asimilarlo. En dos se te pasa volando. Si el plan es verlo en casa, con tu gente, en La Caleta y sin coger el coche, eso también vale: la totalidad en Cádiz es totalidad de verdad, no una versión menor.`,
        },
        {
          type: "callout",
          title: "Lo que no debes hacer",
          text: "Salir de Cádiz la mañana del día 2 para bajar al sur. Con el tráfico previsible y una ciudad que se vacía por dos puentes y un istmo, es la forma más segura de ver la totalidad desde el arcén de la N-340. Si decides bajar, duerme abajo.",
        },
        { type: "h2", text: "Si te quedas, aprovecha lo que Cádiz tiene y otros no" },
        {
          type: "ul",
          items: [
            "Horizonte atlántico abierto al oeste, que es por donde llega la sombra de la Luna cruzando el agua antes de alcanzarte.",
            "Playas urbanas grandes a las que se llega andando: nada de coche, nada de aparcamiento, nada de atasco de vuelta.",
            "Una ciudad entera con sombra, agua y bares abiertos para la hora larga de fase parcial que hay que esperar antes.",
            "Y el detalle que casi nadie tiene en cuenta: al terminar, estás en tu casa. Los que hayan bajado al sur todavía tienen que volver.",
          ],
        },
        {
          type: "p",
          text: `Sea cual sea la decisión, tómala antes del 1 de agosto y reserva en consecuencia. Improvisar el mismo día es la única opción que garantiza perder tiempo de totalidad.`,
        },
      ],
    }),
    en: (city) => ({
      title: "Cádiz near the edge of the path: what you gain by going south",
      shortTitle: "Cádiz and the edge of the path",
      description: `Cádiz sees ${formatDuration(city.eclipse.totalitySeconds, "en")} of totality, less than half what the south of the province gets. Exactly how much Chiclana, Conil, Vejer or Barbate add, and when moving is worth it.`,
      body: [
        {
          type: "p",
          text: `Cádiz is inside the path of totality: on 2 August 2027 the Sun will disappear completely over the city for ${formatDuration(city.eclipse.totalitySeconds, "en")}, between ${city.localTimes.totalityStart} and ${city.localTimes.totalityEnd}. But it sits fairly close to the northern edge, and that has a consequence almost nobody spells out: forty kilometres to the south, totality lasts more than twice as long.`,
        },
        { type: "h2", text: "Why this happens" },
        {
          type: "p",
          text: `The Moon's shadow is an ellipse roughly 258 kilometres wide. At its centre totality lasts longest; towards the edges it shortens until it vanishes. Cádiz is not on the centreline, it is in the northern half, so it collects a fraction of the available duration. This is not a flaw of the city: it is geometry.`,
        },
        { type: "h2", text: "Exactly how much you gain" },
        {
          type: "p",
          text: `These figures are computed from Besselian elements for each location's coordinates, not copied from a table. You can check any point in between using the locator.`,
        },
        {
          type: "table",
          head: durationHead.en,
          rows: [
            durationRow("jerez-de-la-frontera", "en", "North of Cádiz: barely clips totality."),
            durationRow("el-puerto-de-santa-maria", "en", "Northern bay, below the city."),
            durationRow("puerto-real", "en", "Practically identical to Cádiz."),
            durationRow("cadiz", "en", "The city itself."),
            durationRow("san-fernando", "en", "One commuter-train stop, already noticeable."),
            durationRow("chiclana-de-la-frontera", "en", "Half an hour by car, over half a minute more."),
            durationRow("conil-de-la-frontera", "en", "Costa de la Luz, close to a full extra minute."),
            durationRow("vejer-de-la-frontera", "en", "Inland, with height and a wide horizon."),
            durationRow("barbate", "en", "Over a minute and a half more than Cádiz."),
          ],
        },
        { type: "h2", text: "So should you leave Cádiz?" },
        {
          type: "p",
          text: `It depends what matters more to you, and both answers are defensible. If you have never seen a total eclipse, the difference between a long two minutes and four is real: four minutes give you time to look at the corona, drop your eyes, take in the 360° glow, look again and still absorb it. Two are gone before you have settled. If the plan is to watch it at home, with your people, at La Caleta, without touching a car — that counts too: totality in Cádiz is real totality, not a lesser version of it.`,
        },
        {
          type: "callout",
          title: "What not to do",
          text: "Leave Cádiz on the morning of the 2nd to drive south. With the traffic to expect and a city that empties through two bridges and an isthmus, that is the surest way to watch totality from the hard shoulder of the N-340. If you decide to go south, sleep south.",
        },
        { type: "h2", text: "If you stay, use what Cádiz has and others do not" },
        {
          type: "ul",
          items: [
            "An open Atlantic horizon to the west, the direction the Moon's shadow arrives from, crossing the water before it reaches you.",
            "Large city beaches you can walk to: no car, no parking, no jam on the way back.",
            "A whole city of shade, water and open bars for the long partial phase you have to wait through first.",
            "And the detail few people weigh: when it ends, you are already home. Everyone who drove south still has to drive back.",
          ],
        },
        {
          type: "p",
          text: `Whichever you choose, choose before 1 August and book accordingly. Improvising on the day is the one option guaranteed to cost you totality.`,
        },
      ],
    }),
  },
};

// --- Tarifa -----------------------------------------------------------------

/** El levante: en Tarifa es la única variable que puede arruinar el eclipse. */
export const levante: Article = {
  slug: "levante",
  cities: ["tarifa"],
  content: {
    es: (city) => ({
      title: "El levante y el eclipse en Tarifa: el viento que decide si se ve",
      shortTitle: "El levante en Tarifa",
      description: `En Tarifa la nubosidad de levante es el mayor riesgo del eclipse del 2 de agosto de 2027. Qué es la barra, por qué aparece justo a media mañana y cuál es el plan B que sigue dentro de la franja.`,
      body: [
        {
          type: "p",
          text: `Tarifa verá ${formatDuration(city.eclipse.totalitySeconds)} de totalidad el 2 de agosto de 2027, con el Sol a ${city.eclipse.sunAltitudeDeg.toFixed(0)}° sobre el horizonte y África enfrente. Es uno de los mejores sitios de la franja peninsular y, a la vez, el que tiene el mayor riesgo meteorológico local de toda ella. La razón tiene nombre propio y aquí lo conoce todo el mundo: el levante.`,
        },
        { type: "h2", text: "Qué es la barra" },
        {
          type: "p",
          text: `Cuando sopla levante, el aire húmedo del Mediterráneo se comprime al embocar el Estrecho y asciende al chocar con el relieve de la costa. Al ascender se enfría, condensa y forma una banda de nubes bajas que se queda enganchada a la sierra y al litoral: es lo que aquí se llama la barra. No es una tormenta ni un frente: es un techo bajo, local y a veces tozudo, que puede convivir con un cielo perfectamente azul unos kilómetros más allá.`,
        },
        {
          type: "callout",
          title: "El peor detalle: la hora",
          text: `La barra suele ser más densa a primera hora y a media mañana, y tiende a levantar según avanza el día. La totalidad en Tarifa empieza a las ${city.localTimes.totalityStart}. Es decir, el eclipse cae justo en la peor franja horaria posible para este fenómeno.`,
        },
        { type: "h2", text: "Qué probabilidad hay" },
        {
          type: "p",
          text: `No la vamos a inventar. Agosto en el Estrecho es, en términos generales, un mes de cielos despejados, y el levante no produce barra todos los días que sopla: depende de la humedad, de la intensidad y de la estabilidad de la masa de aire. Lo honesto es decir dos cosas: que la probabilidad global de cielo despejado en esta zona en agosto es alta, y que el escenario de fallo, cuando ocurre, es exactamente éste y no otro. Publicaremos porcentajes por localidad cuando podamos citarlos de una serie climatológica oficial.`,
        },
        { type: "h2", text: "Qué hacer los días previos" },
        {
          type: "ul",
          items: [
            "Mira la predicción de viento, no solo la de nubes. Si el parte da levante fuerte para la mañana del 2, tienes un problema que gestionar; si da poniente o levante flojo, el riesgo baja mucho.",
            "Fíate de AEMET y de los modelos a 48 horas. Las apps genéricas fallan mucho en zonas de microclima, y esta es el ejemplo de manual.",
            "Ten decidido el plan B el día 1, no el día 2 a las ocho de la mañana.",
            "Recuerda que la altura ayuda hasta cierto punto: el Mirador del Estrecho y las sierras de detrás son justo donde encalla la barra. Con levante, subir puede ser peor que quedarse abajo.",
          ],
        },
        { type: "h2", text: "El plan B: hacia el oeste, sin salirse de la franja" },
        {
          type: "p",
          text: `La barra es un fenómeno del Estrecho. Alejarse hacia el oeste, por la costa atlántica, sale del efecto sin salir de la franja de totalidad. Se pierden segundos, no minutos:`,
        },
        {
          type: "table",
          head: durationHead.es,
          rows: [
            durationRow("tarifa", "es", "El punto de partida, con el riesgo de barra."),
            durationRow("barbate", "es", "Costa atlántica, fuera del efecto del Estrecho."),
            durationRow("vejer-de-la-frontera", "es", "Interior con altura y horizonte amplio."),
            durationRow("conil-de-la-frontera", "es", "Costa de la Luz abierta al oeste."),
            durationRow("algeciras", "es", "Alternativa al este, pero dentro del mismo régimen."),
          ],
        },
        {
          type: "p",
          text: `La cuenta es sencilla y conviene tenerla clara antes de que llegue el momento de decidir: unos segundos menos de totalidad con el cielo limpio valen infinitamente más que ${formatDuration(city.eclipse.totalitySeconds)} debajo de una nube. Si el día 1 por la tarde la predicción da levante fuerte, coge el coche esa misma tarde y duerme al oeste.`,
        },
        { type: "h2", text: "Y si finalmente hay barra" },
        {
          type: "p",
          text: `No des el día por perdido. Incluso con el cielo tapado, la totalidad se nota de forma brutal: la luz cae en picado hasta un crepúsculo profundo en cuestión de segundos, la temperatura baja varios grados, el viento cambia y los pájaros callan. Y hay una posibilidad que aquí es real: la barra se mueve. Un claro de dos minutos en el momento justo es perfectamente posible, así que quédate mirando y ten el filtro puesto por si el Sol reaparece antes de lo que esperas.`,
        },
      ],
    }),
    en: (city) => ({
      title: "The levante and the eclipse in Tarifa: the wind that decides",
      shortTitle: "The levante in Tarifa",
      description: `In Tarifa, levante cloud is the biggest risk to the 2 August 2027 eclipse. What the barra is, why it forms in mid-morning, and the fallback that stays inside the path.`,
      body: [
        {
          type: "p",
          text: `Tarifa sees ${formatDuration(city.eclipse.totalitySeconds, "en")} of totality on 2 August 2027, with the Sun ${city.eclipse.sunAltitudeDeg.toFixed(0)}° above the horizon and Africa in full view. It is one of the best places in the mainland path and, simultaneously, the one carrying the highest local weather risk in it. The reason has a name everyone here knows: the levante.`,
        },
        { type: "h2", text: "What the barra is" },
        {
          type: "p",
          text: `When the levante blows, humid Mediterranean air compresses as it funnels into the Strait and is forced upwards by the coastal relief. Rising, it cools, condenses and forms a band of low cloud that snags on the hills and the shoreline: locally, *la barra*. It is not a storm or a front: it is a low, strictly local and sometimes stubborn ceiling that can sit alongside perfectly blue sky a few kilometres away.`,
        },
        {
          type: "callout",
          title: "The worst part: the timing",
          text: `The barra tends to be thickest in the early and mid-morning, lifting as the day goes on. Totality in Tarifa begins at ${city.localTimes.totalityStart}. In other words, the eclipse falls in the worst possible window for this phenomenon.`,
        },
        { type: "h2", text: "How likely is it" },
        {
          type: "p",
          text: `We are not going to invent a number. August in the Strait is broadly a month of clear skies, and the levante does not produce a barra every day it blows: it depends on humidity, strength and the stability of the air mass. The honest statement is twofold — the overall probability of clear sky here in August is high, and when it does fail, this is precisely how it fails. We will publish per-location percentages once we can cite them from an official climatological series.`,
        },
        { type: "h2", text: "What to do in the days before" },
        {
          type: "ul",
          items: [
            "Watch the wind forecast, not just the cloud forecast. A strong levante forecast for the morning of the 2nd is a problem to manage; a poniente or a light levante drops the risk sharply.",
            "Trust AEMET, the Spanish met office, and the 48-hour models. Generic weather apps perform badly in microclimate areas, and this is the textbook case.",
            "Have your fallback decided on the 1st, not at eight in the morning on the 2nd.",
            "Remember that height only helps up to a point: the Mirador del Estrecho and the hills behind it are exactly where the barra runs aground. With a levante, going up can be worse than staying down.",
          ],
        },
        { type: "h2", text: "The fallback: west, without leaving the path" },
        {
          type: "p",
          text: `The barra is a phenomenon of the Strait. Moving west along the Atlantic coast escapes the effect without leaving the path of totality. You lose seconds, not minutes:`,
        },
        {
          type: "table",
          head: durationHead.en,
          rows: [
            durationRow("tarifa", "en", "The starting point, with the barra risk."),
            durationRow("barbate", "en", "Atlantic coast, outside the Strait effect."),
            durationRow("vejer-de-la-frontera", "en", "Inland, with height and a wide horizon."),
            durationRow("conil-de-la-frontera", "en", "Costa de la Luz, open to the west."),
            durationRow("algeciras", "en", "An eastward alternative, but in the same regime."),
          ],
        },
        {
          type: "p",
          text: `The arithmetic is simple and worth settling before the moment of decision arrives: a few seconds less of totality under a clean sky is worth infinitely more than ${formatDuration(city.eclipse.totalitySeconds, "en")} under cloud. If the forecast on the afternoon of the 1st calls a strong levante, get in the car that same afternoon and sleep further west.`,
        },
        { type: "h2", text: "And if the barra does turn up" },
        {
          type: "p",
          text: `Do not write the day off. Even under full cover, totality registers hard: the light collapses into deep twilight within seconds, the temperature drops several degrees, the wind shifts and the birds go quiet. And one possibility here is genuinely real: the barra moves. A two-minute break at exactly the right moment is entirely possible, so keep watching — and keep your filter to hand in case the Sun reappears sooner than you expect.`,
        },
      ],
    }),
  },
};

// --- Gibraltar --------------------------------------------------------------

/** La frontera: el único punto de la red donde el acceso es un control de pasaportes. */
export const frontera: Article = {
  slug: "frontera",
  cities: ["gibraltar"],
  content: {
    es: (city) => ({
      title: "Cruzar a Gibraltar el día del eclipse: la frontera, la cola y si compensa",
      shortTitle: "Cruzar la frontera",
      description: `Cómo cruzar a Gibraltar para el eclipse del 2 de agosto de 2027, cuánto puede durar la cola de la frontera y por qué La Línea ve prácticamente la misma totalidad.`,
      body: [
        {
          type: "p",
          text: `Gibraltar verá ${formatDuration(city.eclipse.totalitySeconds)} de totalidad el 2 de agosto de 2027, con el segundo contacto a las ${city.localTimes.totalityStart}. Es un punto excelente y el único de toda la franja al que se entra pasando un control de fronteras. Ese detalle, que el resto del año es una molestia menor, el día del eclipse es la variable que puede costarte el viaje entero.`,
        },
        { type: "h2", text: "La cola" },
        {
          type: "p",
          text: `Un día cualquiera de agosto la cola de entrada a Gibraltar ya se cuenta en decenas de minutos, y en los peores momentos en más de una hora. Ahora súmale un eclipse total con miles de personas queriendo cruzar dentro de la misma franja horaria de la mañana, porque todo el mundo tiene la misma hora límite: las ${city.localTimes.totalityStart}. La totalidad no espera, y una cola de frontera no se salta.`,
        },
        {
          type: "callout",
          title: "La única forma segura de estar dentro",
          text: "Cruzar el día anterior y dormir en el Peñón, o cruzar a primera hora de la mañana del 2 con muchísimo margen. Salir de La Línea a media mañana contando con llegar a tiempo no es un plan, es una apuesta.",
        },
        { type: "h2", text: "A pie, no en coche" },
        {
          type: "ul",
          items: [
            "Gibraltar es diminuto y el aparcamiento es escaso incluso un martes de febrero. Deja el coche en La Línea y cruza andando: es lo que hace todo el mundo que sabe cómo funciona esto.",
            "El paso peatonal cruza la pista del aeropuerto y se cierra con cada operación de vuelo. El tráfico rodado ya usa el túnel bajo la pista, pero si vas a pie tienes que contar con esa espera.",
            "Dentro, el autobús urbano y el propio tamaño del territorio hacen que no necesites vehículo para nada.",
          ],
        },
        { type: "h2", text: "Documentación, moneda y hora" },
        {
          type: "ul",
          items: [
            "Lleva documentación en regla. Y comprueba los requisitos poco antes de viajar: las condiciones de paso pueden cambiar antes de 2027 por el acuerdo entre la Unión Europea y el Reino Unido sobre Gibraltar. Lo que leíste hace un año puede no valer.",
            "La moneda es la libra gibraltareña. Se acepta el euro casi en todas partes, pero el cambio que te apliquen no te va a gustar.",
            "Gibraltar no va en hora británica: va en la misma hora que España. Todos los horarios de esta web son directamente los del reloj del Peñón, sin conversión.",
          ],
        },
        { type: "h2", text: "La pregunta incómoda: ¿compensa cruzar?" },
        {
          type: "p",
          text: `Si tu único criterio es la duración de la totalidad, la respuesta es no, y con un margen que no admite discusión:`,
        },
        {
          type: "table",
          head: durationHead.es,
          rows: [
            durationRow("gibraltar", "es", "Con frontera, aforo y la nube del Peñón."),
            durationRow("la-linea-de-la-concepcion", "es", "A diez minutos andando, sin cruzar nada."),
            durationRow("san-roque", "es", "Campo de Gibraltar, más plazas de alojamiento."),
            durationRow("algeciras", "es", "El mejor punto peninsular, al otro lado de la bahía."),
          ],
        },
        {
          type: "p",
          text: `La diferencia entre Gibraltar y La Línea es de un par de segundos. Nadie en su sano juicio se juega una cola de frontera de duración desconocida por dos segundos. Así que la razón para cruzar tiene que ser otra: ver el eclipse desde el Peñón porque quieres verlo desde el Peñón, con esa silueta y esa vista de las dos orillas. Es una razón perfectamente buena. Solo hay que saber que es la razón.`,
        },
        { type: "h2", text: "Y una advertencia que solo aplica aquí" },
        {
          type: "p",
          text: `Si cruzas, no des por hecho que la cima es el mejor sitio. Con viento de levante, el Peñón fabrica su propia nube: el aire húmedo choca contra la cara este, asciende, condensa y forma un capuchón estacionario que corona la roca y se derrama por la ladera oeste, mientras el resto del cielo puede estar limpio. Con levante en la predicción, baja a Europa Point o quédate al nivel del mar. La totalidad es la misma y el cielo, probablemente, mejor.`,
        },
      ],
    }),
    en: (city) => ({
      title: "Crossing into Gibraltar on eclipse day: the border, the queue, and whether it is worth it",
      shortTitle: "Crossing the border",
      description: `How to cross into Gibraltar for the 2 August 2027 eclipse, how long the border queue could run, and why La Línea sees practically the same totality.`,
      body: [
        {
          type: "p",
          text: `Gibraltar sees ${formatDuration(city.eclipse.totalitySeconds, "en")} of totality on 2 August 2027, with second contact at ${city.localTimes.totalityStart}. It is an excellent location and the only point in the entire path you enter through a border control. That detail, a minor nuisance for the rest of the year, is on eclipse day the variable that can cost you the whole trip.`,
        },
        { type: "h2", text: "The queue" },
        {
          type: "p",
          text: `On an ordinary August day the queue into Gibraltar already runs to tens of minutes, and at its worst beyond an hour. Now add a total eclipse with thousands of people wanting to cross within the same morning window, because everyone shares the same deadline: ${city.localTimes.totalityStart}. Totality does not wait, and you cannot skip a border queue.`,
        },
        {
          type: "callout",
          title: "The only reliable way to be inside",
          text: "Cross the day before and sleep on the Rock, or cross first thing on the morning of the 2nd with a huge margin. Leaving La Línea mid-morning and expecting to make it is not a plan, it is a bet.",
        },
        { type: "h2", text: "On foot, not by car" },
        {
          type: "ul",
          items: [
            "Gibraltar is tiny and parking is scarce even on a Tuesday in February. Leave the car in La Línea and walk across: that is what everyone who knows how this works does.",
            "The pedestrian crossing runs across the airport runway and closes for every flight movement. Road traffic now uses the tunnel beneath it, but on foot you have to budget for that wait.",
            "Once inside, the local bus network and the sheer size of the place mean you need no vehicle at all.",
          ],
        },
        { type: "h2", text: "Documents, currency and the clock" },
        {
          type: "ul",
          items: [
            "Carry valid documentation, and check the requirements shortly before you travel: crossing conditions may change before 2027 under the EU–UK treaty on Gibraltar. What you read a year ago may no longer hold.",
            "The currency is the Gibraltar pound. Euros are taken almost everywhere, at a rate you will not enjoy.",
            "Gibraltar does not run on UK time: it runs on the same clock as Spain. Every timing on this site is already Rock time, with no conversion needed.",
          ],
        },
        { type: "h2", text: "The awkward question: is crossing worth it?" },
        {
          type: "p",
          text: `If your only criterion is the length of totality, the answer is no, by a margin that leaves no room for argument:`,
        },
        {
          type: "table",
          head: durationHead.en,
          rows: [
            durationRow("gibraltar", "en", "With a border, capacity limits and the Rock's own cloud."),
            durationRow("la-linea-de-la-concepcion", "en", "A ten-minute walk away, crossing nothing."),
            durationRow("san-roque", "en", "Campo de Gibraltar, more accommodation."),
            durationRow("algeciras", "en", "The best mainland spot, across the bay."),
          ],
        },
        {
          type: "p",
          text: `The gap between Gibraltar and La Línea is a couple of seconds. Nobody in their right mind gambles an open-ended border queue on two seconds. So the reason to cross has to be a different one: watching the eclipse from the Rock because you want to watch it from the Rock, with that silhouette and that view of both shores. That is a perfectly good reason. You just need to know it is the reason.`,
        },
        { type: "h2", text: "And a warning that applies only here" },
        {
          type: "p",
          text: `If you do cross, do not assume the summit is the best spot. With an easterly levante, the Rock manufactures its own cloud: humid air hits the eastern face, rises, condenses and forms a stationary cap that crowns the ridge and spills down the western slope while the rest of the sky may be clear. If the forecast calls levante, go down to Europa Point or stay at sea level. Totality is identical and the sky is probably better.`,
        },
      ],
    }),
  },
};

/** Todas las guías exclusivas, en el orden en que se registran. */
export const LOCAL_ARTICLES: Article[] = [ferry, bordeDeLaFranja, levante, frontera];
