import { ECLIPSE_DAY, durationWords, hm } from "../helpers";
import type { BlogPost } from "../types";

/** Publicación inicial de la sección. Se sube al revisar un post de verdad. */
const PUBLISHED = "2026-08-17";

/**
 * Por qué Ceuta.
 *
 * Es el post cabecera de la sección: la pregunta con más volumen de búsqueda y la
 * que mejor convierte, porque quien la busca todavía no ha decidido dónde va a
 * estar. La respuesta se apoya en la única cosa que no admite discusión —los
 * segundos— y en el gráfico calculado, no en adjetivos.
 */
export const porQueCeuta: BlogPost = {
  slug: "por-que-ceuta-es-el-mejor-sitio-de-espana-para-ver-el-eclipse",
  citySlug: "ceuta",
  category: "eclipse",
  published: PUBLISHED,
  cover: "duration-bars",
  related: [
    "donde-ver-el-eclipse-en-ceuta",
    "como-llegar-a-ceuta-para-el-eclipse",
    "donde-dormir-la-noche-del-eclipse-en-ceuta",
  ],
  content: {
    es: (city) => ({
      title: `Por qué Ceuta es el mejor sitio de España para ver el eclipse de 2027`,
      description: `Ceuta tendrá ${durationWords(city, "es")} de totalidad el 2 de agosto de 2027, la mayor duración de toda España. Por qué gana, cuánto se lleva a los demás y qué implica eso el día del eclipse.`,
      lead: `El ${ECLIPSE_DAY.es}, Ceuta verá ${durationWords(city, "es")} de eclipse solar total: más que cualquier otro punto de España. No es una cuestión de suerte ni de marketing, sino de geometría, y la diferencia con el resto se mide en segundos que se pueden contar.`,
      body: [
        {
          type: "p",
          text: `La franja de totalidad del eclipse del 2 de agosto de 2027 mide unos 260 kilómetros de ancho y cruza el estrecho de Gibraltar de oeste a este. Dentro de esa franja, la duración depende de una sola cosa: lo cerca que estés de su línea central. En el centro la Luna tapa el Sol durante el máximo tiempo posible; en el borde, apenas un instante. Ceuta cae prácticamente sobre esa línea central, y ahí está toda la explicación.`,
        },
        { type: "h2", text: "Los segundos, uno a uno" },
        {
          type: "p",
          text: `Estas duraciones no están copiadas de ninguna tabla: se calculan resolviendo los elementos besselianos que publica la NASA para este eclipse, y el resultado se valida antes de cada despliegue contra las cifras del Instituto Geográfico Nacional. La diferencia con el IGN está en el orden de un segundo.`,
        },
        {
          type: "figure",
          art: "duration-bars",
          caption:
            "Duración de la totalidad en las localidades de la red, ordenadas de mayor a menor, con su distancia a la línea central de la franja.",
        },
        {
          type: "p",
          text: `Lo interesante de esa lista no es que Ceuta gane, sino por cuánto. Frente a Málaga capital —la otra capital de provincia dentro de la franja— la diferencia es de casi tres minutos: en Ceuta la totalidad dura más del doble. Frente a Cádiz, casi dos minutos. Y frente al mejor punto de la Península, el Campo de Gibraltar, la ventaja es de unos veinte segundos, que en un fenómeno que dura minutos es mucho más de lo que parece.`,
        },
        { type: "h2", text: "Qué significan veinte segundos de más" },
        {
          type: "p",
          text: `Suena a poco. No lo es. Durante la totalidad pasan varias cosas seguidas y cada una pide su tiempo: las perlas de Baily justo antes y justo después, las protuberancias rosadas asomando en el limbo, la corona desplegándose, las estrellas apareciendo, el horizonte iluminado en los 360 grados. Con dos minutos apenas da tiempo a levantar la vista y asimilar lo que se ve. Con casi cinco, se puede mirar dos veces, bajar la cámara y quedarse quieto un rato, que es lo que recuerda todo el mundo que ha visto uno.`,
        },
        {
          type: "callout",
          title: "El Sol estará a buena altura, y eso también cuenta",
          text: `En Ceuta el máximo ocurre con el Sol a unos ${city.eclipse.sunAltitudeDeg.toFixed(0)}° sobre el horizonte, hacia el ${city.eclipse.sunAzimuthDeg.toFixed(0)}° de azimut, es decir al este-sureste. A esa altura, casi ningún edificio, monte o bruma costera se interpone. En eclipses con el Sol bajo, encontrar un horizonte limpio es la mitad del problema; aquí no lo es.`,
        },
        {
          type: "figure",
          art: "path-strait",
          caption:
            "Ceuta cae prácticamente sobre la línea central de la franja, y de ahí sale la ventaja en segundos sobre el resto de España.",
        },
        { type: "h2", text: "Las ventajas que no son astronómicas" },
        {
          type: "ul",
          items: [
            "Es una ciudad, no un descampado. Hay hoteles, restaurantes, farmacias, hospital y transporte público. En eclipses anteriores, mucha gente acabó viéndolo desde el arcén de una carretera comarcal porque el mejor punto no tenía nada alrededor.",
            "Es península y es costa: hay horizonte marino al norte y al sur, lo que multiplica los sitios con vistas abiertas en un territorio de apenas 19 km².",
            "Tiene altura fácil. El Monte Hacho, en el extremo de la Almina, ronda los 200 metros y se sube en coche, lo que da margen si amanece con nube baja pegada al mar.",
            "Está en horario peninsular. Ceuta va con la España peninsular, así que quien venga desde Andalucía no tiene que cambiar de hora, a diferencia de quien cruce a Marruecos.",
          ],
        },
        { type: "h2", text: "Lo que hay que tener en cuenta antes de decidirse" },
        {
          type: "p",
          text: `Ceuta se llega en barco. No hay aeropuerto —sí un helipuerto—, y la vía normal es el ferry desde Algeciras. Eso convierte la travesía en el cuello de botella del día: el aforo de los barcos es limitado y el 1 y el 2 de agosto de 2027 va a haber mucha más gente queriendo cruzar que plazas. Quien decida ver el eclipse desde Ceuta debería reservar barco y alojamiento en cuanto se abran las ventas, y contar con dormir allí en vez de intentar ir y volver el mismo día.`,
        },
        {
          type: "callout",
          title: "¿Y si no llego a Ceuta?",
          text: `No pasa nada grave: el Campo de Gibraltar —Algeciras, La Línea, Los Barrios, San Roque— se queda a unos veinte segundos de Ceuta y se llega en coche sin cruzar ningún mar. La diferencia real no está entre Ceuta y Algeciras, sino entre estar dentro de la franja y quedarse fuera: en Sevilla, con un 98 % del disco cubierto, no se hará de noche ni se verá la corona.`,
        },
        { type: "h2", text: "En una frase" },
        {
          type: "p",
          text: `Ceuta reúne la duración máxima del país, un Sol a buena altura, horizonte marino en dos direcciones, altura accesible y servicios de ciudad. El precio que se paga es logístico: un ferry con aforo y una plaza de hotel que hay que asegurar con mucha antelación. Si se resuelve eso, no hay mejor sitio en España.`,
        },
      ],
      faq: [
        {
          q: "¿Cuánto dura el eclipse total en Ceuta?",
          a: `La totalidad durará ${durationWords(city, "es")} en Ceuta, entre las ${hm(city.localTimes.totalityStart)} y las ${hm(city.localTimes.totalityEnd)} hora local. Es la mayor duración de toda España.`,
        },
        {
          q: "¿Hay algún sitio de España donde dure más que en Ceuta?",
          a: "No. Ceuta es el punto de España con más duración de la totalidad en el eclipse del 2 de agosto de 2027, porque es lo más cerca que el territorio español llega de la línea central de la franja. En la Península, el mejor punto es el Campo de Gibraltar, unos veinte segundos por debajo.",
        },
        {
          q: "¿Merece la pena cruzar a Ceuta solo por unos segundos más?",
          a: "Si ya estás en el Campo de Gibraltar, la ganancia en segundos es pequeña y el riesgo logístico del ferry es real. Si vienes de más lejos y puedes reservar barco y hotel con antelación, Ceuta añade la duración máxima del país, horizonte marino y una ciudad con servicios alrededor.",
        },
        {
          q: "¿Se puede ir y volver en el día desde Algeciras?",
          a: "Sobre el papel sí, pero es la peor idea del día. El aforo de los ferrys es limitado y habrá mucha demanda; un retraso a la ida puede costar el eclipse entero. Lo sensato es dormir en Ceuta la noche del 1 al 2 de agosto.",
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: `Why ${name} is the best place in Spain to see the 2027 eclipse`,
        description: `${name} gets ${durationWords(city, "en")} of totality on 2 August 2027, the longest anywhere in Spain. Why it wins, by how much, and what that means on eclipse day.`,
        lead: `On ${ECLIPSE_DAY.en}, Ceuta will see ${durationWords(city, "en")} of total solar eclipse — longer than anywhere else in Spain. That is not luck or marketing but geometry, and the margin over everywhere else can be counted in seconds.`,
        body: [
          {
            type: "p",
            text: `The path of totality on 2 August 2027 is roughly 260 kilometres wide and crosses the Strait of Gibraltar from west to east. Inside that band, how long totality lasts depends on one thing: how close you are to its centreline. On the centreline the Moon covers the Sun for the maximum possible time; at the edge, barely an instant. Ceuta sits almost exactly on that centreline, and that is the whole explanation.`,
          },
          { type: "h2", text: "The seconds, one by one" },
          {
            type: "p",
            text: `These durations are not copied from anyone's table. They are computed by solving the Besselian elements NASA publishes for this eclipse, and the result is validated before every deployment against the figures from Spain's national geographic institute, the IGN. The disagreement with the IGN is of the order of one second.`,
          },
          {
            type: "figure",
            art: "duration-bars",
            caption:
              "Length of totality across the network's locations, longest first, with each one's distance from the centreline of the path.",
          },
          {
            type: "p",
            text: `What matters in that list is not that Ceuta wins, but by how much. Against Malaga city — the other provincial capital inside the path — the gap is nearly three minutes: totality in Ceuta lasts more than twice as long. Against Cadiz, close to two minutes. Against the best spot on the Spanish mainland, the Campo de Gibraltar, the margin is about twenty seconds, which in an event measured in minutes is far more than it sounds.`,
          },
          { type: "h2", text: "What twenty extra seconds buy you" },
          {
            type: "p",
            text: `It sounds trivial. It is not. Several things happen in sequence during totality, and each wants its own moment: Baily's beads just before and just after, pink prominences on the limb, the corona unfolding, stars appearing, the horizon glowing all the way round. With two minutes there is barely time to look up and take it in. With almost five you can look twice, put the camera down and simply stand still — which is the part everybody who has seen one remembers.`,
          },
          {
            type: "callout",
            title: "The Sun will be comfortably high, and that counts too",
            text: `In Ceuta the maximum happens with the Sun about ${city.eclipse.sunAltitudeDeg.toFixed(0)}° above the horizon at an azimuth of roughly ${city.eclipse.sunAzimuthDeg.toFixed(0)}°, that is east-southeast. At that height almost no building, hill or coastal haze gets in the way. In eclipses with a low Sun, finding a clean horizon is half the problem; here it is not.`,
          },
          {
          type: "figure",
          art: "path-strait",
          caption:
            "Ceuta sits almost exactly on the centreline of the path, and that is where its lead in seconds over the rest of Spain comes from.",
        },
        { type: "h2", text: "The advantages that are not astronomical" },
          {
            type: "ul",
            items: [
              "It is a city, not a field. There are hotels, restaurants, pharmacies, a hospital and public transport. At recent eclipses plenty of people ended up watching from the verge of a country road because the best spot had nothing around it.",
              "It is a peninsula and it is coast: sea horizons to the north and to the south, which multiplies the number of open viewpoints within barely 19 km².",
              "Height is easy to reach. Monte Hacho, at the end of the Almina peninsula, is around 200 metres and you can drive up, which gives you options if the morning starts with low cloud on the water.",
              "It runs on mainland Spanish time. Ceuta keeps the same clock as Andalusia, unlike Morocco across the Strait, which in August 2027 is an hour behind.",
            ],
          },
          { type: "h2", text: "What to weigh up before committing" },
          {
            type: "p",
            text: `You reach Ceuta by sea. There is no airport — there is a heliport — and the normal route is the ferry from Algeciras. That makes the crossing the bottleneck of the day: ferry capacity is finite, and on 1 and 2 August 2027 far more people will want to cross than there are places. If you plan to watch from Ceuta, book the boat and a bed as soon as sales open, and plan to sleep there rather than attempt a day trip.`,
          },
          {
            type: "callout",
            title: "And if you cannot get to Ceuta?",
            text: `Nothing is lost. The Campo de Gibraltar — Algeciras, La Línea, Los Barrios, San Roque — comes within about twenty seconds of Ceuta and is reachable by road with no sea crossing at all. The real difference is not Ceuta versus Algeciras: it is being inside the path versus outside it. In Seville, with 98 % of the disc covered, it will not go dark and there will be no corona.`,
          },
          { type: "h2", text: "In one sentence" },
          {
            type: "p",
            text: `Ceuta combines the country's longest totality, a comfortably high Sun, sea horizons in two directions, easy elevation and city services. The price is logistical: a ferry with limited capacity and a hotel bed that has to be locked in early. Solve that, and there is no better place in Spain.`,
          },
        ],
        faq: [
          {
            q: "How long does the total eclipse last in Ceuta?",
            a: `Totality lasts ${durationWords(city, "en")} in Ceuta, between ${hm(city.localTimes.totalityStart)} and ${hm(city.localTimes.totalityEnd)} local time. It is the longest duration anywhere in Spain.`,
          },
          {
            q: "Is there anywhere in Spain where totality lasts longer than in Ceuta?",
            a: "No. Ceuta is the Spanish location with the longest totality for the 2 August 2027 eclipse, because it is as close as Spanish territory gets to the centreline of the path. On the mainland the best spot is the Campo de Gibraltar, some twenty seconds behind.",
          },
          {
            q: "Is crossing to Ceuta worth it for a few extra seconds?",
            a: "If you are already in the Campo de Gibraltar, the gain in seconds is small and the ferry risk is real. If you are coming from further away and can book a boat and a bed in advance, Ceuta adds the country's longest totality, sea horizons and a city with services around you.",
          },
          {
            q: "Can I do it as a day trip from Algeciras?",
            a: "On paper yes, and it is the worst plan of the day. Ferry capacity is limited and demand will be high; one delay on the way over could cost you the entire eclipse. The sensible choice is to sleep in Ceuta on the night of 1 August.",
          },
        ],
      };
    },
  },
};

/** Los cinco contactos: vocabulario básico, explicado sin condescendencia. */
export const cincoContactos: BlogPost = {
  slug: "los-cinco-contactos-del-eclipse-explicados",
  citySlug: "ceuta",
  category: "eclipse",
  published: PUBLISHED,
  cover: "contacts-timeline",
  related: [
    "que-se-ve-durante-la-totalidad-en-ceuta",
    "plan-hora-a-hora-del-dia-del-eclipse-en-ceuta",
    "gafas-de-eclipse-en-ceuta-como-elegirlas",
  ],
  content: {
    es: (city) => ({
      title: "C1, C2, C3, C4: los contactos del eclipse, explicados",
      description: `Qué significan C1, C2, C3 y C4, por qué solo entre C2 y C3 se puede mirar sin filtro, y a qué hora ocurre cada uno en ${city.name}.`,
      lead: `Un eclipse total tiene cuatro contactos y un máximo, y solo uno de los tramos permite mirar sin filtro. En ${city.name} el eclipse parcial empieza a las ${hm(city.localTimes.partialStart)}, la totalidad va de las ${hm(city.localTimes.totalityStart)} a las ${hm(city.localTimes.totalityEnd)}, y todo termina a las ${hm(city.localTimes.partialEnd)}.`,
      body: [
        {
          type: "p",
          text: `«Contacto» es simplemente el instante en que los bordes del disco solar y del disco lunar se tocan. Hay cuatro, y numerarlos es la forma que tienen los astrónomos de no tener que explicar la frase entera cada vez. Merece la pena aprenderlos porque son los que van a aparecer en cualquier programa de actos, en cualquier aplicación y en cualquier conversación ese día.`,
        },
        {
          type: "figure",
          art: "contacts-timeline",
          caption: `Los cinco momentos del eclipse con las horas locales calculadas para ${city.name}. El tramo naranja es el único en el que se puede mirar sin filtro.`,
        },
        { type: "h2", text: "C1 · Primer contacto" },
        {
          type: "p",
          text: `A las ${hm(city.localTimes.partialStart)} la Luna toca el borde del Sol por primera vez. No se nota nada: aparece una muesca minúscula que solo se ve con filtro, y la luz del día sigue siendo la misma. Es el momento de ponerse las gafas de eclipse y no volver a quitárselas hasta C2. Durante la hora siguiente el mordisco crece despacio y, hacia el final, la luz empieza a volverse extraña: no más oscura, sino más metálica, con las sombras muy afiladas.`,
        },
        { type: "h2", text: "C2 · Segundo contacto: empieza la totalidad" },
        {
          type: "p",
          text: `A las ${hm(city.localTimes.totalityStart)} el disco lunar cubre por completo al solar. En los segundos anteriores pasan dos cosas que hay que buscar a propósito: las sombras voladoras, unas bandas tenues que recorren el suelo claro, y las perlas de Baily, los últimos puntos de luz colándose entre los valles del relieve lunar hasta quedar uno solo, el anillo de diamante. Ahí, y solo ahí, se quitan los filtros.`,
        },
        {
          type: "figure",
          art: "corona",
          caption:
            "Entre C2 y C3 la corona es lo único visible del Sol, y es tenue: por eso no hace falta filtro exactamente en ese tramo y en ninguno más.",
        },
        { type: "h2", text: "Máximo del eclipse" },
        {
          type: "p",
          text: `A las ${hm(city.localTimes.maximum)}, a mitad de la totalidad, el centro del disco lunar pasa lo más cerca posible del centro del solar. No hay nada visible que marque ese instante: es un dato de cálculo, útil para saber cuándo se ha pasado la mitad y queda tanto tiempo como el ya transcurrido.`,
        },
        { type: "h2", text: "C3 · Tercer contacto: termina la totalidad" },
        {
          type: "p",
          text: `A las ${hm(city.localTimes.totalityEnd)} reaparece el primer destello de Sol por el lado opuesto. Es el momento peligroso del día, porque el ojo está adaptado a la oscuridad, la pupila está muy abierta y el reflejo de aparta no llega a tiempo. **Las gafas se ponen al primer indicio de luz, no cuando ya molesta.**`,
        },
        {
          type: "callout",
          title: "Por eso no te fíes del reloj",
          text: `Nuestras horas de contacto son fiables dentro de unos pocos segundos, y aun así no sirven para decidir cuándo quitarse el filtro. El instante real de C2 y C3 depende del relieve del limbo lunar, que añade uno o dos segundos de incertidumbre, y esa es exactamente la escala en la que se juega la vista. Guíate por lo que ves: filtro fuera cuando el disco esté completamente tapado, filtro puesto al primer destello.`,
        },
        { type: "h2", text: "C4 · Cuarto contacto" },
        {
          type: "p",
          text: `A las ${hm(city.localTimes.partialEnd)} la Luna abandona el disco solar y el eclipse termina. Casi nadie se queda hasta aquí, y no pasa nada: lo que viene tras C3 es la misma película al revés. Lo que sí conviene es quedarse un rato más en el sitio, porque la salida en masa hacia el ferry o hacia la carretera es lo peor del día.`,
        },
        { type: "h2", text: "Resumen para llevar en el bolsillo" },
        {
          type: "table",
          head: ["Contacto", "Hora local", "Qué hacer"],
          rows: [
            ["C1 · empieza el parcial", hm(city.localTimes.partialStart), "Filtro puesto"],
            ["C2 · empieza la totalidad", hm(city.localTimes.totalityStart), "Filtro fuera, cuando ya no haya Sol visible"],
            ["Máximo", hm(city.localTimes.maximum), "Mitad de la totalidad"],
            ["C3 · termina la totalidad", hm(city.localTimes.totalityEnd), "Filtro puesto al primer destello"],
            ["C4 · termina el parcial", hm(city.localTimes.partialEnd), "Filtro hasta el final"],
          ],
        },
      ],
      faq: [
        {
          q: "¿Cuándo se pueden quitar las gafas de eclipse?",
          a: `Solo entre C2 y C3, es decir entre las ${hm(city.localTimes.totalityStart)} y las ${hm(city.localTimes.totalityEnd)} en ${city.name}, y solo si el disco solar está completamente tapado. En cualquier otro momento del eclipse hace falta filtro certificado.`,
        },
        {
          q: "¿Qué es el anillo de diamante?",
          a: "El último punto de luz solar que queda visible justo antes de C2, o el primero que reaparece en C3, rodeado ya por el resplandor de la corona. Dura uno o dos segundos y es uno de los momentos más recordados del fenómeno.",
        },
        {
          q: "¿Cuánto dura el eclipse completo?",
          a: `En ${city.name}, desde C1 a las ${hm(city.localTimes.partialStart)} hasta C4 a las ${hm(city.localTimes.partialEnd)}: algo más de dos horas y media en total, de las que ${durationWords(city, "es")} son de totalidad.`,
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: "C1, C2, C3, C4: the eclipse contacts, explained",
        description: `What C1, C2, C3 and C4 mean, why only the stretch between C2 and C3 can be watched without a filter, and when each one happens in ${name}.`,
        lead: `A total eclipse has four contacts and a maximum, and only one of the stretches lets you look without a filter. In ${name} the partial eclipse begins at ${hm(city.localTimes.partialStart)}, totality runs from ${hm(city.localTimes.totalityStart)} to ${hm(city.localTimes.totalityEnd)}, and everything is over by ${hm(city.localTimes.partialEnd)}.`,
        body: [
          {
            type: "p",
            text: `A "contact" is simply the instant when the edges of the solar and lunar discs touch. There are four of them, and numbering them is how astronomers avoid saying the whole sentence every time. They are worth learning because they are what will appear in every programme of events, every app and every conversation that day.`,
          },
          {
            type: "figure",
            art: "contacts-timeline",
            caption: `The five moments of the eclipse with local times computed for ${name}. The orange stretch is the only one you may watch without a filter.`,
          },
          { type: "h2", text: "C1 · First contact" },
          {
            type: "p",
            text: `At ${hm(city.localTimes.partialStart)} the Moon touches the Sun's edge for the first time. Nothing is noticeable: a tiny notch appears that you can only see through a filter, and daylight is unchanged. This is when the eclipse glasses go on and stay on until C2. Over the next hour the bite grows slowly and, towards the end, the light turns strange — not darker so much as metallic, with unusually sharp shadows.`,
          },
          { type: "h2", text: "C2 · Second contact: totality begins" },
          {
            type: "p",
            text: `At ${hm(city.localTimes.totalityStart)} the lunar disc covers the solar one completely. In the seconds before, two things happen that you have to look for deliberately: shadow bands, faint ripples running across pale ground, and Baily's beads, the last points of light squeezing through valleys on the lunar limb until one remains — the diamond ring. There, and only there, the filters come off.`,
          },
          {
          type: "figure",
          art: "corona",
          caption:
            "Between C2 and C3 the corona is all that is visible of the Sun, and it is faint: that is why no filter is needed in exactly that stretch and in no other.",
        },
        { type: "h2", text: "Maximum eclipse" },
          {
            type: "p",
            text: `At ${hm(city.localTimes.maximum)}, halfway through totality, the centre of the lunar disc passes as close as it will get to the centre of the solar one. Nothing visible marks the instant: it is a computed figure, useful for knowing that you are halfway and have as long again ahead of you.`,
          },
          { type: "h2", text: "C3 · Third contact: totality ends" },
          {
            type: "p",
            text: `At ${hm(city.localTimes.totalityEnd)} the first flash of Sun reappears on the opposite side. This is the dangerous moment of the day, because your eye is dark-adapted, the pupil is wide open and the blink reflex arrives too late. **The glasses go on at the first hint of light, not when it starts to hurt.**`,
          },
          {
            type: "callout",
            title: "Which is why you should not trust the clock",
            text: `Our contact times are reliable to within a few seconds, and even so they are not the right tool for deciding when to remove a filter. The true instant of C2 and C3 depends on the relief of the lunar limb, which adds a second or two of uncertainty — exactly the scale on which your eyesight is at stake. Go by what you see: filter off once the disc is fully covered, filter back on at the first flash.`,
          },
          { type: "h2", text: "C4 · Fourth contact" },
          {
            type: "p",
            text: `At ${hm(city.localTimes.partialEnd)} the Moon leaves the solar disc and the eclipse is over. Hardly anyone stays that long, and that is fine: what follows C3 is the same film in reverse. What is worth doing is staying put a while longer, because the mass exit towards the ferry or the road is the worst part of the day.`,
          },
          { type: "h2", text: "The pocket summary" },
          {
            type: "table",
            head: ["Contact", "Local time", "What to do"],
            rows: [
              ["C1 · partial begins", hm(city.localTimes.partialStart), "Filter on"],
              ["C2 · totality begins", hm(city.localTimes.totalityStart), "Filter off, once no Sun is visible"],
              ["Maximum", hm(city.localTimes.maximum), "Halfway through totality"],
              ["C3 · totality ends", hm(city.localTimes.totalityEnd), "Filter on at the first flash"],
              ["C4 · partial ends", hm(city.localTimes.partialEnd), "Filter until the end"],
            ],
          },
        ],
        faq: [
          {
            q: "When can I take the eclipse glasses off?",
            a: `Only between C2 and C3 — that is between ${hm(city.localTimes.totalityStart)} and ${hm(city.localTimes.totalityEnd)} in ${name} — and only while the solar disc is completely covered. At every other point in the eclipse a certified filter is required.`,
          },
          {
            q: "What is the diamond ring?",
            a: "The last point of sunlight still visible just before C2, or the first to return at C3, already surrounded by the glow of the corona. It lasts a second or two and is one of the most remembered moments of the whole event.",
          },
          {
            q: "How long does the whole eclipse last?",
            a: `In ${name}, from C1 at ${hm(city.localTimes.partialStart)} to C4 at ${hm(city.localTimes.partialEnd)}: a little over two and a half hours in all, of which ${durationWords(city, "en")} are totality.`,
          },
        ],
      };
    },
  },
};

/** Lo que se ve. El post más "sensorial" y el que mejor funciona compartido. */
export const queSeVe: BlogPost = {
  slug: "que-se-ve-durante-la-totalidad-en-ceuta",
  citySlug: "ceuta",
  category: "eclipse",
  published: PUBLISHED,
  cover: "corona",
  related: [
    "los-cinco-contactos-del-eclipse-explicados",
    "la-sombra-de-la-luna-sobre-el-estrecho",
    "fotografiar-el-eclipse-en-ceuta",
  ],
  content: {
    es: (city) => ({
      title: `Qué se ve exactamente durante los ${durationWords(city, "es")} de totalidad`,
      description: `Guía de lo que ocurre minuto a minuto durante la totalidad del eclipse en ${city.name}: corona, protuberancias, perlas de Baily, el horizonte iluminado y el silencio.`,
      lead: `Durante los ${durationWords(city, "es")} de totalidad en ${city.name} pasan más cosas de las que caben en la memoria. Ésta es la lista, en orden, de lo que hay que buscar a propósito para no perdérselo.`,
      body: [
        {
          type: "p",
          text: `Todo el mundo que ha visto un eclipse total cuenta lo mismo: que las fotos no se parecen a lo que se ve, y que la primera vez se les pasó casi todo porque estaban mirando en la dirección equivocada. Con casi cinco minutos, ${city.name} da margen para hacerlo bien. Lo que sigue está pensado para leerlo antes, no durante.`,
        },
        { type: "h2", text: "Los diez minutos anteriores: la luz se vuelve rara" },
        {
          type: "p",
          text: `Con el 90 % del disco cubierto todavía es de día, pero la luz ya no es normal. El Sol se ha convertido en una fuente casi puntual, así que las sombras se afilan de una forma que no se ve nunca: el borde de una hoja se proyecta nítido en el suelo. La temperatura empieza a caer. Si hay árboles, las manchas de luz que atraviesan las hojas dejan de ser redondas y se convierten en crecientes: es el Sol mordido, proyectado cientos de veces.`,
        },
        { type: "h2", text: "Un minuto antes: mira al oeste y al suelo" },
        {
          type: "ul",
          items: [
            "Al oeste, sobre el mar, se ve venir la sombra: una pared de penumbra que se acerca a más de 2.000 km/h. Desde Ceuta, con horizonte marino, es una de las mejores posiciones posibles para verla llegar.",
            "En el suelo claro —una pared blanca, una sábana, la arena— pueden aparecer las sombras voladoras: bandas tenues y rápidas, como el fondo de una piscina. No siempre se ven, y a mucha gente le parece lo más raro de todo.",
            "El horizonte entero se tiñe de un naranja profundo, como veinte atardeceres a la vez y en todas direcciones.",
          ],
        },
        {
          type: "figure",
          art: "shadow-sea",
          caption:
            "El minuto anterior a C2 se aprovecha mirando al oeste, no al Sol: desde Ceuta la sombra llega por encima del agua.",
        },
        { type: "h2", text: "El instante de C2: perlas y anillo de diamante" },
        {
          type: "p",
          text: `Los últimos rayos de Sol se cuelan por los valles del relieve lunar y se rompen en una fila de puntos brillantes: las perlas de Baily. Se apagan una a una hasta que queda uno solo, y ese punto rodeado del primer resplandor de la corona es el anillo de diamante. Dura un segundo o dos.`,
        },
        {
          type: "figure",
          art: "corona",
          caption:
            "Durante la totalidad, la corona se extiende varios diámetros solares y el horizonte sigue iluminado en los 360°, porque la sombra mide solo unos 260 km.",
        },
        { type: "h2", text: "La corona: lo que has venido a ver" },
        {
          type: "p",
          text: `La corona es la atmósfera exterior del Sol, un millón de veces más tenue que el disco y, por eso, invisible cualquier otro día del año. A simple vista es blanca nacarada, con penachos y filamentos que se extienden de forma asimétrica, a veces varios diámetros solares. No es un halo uniforme: tiene estructura, y esa estructura cambia de un eclipse a otro según el ciclo solar. Se mira a simple vista, sin nada: los prismáticos la recortan y pierden lo mejor.`,
        },
        { type: "h2", text: "Las protuberancias" },
        {
          type: "p",
          text: `Pegadas al borde negro del disco pueden verse pequeñas lenguas de un rosa salmón intenso: son protuberancias, arcos de plasma sostenidos por el campo magnético solar. Cada una es varias veces más grande que la Tierra. Se ven mejor con unos prismáticos, y son lo único de la totalidad para lo que merece la pena usarlos.`,
        },
        { type: "h2", text: "Y todo lo que no está en el cielo" },
        {
          type: "ul",
          items: [
            "Se ven estrellas y planetas. En agosto de 2027, con el Sol en Leo, el cielo alrededor queda como un crepúsculo avanzado.",
            "La temperatura baja varios grados en minutos. En Ceuta, en agosto y a media mañana, el alivio se nota físicamente.",
            "El viento cambia. Es un efecto real y documentado: la brisa cae o gira cuando desaparece el calentamiento del suelo.",
            "Los animales se callan. Las gaviotas se posan, los vencejos desaparecen, los grillos empiezan a cantar como al anochecer. Mucha gente recuerda el silencio antes que la corona.",
            "La gente grita. Sin excepción. Merece la pena escucharlo.",
          ],
        },
        {
          type: "callout",
          title: "El consejo que da todo el mundo que ya ha visto uno",
          text: `Dedica los primeros veinte segundos a mirar la corona a simple vista. Los siguientes, a mirar el horizonte de 360° y a la gente que tienes al lado. Y no intentes fotografiarlo si es tu primer eclipse total: se te irán los ${durationWords(city, "es")} peleándote con la cámara y te llevarás una foto peor que las que ya existen.`,
        },
      ],
      faq: [
        {
          q: "¿Se puede mirar el eclipse sin gafas durante la totalidad?",
          a: `Sí, y es la única forma de verlo bien. Mientras el disco solar esté completamente tapado —entre las ${hm(city.localTimes.totalityStart)} y las ${hm(city.localTimes.totalityEnd)} en ${city.name}— no hay nada que filtrar: la corona es tenue. En cuanto reaparece el primer destello de Sol hay que volver a ponerse el filtro inmediatamente.`,
        },
        {
          q: "¿Se ven las estrellas durante un eclipse total?",
          a: "Sí. La luminosidad del cielo durante la totalidad es parecida a la de un crepúsculo avanzado, así que se ven los planetas brillantes y las estrellas más luminosas alrededor del Sol eclipsado.",
        },
        {
          q: "¿Hacen falta prismáticos o telescopio?",
          a: "No, y para la corona es mejor no usarlos: es grande y el instrumento la recorta. Lo único que ganan los prismáticos son las protuberancias rosadas del borde. Si los usas, quítalos antes de que termine la totalidad.",
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: `What you actually see during ${durationWords(city, "en")} of totality`,
        description: `A guide to what happens minute by minute during totality in ${name}: the corona, prominences, Baily's beads, the lit horizon and the silence.`,
        lead: `More happens during the ${durationWords(city, "en")} of totality in ${name} than anyone remembers afterwards. This is the list, in order, of what to look for on purpose so that you do not miss it.`,
        body: [
          {
            type: "p",
            text: `Everybody who has seen a total eclipse says the same two things: that photographs look nothing like it, and that the first time round they missed most of it because they were looking the wrong way. With almost five minutes, ${name} gives you room to do it properly. What follows is meant to be read beforehand, not during.`,
          },
          { type: "h2", text: "The ten minutes before: the light turns strange" },
          {
            type: "p",
            text: `With 90 % of the disc covered it is still daylight, but the light is no longer normal. The Sun has become an almost point-like source, so shadows sharpen in a way you never otherwise see: the edge of a leaf projects crisply onto the ground. The temperature starts to drop. Under trees, the patches of light coming through the leaves stop being round and turn into crescents — the bitten Sun, projected hundreds of times over.`,
          },
          { type: "h2", text: "One minute before: look west, and look down" },
          {
            type: "ul",
            items: [
              "To the west, over the sea, you can watch the shadow coming: a wall of darkness closing at over 2,000 km/h. From Ceuta, with an open sea horizon, you are in one of the best possible places to see it arrive.",
              "On pale ground — a white wall, a sheet, sand — shadow bands may appear: faint, fast ripples, like the bottom of a swimming pool. They do not always show, and many people find them the strangest part of all.",
              "The whole horizon turns deep orange, like twenty sunsets at once and in every direction.",
            ],
          },
          {
          type: "figure",
          art: "shadow-sea",
          caption:
            "The minute before C2 is best spent looking west rather than at the Sun: from Ceuta the shadow arrives over open water.",
        },
        { type: "h2", text: "The instant of C2: beads and the diamond ring" },
          {
            type: "p",
            text: `The last rays of sunlight thread through valleys on the lunar limb and break into a row of bright points: Baily's beads. They wink out one by one until a single one is left, and that point ringed by the first glow of the corona is the diamond ring. It lasts a second or two.`,
          },
          {
            type: "figure",
            art: "corona",
            caption:
              "During totality the corona reaches out several solar diameters while the horizon stays lit all the way round, because the shadow is only about 260 km across.",
          },
          { type: "h2", text: "The corona: what you came for" },
          {
            type: "p",
            text: `The corona is the Sun's outer atmosphere, a million times fainter than the disc and therefore invisible on any other day of the year. To the naked eye it is pearly white, with plumes and filaments reaching out asymmetrically, sometimes several solar diameters. It is not a uniform halo: it has structure, and that structure differs from one eclipse to the next with the solar cycle. Watch it with the naked eye — binoculars crop it and lose the best part.`,
          },
          { type: "h2", text: "The prominences" },
          {
            type: "p",
            text: `Against the black edge of the disc you may see small tongues of intense salmon pink: prominences, arcs of plasma held up by the Sun's magnetic field. Each is several times the size of the Earth. Binoculars help here, and this is the one thing in totality they are genuinely worth using for.`,
          },
          { type: "h2", text: "And everything that is not in the sky" },
          {
            type: "ul",
            items: [
              "Stars and planets appear. In August 2027, with the Sun in Leo, the surrounding sky looks like deep twilight.",
              "The temperature drops several degrees in minutes. In Ceuta, in August, mid-morning, the relief is physical.",
              "The wind changes. It is a real, documented effect: the breeze drops or turns as the ground stops being heated.",
              "The animals go quiet. Gulls settle, swifts vanish, crickets start up as though night had fallen. Plenty of people remember the silence before they remember the corona.",
              "People shout. Without exception. It is worth listening to.",
            ],
          },
          {
            type: "callout",
            title: "The advice everyone who has seen one gives",
            text: `Spend the first twenty seconds looking at the corona with your own eyes. Spend the next lot looking at the 360° horizon and at the people beside you. And do not try to photograph it if this is your first total eclipse: you will spend all ${durationWords(city, "en")} fighting a camera and come away with a worse picture than the ones that already exist.`,
          },
        ],
        faq: [
          {
            q: "Can you look at the eclipse without glasses during totality?",
            a: `Yes, and it is the only way to see it properly. While the solar disc is fully covered — between ${hm(city.localTimes.totalityStart)} and ${hm(city.localTimes.totalityEnd)} in ${name} — there is nothing to filter: the corona is faint. The moment the first flash of Sun returns, the filter must go straight back on.`,
          },
          {
            q: "Can you see stars during a total eclipse?",
            a: "Yes. Sky brightness during totality is similar to deep twilight, so the bright planets and the brightest stars are visible around the eclipsed Sun.",
          },
          {
            q: "Do I need binoculars or a telescope?",
            a: "No, and for the corona you are better off without: it is large and an instrument crops it. The one thing binoculars add is the pink prominences on the limb. If you use them, put them down before totality ends.",
          },
        ],
      };
    },
  },
};

/** La sombra sobre el mar: la ventaja específica de mirar desde el Estrecho. */
export const sombraEstrecho: BlogPost = {
  slug: "la-sombra-de-la-luna-sobre-el-estrecho",
  citySlug: "ceuta",
  category: "eclipse",
  published: PUBLISHED,
  cover: "shadow-sea",
  related: [
    "que-se-ve-durante-la-totalidad-en-ceuta",
    "donde-ver-el-eclipse-en-ceuta",
    "hacia-donde-mirar-la-posicion-del-sol-en-ceuta",
  ],
  content: {
    es: (city) => ({
      title: "Ver llegar la sombra de la Luna sobre el Estrecho",
      description: `Desde ${city.name} la sombra de la Luna llega por el mar, a más de 2.000 km/h. Cómo, cuándo y hacia dónde mirar para verla venir, y por qué es la ventaja de estar en el Estrecho.`,
      lead: `La sombra de la Luna cruza el estrecho de Gibraltar a más de 2.000 km/h y, desde ${city.name}, llega por encima del agua. Verla venir es una de las dos o tres cosas del eclipse que sólo se pueden ver desde una costa, y hay que estar mirando en el sitio correcto un minuto antes de las ${hm(city.localTimes.totalityStart)}.`,
      body: [
        {
          type: "p",
          text: `La umbra —la sombra de verdad, la que produce la totalidad— es una mancha de unos 260 kilómetros de ancho que barre la superficie de la Tierra. No cae verticalmente: llega inclinada y avanza. Sobre el suelo, entre edificios y colinas, es difícil verla porque no hay una superficie limpia y grande donde se dibuje. Sobre el mar sí la hay, y eso convierte el Estrecho en uno de los mejores escenarios de todo el trazado de este eclipse.`,
        },
        {
          type: "figure",
          art: "shadow-sea",
          caption:
            "La umbra llega por el oeste, sobre el agua. El borde no es una línea nítida: es un degradado rápido que oscurece el mar por delante de ti.",
        },
        { type: "h2", text: "Cuándo mirar, y hacia dónde" },
        {
          type: "p",
          text: `La franja se recorre de oeste a este, así que la sombra viene del oeste: desde el Atlántico, entrando por la zona de Tarifa. Desde ${city.name} eso significa mirar hacia el oeste y el noroeste, es decir hacia el mar y hacia la costa peninsular, en el minuto anterior a las ${hm(city.localTimes.totalityStart)}. El Sol, en cambio, está al este-sureste: para ver llegar la sombra hay que darle la espalda al Sol.`,
        },
        {
          type: "callout",
          title: "El error clásico",
          text: `Casi todo el mundo pasa el minuto anterior a la totalidad mirando al Sol a través del filtro. Es comprensible, pero es el momento de mirar en la dirección opuesta. El Sol no se va a mover; la sombra pasa una sola vez.`,
        },
        { type: "h2", text: "Qué se ve exactamente" },
        {
          type: "ul",
          items: [
            "El agua del oeste pierde brillo antes que la que tienes delante: el mar se apaga por sectores, no de golpe.",
            "El horizonte hacia poniente se convierte en una banda oscura de aspecto casi sólido, como una tormenta que llega sin nubes.",
            "Los últimos segundos son muy rápidos. A 2.000 km/h, el frente recorre el ancho visible del Estrecho en menos de un minuto.",
            "Tras la totalidad, la sombra se marcha hacia el este, hacia Melilla y el Mediterráneo. Ese segundo pase también se ve, y casi nadie se queda a verlo.",
          ],
        },
        {
          type: "figure",
          art: "path-strait",
          caption:
            "La franja se recorre de oeste a este, así que la umbra entra por el Atlántico y sale hacia el Mediterráneo.",
        },
        { type: "h2", text: "Dónde colocarse en Ceuta para esto" },
        {
          type: "p",
          text: `Hace falta horizonte abierto hacia el oeste y el noroeste, sobre el agua. En ${city.name} eso apunta a la fachada norte y a los puntos altos: cuanto más despejado esté el cuadrante de poniente, mejor. Un mirador con vistas solo al Mediterráneo oriental te dará la corona perfecta y te quitará la llegada de la sombra.`,
        },
        {
          type: "p",
          text: `Merece la pena hacer el ejercicio unos días antes, a la misma hora: ir al punto elegido, orientarse y comprobar qué hay hacia poniente. Cinco minutos de reconocimiento previo valen más que cualquier lista de miradores, incluida la nuestra.`,
        },
        { type: "h2", text: "Y desde el barco, ¿mejor?" },
        {
          type: "p",
          text: `Un ferry en mitad del Estrecho tendría el horizonte perfecto, pero es una apuesta arriesgada: la cubierta se llena, la plataforma se mueve —fatal para fotografiar— y sobre todo no controlas la posición ni el rumbo. Si el barco va con retraso o cambia de derrota, no hay plan B. Tierra firme, con margen y horizonte, es una opción mejor.`,
        },
      ],
      faq: [
        {
          q: "¿Desde dónde llega la sombra del eclipse en Ceuta?",
          a: `Desde el oeste. La franja de totalidad se recorre de oeste a este, así que la umbra entra por el Atlántico y la zona de Tarifa y cruza el Estrecho hacia ${city.name}. Para verla llegar hay que mirar al oeste y noroeste, dando la espalda al Sol.`,
        },
        {
          q: "¿A qué velocidad se mueve la sombra de la Luna?",
          a: "En esta zona del trazado, del orden de 2.000 km/h. Es la razón por la que la totalidad dura minutos y no horas, y por la que el frente de sombra cruza el ancho visible del Estrecho en menos de un minuto.",
        },
        {
          q: "¿Se ve mejor el eclipse desde un barco?",
          a: "El horizonte es mejor, pero el resto es peor: cubierta llena, plataforma en movimiento y ninguna capacidad de decidir dónde estarás. Para observar y para fotografiar, tierra firme con horizonte abierto es más fiable.",
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: "Watching the Moon's shadow arrive across the Strait",
        description: `From ${name} the Moon's shadow arrives over the water at more than 2,000 km/h. How, when and where to look to see it coming, and why the Strait is the place for it.`,
        lead: `The Moon's shadow crosses the Strait of Gibraltar at over 2,000 km/h and, from ${name}, it arrives over open water. Watching it come is one of the two or three things about an eclipse you can only see from a coast, and you need to be looking the right way one minute before ${hm(city.localTimes.totalityStart)}.`,
        body: [
          {
            type: "p",
            text: `The umbra — the real shadow, the one that produces totality — is a patch some 260 kilometres across sweeping over the Earth's surface. It does not fall vertically: it arrives at an angle and it moves. Over land, among buildings and hills, it is hard to see because there is no large clean surface for it to draw itself on. Over the sea there is, and that makes the Strait one of the best settings anywhere along this eclipse's track.`,
          },
          {
            type: "figure",
            art: "shadow-sea",
            caption:
              "The umbra arrives from the west, over the water. The edge is not a sharp line but a fast gradient that darkens the sea ahead of you.",
          },
          { type: "h2", text: "When to look, and where" },
          {
            type: "p",
            text: `The path is traced from west to east, so the shadow comes from the west: in off the Atlantic, entering around Tarifa. From ${name} that means looking west and northwest — out to sea and towards the Spanish coast — in the minute before ${hm(city.localTimes.totalityStart)}. The Sun, meanwhile, is east-southeast: to watch the shadow arrive you have to turn your back on the Sun.`,
          },
          {
            type: "callout",
            title: "The classic mistake",
            text: `Almost everybody spends the minute before totality staring at the Sun through a filter. It is understandable, and it is exactly the moment to look the other way. The Sun is not going anywhere; the shadow passes once.`,
          },
          { type: "h2", text: "What you actually see" },
          {
            type: "ul",
            items: [
              "The water to the west dulls before the water in front of you: the sea goes out in sectors, not all at once.",
              "The western horizon becomes a dark band that looks almost solid, like a storm arriving without any cloud.",
              "The last seconds are very fast. At 2,000 km/h the front crosses the visible width of the Strait in under a minute.",
              "After totality the shadow leaves towards the east, towards Melilla and the Mediterranean. That second pass is visible too, and hardly anyone stays for it.",
            ],
          },
          {
          type: "figure",
          art: "path-strait",
          caption:
            "The path is traced from west to east, so the umbra comes in off the Atlantic and leaves towards the Mediterranean.",
        },
        { type: "h2", text: "Where to stand in Ceuta for this" },
          {
            type: "p",
            text: `You need an open horizon to the west and northwest, over water. In ${name} that points to the northern side of the city and to high ground: the clearer the western quadrant, the better. A viewpoint that only looks out over the eastern Mediterranean will give you a perfect corona and cost you the shadow's arrival.`,
          },
          {
            type: "p",
            text: `It is worth rehearsing a few days beforehand at the same time of morning: go to your chosen spot, orient yourself and check what lies to the west. Five minutes of scouting is worth more than any list of viewpoints, ours included.`,
          },
          { type: "h2", text: "Would a boat be better?" },
          {
            type: "p",
            text: `A ferry in mid-Strait would have the perfect horizon, but it is a risky bet: the deck fills up, the platform moves — fatal for photography — and above all you control neither position nor course. If the boat runs late or changes route, there is no plan B. Solid ground with margin and a horizon is the better option.`,
          },
        ],
        faq: [
          {
            q: "Which direction does the eclipse shadow come from in Ceuta?",
            a: `From the west. The path of totality is traced west to east, so the umbra comes in off the Atlantic near Tarifa and crosses the Strait towards ${name}. To see it arrive, look west and northwest, with your back to the Sun.`,
          },
          {
            q: "How fast does the Moon's shadow move?",
            a: "Along this part of the track, of the order of 2,000 km/h. That is why totality lasts minutes rather than hours, and why the shadow front crosses the visible width of the Strait in under a minute.",
          },
          {
            q: "Is the eclipse better from a boat?",
            a: "The horizon is better, everything else is worse: a crowded deck, a moving platform, and no say over where you will be. For watching and for photographing, solid ground with an open horizon is more reliable.",
          },
        ],
      };
    },
  },
};
