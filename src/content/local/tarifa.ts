import type { LocalProfile } from "./types";

/**
 * Tarifa: el punto más al sur de la Península, con África enfrente y con el viento
 * más constante de Europa. Ese viento no es color local: es la variable que decide
 * si el 2 de agosto se ve la corona o una nube.
 */
export const tarifa: LocalProfile = {
  citySlug: "tarifa",
  angle: {
    es: "Tarifa es el sitio donde la sombra de la Luna entra en Europa desde el Atlántico y donde se ve África enfrente mientras ocurre. Es también el punto más ventoso del continente, y ahí está el matiz que ninguna guía general recoge: en Tarifa el viento no es una molestia, es la variable que decide si el eclipse se ve. Un levante fuerte el 2 de agosto puede dejar la corona detrás de una banda de nubes bajas mientras a veinte kilómetros al oeste el cielo está limpio.",
    en: "Tarifa is where the Moon's shadow enters Europe from the Atlantic, with Africa in full view while it happens. It is also the windiest point on the continent, and that is the detail no general guide carries: in Tarifa the wind is not an inconvenience, it is the variable that decides whether you see the eclipse at all. A strong levante on 2 August can leave the corona behind a band of low cloud while twenty kilometres to the west the sky is clear.",
  },
  whyHere: {
    es: "Tarifa es donde la sombra de la Luna entra en la Europa continental. Cruza el Atlántico, toca tierra por esta costa y sigue hacia el Estrecho, así que desde aquí se puede ver llegar sobre el agua antes de que llegue a ninguna otra parte de la Península. Añade a eso la vista de África enfrente, la totalidad más larga de la provincia de Cádiz y un pueblo pequeño acostumbrado a llenarse de visitantes en agosto, y tienes el punto que más eclipsistas internacionales va a atraer de toda la franja peninsular. También el que más depende del viento, que aquí no es un detalle sino la variable principal.",
    en: "Tarifa is where the Moon's shadow enters continental Europe. It crosses the Atlantic, makes landfall on this coast and carries on into the Strait, so from here you can watch it arrive over the water before it reaches anywhere else on the Spanish mainland. Add the view of Africa opposite, the longest totality in the province of Cádiz and a small town well used to filling up in August, and you have the spot likely to draw more international eclipse chasers than anywhere else in the mainland path. Also the one that depends most on the wind, which here is not a detail but the main variable.",
  },
  spots: [
    {
      name: "Playa de Los Lances",
      why: {
        es: "Kilómetros de arena llana con horizonte atlántico abierto hacia el oeste, que es por donde llega la sombra cruzando el agua. Es el único sitio del municipio con espacio real para mucha gente a la vez.",
        en: "Kilometres of flat sand with an open Atlantic horizon to the west, the direction the shadow arrives from across the water. It is the only place in the municipality with genuine room for large numbers of people.",
      },
      caveat: {
        es: "Buena parte es paraje natural protegido con accesos limitados, y no hay una sola sombra. Con levante, la arena en suspensión es un problema serio para cualquier equipo óptico.",
        en: "Much of it is protected natural parkland with limited access points, and there is not a scrap of shade. With a levante blowing, airborne sand is a serious problem for any optical gear.",
      },
    },
    {
      name: "Mirador del Estrecho",
      why: {
        es: "Altura sobre el Estrecho con África enfrente y vista del agua por la que cruza la sombra. Estar por encima del nivel del mar ayuda si hay nubosidad baja pegada a la costa.",
        en: "Height over the Strait with Africa opposite and a view of the water the shadow crosses. Being above sea level helps if low cloud is clinging to the coastline.",
      },
      caveat: {
        es: "El aparcamiento es pequeño y está junto a una carretera nacional de curvas. Ese día se colapsa: o llegas mucho antes del amanecer o asumes que no vas a poder parar. Con levante fuerte es además de los primeros sitios en quedar tapados, porque es justo donde encalla la nube.",
        en: "The car park is small and sits beside a winding main road. It will gridlock that day: either you arrive long before dawn or you accept you will not be able to stop. With a strong levante it is also one of the first places to be covered, because it is exactly where the cloud runs aground.",
      },
    },
    {
      name: "Punta de Tarifa y el malecón de la isla de las Palomas",
      why: {
        es: "El punto más al sur de la Europa continental, con el Mediterráneo a un lado y el Atlántico al otro. Simbólicamente no hay mejor sitio en toda la franja peninsular.",
        en: "Continental Europe's southernmost point, Mediterranean on one side and Atlantic on the other. Symbolically there is no better spot in the whole mainland path.",
      },
      caveat: {
        es: "La isla es zona militar y su acceso está restringido. El malecón que llega hasta la puerta sí es público, pero es un paso estrecho: cabe poca gente y no es sitio para plantar un trípode entre multitudes.",
        en: "The island itself is military ground with restricted access. The causeway up to the gate is public, but it is a narrow walkway: it holds few people and is no place to set up a tripod in a crowd.",
      },
    },
    {
      name: "Valdevaqueros y la duna de Punta Paloma",
      why: {
        es: "Playas anchas del lado atlántico con la duna como punto elevado natural y horizonte limpio en casi todas las direcciones.",
        en: "Wide Atlantic-side beaches with the dune as a natural high point and a clean horizon in almost every direction.",
      },
      caveat: {
        es: "Es la zona de kitesurf y en agosto ya está llena sin eclipse. El aparcamiento es informal y el acceso, una única salida de la N-340.",
        en: "This is the kitesurfing zone and it is already packed in August without an eclipse. Parking is informal and access is a single turn-off from the N-340.",
      },
    },
    {
      name: "Ensenada de Bolonia",
      why: {
        es: "Ensenada abierta al oeste, con la duna y el conjunto arqueológico de Baelo Claudia. Menos masificada que el entorno del pueblo y con horizonte marino amplio.",
        en: "A west-facing cove with its dune and the Roman site of Baelo Claudia. Less crowded than the area around the town, with a wide sea horizon.",
      },
      caveat: {
        es: "Se llega por una carretera de varios kilómetros sin salida: entra todo el mundo por el mismo sitio y sale por el mismo sitio. Es la trampa clásica de un día de eclipse.",
        en: "It is reached by a dead-end road several kilometres long: everyone goes in the same way and comes out the same way. It is the classic eclipse-day trap.",
      },
    },
  ],
  access: {
    es: [
      "La N-340 es la única vía de acceso, por el puerto del Bujeo desde Algeciras o por Vejer desde Cádiz. Es carretera de un carril por sentido en buena parte del recorrido y con mucha curva: un incidente la bloquea entera.",
      "No hay tren. La estación útil más cercana es Algeciras, y desde allí hay que combinar con autobús o coche.",
      "El puerto de Tarifa conecta con Tánger Ciudad en una travesía corta, y ese día habrá movimiento en las dos direcciones. Marruecos va una hora por detrás de España en agosto: revisa con qué hora estás calculando.",
      "Aeropuertos: Gibraltar y Jerez son los más cercanos, Málaga el grande y el que más se llenará. Desde cualquiera de ellos queda un buen rato de carretera por la N-340 o la A-7.",
      "Aparcar en el pueblo en agosto ya es difícil. El día 2 hay que asumir aparcar lejos y andar, o no mover el coche en todo el día.",
    ],
    en: [
      "The N-340 is the only way in, over the Bujeo pass from Algeciras or via Vejer from Cádiz. It is single-lane each way for much of its length and full of bends: one incident blocks the lot.",
      "There is no railway. The nearest useful station is Algeciras, and from there you combine with a bus or a car.",
      "Tarifa's port runs a short crossing to Tangier City, and there will be movement in both directions that day. Morocco is an hour behind Spain in August: check which clock your timings are in.",
      "Airports: Gibraltar and Jerez are closest, Malaga is the big one and the one that will fill first. From any of them you still face a long stretch of the N-340 or the A-7.",
      "Parking in town is already hard in August. On the 2nd, assume you park a long way out and walk, or that you do not move the car at all.",
    ],
  },
  bottleneck: {
    title: {
      es: "Un pueblo pequeño con una sola carretera",
      en: "A small town with a single road",
    },
    text: {
      es: "Tarifa recibe en agosto mucha más gente de la que su acceso soporta, y el día del eclipse esa proporción se dispara con una N-340 que no tiene alternativa. Cualquier plan que dependa de conducir esa mañana es un riesgo real, no teórico. Duerme dentro del municipio o en el Campo de Gibraltar, elige el punto la tarde anterior y ve andando o en bici si puedes.",
      en: "Tarifa already takes far more people in August than its access can carry, and on eclipse day that ratio spikes on an N-340 with no alternative. Any plan that depends on driving that morning is a real risk, not a theoretical one. Sleep inside the municipality or in the Campo de Gibraltar, pick your spot the evening before, and walk or cycle there if you can.",
    },
  },
  stay: {
    es: [
      "Los hoteles del casco y los campings de la N-340 entre el pueblo y Valdevaqueros son la oferta real, y en agosto ya funcionan al límite. Reserva con cancelación gratuita en cuanto puedas.",
      "Alojarse dentro del municipio te ahorra el único problema serio del día, que es la carretera. Vale más una habitación mediocre en Tarifa que una buena a una hora de coche.",
      "Si Tarifa está llena, Algeciras, Los Barrios y Barbate están dentro de la franja y ven una totalidad de pocos segundos menos. La diferencia no justifica conducir la mañana del día 2.",
      "En autocaravana, cuenta con que la acampada libre está prohibida en el litoral y con que esos días habrá vigilancia reforzada y, previsiblemente, zonas habilitadas. Busca sitio en un área oficial en vez de improvisar.",
    ],
    en: [
      "Hotels in town and the campsites along the N-340 between Tarifa and Valdevaqueros are the real supply, and in August they already run at capacity. Book something with free cancellation as soon as you can.",
      "Staying inside the municipality removes the only serious problem of the day, which is the road. A mediocre room in Tarifa beats a good one an hour's drive away.",
      "If Tarifa is full, Algeciras, Los Barrios and Barbate are inside the path and see a totality only seconds shorter. The difference does not justify driving on the morning of the 2nd.",
      "In a motorhome, note that wild camping is banned along this coastline and expect reinforced enforcement plus, most likely, designated areas for those days. Aim for an official site rather than improvising.",
    ],
  },
  weather: {
    title: {
      es: "El levante decide, y aquí decide más que en ningún sitio",
      en: "The levante decides — and here it decides more than anywhere",
    },
    text: {
      es: "Con levante, el aire húmedo del Mediterráneo se comprime al pasar el Estrecho y forma una banda de nubes bajas —la barra— que se engancha a la costa y a las sierras de Tarifa y del Bujeo, sobre todo a media mañana: exactamente la hora del eclipse. Con poniente, el cielo suele quedar limpio. Es la diferencia entre ver la corona y no verla, y se sabe con fiabilidad solo 24 o 48 horas antes. Ten preparado el plan B hacia el oeste —Barbate, Vejer, Conil siguen dentro de la franja— y no lo descartes por perder unos segundos de totalidad: unos segundos menos con cielo limpio ganan a cuatro minutos y medio bajo una nube.",
      en: "With a levante, humid Mediterranean air compresses as it funnels through the Strait and forms a band of low cloud — locally *la barra* — that catches on the coast and on the hills behind Tarifa and the Bujeo, particularly in mid-morning: exactly eclipse time. With a westerly poniente the sky usually stays clean. This is the difference between seeing the corona and not seeing it, and it only becomes reliably predictable 24 to 48 hours ahead. Have a fallback ready to the west — Barbate, Vejer and Conil are still inside the path — and do not dismiss it over a few lost seconds: a few seconds less under a clear sky beats four and a half minutes under cloud.",
    },
  },
};
