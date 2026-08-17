import { ECLIPSE_DAY, durationWords, hm } from "../helpers";
import type { BlogPost } from "../types";

const PUBLISHED = "2026-08-17";

/**
 * Dónde verlo. El post con más intención de búsqueda de toda la sección.
 *
 * Va por zonas y no por puntos concretos a propósito. Señalar un rincón pequeño y
 * bonito que después no soporte la afluencia sería un flaco favor a quien nos lee y
 * al propio sitio, y los puntos habilitados oficialmente los publicará la ciudad.
 */
export const dondeVerCeuta: BlogPost = {
  slug: "donde-ver-el-eclipse-en-ceuta",
  citySlug: "ceuta",
  category: "observacion",
  published: PUBLISHED,
  cover: "viewpoints-map",
  related: [
    "hacia-donde-mirar-la-posicion-del-sol-en-ceuta",
    "la-sombra-de-la-luna-sobre-el-estrecho",
    "movilidad-y-atascos-el-dia-del-eclipse-en-ceuta",
  ],
  content: {
    es: (city) => ({
      title: `Dónde ver el eclipse en ${city.name}: cinco zonas y cómo elegir`,
      description: `Las zonas de ${city.name} con mejor horizonte para el eclipse total del 2 de agosto de 2027: el Monte Hacho, las playas del norte, las murallas, la costa sur y Benzú. Qué gana y qué pierde cada una.`,
      lead: `${city.name} entra entera en la franja de totalidad, así que el eclipse se verá desde cualquier punto del municipio con el cielo despejado. Lo que cambia de un sitio a otro no es si lo ves, sino qué más ves: la sombra llegando por el mar, el horizonte de 360°, y si sales de allí en veinte minutos o en dos horas.`,
      body: [
        {
          type: "p",
          text: `Empecemos por lo que no importa. En ${city.name} el Sol estará a unos ${city.eclipse.sunAltitudeDeg.toFixed(0)}° sobre el horizonte, hacia el ${city.eclipse.sunAzimuthDeg.toFixed(0)}° de azimut. A esa altura no hay edificio ni monte que lo tape: no hace falta buscar un sitio «con vistas al Sol». Tampoco importa la altitud para la duración —los ${durationWords(city, "es")} de totalidad son los mismos arriba y abajo— ni acercarse unos metros a la línea central.`,
        },
        {
          type: "p",
          text: `Lo que sí importa es el entorno: horizonte abierto hacia poniente para ver llegar la sombra, espacio para la gente que va a haber, sombra y agua para la hora larga de espera, y una salida que no sea un embudo.`,
        },
        {
          type: "figure",
          art: "viewpoints-map",
          caption: `Las cinco zonas de ${city.name} con mejores condiciones. Es un esquema orientativo: los puntos habilitados oficialmente los publicará la ciudad más cerca de la fecha.`,
        },
        {
          type: "figure",
          art: "sun-position",
          caption:
            "Con el Sol a esta altura y en esta dirección, elegir sitio deja de ser una cuestión de ver el Sol y pasa a ser una cuestión de entorno.",
        },
        { type: "h2", text: "1. El Monte Hacho y el mirador de San Antonio" },
        {
          type: "p",
          text: `Es la opción de altura: unos 200 metros en el extremo de la península de la Almina, con vistas al Estrecho, a la costa peninsular y al Mediterráneo. Gana en horizonte y gana si amanece con nube baja pegada al agua, porque a esa cota es probable quedar por encima. Pierde en aforo y en accesos: la carretera de subida es estrecha y ese día va a haber mucho más tráfico del que admite. La fortaleza del Hacho es zona militar y no es un mirador público; el entorno de la ermita de San Antonio sí es accesible. Si eliges esta zona, sube muy temprano y cuenta con bajar andando o esperar.`,
        },
        { type: "h2", text: "2. Las playas del norte y el frente marítimo" },
        {
          type: "p",
          text: `El frente que mira al Estrecho es la mejor apuesta para ver llegar la umbra sobre el agua, que es la ventaja específica de estar aquí. Hay espacio, hay salida por varios sitios y se puede llegar andando desde el centro, lo que ahorra el problema del aparcamiento. Lo que hay que vigilar es la sombra —de la que no habrá— y la marea de gente en los accesos más cómodos.`,
        },
        { type: "h2", text: "3. Las Murallas Reales y el Foso de San Felipe" },
        {
          type: "p",
          text: `Es la opción urbana y la más fotogénica: un foso navegable —el único de España— y un conjunto defensivo del siglo XVI en pleno centro. Como punto de observación tiene el horizonte más recortado de las cinco zonas, pero compensa en otra cosa: es donde una foto del eclipse identifica a ${city.name} sin necesidad de leyenda. Está a un paso de todo, así que resuelve el problema de la espera con bares y sombra a mano.`,
        },
        { type: "h2", text: "4. La costa sur de la Almina y el Parque Marítimo" },
        {
          type: "p",
          text: `La fachada mediterránea, con el Parque Marítimo del Mediterráneo —el conjunto de lagos y piscinas diseñado por César Manrique— como centro. Horizonte marino amplio hacia el este y el sur, servicios, sombra y sitio donde sentarse. No es la mejor zona para ver llegar la sombra, que viene de poniente, pero sí una de las más cómodas para pasar la hora de eclipse parcial con niños o con familia.`,
        },
        { type: "h2", text: "5. Benzú y el extremo noroeste" },
        {
          type: "p",
          text: `El rincón más tranquilo y con más horizonte hacia poniente, en el límite noroeste del término, frente al Estrecho y con el macizo marroquí de la Mujer Muerta enfrente. Es la zona con menos afluencia previsible y el mejor cuadrante oeste. A cambio, casi no hay servicios y la carretera de acceso es única: en el peor escenario, la salida es lenta. Vale la pena si vas con todo lo necesario y con la intención de no moverte hasta media tarde.`,
        },
        {
          type: "callout",
          title: "Lo que ninguna guía puede decirte todavía",
          text: `A un año del eclipse, no hay puntos de observación habilitados ni aforos publicados. Cuando el ayuntamiento y las agrupaciones astronómicas confirmen los suyos, los publicaremos aquí. Preferimos no señalar de antemano rincones pequeños que no soportarían la afluencia: sería el modo más rápido de estropear justo el sitio que recomendamos.`,
        },
        { type: "h2", text: "La regla que resuelve la decisión" },
        {
          type: "ul",
          items: [
            "Si vienes de fuera y no conoces la ciudad: frente marítimo norte, andando desde el centro. Buen horizonte, salida fácil, cero riesgo.",
            "Si te importa la fotografía con contexto: murallas o Parque Marítimo.",
            "Si te da miedo la nube baja: Hacho, subiendo muy temprano.",
            "Si buscas tranquilidad y te organizas: Benzú.",
            "Si vas con niños: costa sur y Parque Marítimo, por sombra y servicios.",
          ],
        },
        {
          type: "p",
          text: `Y la más importante: **elige un sitio cómodo y quédate ahí**. Perseguir el punto perfecto el día del eclipse es la forma más habitual de perdérselo.`,
        },
      ],
      faq: [
        {
          q: `¿Se ve el eclipse total desde toda ${city.name}?`,
          a: `Sí. ${city.name} está completamente dentro de la franja de totalidad, así que la totalidad se ve desde cualquier punto del municipio con cielo despejado, con ${durationWords(city, "es")} de duración y sin diferencias apreciables entre barrios.`,
        },
        {
          q: "¿Hace falta subir al Monte Hacho para verlo mejor?",
          a: "No para la duración, que es la misma a cualquier altitud. La altura solo ayuda en dos cosas: quedar por encima de una posible capa de nube baja y ganar horizonte. A cambio, el acceso es estrecho y el aforo limitado.",
        },
        {
          q: "¿Hay puntos de observación oficiales en Ceuta para el eclipse?",
          a: "Todavía no. A esta distancia de la fecha no hay puntos habilitados ni aforos publicados. Cuando la ciudad y las agrupaciones astronómicas los confirmen, aparecerán en esta guía.",
        },
        {
          q: "¿Cuál es el mejor sitio para ver llegar la sombra?",
          a: "Cualquiera con horizonte abierto hacia el oeste y el noroeste, sobre el agua: el frente marítimo norte y la zona de Benzú son las mejores. La sombra viene del Atlántico, así que hay que dar la espalda al Sol para verla llegar.",
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: `Where to watch the eclipse in ${name}: five areas and how to choose`,
        description: `The areas of ${name} with the best horizons for the total eclipse of 2 August 2027: Monte Hacho, the northern seafront, the walls, the southern coast and Benzú. What each one gains and loses.`,
        lead: `The whole of ${name} lies inside the path of totality, so the eclipse will be visible from anywhere in the city with a clear sky. What changes from spot to spot is not whether you see it but what else you see: the shadow arriving over the sea, the 360° horizon, and whether you get out in twenty minutes or two hours.`,
        body: [
          {
            type: "p",
            text: `Start with what does not matter. In ${name} the Sun will sit about ${city.eclipse.sunAltitudeDeg.toFixed(0)}° above the horizon at an azimuth of roughly ${city.eclipse.sunAzimuthDeg.toFixed(0)}°. At that height no building or hill is going to block it: you do not need a spot "with a view of the Sun". Altitude does not change duration either — the ${durationWords(city, "en")} of totality are the same high or low — and neither does moving a few metres closer to the centreline.`,
          },
          {
            type: "p",
            text: `What does matter is the surroundings: an open horizon to the west so you can watch the shadow arrive, room for the crowd there will be, shade and water for the hour of waiting, and an exit that is not a funnel.`,
          },
          {
            type: "figure",
            art: "viewpoints-map",
            caption: `The five areas of ${name} with the best conditions. It is an indicative diagram: officially designated viewing points will be published by the city closer to the date.`,
          },
          {
          type: "figure",
          art: "sun-position",
          caption:
            "With the Sun at this altitude and in this direction, choosing a spot stops being about seeing the Sun and becomes about the surroundings.",
        },
        { type: "h2", text: "1. Monte Hacho and the San Antonio viewpoint" },
          {
            type: "p",
            text: `This is the high option: around 200 metres at the tip of the Almina peninsula, looking out over the Strait, the Spanish coast and the Mediterranean. It wins on horizon, and it wins if the morning brings low cloud on the water, because at that height you will probably be above it. It loses on capacity and access: the road up is narrow and there will be far more traffic that day than it takes. The Hacho fortress is a military zone and not a public viewpoint; the area around the San Antonio chapel is accessible. If you choose here, go up very early and be ready to walk down or wait.`,
          },
          { type: "h2", text: "2. The northern beaches and seafront" },
          {
            type: "p",
            text: `The front facing the Strait is the best bet for watching the umbra arrive over the water, which is the specific advantage of being here. There is space, there are several ways out, and you can walk from the centre, which removes the parking problem altogether. What to watch for is shade — of which there will be none — and the crush at the easiest access points.`,
          },
          { type: "h2", text: "3. The Royal Walls and the San Felipe moat" },
          {
            type: "p",
            text: `The urban option, and the most photogenic: a navigable moat — the only one in Spain — and a 16th-century defensive complex in the middle of town. As an observing spot it has the most cluttered horizon of the five, but it makes up for it elsewhere: this is where a photograph of the eclipse identifies ${name} without a caption. It is a step from everything, so the hour of waiting comes with bars and shade to hand.`,
          },
          { type: "h2", text: "4. The southern Almina coast and the Maritime Park" },
          {
            type: "p",
            text: `The Mediterranean side, centred on the Parque Marítimo del Mediterráneo — the complex of lakes and pools designed by César Manrique. Wide sea horizon to the east and south, plus services, shade and somewhere to sit. It is not the best area for watching the shadow arrive, which comes from the west, but it is one of the most comfortable places to spend the partial phase with children or family.`,
          },
          { type: "h2", text: "5. Benzú and the northwestern tip" },
          {
            type: "p",
            text: `The quietest corner and the one with most horizon to the west, at the northwestern limit of the territory, facing the Strait with the Moroccan massif opposite. It is the area with the least expected footfall and the best western quadrant. In exchange there are almost no services and a single access road: worst case, getting out is slow. Worth it if you arrive self-sufficient and intend not to move until mid-afternoon.`,
          },
          {
            type: "callout",
            title: "What no guide can tell you yet",
            text: `A year out from the eclipse there are no designated viewing points and no published capacities. When the city council and the astronomy groups confirm theirs, we will publish them here. We would rather not name small corners in advance that could not take the numbers: it would be the fastest way to ruin the very spot we recommended.`,
          },
          { type: "h2", text: "The rule that settles it" },
          {
            type: "ul",
            items: [
              "Coming from outside and do not know the city: the northern seafront, on foot from the centre. Good horizon, easy exit, no risk.",
              "Care about a photograph with context: the walls or the Maritime Park.",
              "Worried about low cloud: Hacho, going up very early.",
              "Want quiet and can organise yourself: Benzú.",
              "With children: the southern coast and Maritime Park, for shade and services.",
            ],
          },
          {
            type: "p",
            text: `And the most important one: **pick somewhere comfortable and stay there**. Chasing the perfect spot on eclipse day is the most common way to miss it.`,
          },
        ],
        faq: [
          {
            q: `Is the total eclipse visible from all of ${name}?`,
            a: `Yes. ${name} lies entirely within the path of totality, so totality is visible from anywhere in the city with a clear sky, lasting ${durationWords(city, "en")} with no meaningful difference between neighbourhoods.`,
          },
          {
            q: "Do I need to go up Monte Hacho to see it better?",
            a: "Not for duration, which is identical at any altitude. Height helps with two things only: getting above a possible layer of low cloud, and gaining horizon. In exchange, access is narrow and capacity limited.",
          },
          {
            q: "Are there official viewing points in Ceuta for the eclipse?",
            a: "Not yet. This far out there are no designated points and no published capacities. When the city and the astronomy groups confirm them, they will appear in this guide.",
          },
          {
            q: "Where is the best place to watch the shadow arrive?",
            a: "Anywhere with an open horizon to the west and northwest over water: the northern seafront and the Benzú area are the best. The shadow comes in off the Atlantic, so you have to turn your back on the Sun to see it arrive.",
          },
        ],
      };
    },
  },
};

/** El plan del día. Es el post que la gente guarda y consulta el 2 de agosto. */
export const planDelDia: BlogPost = {
  slug: "plan-hora-a-hora-del-dia-del-eclipse-en-ceuta",
  citySlug: "ceuta",
  category: "observacion",
  published: PUBLISHED,
  cover: "day-plan",
  related: [
    "los-cinco-contactos-del-eclipse-explicados",
    "donde-ver-el-eclipse-en-ceuta",
    "movilidad-y-atascos-el-dia-del-eclipse-en-ceuta",
  ],
  content: {
    es: (city) => ({
      title: `El día del eclipse en ${city.name}, hora a hora`,
      description: `Qué hacer el 2 de agosto de 2027 en ${city.name}, desde el desayuno hasta el atasco de la tarde, con las horas exactas de cada fase del eclipse y qué llevar encima.`,
      lead: `El eclipse en ${city.name} empieza a las ${hm(city.localTimes.partialStart)} y termina a las ${hm(city.localTimes.partialEnd)}, pero el día del eclipse empieza mucho antes y acaba bastante después. Éste es el plan completo, con lo que suele salir mal en cada tramo.`,
      body: [
        {
          type: "p",
          text: `El ${ECLIPSE_DAY.es} es lunes, lo que en la práctica significa un fin de semana largo de gente llegando. La totalidad ocurre a media mañana, así que no hay que madrugar de forma heroica: hay que llegar con margen, que es distinto.`,
        },
        {
          type: "figure",
          art: "day-plan",
          caption: `Las horas de las fases están calculadas para ${city.name} y son hora local peninsular. Las de logística son recomendaciones, no datos.`,
        },
        { type: "h2", text: "La noche anterior" },
        {
          type: "ul",
          items: [
            "Deja el equipaje hecho y el depósito lleno si vas a moverte. Si la predicción cambia de madrugada, quieres poder salir sin pensar.",
            "Carga todo: móvil, batería externa, cámara, baterías de repuesto.",
            "Comprueba las gafas de eclipse a la luz de una bombilla potente: si ves algo que no sea el filamento, están dañadas y no sirven.",
            "Mira la predicción de AEMET, no una app genérica. En el Estrecho los microclimas rompen los modelos globales.",
            "Acuerda un punto de encuentro con tu grupo. La cobertura móvil se saturará con miles de personas en el mismo sitio.",
          ],
        },
        { type: "h2", text: "08:00 – 09:00 · Desayuna y sal" },
        {
          type: "p",
          text: `Come antes de salir. En el punto de observación va a haber cola en todo lo que tenga mostrador, y estar tres horas al sol de agosto sin haber desayunado bien es una mala idea. Sal con al menos dos litros de agua por persona, gorra, crema solar y algo de comida.`,
        },
        { type: "h2", text: `09:00 – ${hm(city.localTimes.partialStart)} · Coloca el sitio` },
        {
          type: "p",
          text: `Llega al punto elegido con una hora de margen sobre el inicio del parcial. No es para «coger sitio» en el mejor mirador: es para no estar aparcando cuando el eclipse ya haya empezado. Busca sombra, o llévala. Localiza el baño más cercano. Y orientate: el Sol estará al este-sureste, y la sombra vendrá del oeste.`,
        },
        { type: "h2", text: `${hm(city.localTimes.partialStart)} · C1, empieza el eclipse` },
        {
          type: "p",
          text: `Filtro puesto. Durante la primera media hora no se nota nada a simple vista, y ése es el momento perfecto para montar la cámara si vas a fotografiar, para probar la proyección con un colador si hay niños, y para explicarle a todo el mundo qué va a pasar en C2 y en C3.`,
        },
        { type: "h2", text: `${hm(city.localTimes.totalityStart)} · C2, filtro fuera` },
        {
          type: "p",
          text: `Un minuto antes, mira al oeste: la sombra llega por el mar. Cuando el disco esté completamente tapado, quítate el filtro. Tienes ${durationWords(city, "es")}: no los gastes todos detrás de una pantalla. Mira la corona a simple vista, mira el horizonte de 360°, mira a la gente.`,
        },
        {
          type: "callout",
          title: `${hm(city.localTimes.totalityEnd)} · C3: el momento crítico`,
          text: `Al primer destello de Sol, filtro puesto, sin esperar a que moleste. El ojo está adaptado a la oscuridad y el reflejo de aparta no llega a tiempo. No es una recomendación prudente: es el único momento del día en que se puede hacer daño de verdad.`,
        },
        { type: "h2", text: `${hm(city.localTimes.partialEnd)} · C4 y después` },
        {
          type: "p",
          text: `El eclipse termina, y empieza la otra mitad del día. **No te vayas inmediatamente.** Miles de personas van a intentar salir a la vez del mismo sitio y, si estás pensando en coger un ferry, la cola del puerto será el recuerdo menos agradable del viaje. Come tranquilo, busca sombra y sal a media tarde. Si tienes barco reservado, cuenta con llegar al puerto con mucha más antelación de la habitual.`,
        },
        {
          type: "figure",
          art: "contacts-timeline",
          caption:
            "Los cinco momentos que marcan el día. El único tramo naranja es el que permite mirar sin filtro.",
        },
        { type: "h2", text: "La mochila, en una lista" },
        {
          type: "ul",
          items: [
            "Gafas de eclipse certificadas, una por persona, más una de repuesto",
            "Dos litros de agua por persona, y algo de sal (fruta, frutos secos)",
            "Gorra, crema solar y algo con lo que hacer sombra",
            "Batería externa cargada",
            "Un colador o una caja de zapatos si hay niños",
            "Efectivo: con la red saturada, los pagos con tarjeta fallan",
            "Una silla plegable o una esterilla, que se agradece a la tercera hora",
          ],
        },
      ],
      faq: [
        {
          q: `¿A qué hora es el eclipse en ${city.name}?`,
          a: `El eclipse parcial empieza a las ${hm(city.localTimes.partialStart)} y termina a las ${hm(city.localTimes.partialEnd)}. La totalidad va de las ${hm(city.localTimes.totalityStart)} a las ${hm(city.localTimes.totalityEnd)}, con el máximo a las ${hm(city.localTimes.maximum)}. Todas son hora local de ${city.name}, que es la misma que la de la España peninsular.`,
        },
        {
          q: "¿A qué hora conviene llegar al punto de observación?",
          a: `Con al menos una hora de margen sobre el inicio del parcial, es decir alrededor de las ${hm(city.localTimes.partialStart)} menos una hora. No es para coger sitio, es para no estar buscando aparcamiento cuando el eclipse ya haya empezado.`,
        },
        {
          q: "¿Cuánto dura todo el eclipse?",
          a: `Algo más de dos horas y media desde el primer contacto hasta el último, de las que ${durationWords(city, "es")} son de totalidad.`,
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: `Eclipse day in ${name}, hour by hour`,
        description: `What to do on 2 August 2027 in ${name}, from breakfast to the afternoon traffic, with exact times for every phase of the eclipse and what to carry.`,
        lead: `The eclipse in ${name} begins at ${hm(city.localTimes.partialStart)} and ends at ${hm(city.localTimes.partialEnd)}, but eclipse day starts well before that and finishes well after. Here is the full plan, with what tends to go wrong at each stage.`,
        body: [
          {
            type: "p",
            text: `${ECLIPSE_DAY.en} is a Monday, which in practice means a long weekend of people arriving. Totality falls mid-morning, so there is no need for a heroic early start: what you need is margin, which is a different thing.`,
          },
          {
            type: "figure",
            art: "day-plan",
            caption: `Phase times are computed for ${name} and given in mainland Spanish local time. The logistics times are recommendations, not data.`,
          },
          { type: "h2", text: "The night before" },
          {
            type: "ul",
            items: [
              "Pack and fill the tank if you plan to move. If the forecast turns overnight, you want to be able to leave without thinking.",
              "Charge everything: phone, power bank, camera, spare batteries.",
              "Check your eclipse glasses against a bright bulb: if you can see anything other than the filament, they are damaged and unusable.",
              "Read AEMET, the Spanish met office, rather than a generic app. Microclimates around the Strait break global models.",
              "Agree a meeting point with your group. Mobile coverage will saturate with thousands of people in one place.",
            ],
          },
          { type: "h2", text: "08:00 – 09:00 · Eat, then leave" },
          {
            type: "p",
            text: `Eat before you go. Anything with a counter will have a queue at the viewing spot, and spending three hours in August sun on an empty stomach is a bad idea. Leave with at least two litres of water per person, a hat, sunscreen and some food.`,
          },
          { type: "h2", text: `09:00 – ${hm(city.localTimes.partialStart)} · Set up` },
          {
            type: "p",
            text: `Get to your chosen spot an hour before the partial phase starts. It is not about claiming the best viewpoint: it is about not still be parking when the eclipse has already begun. Find shade, or bring it. Locate the nearest toilet. And orient yourself: the Sun will be east-southeast, and the shadow will come from the west.`,
          },
          { type: "h2", text: `${hm(city.localTimes.partialStart)} · C1, the eclipse begins` },
          {
            type: "p",
            text: `Filter on. For the first half hour nothing is visible to the naked eye, which makes it the perfect moment to set up a camera if you are shooting, to try projecting with a colander if there are children, and to explain to everyone what will happen at C2 and C3.`,
          },
          { type: "h2", text: `${hm(city.localTimes.totalityStart)} · C2, filter off` },
          {
            type: "p",
            text: `A minute before, look west: the shadow arrives over the sea. Once the disc is fully covered, take the filter off. You have ${durationWords(city, "en")}: do not spend all of them behind a screen. Look at the corona with your own eyes, look at the 360° horizon, look at the people around you.`,
          },
          {
            type: "callout",
            title: `${hm(city.localTimes.totalityEnd)} · C3: the critical moment`,
            text: `At the first flash of Sun, filter on, without waiting for it to become uncomfortable. Your eye is dark-adapted and the blink reflex arrives too late. This is not cautious advice: it is the only moment of the day when real harm is possible.`,
          },
          { type: "h2", text: `${hm(city.localTimes.partialEnd)} · C4 and after` },
          {
            type: "p",
            text: `The eclipse ends, and the other half of the day begins. **Do not leave immediately.** Thousands of people will try to get out of the same place at once and, if you are counting on a ferry, the queue at the port will be the least pleasant memory of the trip. Eat unhurriedly, find shade and leave mid-afternoon. If you have a boat booked, plan on reaching the port far earlier than usual.`,
          },
          {
          type: "figure",
          art: "contacts-timeline",
          caption:
            "The five moments that structure the day. The single orange stretch is the one you may watch unfiltered.",
        },
        { type: "h2", text: "The bag, as a list" },
          {
            type: "ul",
            items: [
              "Certified eclipse glasses, one per person, plus a spare",
              "Two litres of water per person, and something salty (fruit, nuts)",
              "Hat, sunscreen and something to make shade with",
              "A charged power bank",
              "A colander or a shoebox if there are children",
              "Cash: with the network saturated, card payments fail",
              "A folding chair or a mat, which you will thank yourself for by hour three",
            ],
          },
        ],
        faq: [
          {
            q: `What time is the eclipse in ${name}?`,
            a: `The partial eclipse starts at ${hm(city.localTimes.partialStart)} and ends at ${hm(city.localTimes.partialEnd)}. Totality runs from ${hm(city.localTimes.totalityStart)} to ${hm(city.localTimes.totalityEnd)}, with maximum at ${hm(city.localTimes.maximum)}. All times are local to ${name}, which keeps the same clock as mainland Spain.`,
          },
          {
            q: "What time should I arrive at my viewing spot?",
            a: `At least an hour before the partial phase begins. It is not about claiming a place, it is about not hunting for parking once the eclipse has started.`,
          },
          {
            q: "How long does the whole eclipse last?",
            a: `A little over two and a half hours from first contact to last, of which ${durationWords(city, "en")} are totality.`,
          },
        ],
      };
    },
  },
};

/** Orientación: el post que resuelve "¿por dónde saldrá?" con datos calculados. */
export const haciaDondeMirar: BlogPost = {
  slug: "hacia-donde-mirar-la-posicion-del-sol-en-ceuta",
  citySlug: "ceuta",
  category: "observacion",
  published: PUBLISHED,
  cover: "sun-position",
  related: [
    "donde-ver-el-eclipse-en-ceuta",
    "la-sombra-de-la-luna-sobre-el-estrecho",
    "fotografiar-el-eclipse-en-ceuta",
  ],
  content: {
    es: (city) => ({
      title: `Hacia dónde mirar: dónde estará el Sol durante el eclipse en ${city.name}`,
      description: `En el máximo del eclipse el Sol estará a ${city.eclipse.sunAltitudeDeg.toFixed(0)}° de altura y ${city.eclipse.sunAzimuthDeg.toFixed(0)}° de azimut desde ${city.name}: al este-sureste y alto. Qué implica para elegir sitio y para encuadrar.`,
      lead: `Desde ${city.name}, en el máximo del eclipse el Sol estará a unos ${city.eclipse.sunAltitudeDeg.toFixed(0)}° sobre el horizonte y hacia el ${city.eclipse.sunAzimuthDeg.toFixed(0)}° de azimut, es decir al este-sureste. A buena altura y sin obstáculos: es una de las mejores geometrías posibles, y simplifica mucho la elección de sitio.`,
      body: [
        {
          type: "p",
          text: `«Altura» es cuántos grados por encima del horizonte está el Sol: 0° es el horizonte, 90° el cenit. «Azimut» es la dirección en el plano, contada desde el norte hacia el este: 90° es este exacto, 180° sur. Con esos dos números se sabe exactamente dónde apuntar sin necesidad de mapas.`,
        },
        {
          type: "figure",
          art: "sun-position",
          caption: `Altura y azimut del Sol en el instante del máximo, calculados para las coordenadas de ${city.name} (${city.lat.toFixed(4)}, ${city.lon.toFixed(4)}).`,
        },
        { type: "h2", text: "Por qué esta geometría es buena noticia" },
        {
          type: "p",
          text: `Muchos eclipses ocurren con el Sol bajo, y entonces encontrar un horizonte limpio en la dirección exacta se convierte en la mitad del problema: una colina, un bloque de pisos o una capa de bruma pegada al horizonte pueden arruinar la observación. Con el Sol a ${city.eclipse.sunAltitudeDeg.toFixed(0)}° eso desaparece. Basta con no estar dentro de un patio: desde una calle ancha, una playa, un mirador o casi cualquier azotea se ve.`,
        },
        {
          type: "p",
          text: `También significa que la bruma no es un problema. El grosor de atmósfera que atraviesa la luz solar a esa altura es muy inferior al que atraviesa cerca del horizonte, así que la corona se verá con más contraste y las fotos saldrán más limpias.`,
        },
        { type: "h2", text: "Lo que sí cambia con la altura del Sol" },
        {
          type: "ul",
          items: [
            "Sombra. Un Sol alto significa poca sombra natural durante la hora larga de espera. Es el factor que más se subestima en agosto: hay que llevar sombra o elegir un sitio que la tenga.",
            "Encuadre. Con el Sol a esa altura no cabe en la misma foto que el paisaje sin un gran angular muy generoso. Quien quiera «eclipse sobre las murallas» tiene que planear una composición vertical o resignarse a dos fotos distintas.",
            `Cuello. Cuatro minutos con la cabeza levantada ${city.eclipse.sunAltitudeDeg.toFixed(0)}° es más incómodo de lo que parece. Una tumbona o una esterilla en el suelo se agradece.`,
          ],
        },
        {
          type: "callout",
          title: "Cómo comprobarlo tú mismo, sin apps",
          text: `El Sol pasa por la misma posición del cielo aproximadamente el mismo día de cada año. Sal el 2 de agosto de 2026, o cualquier día de principios de agosto, a la hora del máximo —las ${hm(city.localTimes.maximum)}— y mira: ahí estará el eclipse el año que viene. Es el mejor ensayo posible del punto de observación, y no hace falta más que un reloj.`,
        },
        {
          type: "figure",
          art: "shadow-sea",
          caption:
            "La asimetría del día: el Sol está al este-sureste, pero la sombra llega del oeste. Las dos direcciones importan.",
        },
        { type: "h2", text: "Al este-sureste: qué hay en esa dirección" },
        {
          type: "p",
          text: `Desde ${city.name}, el este-sureste apunta hacia el Mediterráneo, por encima de la península de la Almina si estás en la parte occidental de la ciudad. Es decir: la mayoría de los puntos de la ciudad tienen esa dirección despejada, y quien esté en la costa sur tendrá el Sol directamente sobre el mar. Nada de esto es limitante a ${city.eclipse.sunAltitudeDeg.toFixed(0)}° de altura, pero conviene saberlo si se busca una composición concreta.`,
        },
        {
          type: "p",
          text: `Y recuerda la asimetría del día: **el Sol está al este-sureste, pero la sombra llega del oeste.** Son dos direcciones opuestas, y las dos merecen atención en el minuto anterior a la totalidad.`,
        },
      ],
      faq: [
        {
          q: `¿A qué altura estará el Sol durante el eclipse en ${city.name}?`,
          a: `A unos ${city.eclipse.sunAltitudeDeg.toFixed(1)}° sobre el horizonte en el instante del máximo, con un azimut de ${city.eclipse.sunAzimuthDeg.toFixed(0)}° (este-sureste). Es una altura cómoda: prácticamente ningún obstáculo urbano o natural se interpone.`,
        },
        {
          q: "¿Hacia dónde tengo que mirar para ver el eclipse?",
          a: `Al este-sureste y a media altura, unos ${city.eclipse.sunAltitudeDeg.toFixed(0)}° sobre el horizonte. En el minuto anterior a la totalidad, además, merece la pena mirar al oeste: por ahí llega la sombra de la Luna.`,
        },
        {
          q: "¿Puedo ensayar la posición antes del día del eclipse?",
          a: `Sí, y es lo más útil que puedes hacer. A principios de agosto de cualquier año, a la hora del máximo (${hm(city.localTimes.maximum)}), el Sol está prácticamente en la misma posición del cielo. Vete a tu punto de observación ese día y compruébalo.`,
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: `Where to look: the Sun's position during the eclipse in ${name}`,
        description: `At maximum eclipse the Sun will be ${city.eclipse.sunAltitudeDeg.toFixed(0)}° high at an azimuth of ${city.eclipse.sunAzimuthDeg.toFixed(0)}° from ${name}: east-southeast and high. What that means for choosing a spot and for framing a shot.`,
        lead: `From ${name}, at maximum eclipse the Sun will sit about ${city.eclipse.sunAltitudeDeg.toFixed(0)}° above the horizon at an azimuth of roughly ${city.eclipse.sunAzimuthDeg.toFixed(0)}° — east-southeast. Comfortably high and unobstructed: one of the best possible geometries, and it simplifies choosing a spot enormously.`,
        body: [
          {
            type: "p",
            text: `"Altitude" is how many degrees above the horizon the Sun sits: 0° is the horizon, 90° the zenith. "Azimuth" is the compass direction, counted from north towards east: 90° is due east, 180° south. Those two numbers tell you exactly where to point, no map required.`,
          },
          {
            type: "figure",
            art: "sun-position",
            caption: `Altitude and azimuth of the Sun at the instant of maximum, computed for the coordinates of ${name} (${city.lat.toFixed(4)}, ${city.lon.toFixed(4)}).`,
          },
          { type: "h2", text: "Why this geometry is good news" },
          {
            type: "p",
            text: `Many eclipses happen with a low Sun, and then finding a clean horizon in exactly the right direction becomes half the problem: one hill, one apartment block or a band of haze on the horizon can ruin the view. With the Sun at ${city.eclipse.sunAltitudeDeg.toFixed(0)}° that disappears. As long as you are not standing in a courtyard — a wide street, a beach, a viewpoint or almost any rooftop will do.`,
          },
          {
            type: "p",
            text: `It also means haze is not an issue. The thickness of atmosphere sunlight crosses at that altitude is far less than near the horizon, so the corona will show more contrast and photographs will come out cleaner.`,
          },
          { type: "h2", text: "What a high Sun does change" },
          {
            type: "ul",
            items: [
              "Shade. A high Sun means little natural shade during the long wait. It is the most underestimated factor in August: bring shade or pick a spot that has some.",
              "Framing. At that altitude the Sun will not fit in the same frame as the landscape without a very generous wide angle. If you want 'eclipse over the walls', plan a vertical composition or accept two separate photographs.",
              `Your neck. Four minutes with your head tilted ${city.eclipse.sunAltitudeDeg.toFixed(0)}° up is less comfortable than it sounds. A lounger or a mat on the ground earns its place.`,
            ],
          },
          {
            type: "callout",
            title: "How to check it yourself, without an app",
            text: `The Sun passes through roughly the same place in the sky on the same date each year. Step outside on 2 August of any year, at the time of maximum — ${hm(city.localTimes.maximum)} — and look: that is where the eclipse will be. It is the best possible rehearsal of a viewing spot, and all it takes is a watch.`,
          },
          {
          type: "figure",
          art: "shadow-sea",
          caption:
            "The day's asymmetry: the Sun is east-southeast, but the shadow arrives from the west. Both directions matter.",
        },
        { type: "h2", text: "East-southeast: what lies that way" },
          {
            type: "p",
            text: `From ${name}, east-southeast points out over the Mediterranean, above the Almina peninsula if you are in the western part of the city. Which means most spots in town have that direction clear, and anyone on the southern coast will have the Sun directly over the sea. None of it is limiting at ${city.eclipse.sunAltitudeDeg.toFixed(0)}° of altitude, but it is worth knowing if you are after a particular composition.`,
          },
          {
            type: "p",
            text: `And remember the asymmetry of the day: **the Sun is east-southeast, but the shadow arrives from the west.** Two opposite directions, and both deserve attention in the minute before totality.`,
          },
        ],
        faq: [
          {
            q: `How high will the Sun be during the eclipse in ${name}?`,
            a: `About ${city.eclipse.sunAltitudeDeg.toFixed(1)}° above the horizon at the instant of maximum, at an azimuth of ${city.eclipse.sunAzimuthDeg.toFixed(0)}° (east-southeast). That is a comfortable altitude: virtually no urban or natural obstacle gets in the way.`,
          },
          {
            q: "Which way do I have to look to see the eclipse?",
            a: `East-southeast and at middling height, around ${city.eclipse.sunAltitudeDeg.toFixed(0)}° above the horizon. In the minute before totality it is also worth looking west: that is where the Moon's shadow arrives from.`,
          },
          {
            q: "Can I rehearse the position before eclipse day?",
            a: `Yes, and it is the most useful thing you can do. In early August of any year, at the time of maximum (${hm(city.localTimes.maximum)}), the Sun sits in practically the same place in the sky. Go to your chosen spot on that date and check.`,
          },
        ],
      };
    },
  },
};

/** El tiempo. El post que se releerá en la semana previa. */
export const levanteYTiempo: BlogPost = {
  slug: "el-levante-y-el-tiempo-el-dia-del-eclipse-en-ceuta",
  citySlug: "ceuta",
  category: "observacion",
  published: PUBLISHED,
  cover: "levante-cloud",
  related: [
    "donde-ver-el-eclipse-en-ceuta",
    "plan-hora-a-hora-del-dia-del-eclipse-en-ceuta",
    "que-se-ve-durante-la-totalidad-en-ceuta",
  ],
  content: {
    es: (city) => ({
      title: `¿Estará despejado en ${city.name} el día del eclipse? El factor levante`,
      description: `Agosto es el mes más despejado del año en el Estrecho, pero el levante puede pegar una capa de nube baja a la costa justo a media mañana. Qué vigilar y qué margen hay para moverse.`,
      lead: `La buena noticia: principios de agosto en el sur de España es una de las combinaciones de fecha y lugar más favorables del planeta para un eclipse. La mala: en el Estrecho existe el levante, y el levante trabaja precisamente a media mañana, que es cuando ocurre la totalidad.`,
      body: [
        {
          type: "p",
          text: `Conviene separar dos cosas que se confunden. La climatología de agosto en ${city.name} es excelente: es la época del año con menos nubosidad y prácticamente sin lluvia, y el Sol estará a unos ${city.eclipse.sunAltitudeDeg.toFixed(0)}° de altura, lo que elimina el problema de la bruma baja. La probabilidad de una tormenta que tape el eclipse es muy pequeña. Lo que no es despreciable es otra cosa, mucho más local.`,
        },
        { type: "h2", text: "El Estrecho tiene su propio tiempo" },
        {
          type: "p",
          text: `En la zona del Estrecho conviven dos regímenes de viento con efectos opuestos. El **levante** viene del este, empuja aire húmedo mediterráneo y, al forzarlo a subir contra la costa y las laderas, forma una capa de nubes bajas —a veces una simple lengua de estratos— que se pega al relieve y no se despega en horas. El **poniente**, atlántico y más fresco, suele dejar cielos limpios. En agosto los dos son habituales.`,
        },
        {
          type: "figure",
          art: "levante-cloud",
          caption:
            "Con levante, el aire húmedo del Mediterráneo se ve forzado a subir contra la costa y condensa en una capa baja. Con poniente, el cielo suele quedar limpio.",
        },
        {
          type: "p",
          text: `Esa capa baja es el escenario adverso realista de este eclipse en ${city.name}, y tiene dos características que conviene entender: es **poco profunda** —a menudo unos cientos de metros— y es **muy local**, capaz de tapar una ladera y dejar despejado un valle a cinco kilómetros. Las dos cosas son buenas noticias para quien tenga un plan.`,
        },
        { type: "h2", text: "Qué hacer con eso, en orden" },
        {
          type: "ol",
          items: [
            "No decidas el punto exacto hasta 24 o 48 horas antes. Antes de eso, ninguna predicción es fiable a este nivel de detalle.",
            "Sigue AEMET y no una app genérica. Los modelos globales resuelven mal los microclimas del Estrecho; el boletín de la Agencia Estatal de Meteorología, sí.",
            "Ten dos alternativas preparadas: una con altura y otra en otra orientación de la costa. Ganar 200 metros de cota suele bastar para quedar por encima de la capa.",
            "Duerme cerca de tus alternativas y con el coche listo, para poder moverte a primera hora si la predicción cambia de madrugada.",
            "Cuando amanezca, mira al cielo antes que al móvil. Una capa baja de levante se ve venir desde el suelo mejor que en cualquier mapa.",
          ],
        },
        {
          type: "callout",
          title: "Por qué no damos porcentajes",
          text: `Sería fácil escribir «un 85 % de probabilidad de cielo despejado» y quedaría muy bien. No lo hacemos porque no tenemos una serie climatológica oficial de ${city.name} que podamos citar, y en climatología un número inventado es peor que ningún número: la gente planifica un viaje de mil kilómetros con él. Cuando podamos citar la fuente, publicaremos la cifra y la fuente.`,
        },
        {
          type: "figure",
          art: "viewpoints-map",
          caption:
            "Costa norte, costa sur y 200 metros de cota en 19 km²: tres microclimas distintos sin salir de la franja de totalidad.",
        },
        { type: "h2", text: "La ventaja de estar en Ceuta si hay nube" },
        {
          type: "p",
          text: `${city.name} tiene una virtud poco obvia para este escenario: en 19 km² concentra costa norte, costa sur y una cota de 200 metros, todo a menos de veinte minutos en coche. Es decir, tres microclimas distintos dentro del mismo municipio y sin salir de la franja de totalidad. Muy pocos puntos del trazado ofrecen esa flexibilidad sin arriesgar un desplazamiento largo el mismo día.`,
        },
        { type: "h2", text: "Y si al final está nublado" },
        {
          type: "p",
          text: `No es el fin del mundo, aunque escueza. Incluso con el cielo cubierto la totalidad se nota mucho: la luz cae en picado hasta un crepúsculo profundo en cuestión de minutos, la temperatura baja varios grados, el viento cambia y los animales se comportan como al anochecer. No verás la corona, y eso es una pérdida real. Verás y sentirás todo lo demás.`,
        },
      ],
      faq: [
        {
          q: `¿Qué probabilidad hay de que esté despejado en ${city.name} el 2 de agosto de 2027?`,
          a: `Alta, aunque no publicamos un porcentaje porque no tenemos una serie climatológica oficial que citar. Principios de agosto es la época del año con menos nubosidad en la zona. El riesgo realista no es la lluvia, sino una capa de nubes bajas asociada al viento de levante, que es poco profunda y muy local.`,
        },
        {
          q: "¿Qué es el levante y por qué importa para el eclipse?",
          a: "Es el viento del este que empuja aire húmedo mediterráneo hacia el Estrecho. Al forzarlo a ascender contra la costa forma una capa de nubes bajas que se pega al relieve, sobre todo por la mañana, que es justo cuando ocurre la totalidad. Suele ser poco profunda, así que ganar altura ayuda.",
        },
        {
          q: "¿Se nota el eclipse total si está nublado?",
          a: "Mucho. La luz cae hasta un crepúsculo profundo en minutos, la temperatura baja varios grados, el viento cambia y los animales reaccionan como al anochecer. Lo que se pierde con nubes es la corona, que es lo más espectacular, pero el resto del fenómeno sigue siendo notable.",
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: `Will the sky be clear in ${name} on eclipse day? The levante factor`,
        description: `August is the clearest month of the year around the Strait, but the levante wind can pin a layer of low cloud against the coast exactly mid-morning. What to watch and how much room you have to move.`,
        lead: `The good news: early August in southern Spain is one of the most favourable date-and-place combinations on the planet for an eclipse. The bad news: the Strait has the levante, and the levante works precisely mid-morning — which is when totality happens.`,
        body: [
          {
            type: "p",
            text: `Two things get conflated here. August climatology in ${name} is excellent: it is the least cloudy time of year, with virtually no rain, and the Sun will be around ${city.eclipse.sunAltitudeDeg.toFixed(0)}° high, which removes the problem of haze low down. The chance of a storm blotting out the eclipse is very small. What is not negligible is something else, much more local.`,
          },
          { type: "h2", text: "The Strait makes its own weather" },
          {
            type: "p",
            text: `Two opposing wind regimes meet around the Strait. The **levante** comes from the east, pushing humid Mediterranean air west and, as that air is forced up against the coast and the hillsides, forming a layer of low cloud — sometimes just a tongue of stratus — that clings to the terrain and does not shift for hours. The **poniente**, Atlantic and cooler, usually leaves clean skies. In August both are common.`,
          },
          {
            type: "figure",
            art: "levante-cloud",
            caption:
              "With a levante, humid Mediterranean air is forced up against the coast and condenses into a low layer. With a poniente, the sky usually stays clean.",
          },
          {
            type: "p",
            text: `That low layer is the realistic adverse scenario for this eclipse in ${name}, and it has two properties worth understanding: it is **shallow** — often a few hundred metres — and it is **very local**, capable of covering one hillside while a valley five kilometres away stays clear. Both are good news for anyone with a plan.`,
          },
          { type: "h2", text: "What to do about it, in order" },
          {
            type: "ol",
            items: [
              "Do not commit to an exact spot until 24 to 48 hours before. Before that, no forecast is reliable at this level of detail.",
              "Follow AEMET rather than a generic app. Global models resolve the Strait's microclimates badly; the Spanish met office bulletin does not.",
              "Have two alternatives ready: one with height and one on a different coastal aspect. Gaining 200 metres of elevation is often enough to sit above the layer.",
              "Sleep near your alternatives with the car ready, so you can move at first light if the forecast turns overnight.",
              "At dawn, look at the sky before you look at your phone. A levante layer is easier to read from the ground than on any map.",
            ],
          },
          {
            type: "callout",
            title: "Why we do not give percentages",
            text: `It would be easy to write "85 % chance of clear skies" and it would look authoritative. We do not, because we have no official climatological series for ${name} that we can cite, and in climatology an invented number is worse than none: people plan thousand-kilometre trips on it. When we can cite the source, we will publish the figure and the source.`,
          },
          {
          type: "figure",
          art: "viewpoints-map",
          caption:
            "North coast, south coast and 200 metres of elevation within 19 km²: three different microclimates without leaving the path.",
        },
        { type: "h2", text: "Ceuta's advantage if there is cloud" },
          {
            type: "p",
            text: `${name} has one non-obvious virtue in this scenario: within 19 km² it packs a north coast, a south coast and 200 metres of elevation, all less than twenty minutes apart by car. That is three different microclimates inside the same municipality and without leaving the path of totality. Very few points along the track offer that flexibility without risking a long drive on the day.`,
          },
          { type: "h2", text: "And if it does end up cloudy" },
          {
            type: "p",
            text: `It is not the end of the world, however much it stings. Even under full overcast, totality registers strongly: the light collapses into deep twilight within minutes, the temperature falls several degrees, the wind shifts and animals behave as though night has come. You will not see the corona, and that is a genuine loss. You will see and feel everything else.`,
          },
        ],
        faq: [
          {
            q: `What are the chances of clear skies in ${name} on 2 August 2027?`,
            a: `Good, though we do not publish a percentage because we have no official climatological series to cite. Early August is the least cloudy time of year in the area. The realistic risk is not rain but a layer of low cloud associated with the levante wind, which is shallow and very local.`,
          },
          {
            q: "What is the levante and why does it matter for the eclipse?",
            a: "It is the easterly wind that pushes humid Mediterranean air towards the Strait. Forced to rise against the coast, that air forms a layer of low cloud that clings to the terrain, mostly in the morning — exactly when totality happens. It is usually shallow, so gaining height helps.",
          },
          {
            q: "Can you tell there is a total eclipse if it is cloudy?",
            a: "Very much so. The light falls to deep twilight within minutes, the temperature drops several degrees, the wind shifts and animals react as though night had fallen. What cloud takes away is the corona, the most spectacular part; the rest of the phenomenon remains striking.",
          },
        ],
      };
    },
  },
};
