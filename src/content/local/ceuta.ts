import type { LocalProfile } from "./types";

/**
 * Ceuta: la mejor duración de España y el único punto de la red al que no se llega
 * por carretera. Todo el contenido local gira alrededor de esa segunda parte.
 */
export const ceuta: LocalProfile = {
  citySlug: "ceuta",
  angle: {
    es: "Ceuta tiene la totalidad más larga de toda España y, a la vez, el acceso más frágil de toda la franja: no hay carretera que llegue hasta aquí. Encontrar sitio para mirar es lo fácil —la ciudad entera está dentro de la franja y el Sol estará alto—; lo difícil es el billete de barco. Cualquier plan que consista en cruzar el Estrecho la mañana del día 2 depende de que el mar deje salir al ferry.",
    en: "Ceuta gets the longest totality anywhere in Spain and, at the same time, the most fragile access of the whole path: no road reaches it. Finding somewhere to watch is the easy part — the entire city is inside the path and the Sun will be high; the hard part is the boat. Any plan that involves crossing the Strait on the morning of the 2nd depends on the sea letting the ferry sail.",
  },
  whyHere: {
    es: "Para Ceuta este eclipse no es un evento más: es el mejor punto de observación de todo el país. La ciudad entera queda dentro de la franja, con la totalidad más larga de España y con el Sol alto sobre el Mediterráneo, así que no hay que ir a ningún sitio concreto ni buscar altura. En una ciudad de veinte kilómetros cuadrados, eso significa que ese lunes se va a mirar el cielo desde todas partes a la vez: desde el Hacho, desde las playas, desde las azoteas y desde la calle. Es probablemente el mayor acontecimiento público que va a vivir Ceuta en décadas, y también un problema de aforo que conviene tener pensado con tiempo.",
    en: "For Ceuta this eclipse is not just another event: it is the best observing point in the whole country. The entire city sits inside the path, with Spain's longest totality and the Sun high over the Mediterranean, so there is no particular place you have to reach and no height you need to gain. In a city of twenty square kilometres, that means people will be watching from everywhere at once that Monday: from Monte Hacho, from the beaches, from rooftops and from the street. It is probably the largest public event Ceuta will see in decades, and also a crowd problem worth thinking through early.",
  },
  spots: [
    {
      name: "Monte Hacho y el mirador de San Antonio",
      why: {
        es: "El punto alto de la ciudad, con vista abierta al Estrecho, a la Península enfrente y al Rif. Es el sitio desde el que mejor se puede ver llegar la sombra de la Luna por el oeste, sobre el agua, y el resplandor de atardecer en los 360°.",
        en: "The city's high ground, with an open view over the Strait, the Spanish mainland opposite and the Rif mountains. It is the best place to watch the Moon's shadow arrive from the west across the water, and to see the 360° sunset glow.",
      },
      caveat: {
        es: "La carretera de subida es estrecha y el aparcamiento arriba es muy limitado. Ese día se llenará temprano y es previsible que el acceso se regule: cuenta con subir andando o con quedarte sin sitio.",
        en: "The access road is narrow and parking at the top is very limited. It will fill early that day and access will most likely be controlled: plan on walking up, or on not getting in.",
      },
    },
    {
      name: "Parque Marítimo del Mediterráneo",
      why: {
        es: "Espacio amplio, sombra, agua y servicios a pie del centro, que es exactamente lo que hace falta para una espera de más de una hora a pleno sol de agosto. Con niños es la opción sensata.",
        en: "Open space, shade, water and facilities within walking distance of the centre — exactly what a wait of over an hour in full August sun requires. With children it is the sensible choice.",
      },
      caveat: {
        es: "Es un recinto con aforo, entrada y horario, y el horizonte está parcialmente edificado. Comprueba antes que abre a la hora del eclipse.",
        en: "It is a ticketed venue with capacity limits and opening hours, and the horizon is partly built up. Check in advance that it is open at eclipse time.",
      },
    },
    {
      name: "Playa de la Ribera y playa del Chorrillo",
      why: {
        es: "Las dos playas urbanas del lado mediterráneo, llanas y céntricas, a las que se llega andando desde el puerto y desde casi cualquier hotel. El Sol estará hacia el este, justo sobre ese mar.",
        en: "The two city beaches on the Mediterranean side, flat and central, walkable from the port and from almost any hotel. The Sun will be to the east, right over that stretch of sea.",
      },
      caveat: {
        es: "Son las playas donde va todo el mundo y son pequeñas. Sin altura ni horizonte limpio hacia el oeste, no se ve venir la sombra: se ve el eclipse, no la aproximación.",
        en: "They are small and they are where everyone goes. With no height and no clean western horizon, you do not see the shadow coming: you get the eclipse, not the approach.",
      },
    },
    {
      name: "Benzú y la costa noroeste",
      why: {
        es: "El extremo opuesto al Hacho, mirando al Estrecho abierto con la isla de Perejil enfrente. Menos gente que en el centro y horizonte marino limpio por donde entra la sombra.",
        en: "The far end from Monte Hacho, facing the open Strait with Perejil island in view. Fewer people than the centre, and a clean sea horizon in the direction the shadow comes from.",
      },
      caveat: {
        es: "Una sola carretera de costa para ir y volver, y la proximidad del perímetro fronterizo. Si se satura, no hay ruta alternativa.",
        en: "A single coast road in and out, plus the proximity of the border perimeter. If it saturates, there is no alternative route.",
      },
    },
  ],
  access: {
    es: [
      "El ferry desde Algeciras es el acceso real y su capacidad es la que es. Reserva en cuanto abran las ventas para esas fechas, y da por hecho que las salidas de la mañana del día 2 serán las primeras en agotarse.",
      "Si puedes, cruza como pasajero y no con vehículo: la plaza de coche se agota mucho antes, y Ceuta es una ciudad pequeña que se recorre andando o en autobús urbano sin problema.",
      "Reserva también la vuelta. La tarde del 2 de agosto todo el mundo intentará salir a la vez y el barco no admite improvisación.",
      "El servicio de helicóptero con la Península existe y tiene muy pocas plazas: sirve como alternativa si el barco está lleno, no como plan principal. Comprueba que siga operativo antes de contar con él.",
      "Quien venga desde Marruecos entra por el paso del Tarajal. Comprueba antes del viaje que está operativo y con qué requisitos, y cuenta con controles más lentos de lo normal ese fin de semana.",
      "Marruecos va una hora por detrás de España en agosto. Si cruzas desde Tetuán o Tánger, revisa dos veces con qué hora estás calculando.",
    ],
    en: [
      "The ferry from Algeciras is the real way in, and its capacity is fixed. Book the moment sailings for those dates go on sale, and assume the morning crossings on the 2nd will be the first to sell out.",
      "Cross as a foot passenger rather than with a vehicle if you can: car spaces sell out far earlier, and Ceuta is a small city you can cover on foot or by local bus.",
      "Book the return as well. On the afternoon of 2 August everyone will try to leave at once and there is no improvising with a boat.",
      "The helicopter service to the mainland exists and has very few seats: it is a fallback if the ferry is full, not a main plan. Check it is still operating before relying on it.",
      "Arriving from Morocco means the Tarajal crossing. Check before travelling that it is open and on what terms, and expect slower controls than usual that weekend.",
      "Morocco is an hour behind Spain in August. If you are crossing from Tetouan or Tangier, double-check which clock your timings are in.",
    ],
  },
  bottleneck: {
    title: {
      es: "El cuello de botella no es el tráfico, es el mar",
      en: "The bottleneck is not traffic, it is the sea",
    },
    text: {
      es: "En el resto de la franja el riesgo es un atasco; aquí es quedarse en tierra. Un levante fuerte en el Estrecho cancela salidas de ferry con pocas horas de aviso, y ese mismo levante es habitual en agosto. La única forma de eliminar el riesgo es dormir en Ceuta la noche del 1 al 2 de agosto.",
      en: "Everywhere else in the path the risk is a traffic jam; here it is being left on the wrong side. A strong levante in the Strait cancels ferry departures at a few hours' notice, and that same levante is common in August. The only way to remove the risk is to sleep in Ceuta on the night of 1–2 August.",
    },
  },
  stay: {
    es: [
      "La oferta hotelera de Ceuta es pequeña para un evento de esta escala. Reserva con cancelación gratuita en cuanto puedas: aquí el margen es mucho más estrecho que en la Península.",
      "Si no encuentras nada, Algeciras, Los Barrios y el Campo de Gibraltar están dentro de la franja con una totalidad muy parecida. La diferencia con Ceuta ronda los veinte segundos: no compensa jugarse el eclipse a un ferry para ganarlos.",
      "Dormir en la Península y cruzar la mañana del día 2 es la única combinación que desaconsejamos sin matices. Si duermes fuera, quédate fuera y mira desde allí.",
    ],
    en: [
      "Ceuta's hotel stock is small for an event of this scale. Book something with free cancellation as early as you can: the margin here is far tighter than on the mainland.",
      "If nothing is available, Algeciras, Los Barrios and the Campo de Gibraltar are inside the path with very similar totality — about twenty seconds less than Ceuta. That is not worth gambling the eclipse on a ferry for.",
      "Sleeping on the mainland and crossing on the morning of the 2nd is the one combination we advise against without qualification. If you sleep outside, stay outside and watch from there.",
    ],
  },
  weather: {
    title: {
      es: "Aquí el levante se cobra dos cosas",
      en: "Here the levante costs you twice",
    },
    text: {
      es: "El viento de levante forma nubes bajas que se enganchan al Monte Hacho y a las laderas de enfrente, justo a media mañana, y además levanta mar en el Estrecho. Es decir: el mismo fenómeno que puede taparte el cielo puede dejarte sin barco. Con levante en la predicción, vigila a la vez el parte de AEMET y el estado de las salidas de la naviera, y ten claro que desde el Hacho la nube baja se ve antes que desde la ciudad.",
      en: "An easterly levante forms low cloud that catches on Monte Hacho and on the hillsides opposite, precisely in mid-morning, and it also builds a swell in the Strait. In other words, the same phenomenon that can cover your sky can also strand you. If the forecast calls levante, watch the AEMET forecast and the ferry operator's departures at the same time — and remember that low cloud reaches Monte Hacho before it reaches sea level.",
    },
  },
};
