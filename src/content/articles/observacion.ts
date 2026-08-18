import { formatDuration } from "@/lib/eclipse/cities";
import { localAngle, localSpotBlocks, localWeatherBlocks } from "../local";
import type { Article, Block } from "./types";

/** Dónde verlo: cómo se elige un punto de observación. */
export const dondeVerlo: Article = {
  slug: "donde-verlo",
  content: {
    es: (city) => {
      const angle = localAngle(city.slug, "es");
      const spots = localSpotBlocks(city.slug, "es");
      return {
      title: `Dónde ver el eclipse en ${city.name}: miradores y cómo elegir el punto`,
      description: `Puntos de observación concretos en ${city.name} para el eclipse total del 2 de agosto de 2027, con la pega de cada uno, y cómo calcular las circunstancias del tuyo.`,
      body: [
        {
          type: "p",
          text: city.eclipse.isTotal
            ? `${city.name} está dentro de la franja de totalidad, así que el eclipse se ve desde cualquier punto del municipio con el cielo despejado. El Sol estará a unos ${city.eclipse.sunAltitudeDeg.toFixed(0)}° sobre el horizonte, hacia el ${city.eclipse.sunAzimuthDeg.toFixed(0)}° de azimut —prácticamente al este—, es decir, bastante alto y por encima de casi cualquier obstáculo. Lo que distingue un sitio bueno de uno malo no es la vista del Sol: es el entorno.`
            : `Desde ${city.name} el eclipse se ve parcial. Para ver la totalidad hay que desplazarse a la franja; esta guía sirve igualmente para elegir el punto una vez allí.`,
        },
        ...(angle ? [{ type: "p", text: angle } as Block] : []),
        {
          type: "callout",
          title: "Calcula tu punto exacto",
          text: "La duración cambia kilómetro a kilómetro. En el localizador puedes introducir las coordenadas exactas donde vas a estar y obtener tus horas y tu duración, además de saber si te compensa moverte.",
        },
        ...(spots.length
          ? ([
              { type: "h2", text: `Dónde ver el eclipse en ${city.name}, sitio por sitio` },
              {
                type: "p",
                text: `Cada punto va con su pega, porque el 2 de agosto la diferencia entre un buen sitio y una trampa no es la vista: es el aparcamiento, el aforo y por dónde se sale.`,
              },
              ...spots,
            ] as Block[])
          : []),
        { type: "h2", text: "Qué hace bueno a un punto de observación" },
        {
          type: "ul",
          items: [
            "Horizonte despejado en 360°, no hacia el Sol. Lo espectacular de la totalidad es ver el resplandor anaranjado rodeándote por todos lados, y eso se pierde encajonado entre edificios.",
            "Algo de altura, que ayuda si hay nubes bajas de levante pegadas a la costa.",
            "Espacio suficiente para la gente que va a haber. Un mirador pequeño y famoso será un problema, no una ventaja.",
            "Acceso y salida razonables. Un sitio precioso con una única carretera de acceso se convierte en una trampa ese día.",
            "Sombra y agua cerca, o la posibilidad de llevarlas. La espera es de más de una hora a pleno sol de agosto.",
            "Sin farolas que se enciendan automáticamente al caer la luz: arruinan la visión justo en el momento clave.",
          ],
        },
        { type: "h2", text: "Tres estrategias que funcionan" },
        {
          type: "ul",
          items: [
            "La playa: horizonte marino limpio, espacio de sobra y la posibilidad de ver la sombra de la Luna acercarse sobre el agua, que es de lo más impresionante del fenómeno.",
            "El punto alto: un cerro o mirador por encima de la capa de nubes bajas, con vistas amplias del paisaje oscureciéndose.",
            "El sitio tranquilo: cualquier descampado accesible lejos del punto de moda. Se ve exactamente igual y se sale sin atasco.",
          ],
        },
        { type: "h2", text: "El error de perseguir el centro de la franja" },
        {
          type: "p",
          text: `Mucha gente se obsesiona con llegar al centro exacto para arañar unos segundos. Casi nunca merece la pena: la diferencia entre estar en el centro y estar a diez kilómetros suele ser de unos pocos segundos, mientras que el riesgo de quedarse atrapado en un atasco y perderlo todo es real. Elige un sitio cómodo y bien comunicado dentro de la franja y quédate ahí.`,
        },
        { type: "h2", text: "Lo que no hace falta" },
        {
          type: "p",
          text: `No hace falta telescopio ni prismáticos: la totalidad se ve mejor a simple vista, porque la corona es grande y el instrumento la recorta. No hace falta madrugar para coger sitio en el mejor mirador; hace falta llegar con margen a un sitio razonable. Y no hace falta altitud: lo que marca la duración es la distancia al centro de la franja, no lo alto que estés.`,
        },
        {
          type: "callout",
          title: "Puntos oficiales, cuando los haya",
          text: `Iremos publicando los puntos de observación habilitados oficialmente en ${city.name} según los confirmen ayuntamiento y agrupaciones astronómicas. Hasta entonces, lo de arriba es criterio, no una lista cerrada: preferimos no señalar rincones pequeños que no soportarían la afluencia.`,
        },
      ],
      };
    },
    en: (city) => {
      const name = city.nameEn ?? city.name;
      const angle = localAngle(city.slug, "en");
      const spots = localSpotBlocks(city.slug, "en");
      return {
        title: `Where to watch the eclipse in ${name}: viewpoints and how to choose`,
        description: `Specific viewing spots in ${name} for the total eclipse of 2 August 2027, each with its catch, and how to work out the exact circumstances for yours.`,
        body: [
          {
            type: "p",
            text: city.eclipse.isTotal
              ? `${name} is inside the path of totality, so the eclipse is visible from anywhere in the municipality with a clear sky. The Sun will be about ${city.eclipse.sunAltitudeDeg.toFixed(0)}° above the horizon at an azimuth of roughly ${city.eclipse.sunAzimuthDeg.toFixed(0)}° — very nearly due east — high enough to clear almost any obstacle. What separates a good spot from a bad one is not the view of the Sun: it is the surroundings.`
              : `From ${name} the eclipse is partial. Seeing totality means travelling into the path; this guide applies equally to choosing a spot once you are there.`,
          },
          ...(angle ? [{ type: "p", text: angle } as Block] : []),
          {
            type: "callout",
            title: "Work out your exact spot",
            text: "Totality changes kilometre by kilometre. The locator lets you enter the exact coordinates where you will be and returns your timings and duration, plus whether moving is worth it.",
          },
          ...(spots.length
            ? ([
                { type: "h2", text: `Where to watch in ${name}, spot by spot` },
                {
                  type: "p",
                  text: `Each one comes with its catch, because on 2 August what separates a good spot from a trap is not the view: it is the parking, the capacity limit and how you get out.`,
                },
                ...spots,
              ] as Block[])
            : []),
          { type: "h2", text: "What makes a good viewing spot" },
          {
            type: "ul",
            items: [
              "A clear horizon in all 360°, not towards the Sun. The remarkable part of totality is the orange glow surrounding you on every side, and that is lost boxed in between buildings.",
              "Some elevation, which helps if easterly winds have pushed low cloud against the coast.",
              "Enough room for the crowd there will be. A small, famous viewpoint is a liability, not an advantage.",
              "Sensible access and exit. A beautiful spot with one road in becomes a trap that day.",
              "Shade and water nearby, or the ability to carry them. The wait is over an hour in full August sun.",
              "No streetlights that switch on automatically as the light drops: they ruin the view at the critical moment.",
            ],
          },
          { type: "h2", text: "Three strategies that work" },
          {
            type: "ul",
            items: [
              "The beach: a clean sea horizon, plenty of space, and the chance to watch the Moon's shadow racing towards you across the water, which is among the most striking parts of the whole event.",
              "High ground: a hill or viewpoint above any low cloud layer, with a wide view of the landscape darkening.",
              "The quiet spot: any accessible open ground away from the famous location. It looks exactly the same and you leave without a jam.",
            ],
          },
          { type: "h2", text: "The mistake of chasing the centreline" },
          {
            type: "p",
            text: `Many people fixate on reaching the exact centre to gain a few seconds. It is rarely worth it: the difference between the centreline and ten kilometres off is usually a handful of seconds, while the risk of being caught in traffic and losing everything is real. Pick a comfortable, well-connected spot inside the path and stay there.`,
          },
          { type: "h2", text: "What you do not need" },
          {
            type: "p",
            text: `You do not need a telescope or binoculars: totality looks better with the naked eye, because the corona is large and an instrument crops it. You do not need to arrive at dawn to claim the best viewpoint; you need to arrive with margin somewhere reasonable. And you do not need altitude: duration is set by your distance from the centre of the path, not by how high you stand.`,
          },
        ],
      };
    },
  },
};

/** Clima: la única variable que no se puede planificar del todo. */
export const clima: Article = {
  slug: "clima",
  content: {
    es: (city) => {
      const local = localWeatherBlocks(city.slug, "es");
      return {
      title: `¿Estará despejado en ${city.name} el día del eclipse?`,
      description: `Qué dice la climatología de principios de agosto en ${city.name}, qué fenómeno local puede estropearlo y qué margen hay para moverse el 2 de agosto de 2027.`,
      body: [
        {
          type: "p",
          text: `La buena noticia es que el eclipse cae a principios de agosto en el sur de España, que es de las combinaciones de fecha y lugar más favorables del mundo: es la época del año con menos nubosidad y menos lluvia de toda la región, y el Sol estará a unos ${city.eclipse.sunAltitudeDeg.toFixed(0)}° sobre el horizonte, lo que reduce el efecto de la bruma cercana al horizonte.`,
        },
        ...(local.length
          ? local
          : ([
              { type: "h2", text: "El matiz local: el Estrecho tiene su propio tiempo" },
              {
                type: "p",
                text: `En la zona del Estrecho conviven dos regímenes de viento con efectos opuestos. El levante empuja aire húmedo del Mediterráneo y puede formar una capa de nubes bajas que se pega a la costa y a las laderas, sobre todo por la mañana, que es justo cuando ocurre el eclipse. El poniente, más fresco y atlántico, suele dejar cielos más limpios. Es el factor que más puede estropear la observación en la zona, más que una tormenta.`,
              },
            ] as Block[])),
        { type: "h2", text: "Qué hacer con eso" },
        {
          type: "ul",
          items: [
            "No decidas el punto exacto de observación hasta 24 o 48 horas antes, cuando las predicciones ya son fiables.",
            "Ten una alternativa tierra adentro y otra a lo largo de la franja: unos kilómetros bastan para salir de una capa de nubes bajas costera.",
            "Gana altura si hay nubes bajas: los puntos elevados a menudo quedan por encima de la capa.",
            "Sigue la predicción de AEMET los días previos y no las apps genéricas, que en zonas de microclima fallan mucho.",
            "Ten el depósito lleno y el equipaje hecho la noche antes, para poder moverte de madrugada si la predicción cambia.",
          ],
        },
        {
          type: "callout",
          title: "Sobre los datos concretos",
          text: "Publicaremos porcentajes históricos de nubosidad por localidad cuando podamos citarlos de una serie climatológica oficial. Mientras tanto preferimos no dar cifras: en climatología, un número inventado es peor que ningún número.",
        },
        { type: "h2", text: "Qué se nota aunque esté nublado" },
        {
          type: "p",
          text: `Incluso con el cielo cubierto, la totalidad se nota: la luz cae en picado hasta un crepúsculo profundo, la temperatura baja varios grados en minutos, el viento cambia y los animales se comportan como al anochecer. No es lo mismo que ver la corona, pero no es nada desdeñable.`,
        },
      ],
      };
    },
    en: (city) => {
      const name = city.nameEn ?? city.name;
      const local = localWeatherBlocks(city.slug, "en");
      return {
        title: `Will the sky be clear in ${name} on eclipse day?`,
        description: `What August climatology says about ${name}, which local phenomenon can ruin it, and how much room you have to move on 2 August 2027.`,
        body: [
          {
            type: "p",
            text: `The good news is that this eclipse falls in early August in southern Spain, one of the most favourable combinations of date and place anywhere in the world. It is the time of year with the least cloud and the least rain in the region, and the Sun will be around ${city.eclipse.sunAltitudeDeg.toFixed(0)}° above the horizon, which reduces the effect of haze low down.`,
          },
          ...(local.length
            ? local
            : ([
                { type: "h2", text: "The local catch: the Strait makes its own weather" },
                {
                  type: "p",
                  text: `Two opposing wind regimes meet around the Strait of Gibraltar. The levante pushes humid Mediterranean air west and can form a layer of low cloud that clings to the coast and hillsides, particularly in the morning — exactly when the eclipse happens. The poniente, cooler and Atlantic, usually leaves cleaner skies. This, rather than any storm, is the thing most likely to spoil the view here.`,
                },
              ] as Block[])),
          { type: "h2", text: "What to do about it" },
          {
            type: "ul",
            items: [
              "Do not commit to an exact spot until 24 to 48 hours before, when forecasts become reliable.",
              "Have one backup inland and another along the path: a few kilometres is often enough to escape a coastal low-cloud layer.",
              "Gain height if there is low cloud: elevated spots frequently sit above the layer.",
              "Follow AEMET, the Spanish met office, in the final days rather than generic weather apps, which perform badly in microclimate areas.",
              "Keep the tank full and your bags packed the night before, so you can move at dawn if the forecast turns.",
            ],
          },
          {
            type: "callout",
            title: "On specific figures",
            text: "We will publish historical cloud-cover percentages by location once we can cite them from an official climatological series. Until then we would rather give no number: in climatology, an invented figure is worse than none.",
          },
          { type: "h2", text: "What you still get under cloud" },
          {
            type: "p",
            text: `Even under complete overcast, totality registers: the light collapses into deep twilight, the temperature drops several degrees in minutes, the wind shifts and animals behave as though night has fallen. It is not the same as seeing the corona, but it is far from nothing.`,
          },
        ],
      };
    },
  },
};
