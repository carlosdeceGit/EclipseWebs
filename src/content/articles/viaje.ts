import { formatDuration } from "@/lib/eclipse/cities";
import type { Article } from "./types";

/** Alojamiento: la decisión que hay que tomar antes que ninguna otra. */
export const alojamiento: Article = {
  slug: "alojamiento",
  content: {
    es: (city) => ({
      title: `Alojamiento para el eclipse en ${city.name}: qué hacer y cuándo reservar`,
      description: `Cómo encontrar sitio en ${city.name} para el eclipse del 2 de agosto de 2027, qué precios esperar y qué alternativas hay si se agota todo dentro de la franja.`,
      body: [
        {
          type: "p",
          text: `El eclipse cae un lunes de agosto, en plena temporada alta, sobre una franja estrecha de costa que ya está llena. Esa combinación es la que agota el alojamiento con meses de antelación en todos los eclipses recientes: en los de Estados Unidos de 2017 y 2024, los hoteles dentro de la franja colgaron el cartel de completo más de un año antes, con tarifas de tres a cinco veces la habitual y estancias mínimas de varias noches.`,
        },
        { type: "h2", text: "Cuándo reservar" },
        {
          type: "p",
          text: `Cuanto antes, y con cancelación gratuita. La estrategia que mejor funciona es reservar ya algo cancelable dentro de la franja aunque no sea ideal, y seguir buscando con red debajo. Lo que no funciona es esperar a que bajen los precios: en un eclipse la demanda es un pico de un solo día que no se relaja.`,
        },
        { type: "h2", text: `Dormir en ${city.name} o dormir fuera` },
        {
          type: "p",
          text: city.eclipse.isTotal
            ? `Dormir dentro de la franja evita el problema real del día 2, que no es encontrar sitio para ver el eclipse sino llegar. La totalidad en ${city.name} empieza a las ${city.localTimes.totalityStart}, así que quien duerma fuera tendrá que conducir esa misma mañana hacia una zona con carreteras saturadas. Si no encuentras nada en ${city.name}, un alojamiento más lejos pero dentro de la franja sigue siendo mejor que uno más cerca pero fuera.`
            : `Desde ${city.name} el eclipse se ve parcial, así que si el objetivo es la totalidad conviene buscar alojamiento directamente dentro de la franja y usar ${city.name} solo como base de apoyo.`,
        },
        { type: "h2", text: "Alternativas cuando se agotan los hoteles" },
        {
          type: "ul",
          items: [
            "Campings y áreas de autocaravana de la franja, que suelen abrir reservas más tarde que los hoteles.",
            "Alquiler vacacional completo repartiendo el coste entre varias personas, que es lo que mejor aguanta la subida de precios.",
            "Localidades del interior de la franja, menos demandadas que la primera línea de playa y con la misma totalidad. Medina Sidonia, Vejer o Los Barrios entran aquí.",
            "Ferry o tren nocturno para llegar de madrugada el mismo día 2, evitando la carretera en hora punta.",
            "El tablón de clasificados de esta web, donde particulares de la zona ofrecen habitaciones para esos días.",
          ],
        },
        {
          type: "callout",
          title: "Aviso sobre precios",
          text: "No publicamos precios concretos de hoteles porque cambian a diario y cualquier cifra fija envejece mal. En el directorio recogemos los alojamientos que confirman disponibilidad para esas fechas, con enlace directo a su propia web.",
        },
        { type: "h2", text: "Si vienes en autocaravana" },
        {
          type: "p",
          text: `Es la opción más flexible y la que más conflictos genera. La acampada libre está prohibida en la mayor parte del litoral de ${city.province}, y para un evento de esta magnitud es previsible que los ayuntamientos habiliten zonas específicas y refuercen la vigilancia. Publicamos las áreas oficiales en la guía de eventos según se confirmen.`,
        },
        { type: "h2", text: "Cuidado con las estafas" },
        {
          type: "p",
          text: `Alrededor de un evento con demanda desbordada aparecen anuncios falsos de alojamiento. Las señales son siempre las mismas: precio muy por debajo del mercado, prisa por cerrar, y pago por adelantado fuera de cualquier plataforma. Si reservas a un particular, verifica que existe la dirección y desconfía de quien se niega a una videollamada.`,
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: `Where to stay for the eclipse in ${name}`,
        description: `How to find a place in ${name} for the 2 August 2027 eclipse, what prices to expect, and what to do if everything inside the path is booked out.`,
        body: [
          {
            type: "p",
            text: `The eclipse falls on a Monday in August, at the height of the Spanish holiday season, over a narrow strip of coast that is already full. That combination is what sells out accommodation months in advance at every recent eclipse: in the United States in 2017 and 2024, hotels inside the path were full more than a year ahead, at three to five times normal rates and with multi-night minimum stays.`,
          },
          { type: "h2", text: "When to book" },
          {
            type: "p",
            text: `As early as possible, and with free cancellation. The strategy that works is to book something cancellable inside the path now, even if it is not ideal, and keep looking with a safety net underneath. Waiting for prices to fall does not work: eclipse demand is a single-day spike that never eases.`,
          },
          { type: "h2", text: `Staying in ${name} or staying outside` },
          {
            type: "p",
            text: city.eclipse.isTotal
              ? `Sleeping inside the path avoids the real problem on the day, which is not finding a spot to watch from but getting there at all. Totality in ${name} begins at ${city.localTimes.totalityStart}, so anyone staying outside has to drive that same morning into an area with saturated roads. If you cannot find anything in ${name}, somewhere further away but inside the path still beats somewhere closer but outside it.`
              : `From ${name} the eclipse is partial, so if totality is the goal, look for accommodation inside the path itself and treat ${name} only as a base.`,
          },
          { type: "h2", text: "Alternatives when the hotels are gone" },
          {
            type: "ul",
            items: [
              "Campsites and motorhome areas inside the path, which usually open bookings later than hotels.",
              "A whole holiday rental split between several people, which absorbs the price rise best.",
              "Inland towns inside the path, far less in demand than the beachfront and with identical totality.",
              "An overnight ferry or train to arrive in the early hours of 2 August, avoiding the roads at peak time.",
              "The classifieds board on this site, where local residents offer rooms for those dates.",
            ],
          },
          {
            type: "callout",
            title: "A note on prices",
            text: "We do not publish specific hotel prices because they change daily and any fixed figure ages badly. The directory lists accommodation that has confirmed availability for those dates, linking straight to their own site.",
          },
          { type: "h2", text: "Arriving from abroad" },
          {
            type: "p",
            text: `Malaga is the main international airport for the area and will be the bottleneck: book flights well before the eclipse enters mainstream news coverage. Gibraltar and Jerez are smaller alternatives, and Seville works as a wider entry point with a drive south. Note that Spain is on CEST (UTC+2) in August, while Morocco across the Strait is on UTC+1 — an hour's difference that has caught out more than one eclipse chaser.`,
          },
          { type: "h2", text: "Watch out for scams" },
          {
            type: "p",
            text: `Events with runaway demand attract fake accommodation listings. The signals are always the same: a price well below market, pressure to close quickly, and advance payment outside any platform. If you book from a private owner, verify the address exists and be wary of anyone who refuses a video call.`,
          },
        ],
      };
    },
  },
};

/** Cómo llegar: el problema logístico real del día. */
export const comoLlegar: Article = {
  slug: "como-llegar",
  content: {
    es: (city) => ({
      title: `Cómo llegar a ${city.name} para el eclipse del 2 de agosto de 2027`,
      description: `Ferris, aeropuertos, trenes y carreteras para llegar a ${city.name} el día del eclipse, y cómo evitar quedarte atrapado en la carretera durante la totalidad.`,
      body: [
        {
          type: "p",
          text: city.eclipse.isTotal
            ? `El problema logístico del 2 de agosto de 2027 no es ver el eclipse: es estar dentro de la franja a las ${city.localTimes.totalityStart}. La totalidad dura minutos y no espera. Todo lo que sigue está pensado para que no te pille en un atasco.`
            : `Desde ${city.name} el eclipse se ve parcial, así que la planificación aquí consiste en llegar a la franja a tiempo. La totalidad dura minutos y no espera.`,
        },
        { type: "h2", text: "La regla de la noche anterior" },
        {
          type: "p",
          text: `Duerme dentro de la franja la noche del 1 al 2 de agosto. Es la única forma de no depender del tráfico. En los eclipses de 2017 y 2024 en Estados Unidos se registraron atascos de varias horas en carreteras secundarias que normalmente están vacías, y hubo gente que vio la totalidad desde el arcén porque no llegó a tiempo. Aquí el efecto puede ser mayor, porque parte de la franja es costa con una sola vía de acceso.`,
        },
        { type: "h2", text: `Llegar a ${city.name}` },
        {
          type: "ul",
          items:
            city.slug === "ceuta" || city.slug === "melilla"
              ? [
                  "Por mar: los ferris desde la Península son el acceso principal y se llenarán. Reserva plaza con mucha antelación, y con vehículo aún más; plantéate cruzar como pasajero y moverte a pie o en transporte público.",
                  "Cuenta con colas y controles fronterizos más lentos de lo normal ese fin de semana.",
                  "El aeropuerto de referencia en la Península es Málaga; desde allí hay que bajar al puerto de Algeciras o Tarifa.",
                  "Reserva el ferry de vuelta también: el día 2 por la tarde todo el mundo saldrá a la vez.",
                ]
              : [
                  "En coche: la A-7 y la N-340 son los ejes principales de la costa y serán el cuello de botella. Cualquier desvío por carreteras locales estará igual de saturado.",
                  "En avión: Málaga es el aeropuerto grande de referencia, con Jerez y Gibraltar como alternativas más pequeñas. Los vuelos de esas fechas suben de precio pronto.",
                  "En tren: la red llega bien a Málaga, Cádiz y Jerez, pero no cubre buena parte de los municipios de la franja, así que casi siempre hay que combinar con autobús o coche.",
                  "En autobús: la opción más barata y la más expuesta al atasco. Sirve para llegar días antes, no esa mañana.",
                ],
        },
        { type: "h2", text: "Moverse el mismo día 2" },
        {
          type: "ul",
          items: [
            "Ten elegido el sitio de observación con antelación y una alternativa a menos de veinte minutos por si el cielo se cubre justo ahí.",
            "Llega al punto de observación al menos dos horas antes del inicio de la totalidad.",
            "Cuenta con que la cobertura móvil se degrade: decenas de miles de personas en la misma zona saturan la red. Descarga mapas y horarios sin conexión.",
            "Lleva agua y sombra. Es agosto en el sur y la espera es a pleno sol.",
            "Llena el depósito el día antes. Las gasolineras de la franja se quedarán sin existencias.",
            "No pares en el arcén de una autovía para mirar. Es peligroso y es la escena que provoca los accidentes típicos de los días de eclipse.",
          ],
        },
        {
          type: "callout",
          title: "La vuelta es peor que la ida",
          text: "Todo el mundo se va a la vez, en cuanto termina la totalidad. Si puedes, quédate a comer donde estés y sal por la tarde: ganarás tiempo y de paso el negocio local lo agradece.",
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: `Getting to ${name} for the 2 August 2027 eclipse`,
        description: `Ferries, airports, trains and roads for reaching ${name} on eclipse day, and how to avoid being stuck in traffic during totality.`,
        body: [
          {
            type: "p",
            text: city.eclipse.isTotal
              ? `The logistical problem on 2 August 2027 is not watching the eclipse: it is being inside the path by ${city.localTimes.totalityStart}. Totality lasts minutes and does not wait. Everything below is designed to keep you out of a traffic jam.`
              : `From ${name} the eclipse is only partial, so planning here means reaching the path in time. Totality lasts minutes and does not wait.`,
          },
          { type: "h2", text: "The night-before rule" },
          {
            type: "p",
            text: `Sleep inside the path on the night of 1–2 August. It is the only way not to depend on traffic. The 2017 and 2024 US eclipses produced multi-hour jams on back roads that are normally empty, and some people watched totality from the hard shoulder because they did not make it. The effect here could be worse, since parts of the path are coastline with a single access road.`,
          },
          { type: "h2", text: `Getting to ${name}` },
          {
            type: "ul",
            items:
              city.slug === "ceuta" || city.slug === "melilla"
                ? [
                    "By sea: ferries from mainland Spain are the main access and they will fill up. Book well ahead, and much further ahead with a vehicle; consider crossing as a foot passenger.",
                    "Expect slower border controls than usual that weekend.",
                    "The main mainland airport is Malaga; from there you travel down to the ports of Algeciras or Tarifa.",
                    "Book the return ferry too: everyone leaves at once on the afternoon of the 2nd.",
                  ]
                : [
                    "By car: the A-7 motorway and the N-340 are the coastal arteries and will be the bottleneck. Local road detours will be just as saturated.",
                    "By air: Malaga is the main airport, with Jerez and Gibraltar as smaller alternatives and Seville as a wider entry point. Fares for those dates rise early.",
                    "By train: the network serves Malaga, Cadiz and Jerez well, but not most of the smaller towns in the path, so you will usually combine it with a bus or car.",
                    "By bus: cheapest and most exposed to traffic. Useful for arriving days earlier, not that morning.",
                  ],
          },
          { type: "h2", text: "Moving around on the day" },
          {
            type: "ul",
            items: [
              "Choose your viewing spot in advance, plus a backup less than twenty minutes away in case cloud sits over the first one.",
              "Arrive at least two hours before totality begins.",
              "Expect mobile coverage to degrade: tens of thousands of people in one area saturate the network. Download maps and timings offline.",
              "Bring water and shade. It is August in southern Spain and the wait is in full sun.",
              "Fill the tank the day before. Petrol stations inside the path will run dry.",
              "Do not stop on a motorway hard shoulder to look. It is dangerous and it is the classic cause of eclipse-day accidents.",
            ],
          },
          {
            type: "callout",
            title: "The journey out is worse than the journey in",
            text: "Everyone leaves at the same moment, the instant totality ends. If you can, stay for lunch where you are and set off in the late afternoon: you will save time and the local businesses will appreciate it.",
          },
        ],
      };
    },
  },
};
