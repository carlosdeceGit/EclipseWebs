import type { LocalProfile } from "./types";

/**
 * Cádiz: la única ciudad grande de la franja, y la que está más cerca del borde
 * norte. Dos hechos que mandan sobre todo el contenido local: se entra y se sale
 * por un istmo, y bajando hacia el sur se gana más de un minuto de totalidad.
 */
export const cadiz: LocalProfile = {
  citySlug: "cadiz",
  angle: {
    es: "Cádiz es la única ciudad grande dentro de la franja y la que permite ver la totalidad desde una playa urbana y volver andando a casa. Tiene dos peculiaridades que no comparte con ningún otro punto de la red: está en la punta de una lengua de tierra por la que solo se entra y se sale por tres accesos, y está tan cerca del borde norte de la franja que bajar cuarenta kilómetros hacia el sur alarga la totalidad más de un minuto. Ambas cosas se deciden antes del día 2, no ese día.",
    en: "Cádiz is the only large city inside the path, and the one where you can watch totality from a city beach and walk home afterwards. It has two quirks no other site in the network shares: it sits at the tip of a spit of land with just three ways in and out, and it lies close enough to the northern edge of the path that driving forty kilometres south adds over a minute of totality. Both are decisions to make before the 2nd, not on the day.",
  },
  whyHere: {
    es: "Cádiz será, casi con seguridad, la ciudad desde la que más gente vea la totalidad en España: es la única población grande dentro de la franja y tiene playas urbanas capaces de absorber a mucha gente sin necesidad de coger el coche. Tiene además una circunstancia que conviene entender antes de hacer planes: está en la mitad norte de la franja, no en el centro, así que la totalidad aquí dura bastante menos que en el sur de la provincia. Sigue siendo totalidad —el Sol desaparece del todo, sale la corona y se hace de noche—, pero dura lo que dura, y eso condiciona si el plan es quedarse o bajar.",
    en: "Cádiz will almost certainly be the city where the largest number of people in Spain watch totality: it is the only large town inside the path and it has city beaches able to absorb big crowds without anyone touching a car. It also comes with a circumstance worth understanding before making plans: it sits in the northern half of the path, not on the centreline, so totality here is appreciably shorter than in the south of the province. It is still totality — the Sun vanishes completely, the corona appears and day turns to night — but it lasts what it lasts, and that governs whether the plan is to stay or to go south.",
  },
  spots: [
    {
      name: "La Caleta y el castillo de San Sebastián",
      why: {
        es: "La playa entre dos castillos, con horizonte atlántico limpio hacia el oeste: es por ahí por donde llega la sombra de la Luna, cruzando el agua antes de alcanzar la ciudad. Como estampa del eclipse en Cádiz no hay otra.",
        en: "The beach between two castles, with a clean Atlantic horizon to the west — the direction the Moon's shadow arrives from, crossing the water before it reaches the city. As an image of the eclipse in Cádiz, nothing else comes close.",
      },
      caveat: {
        es: "Es pequeña y es la postal de la ciudad: se llenará mucho antes que ninguna otra. El paseo hasta el castillo tiene aforo y horario propios, así que no cuentes con estar dentro salvo que lo confirmes.",
        en: "It is small and it is the city's postcard: it will fill long before anywhere else. The causeway to the castle has its own capacity limits and opening hours, so do not count on being inside unless you have confirmed it.",
      },
    },
    {
      name: "Playa de la Victoria",
      why: {
        es: "Kilómetros de arena con espacio de sobra, servicios abiertos en agosto y acceso por toda la avenida. Es la opción realista para mucha gente a la vez sin depender de coger sitio a primera hora.",
        en: "Kilometres of sand with room to spare, services open in August and access along the whole avenue. It is the realistic option for large numbers of people without having to claim a spot at dawn.",
      },
      caveat: {
        es: "Sin altura y con la línea de edificios detrás, el resplandor de 360° que es lo mejor de la totalidad se pierde en parte. Baja hasta la orilla y gana todo el horizonte que puedas.",
        en: "With no elevation and a wall of buildings behind, you lose part of the 360° glow that is the best thing about totality. Walk down to the water's edge and buy yourself as much horizon as you can.",
      },
    },
    {
      name: "Playa de Cortadura",
      why: {
        es: "La más amplia y despejada de todas, con dunas y sin edificios detrás, ya en la salida de la ciudad hacia San Fernando. Es el sitio con mejor horizonte completo del término municipal.",
        en: "The widest and most open of them all, backed by dunes rather than buildings, out on the way towards San Fernando. It has the best all-round horizon in the municipality.",
      },
      caveat: {
        es: "Se aparca en la carretera de acceso, que es justo la única vía de entrada y salida de la ciudad. Es el peor sitio posible para estar cuando decenas de miles de personas decidan marcharse a la vez.",
        en: "You park along the access road, which is precisely the city's only way in and out. It is the worst possible place to be when tens of thousands of people decide to leave at the same moment.",
      },
    },
    {
      name: "Campo del Sur, Alameda Apodaca y el baluarte de la Candelaria",
      why: {
        es: "El frente marítimo elevado sobre la muralla, con horizonte abierto y a un paso del casco antiguo. Se llega andando desde cualquier alojamiento del centro, que el día 2 vale más que cualquier vista.",
        en: "The seafront raised on the old walls, with an open horizon and a step away from the old town. You can walk there from anywhere in the centre, which on the day matters more than any view.",
      },
      caveat: {
        es: "Es un espacio lineal y estrecho: cabe menos gente de la que parece y se ocupa muy rápido. Sin sombra ni agua cerca en buena parte del recorrido.",
        en: "It is a narrow, linear space: it holds fewer people than it looks and fills very fast. Much of it has no shade and no water nearby.",
      },
    },
  ],
  access: {
    es: [
      "A Cádiz se entra por tres sitios y los tres son embudo: el puente de la Constitución de 1812, el puente José León de Carranza y la carretera del istmo por San Fernando. No hay una cuarta opción.",
      "El tren de cercanías es la mejor forma de llegar ese día: enlaza Cádiz con San Fernando, Puerto Real, El Puerto de Santa María y Jerez sin depender del tráfico de los puentes.",
      "El catamarán de la bahía desde El Puerto de Santa María y desde Rota deja en el puerto, a pie del casco antiguo, y esquiva los accesos por carretera por completo. Es la vía menos obvia y probablemente la mejor.",
      "El aeropuerto de Jerez está a poco más de media hora en tren. Sevilla y Málaga son las alternativas grandes, ambas con varias horas de carretera o tren por delante.",
      "Aparcar en el casco antiguo el 2 de agosto no es un plan. Si vienes en coche, déjalo en la zona de la avenida o en un aparcamiento disuasorio y muévete a pie.",
    ],
    en: [
      "There are three ways into Cádiz and all three are funnels: the Constitución de 1812 bridge, the José León de Carranza bridge and the isthmus road through San Fernando. There is no fourth option.",
      "The local commuter train is the best way in that day: it links Cádiz with San Fernando, Puerto Real, El Puerto de Santa María and Jerez without touching the bridge traffic.",
      "The bay catamaran from El Puerto de Santa María and from Rota docks in the port, right by the old town, and bypasses the road access entirely. It is the least obvious route and probably the best one.",
      "Jerez airport is a little over half an hour away by train. Seville and Malaga are the larger alternatives, each several hours away by road or rail.",
      "Parking in the old town on 2 August is not a plan. If you drive, leave the car out by the avenue or in a park-and-ride and move on foot.",
    ],
  },
  bottleneck: {
    title: {
      es: "Una ciudad con tres entradas y ninguna salida rápida",
      en: "A city with three ways in and no fast way out",
    },
    text: {
      es: "El problema de Cádiz no es llegar, es salir. En cuanto termine la totalidad, todo el mundo se moverá a la vez hacia dos puentes y un istmo. Si vienes de fuera, entra en tren o en catamarán y déjate el coche donde estés durmiendo; y si has venido en coche, quédate a comer en la ciudad y sal a media tarde. Ganarás más tiempo esperando que conduciendo.",
      en: "The problem in Cádiz is not getting in, it is getting out. The moment totality ends, everyone will head for two bridges and an isthmus at once. If you are coming from outside, arrive by train or catamaran and leave the car where you slept; and if you did drive, stay for lunch and set off in the late afternoon. Waiting will save you more time than driving.",
    },
  },
  stay: {
    es: [
      "El casco antiguo se agotará primero y es el que mejor funciona: todo queda a pie y el día 2 no dependes de nada con ruedas.",
      "La bahía entera está dentro de la franja y a un tren de distancia. San Fernando y Chiclana quedan algo más al sur que Cádiz y ven algo más de totalidad; Puerto Real, El Puerto de Santa María y sobre todo Jerez quedan más al norte y ven bastante menos.",
      "Si el criterio es la duración y no la ciudad, bajar hacia Conil, Vejer o Barbate cambia el resultado de forma seria: allí la totalidad se acerca a los cuatro minutos, más de un minuto por encima de Cádiz. Compruébalo tú mismo en el localizador antes de reservar.",
      "Cádiz en agosto ya está lleno sin eclipse. La escasez aquí no la crea el evento, la agrava.",
    ],
    en: [
      "The old town will sell out first and it is also what works best: everything is walkable and on the day you depend on nothing with wheels.",
      "The whole bay is inside the path and a train ride away. San Fernando and Chiclana sit slightly further south than Cádiz and see a little more totality; Puerto Real, El Puerto de Santa María and above all Jerez sit further north and see appreciably less.",
      "If duration rather than the city is your criterion, moving south to Conil, Vejer or Barbate changes the result seriously: totality there approaches four minutes, over a minute more than in Cádiz. Check it yourself in the locator before booking.",
      "Cádiz in August is already full without an eclipse. The shortage here is not created by the event, it is made worse by it.",
    ],
  },
  weather: {
    title: {
      es: "En la costa atlántica el patrón se invierte",
      en: "On the Atlantic coast the pattern is reversed",
    },
    text: {
      es: "Lo que en el Estrecho estropea la observación es el levante; en Cádiz capital suele ser al revés. El levante aquí llega ya seco y deja el cielo limpio, a costa de viento y arena en la playa. El riesgo local es el poniente húmedo, que puede meter nubosidad baja y bruma marina a primera hora de la mañana, justo en la franja horaria del eclipse, y que se disipa según avanza el día: tarde para lo que nos interesa. Si la predicción da poniente con humedad alta, el plan B es tierra adentro y hacia el sur, no a lo largo de la costa.",
      en: "What spoils viewing in the Strait is the levante; in Cádiz city it tends to be the opposite. The levante arrives here already dry and leaves clean skies, at the cost of wind and blown sand on the beach. The local risk is a humid poniente, which can push low cloud and sea haze in during the first hours of the morning — exactly the eclipse window — and which burns off as the day goes on: too late to help. If the forecast calls for a humid westerly, the fallback is inland and south, not further along the coast.",
    },
  },
};
