import { ECLIPSE_DAY, durationWords, hm } from "../helpers";
import type { BlogPost } from "../types";

const PUBLISHED = "2026-08-17";

/**
 * Cómo llegar.
 *
 * No damos horarios, precios ni navieras concretas: cambian, y un dato caducado en
 * una guía de viaje es peor que la ausencia del dato. Lo que sí damos es la
 * estructura del problema, que no cambia.
 */
export const comoLlegar: BlogPost = {
  slug: "como-llegar-a-ceuta-para-el-eclipse",
  citySlug: "ceuta",
  category: "viaje",
  published: PUBLISHED,
  cover: "ferry-route",
  related: [
    "donde-dormir-la-noche-del-eclipse-en-ceuta",
    "movilidad-y-atascos-el-dia-del-eclipse-en-ceuta",
    "por-que-ceuta-es-el-mejor-sitio-de-espana-para-ver-el-eclipse",
  ],
  content: {
    es: (city) => ({
      title: `Cómo llegar a ${city.name} para el eclipse del 2 de agosto de 2027`,
      description: `Todas las formas de llegar a ${city.name} para el eclipse: ferry desde Algeciras, helicóptero, aeropuertos de referencia y por qué hay que reservar con mucha antelación.`,
      lead: `A ${city.name} se llega en barco. El ferry desde Algeciras cruza unos 14 km de mar y es la vía normal, con travesías de aproximadamente una hora. El ${ECLIPSE_DAY.es} eso convierte el aforo de los barcos en el auténtico cuello de botella del viaje, y en la única cosa del plan que hay que resolver con meses de antelación.`,
      body: [
        {
          type: "p",
          text: `Antes de nada, lo importante: **${city.name} no tiene aeropuerto**. Tiene helipuerto, con conexiones cortas, pero la infraestructura de llegada masiva es el puerto. Todo el que quiera ver el eclipse desde aquí va a pasar por el mismo sitio, en las mismas horas y con el mismo número de plazas disponibles que cualquier otro día de agosto.`,
        },
        {
          type: "figure",
          art: "ferry-route",
          caption:
            "La travesía habitual sale de Algeciras. Es frontera exterior de la Unión Europea, así que hay control de documentación en los dos sentidos.",
        },
        { type: "h2", text: "El ferry desde Algeciras" },
        {
          type: "p",
          text: `Es la vía principal. La travesía es corta —del orden de una hora, algo más en los barcos convencionales— y hay salidas repartidas a lo largo del día. Se puede embarcar con coche, con moto o como pasajero de pie, y hay operadores distintos cubriendo la ruta. No damos aquí horarios ni precios concretos a propósito: cambian cada temporada, y un dato caducado en una guía de viaje hace más daño que su ausencia.`,
        },
        {
          type: "ul",
          items: [
            "Reserva en cuanto se abran las ventas para agosto de 2027. La demanda del 1 y el 2 de agosto no se parecerá a nada visto antes en esta ruta.",
            "Ida y vuelta por separado si eso te da flexibilidad para volver el día 3 en lugar del 2. Merece la pena.",
            "Llega al puerto con margen amplio, sobre todo a la vuelta. Hay control fronterizo y ese día habrá cola.",
            "Lleva DNI o pasaporte en vigor, y el de todos los que viajen contigo, niños incluidos.",
          ],
        },
        {
          type: "figure",
          art: "path-strait",
          caption:
            "Toda la zona del Estrecho está dentro de la franja: las dos orillas ven la totalidad, con unos segundos de diferencia.",
        },
        { type: "h2", text: "Cómo llegar a Algeciras" },
        {
          type: "p",
          text: `Algeciras está bien conectada por carretera y por tren con el resto de Andalucía. Los aeropuertos de referencia son **Gibraltar**, que es el más cercano, **Málaga**, el mejor conectado internacionalmente y a unas dos horas por carretera, y **Jerez** y **Sevilla** como alternativas. Quien venga en avión debería contar con una noche en la zona antes de cruzar: encadenar vuelo y ferry el mismo día, con el eclipse a la mañana siguiente, es apurar demasiado.`,
        },
        {
          type: "callout",
          title: "El plan más robusto, en una frase",
          text: `Llega a la zona el 31 de julio o el 1 de agosto, cruza a ${city.name} el 1, duerme allí las noches del 1 y del 2, y vuelve el 3. Cuesta una noche más de alojamiento y elimina prácticamente todos los riesgos: retrasos, aforos, atascos y la cola del puerto después del eclipse.`,
        },
        { type: "h2", text: "El helicóptero" },
        {
          type: "p",
          text: `Existe una conexión en helicóptero con la Península desde el helipuerto de ${city.name}, que es rápida pero de capacidad muy reducida y sensible al viento —y el levante sopla en agosto—. No es una alternativa realista para mover volumen el día del eclipse, pero puede ser una opción para quien viaje ligero y reserve pronto. Como con el ferry: consulta el operador para horarios y disponibilidad reales.`,
        },
        { type: "h2", text: "Llegar desde Marruecos" },
        {
          type: "p",
          text: `${city.name} tiene frontera terrestre con Marruecos en El Tarajal, y desde Tánger o Tetuán la distancia es corta. Dicho eso: las condiciones de paso de esa frontera pueden cambiar y han cambiado en el pasado sin apenas aviso, y no vamos a hacer previsiones sobre cómo estará en agosto de 2027. Si tu plan depende de cruzar por ahí, consulta la información oficial en los días previos y ten una alternativa.`,
        },
        {
          type: "p",
          text: `Un detalle que sorprende a mucha gente: **Marruecos y ${city.name} no van a la misma hora**. En agosto de 2027, Ceuta está en horario peninsular español (UTC+2) y Marruecos en UTC+1. Quien cruce ese día tiene que ajustar el reloj, y confundirse en una hora significa perderse el eclipse entero.`,
        },
        { type: "h2", text: "Y una vez allí" },
        {
          type: "p",
          text: `No hace falta coche. ${city.name} tiene 19 km² y es caminable: desde el centro se llega a pie al frente marítimo, a las murallas y a buena parte de la costa. Cruzar con el coche añade coste, tiempo de embarque y un problema de aparcamiento el día del eclipse. Si tu punto de observación es urbano —y los mejores lo son—, cruzar como pasajero de pie es más sencillo y más barato.`,
        },
      ],
      faq: [
        {
          q: `¿Cómo se llega a ${city.name}?`,
          a: `En ferry desde Algeciras, con travesías de aproximadamente una hora sobre unos 14 km de mar. También existe una conexión en helicóptero, de capacidad reducida. ${city.name} no tiene aeropuerto: los aeropuertos de referencia son Gibraltar, Málaga, Jerez y Sevilla.`,
        },
        {
          q: "¿Hay que llevar pasaporte para ir a Ceuta?",
          a: "Ceuta es territorio español, así que para ciudadanos españoles y de la UE basta con el DNI o el documento de identidad en vigor. Es frontera exterior de la Unión, así que hay control de documentación en los dos sentidos y conviene llevarlo a mano, también el de los menores.",
        },
        {
          q: "¿Cuándo hay que reservar el ferry para el eclipse?",
          a: "En cuanto se abran las ventas para agosto de 2027. El aforo de los barcos es el factor limitante de todo el viaje y la demanda del 1 y 2 de agosto será excepcional. Reservar la vuelta para el día 3 en lugar del 2 evita el peor momento del puerto.",
        },
        {
          q: "¿Merece la pena cruzar con el coche?",
          a: "Para ver el eclipse, normalmente no. La ciudad es caminable y los mejores puntos de observación son accesibles a pie desde el centro. El coche añade coste de pasaje, tiempo de embarque y un problema de aparcamiento el día del eclipse.",
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: `How to get to ${name} for the eclipse of 2 August 2027`,
        description: `Every way of reaching ${name} for the eclipse: the ferry from Algeciras, the helicopter, the airports to fly into, and why you have to book far ahead.`,
        lead: `You reach ${name} by sea. The ferry from Algeciras crosses some 14 km of water and is the normal route, with sailings of roughly an hour. On ${ECLIPSE_DAY.en} that makes ferry capacity the real bottleneck of the trip, and the one part of the plan that has to be solved months in advance.`,
        body: [
          {
            type: "p",
            text: `First things first: **${name} has no airport**. It has a heliport with short-hop connections, but the infrastructure for arriving in numbers is the port. Everyone who wants to watch the eclipse from here will pass through the same place, in the same hours, with the same number of seats available as on any other August day.`,
          },
          {
            type: "figure",
            art: "ferry-route",
            caption:
              "The usual crossing leaves from Algeciras. This is an external border of the European Union, so documents are checked in both directions.",
          },
          { type: "h2", text: "The ferry from Algeciras" },
          {
            type: "p",
            text: `This is the main route. The crossing is short — of the order of an hour, a little more on conventional ships — with departures spread through the day. You can board with a car, a motorbike or as a foot passenger, and more than one operator covers the route. We deliberately do not print timetables or fares here: they change every season, and a stale figure in a travel guide does more harm than no figure at all.`,
          },
          {
            type: "ul",
            items: [
              "Book as soon as sales open for August 2027. Demand on 1 and 2 August will look like nothing this route has seen.",
              "Book out and back separately if that lets you return on the 3rd instead of the 2nd. It is worth it.",
              "Reach the port with generous margin, especially coming back. There is border control, and there will be a queue that day.",
              "Carry a valid ID card or passport, and one for everyone travelling with you, children included.",
            ],
          },
          {
          type: "figure",
          art: "path-strait",
          caption:
            "The whole Strait area is inside the path: both shores see totality, seconds apart.",
        },
        { type: "h2", text: "Getting to Algeciras" },
          {
            type: "p",
            text: `Algeciras is well connected by road and rail to the rest of Andalusia. The airports to consider are **Gibraltar**, the closest, **Malaga**, the best connected internationally and around two hours by road, and **Jerez** and **Seville** as alternatives. If you are flying in, plan a night in the area before crossing: chaining a flight and a ferry on the same day, with the eclipse the following morning, leaves no margin at all.`,
          },
          {
            type: "callout",
            title: "The robust plan, in one sentence",
            text: `Arrive in the area on 31 July or 1 August, cross to ${name} on the 1st, sleep there on the nights of the 1st and the 2nd, and travel home on the 3rd. It costs one extra night and removes almost every risk: delays, sold-out sailings, traffic, and the queue at the port after the eclipse.`,
          },
          { type: "h2", text: "The helicopter" },
          {
            type: "p",
            text: `There is a helicopter link to the mainland from the ${name} heliport. It is fast but very limited in capacity and sensitive to wind — and the levante blows in August. It is not a realistic way to move numbers on eclipse day, but it can be an option for anyone travelling light who books early. As with the ferry: check the operator for real schedules and availability.`,
          },
          { type: "h2", text: "Arriving from Morocco" },
          {
            type: "p",
            text: `${name} has a land border with Morocco at El Tarajal, and Tangier and Tetouan are close. That said: conditions at that crossing can change, and have changed in the past with little notice, and we are not going to forecast how it will be in August 2027. If your plan depends on crossing there, check official information in the days beforehand and have an alternative.`,
          },
          {
            type: "p",
            text: `One detail that catches people out: **Morocco and ${name} do not keep the same time**. In August 2027 Ceuta is on mainland Spanish time (UTC+2) and Morocco is on UTC+1. Anyone crossing that day has to adjust their watch, and being an hour out means missing the eclipse entirely.`,
          },
          { type: "h2", text: "And once you are there" },
          {
            type: "p",
            text: `You do not need a car. ${name} covers 19 km² and is walkable: the seafront, the walls and much of the coast are within walking distance of the centre. Bringing a car adds fare, boarding time and a parking problem on eclipse day. If your viewing spot is in town — and the best ones are — crossing as a foot passenger is simpler and cheaper.`,
          },
        ],
        faq: [
          {
            q: `How do you get to ${name}?`,
            a: `By ferry from Algeciras, with crossings of roughly an hour over some 14 km of water. There is also a helicopter link with limited capacity. ${name} has no airport: the airports to fly into are Gibraltar, Malaga, Jerez and Seville.`,
          },
          {
            q: "Do I need a passport to go to Ceuta?",
            a: "Ceuta is Spanish territory, so for Spanish and EU citizens a valid national ID card is enough. It is an external border of the Union, so documents are checked in both directions and should be kept to hand, including for children.",
          },
          {
            q: "When should I book the ferry for the eclipse?",
            a: "As soon as sales open for August 2027. Ferry capacity is the limiting factor of the whole trip and demand on 1 and 2 August will be exceptional. Booking the return for the 3rd rather than the 2nd avoids the worst of the port.",
          },
          {
            q: "Is it worth taking a car across?",
            a: "For watching the eclipse, usually not. The city is walkable and the best viewing spots are reachable on foot from the centre. A car adds a vehicle fare, boarding time and a parking problem on eclipse day.",
          },
        ],
      };
    },
  },
};

/** Dónde dormir. El post más comercialmente relevante de la sección. */
export const dondeDormir: BlogPost = {
  slug: "donde-dormir-la-noche-del-eclipse-en-ceuta",
  citySlug: "ceuta",
  category: "viaje",
  published: PUBLISHED,
  cover: "path-strait",
  related: [
    "como-llegar-a-ceuta-para-el-eclipse",
    "movilidad-y-atascos-el-dia-del-eclipse-en-ceuta",
    "por-que-ceuta-es-el-mejor-sitio-de-espana-para-ver-el-eclipse",
  ],
  content: {
    es: (city) => ({
      title: `Dónde dormir la noche del eclipse: ${city.name} o la Península`,
      description: `Ceuta tiene una capacidad de alojamiento pequeña para la demanda que va a haber el 2 de agosto de 2027. Las opciones reales, incluida la de dormir en el Campo de Gibraltar, y qué se pierde con cada una.`,
      lead: `Ésta es la decisión que más condiciona el viaje, y hay que tomarla pronto. ${city.name} tiene una capacidad hotelera pequeña —es una ciudad de unos ${(city.population ?? 83000).toLocaleString("es-ES")} habitantes en 19 km²— frente a una demanda que será excepcional. Quien quiera dormir dentro tiene que reservar con muchísima antelación; quien no llegue, tiene una alternativa perfectamente válida a una hora de barco.`,
      body: [
        {
          type: "p",
          text: `Conviene ser honesto con el punto de partida: no vamos a publicar una lista de hoteles con precios y disponibilidad, porque a esta distancia de la fecha sería inventar. Lo que sí se puede razonar es la estructura de la decisión, que es la parte que la gente resuelve mal.`,
        },
        { type: "h2", text: "Opción A: dormir en Ceuta" },
        {
          type: "p",
          text: `Es lo mejor si se consigue. Elimina de golpe el problema del ferry el día del eclipse, permite ir andando al punto de observación, y sobre todo permite **no volver corriendo después de C4** a las ${hm(city.localTimes.partialEnd)}, que es lo que estropea el día a quien viene y vuelve.`,
        },
        {
          type: "ul",
          items: [
            "Reserva en cuanto se abran las ventas. Y no solo la noche del 1 al 2: también la del 2 al 3, para no tener que coger el peor barco del año.",
            "Comprueba la política de cancelación. A esta distancia, una reserva flexible vale más que veinte euros de descuento.",
            "El alojamiento entre particulares suele abrirse a la venta más tarde que los hoteles y a veces con más disponibilidad. Vale la pena vigilar ambos canales.",
            "Céntrate en el centro y la Almina si quieres ir andando. La periferia obliga a coche o taxi, y ese día los dos son un problema.",
          ],
        },
        { type: "h2", text: "Opción B: dormir en el Campo de Gibraltar y ver el eclipse allí" },
        {
          type: "p",
          text: `Ésta es la alternativa que casi nadie considera y que resuelve el problema. Algeciras, Los Barrios, San Roque y La Línea están **dentro de la franja de totalidad** y a unos veinte segundos de duración de Ceuta. Es decir: se pierden veinte segundos y se gana no depender de un barco, poder llegar en coche desde cualquier punto de Andalucía y disponer de una oferta de alojamiento mucho mayor. Para muchísima gente es objetivamente la mejor decisión.`,
        },
        {
          type: "figure",
          art: "path-strait",
          caption:
            "Toda la zona del Estrecho está dentro de la franja. La diferencia entre las dos orillas es de segundos; la diferencia con quedarse fuera de la franja es total.",
        },
        {
          type: "figure",
          art: "duration-bars",
          caption:
            "La diferencia entre Ceuta y el Campo de Gibraltar son unos veinte segundos. La diferencia con quedarse fuera de la franja es todo.",
        },
        { type: "h2", text: "Opción C: dormir fuera de la franja y desplazarse el día 2" },
        {
          type: "p",
          text: `Es la opción con más riesgo y la que más gente va a intentar. Dormir en Málaga, Sevilla o Cádiz y conducir la mañana del 2 hacia la franja significa competir por la carretera con decenas de miles de personas haciendo lo mismo, en las horas previas a un fenómeno que no espera. Si no hay otra alternativa, la regla es salir de madrugada, no a primera hora: **conviene estar dentro de la franja al amanecer**, no de camino a las nueve.`,
        },
        {
          type: "callout",
          title: "El error que hay que evitar a toda costa",
          text: `Dormir en la Península y tener el ferry a Ceuta reservado para la mañana del 2. Es la combinación con más puntos de fallo posible: un retraso, una cola en el control o un barco cancelado por viento y te quedas viendo el eclipse desde la terminal del puerto. Si duermes fuera, ve el eclipse fuera: el Campo de Gibraltar está en la franja.`,
        },
        { type: "h2", text: "Lo que va a pasar con los precios" },
        {
          type: "p",
          text: `Lo previsible: subirán, y bastante, en toda la zona del Estrecho para las noches del 1 y el 2 de agosto de 2027. No es especulación sobre este eclipse en concreto, es lo que ocurre en todos: la demanda se concentra en dos noches y en una franja de 260 km. La consecuencia práctica es que **reservar pronto no es solo cuestión de disponibilidad, es de precio**, y que las cancelaciones gratuitas son la forma de no quedarse atrapado en una decisión tomada con un año de antelación.`,
        },
        { type: "h2", text: "Resumen" },
        {
          type: "table",
          head: ["Opción", "Totalidad", "Riesgo del día", "Para quién"],
          rows: [
            [`Dormir en ${city.name}`, durationWords(city, "es"), "Bajo: se va andando", "Quien reserve pronto"],
            ["Campo de Gibraltar", "Unos 20 s menos", "Bajo: se llega en coche", "La mayoría de la gente"],
            ["Fuera de la franja", "Ninguna sin desplazarse", "Alto: carretera saturada", "Solo si no hay alternativa"],
          ],
        },
      ],
      faq: [
        {
          q: `¿Hay hoteles suficientes en ${city.name} para el eclipse?`,
          a: `Previsiblemente no para toda la demanda: es una ciudad de unos ${(city.population ?? 83000).toLocaleString("es-ES")} habitantes en 19 km² y el eclipse atraerá visitantes en número excepcional. Quien quiera dormir en Ceuta debería reservar en cuanto se abran las ventas, incluida la noche siguiente al eclipse.`,
        },
        {
          q: "¿Puedo dormir en Algeciras y ver la totalidad?",
          a: "Sí. Algeciras, Los Barrios, San Roque y La Línea están dentro de la franja de totalidad, con una duración solo unos veinte segundos inferior a la de Ceuta. Es una alternativa excelente y con mucha más oferta de alojamiento.",
        },
        {
          q: "¿Es mala idea dormir en Málaga y cruzar a Ceuta el día del eclipse?",
          a: "Es la peor combinación posible. Sumas carretera saturada, cola en el puerto, control fronterizo y aforo de ferry, todo antes de una cita que no espera. Si duermes en la Península, ve el eclipse en la Península: el Campo de Gibraltar está en la franja.",
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: `Where to sleep on eclipse night: ${name} or the mainland`,
        description: `Ceuta has a small accommodation capacity against the demand coming on 2 August 2027. The real options, including sleeping in the Campo de Gibraltar, and what each one costs you.`,
        lead: `This is the decision that shapes the whole trip, and it has to be taken early. ${name} has limited hotel capacity — a city of around ${(city.population ?? 83000).toLocaleString("en-GB")} people in 19 km² — against demand that will be exceptional. If you want to sleep inside, book very far ahead; if you cannot, there is a perfectly good alternative an hour away by boat.`,
        body: [
          {
            type: "p",
            text: `Be honest about the starting point: we are not going to publish a list of hotels with prices and availability, because at this distance from the date that would be invention. What can be reasoned through is the structure of the decision, which is the part people get wrong.`,
          },
          { type: "h2", text: "Option A: sleep in Ceuta" },
          {
            type: "p",
            text: `This is the best outcome if you can get it. It removes the ferry problem on eclipse day at a stroke, lets you walk to your viewing spot, and above all lets you **not rush back after C4** at ${hm(city.localTimes.partialEnd)} — which is what ruins the day for people who come and go.`,
          },
          {
            type: "ul",
            items: [
              "Book as soon as sales open. And not only the night of the 1st: the night of the 2nd too, so you never have to board the worst sailing of the year.",
              "Check the cancellation policy. At this distance, a flexible booking is worth more than a twenty-euro discount.",
              "Private lettings often go on sale later than hotels and sometimes with more availability. Watch both channels.",
              "Focus on the centre and the Almina if you want to walk. The outskirts mean a car or a taxi, and on that day both are a problem.",
            ],
          },
          { type: "h2", text: "Option B: sleep in the Campo de Gibraltar and watch from there" },
          {
            type: "p",
            text: `This is the alternative almost nobody considers and it solves the problem. Algeciras, Los Barrios, San Roque and La Línea are **inside the path of totality**, within about twenty seconds of Ceuta's duration. You give up twenty seconds and you gain independence from a boat, road access from anywhere in Andalusia, and a far larger stock of beds. For a great many people it is objectively the better decision.`,
          },
          {
            type: "figure",
            art: "path-strait",
            caption:
              "The whole Strait area lies inside the path. The difference between the two shores is seconds; the difference against being outside the path is absolute.",
          },
          {
          type: "figure",
          art: "duration-bars",
          caption:
            "The gap between Ceuta and the Campo de Gibraltar is about twenty seconds. The gap against being outside the path is everything.",
        },
        { type: "h2", text: "Option C: sleep outside the path and drive in on the 2nd" },
          {
            type: "p",
            text: `This is the riskiest option and the one most people will attempt. Sleeping in Malaga, Seville or Cadiz and driving towards the path on the morning of the 2nd means competing for road space with tens of thousands of people doing the same thing, in the hours before an event that does not wait. If there is no alternative, the rule is to leave in the small hours rather than early morning: **be inside the path at dawn**, not on the road at nine.`,
          },
          {
            type: "callout",
            title: "The mistake to avoid at all costs",
            text: `Sleeping on the mainland with a ferry to Ceuta booked for the morning of the 2nd. It is the combination with the most points of failure available: one delay, one queue at the checkpoint or one sailing cancelled for wind, and you watch the eclipse from the ferry terminal. If you sleep outside, watch from outside: the Campo de Gibraltar is in the path.`,
          },
          { type: "h2", text: "What will happen to prices" },
          {
            type: "p",
            text: `The predictable thing: they will rise, substantially, across the Strait area for the nights of 1 and 2 August 2027. That is not speculation about this eclipse in particular — it is what happens at all of them, because demand concentrates into two nights along a 260 km band. The practical consequence is that **booking early is not just about availability, it is about price**, and that free cancellation is how you avoid being trapped by a decision taken a year out.`,
          },
          { type: "h2", text: "Summary" },
          {
            type: "table",
            head: ["Option", "Totality", "Risk on the day", "Who it suits"],
            rows: [
              [`Sleep in ${name}`, durationWords(city, "en"), "Low: you walk", "Anyone who books early"],
              ["Campo de Gibraltar", "About 20 s less", "Low: you drive", "Most people"],
              ["Outside the path", "None without travelling", "High: saturated roads", "Only if there is no alternative"],
            ],
          },
        ],
        faq: [
          {
            q: `Are there enough hotels in ${name} for the eclipse?`,
            a: `Probably not for all the demand: it is a city of around ${(city.population ?? 83000).toLocaleString("en-GB")} people in 19 km² and the eclipse will draw exceptional numbers. If you want to sleep in Ceuta, book as soon as sales open — including the night after the eclipse.`,
          },
          {
            q: "Can I sleep in Algeciras and still see totality?",
            a: "Yes. Algeciras, Los Barrios, San Roque and La Línea are inside the path of totality, only about twenty seconds shorter than Ceuta. It is an excellent alternative with far more accommodation.",
          },
          {
            q: "Is sleeping in Malaga and crossing to Ceuta on eclipse day a bad idea?",
            a: "It is the worst combination available. You stack saturated roads, a port queue, border control and ferry capacity, all before an appointment that will not wait. If you sleep on the mainland, watch from the mainland: the Campo de Gibraltar is in the path.",
          },
        ],
      };
    },
  },
};
