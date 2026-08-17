import type { LocalProfile } from "./types";

/**
 * Gibraltar: el único punto de la red con frontera, moneda propia y una montaña que
 * fabrica su propia nube. Las tres cosas son contenido que no existe en ninguna
 * otra web de la red, y la tercera es la más útil de todas.
 */
export const gibraltar: LocalProfile = {
  citySlug: "gibraltar",
  angle: {
    es: "Gibraltar verá la totalidad con el Peñón como silueta y con visitantes llegando directamente desde el Reino Unido. Tiene dos particularidades que no comparte con ningún otro punto de la franja, y las dos son avisos más que reclamos: se entra por una frontera que ese día puede ser el peor atasco de la comarca, y el propio Peñón fabrica su propia nube cuando sopla levante. Se puede dar el caso de que la cima esté tapada mientras a un par de kilómetros el cielo está despejado.",
    en: "Gibraltar will see totality with the Rock in silhouette and with visitors arriving straight from the UK. It has two features no other point in the path shares, and both are warnings rather than selling points: you get in through a border that could be the worst queue in the area that day, and the Rock itself manufactures its own cloud when the levante blows. It is entirely possible for the summit to be covered while the sky is clear a couple of kilometres away.",
  },
  whyHere: {
    es: "Gibraltar es el único territorio británico desde el que se verá esta totalidad, y eso lo convierte en un destino con audiencia propia: para buena parte del público del Reino Unido, el Peñón es el sitio del eclipse con vuelo directo. La totalidad aquí es larga, el Sol estará alto sobre el Mediterráneo y la silueta de la roca da a la escena algo que ninguna otra localidad de la franja puede ofrecer. A cambio, es también el punto con más restricciones prácticas de toda la red: superficie mínima, aforo limitado en casi todo lo interesante y una frontera de por medio.",
    en: "Gibraltar is the only British territory from which this totality will be visible, which gives it an audience of its own: for a large share of the UK public, the Rock is the eclipse destination with a direct flight. Totality here is long, the Sun will be high over the Mediterranean, and the Rock's silhouette gives the scene something no other town in the path can offer. In exchange, it is also the most practically constrained point in the network: minimal land area, capacity limits on almost everything worth seeing, and a border in the way.",
  },
  spots: [
    {
      name: "Europa Point",
      nameEn: "Europa Point",
      why: {
        es: "El extremo sur del Peñón, con horizonte abierto sobre el Estrecho y África enfrente, y sin la mole de la roca tapando nada. Es el mejor equilibrio entre vista y accesibilidad de todo el territorio.",
        en: "The southern tip, with an open horizon over the Strait and Africa opposite, and without the bulk of the Rock blocking anything. It is the best balance of view and accessibility in the whole territory.",
      },
      caveat: {
        es: "El aparcamiento es limitado y es la primera parada de todo autobús turístico. Ese día se llenará muy pronto: cuenta con llegar andando o en transporte público.",
        en: "Parking is limited and it is the first stop on every tour bus route. It will fill very early that day: plan on arriving on foot or by public transport.",
      },
    },
    {
      name: "Upper Rock: miradores y baterías de la cima",
      nameEn: "Upper Rock viewpoints and summit batteries",
      why: {
        es: "Altura y vista completa sobre la bahía, el Estrecho y las dos orillas. Sobre el papel es el mejor mirador de toda la franja.",
        en: "Height and a complete view over the bay, the Strait and both shores. On paper it is the best viewpoint in the entire path.",
      },
      caveat: {
        es: "Es reserva natural de pago, con entrada y horario, y aforo limitado en teleférico y accesos. Y es exactamente el sitio donde se forma la nube de levante: con esa predicción, es el peor sitio posible y no el mejor.",
        en: "It is a paid nature reserve with tickets, opening hours and limited capacity on the cable car and access roads. And it is precisely where the levanter cloud forms: with that forecast it is the worst possible spot, not the best.",
      },
    },
    {
      name: "Eastern Beach y Catalan Bay",
      nameEn: "Eastern Beach and Catalan Bay",
      why: {
        es: "El lado mediterráneo, con el Sol justo sobre ese mar a la hora de la totalidad y con playas donde se puede esperar sentado.",
        en: "The Mediterranean side, with the Sun directly over that sea at totality and beaches where you can wait sitting down.",
      },
      caveat: {
        es: "El Peñón queda detrás, hacia el oeste, y tapa justo la dirección por la que se acerca la sombra de la Luna: verás la totalidad, pero no la verás llegar. Catalan Bay además es muy pequeña y queda encajada bajo el acantilado.",
        en: "The Rock is behind you to the west, blocking exactly the direction the Moon's shadow approaches from: you will see totality, but you will not see it coming. Catalan Bay is also very small and hemmed in under the cliff.",
      },
    },
    {
      name: "Alameda Gardens y el frente oeste de la ciudad",
      nameEn: "Alameda Gardens and the western waterfront",
      why: {
        es: "Sombra, agua y espacio en la ciudad, con vista abierta hacia la bahía por el oeste, que es por donde entra la sombra. Se llega andando desde la frontera.",
        en: "Shade, water and space inside town, with an open view west across the bay — the direction the shadow arrives from. Walkable from the border.",
      },
      caveat: {
        es: "La ladera del Peñón recorta parte del cielo del este, aunque con el Sol a casi 40° eso no llega a estorbar. Lo que sí estorba es la densidad: es zona urbana y ese día estará llena.",
        en: "The Rock's slope crops part of the eastern sky, though with the Sun at nearly 40° that is not actually an obstruction. The crowding is: this is the town centre and it will be packed.",
      },
    },
  ],
  access: {
    es: [
      "La frontera con La Línea es el acceso y es el cuello de botella. A pie se cruza en minutos cuando no hay cola y en más de una hora cuando la hay; el día del eclipse habrá cola.",
      "Entrar en coche es mala idea aunque esté permitido: Gibraltar es diminuto y el aparcamiento, escaso. Lo normal y lo sensato es dejar el coche en La Línea y cruzar andando.",
      "El paso peatonal cruza la pista del aeropuerto y se corta con cada operación de vuelo. El tráfico rodado ya circula por el túnel bajo la pista, pero si vas a pie cuenta con esa espera.",
      "El aeropuerto de Gibraltar tiene vuelos directos con el Reino Unido, lo que convierte al Peñón en puerta de entrada para buena parte del público británico del eclipse.",
      "Lleva documentación en regla y ten en cuenta que las condiciones de paso pueden cambiar antes de 2027 por el acuerdo entre la Unión Europea y el Reino Unido sobre Gibraltar. Comprueba los requisitos poco antes de viajar y no des por válido lo que leíste hace un año.",
      "La moneda es la libra gibraltareña. Se acepta el euro casi en todas partes, pero con un cambio que no te va a gustar.",
    ],
    en: [
      "The land border with La Línea is the way in and it is the bottleneck. On foot it takes minutes when there is no queue and over an hour when there is; on eclipse day there will be a queue.",
      "Driving in is a bad idea even where it is allowed: Gibraltar is tiny and parking is scarce. The normal and sensible move is to leave the car in La Línea and walk across.",
      "The pedestrian crossing runs across the airport runway and is closed for every flight movement. Road traffic now uses the tunnel under the runway, but on foot you should budget for that wait.",
      "Gibraltar airport has direct flights to the UK, which makes the Rock a natural entry point for a large share of the British eclipse audience.",
      "Carry valid documentation, and bear in mind that crossing conditions may change before 2027 under the EU–UK treaty on Gibraltar. Check the requirements shortly before you travel rather than trusting what you read a year earlier.",
      "The currency is the Gibraltar pound. Euros are accepted almost everywhere, at an exchange rate you will not enjoy.",
    ],
  },
  bottleneck: {
    title: {
      es: "La cola de la frontera es el riesgo, y tiene una solución fácil",
      en: "The border queue is the risk, and it has an easy fix",
    },
    text: {
      es: "En un día normal de agosto la cola de la frontera ya se cuenta en decenas de minutos. Con un eclipse total encima, un flujo extraordinario de visitantes y todo el mundo intentando cruzar en la misma franja horaria, puede convertirse en horas. La solución es sencilla: cruza el día anterior y duerme dentro, o cruza a primera hora de la mañana con margen de sobra. Lo que no funciona es salir de La Línea a las nueve y media contando con llegar a tiempo.",
      en: "On an ordinary August day the border queue already runs to tens of minutes. With a total eclipse on top, an extraordinary influx of visitors and everyone trying to cross in the same window, it could stretch to hours. The fix is simple: cross the day before and sleep on the Rock, or cross early in the morning with plenty of margin. What does not work is leaving La Línea at half past nine and expecting to make it.",
    },
  },
  stay: {
    es: [
      "La oferta hotelera del Peñón es pequeña y cara incluso fuera de temporada alta. Para estas fechas, reservar pronto no es un consejo: es la única opción.",
      "La Línea de la Concepción está a diez minutos andando de la frontera, dentro de la franja, y ve la totalidad prácticamente igual de larga que Gibraltar: la diferencia entre las dos es de un par de segundos. Dormir en La Línea es más barato y más fácil.",
      "Dicho eso: si te quedas en La Línea, la pregunta honesta es si merece la pena cruzar. Por dos segundos de totalidad, no. Cruza si quieres ver el eclipse desde el Peñón porque te apetece verlo desde el Peñón, no porque creas que allí se ve mejor.",
      "El resto del Campo de Gibraltar —San Roque, Los Barrios, Algeciras— está dentro de la franja, tiene más plazas y evita la frontera por completo.",
    ],
    en: [
      "Hotel stock on the Rock is small and expensive even outside high season. For these dates, booking early is not advice: it is the only option.",
      "La Línea de la Concepción is a ten-minute walk from the border, inside the path, and sees a totality practically as long as Gibraltar's — the difference between them is a couple of seconds. Staying in La Línea is cheaper and easier.",
      "That said: if you are staying in La Línea, the honest question is whether crossing is worth it. For two seconds of totality, no. Cross if you want to watch from the Rock because watching from the Rock appeals to you, not because you think the view is better.",
      "The rest of the Campo de Gibraltar — San Roque, Los Barrios, Algeciras — is inside the path, has more beds and avoids the border entirely.",
    ],
  },
  weather: {
    title: {
      es: "El Peñón fabrica su propia nube",
      en: "The Rock makes its own cloud",
    },
    text: {
      es: "Cuando sopla levante, el aire húmedo del Mediterráneo choca contra la cara este del Peñón, asciende y condensa: se forma una nube estacionaria —el levanter— que corona la roca y se derrama por la ladera oeste mientras el resto del cielo puede estar despejado. Es un fenómeno cotidiano en verano y perfectamente local: afecta a la cima y a la ciudad al pie, no a la bahía entera. La consecuencia práctica para el 2 de agosto es directa: si la predicción da levante, baja. Europa Point, la costa de La Línea o el lado oeste de la bahía se salen del efecto sin salirse de la franja, y la totalidad allí es la misma.",
      en: "When the levante blows, humid Mediterranean air hits the Rock's eastern face, rises and condenses: a stationary cap cloud — the levanter — forms over the summit and spills down the western slope while the rest of the sky may be perfectly clear. It is an everyday summer phenomenon and a strictly local one: it affects the summit and the town below it, not the whole bay. The practical consequence for 2 August is direct: if the forecast calls levante, go down. Europa Point, the La Línea shoreline or the western side of the bay escape the effect without leaving the path, and totality there is identical.",
    },
  },
};
