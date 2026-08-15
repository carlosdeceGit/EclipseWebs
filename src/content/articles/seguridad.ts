import { formatDuration } from "@/lib/eclipse/cities";
import { SAFETY_FAQ } from "../faq";
import type { Article } from "./types";

/**
 * Guía de seguridad ocular.
 *
 * Es la página con más responsabilidad de toda la red: la única cuyo contenido
 * puede causar un daño irreversible si está mal. Nada de matices comerciales aquí.
 */
export const seguridad: Article = {
  slug: "seguridad",
  faq: SAFETY_FAQ,
  content: {
    es: (city) => {
      const d = formatDuration(city.eclipse.totalitySeconds);
      return {
        title: `Cómo ver el eclipse sin dañarte los ojos en ${city.name}`,
        description: `Filtros ISO 12312-2, errores habituales y el único momento seguro para mirar sin gafas durante el eclipse del 2 de agosto de 2027 en ${city.name}.`,
        body: [
          {
            type: "p",
            text: `Un eclipse solar es el único fenómeno astronómico masivo que puede dejar secuelas permanentes a quien lo mira mal. La retina no tiene receptores de dolor, así que el daño no avisa: la pérdida de visión central aparece horas después y a menudo no se recupera. Todo lo que sigue se resume en una regla: en ${city.name}, durante toda la fase parcial, filtro certificado sin excepciones.`,
          },
          { type: "h2", text: "Qué filtro sirve y cuál no" },
          {
            type: "p",
            text: "Solo son seguros los filtros que cumplen la norma internacional ISO 12312-2, que reduce la luz visible unas cien mil veces y bloquea además el infrarrojo y el ultravioleta. Vienen en dos formatos: gafas de cartón de eclipse y láminas de filtro solar para instrumentos.",
          },
          {
            type: "ul",
            items: [
              "Sirven: gafas de eclipse con la marca ISO 12312-2 y fabricante identificable, y filtros solares de vidrio o película para telescopio colocados delante del objetivo.",
              "No sirven: gafas de sol de cualquier categoría, cristales ahumados, radiografías, negativos fotográficos, CD, botellas de vidrio oscuro ni filtros de soldadura por debajo del grado 14.",
              "Nunca: mirar por un telescopio, prismáticos o teleobjetivo que lleve el filtro detrás del ocular. El calor concentrado lo revienta y la luz llega directa al ojo.",
            ],
          },
          {
            type: "callout",
            title: "La comprobación de los diez segundos",
            text: "Ponte las gafas dentro de casa. Si ves algo que no sea una bombilla muy potente —muebles, ventanas, tu mano— no son filtros de eclipse. Con unas auténticas, el mundo es negro absoluto.",
          },
          { type: "h2", text: "El único momento en que se puede mirar sin filtro" },
          {
            type: "p",
            text: city.eclipse.isTotal
              ? `Durante la totalidad, y solo durante la totalidad. En ${city.name} eso significa ${
                  d ? `unos ${d}` : "unos pocos minutos"
                }, entre las ${city.localTimes.totalityStart} y las ${city.localTimes.totalityEnd} hora local. En ese intervalo se mira a simple vista, sin filtro, y es la única forma de ver la corona: a través de las gafas de eclipse no se ve absolutamente nada.`
              : `Desde ${city.name} el eclipse se ve parcial, así que no hay ningún momento seguro para mirar sin filtro en toda la mañana. La única forma de ver la totalidad es desplazarse a la franja.`,
          },
          {
            type: "callout",
            title: "No te fíes del reloj, fíate del Sol",
            text: "Las horas de esta web están calculadas con precisión de segundos, pero el instante real en que desaparece el último rayo depende del relieve del limbo lunar y de tu posición exacta. La señal buena es visual: cuando el último punto de luz se apaga, fuera filtro; en cuanto aparezca el primer destello por el otro lado, filtro puesto sin esperar a comprobar nada.",
          },
          { type: "h2", text: "Ver el eclipse con niños" },
          {
            type: "ul",
            items: [
              "Un adulto por cada niño pequeño durante la fase parcial: las gafas se resbalan y el reflejo de un crío es mirar arriba.",
              "La proyección es la alternativa sin riesgo: un colador de cocina o una cartulina con un agujero proyectan decenas de soles mordidos sobre el suelo.",
              "Explica antes qué va a pasar. La caída de luz y de temperatura durante la totalidad impresiona, y conviene que no pille por sorpresa.",
            ],
          },
          { type: "h2", text: "Cómo comprobar unas gafas antes de usarlas" },
          {
            type: "ul",
            items: [
              "Mira el filtro a contraluz buscando arañazos, agujeritos o pliegues. Cualquier defecto las inutiliza.",
              "Comprueba que el filtro esté bien pegado a la montura y no se despegue por una esquina.",
              "Póntelas en una habitación iluminada: no debes ver nada salvo las luces más potentes.",
              "Busca impresa la referencia a ISO 12312-2 y el nombre del fabricante. Si no hay fabricante, no hay responsable.",
            ],
          },
          { type: "h2", text: "Dónde conseguirlas" },
          {
            type: "p",
            text: `Planetarios, agrupaciones astronómicas, ópticas y tiendas de astronomía suelen distribuirlas en los meses previos, y muchos ayuntamientos de la franja reparten lotes gratuitos. Evita la venta ambulante sin marca los días previos, que es cuando se cuela el material falsificado. En el directorio de ${city.name} publicamos los puntos de venta confirmados.`,
          },
          { type: "faq", items: SAFETY_FAQ.es },
        ],
      };
    },
    en: (city) => {
      const d = formatDuration(city.eclipse.totalitySeconds, "en");
      const name = city.nameEn ?? city.name;
      return {
        title: `How to watch the eclipse safely in ${name}`,
        description: `ISO 12312-2 filters, the mistakes people make, and the only safe moment to look without glasses during the 2 August 2027 eclipse in ${name}.`,
        body: [
          {
            type: "p",
            text: `A solar eclipse is the only mass astronomical event that can leave permanent damage in people who watch it wrongly. The retina has no pain receptors, so the injury gives no warning: central vision loss appears hours later and often does not recover. Everything below comes down to one rule: in ${name}, throughout the entire partial phase, a certified filter with no exceptions.`,
          },
          { type: "h2", text: "Which filters work and which do not" },
          {
            type: "p",
            text: "Only filters meeting the international standard ISO 12312-2 are safe. They cut visible light by a factor of around one hundred thousand and also block infrared and ultraviolet. They come in two forms: cardboard eclipse glasses and sheets of solar filter for instruments.",
          },
          {
            type: "ul",
            items: [
              "Safe: eclipse glasses marked ISO 12312-2 with an identifiable manufacturer, and glass or film solar filters fitted in front of a telescope objective.",
              "Not safe: sunglasses of any category, smoked glass, X-ray film, photographic negatives, CDs, dark glass bottles, or welding filters below shade 14.",
              "Never: looking through a telescope, binoculars or telephoto lens with the filter behind the eyepiece. The concentrated heat destroys it and the light reaches your eye directly.",
            ],
          },
          {
            type: "callout",
            title: "The ten-second check",
            text: "Put the glasses on indoors. If you can see anything other than a very bright bulb — furniture, windows, your own hand — they are not eclipse filters. Through genuine ones the world is completely black.",
          },
          { type: "h2", text: "The only moment you can look without a filter" },
          {
            type: "p",
            text: city.eclipse.isTotal
              ? `During totality, and only during totality. In ${name} that means ${
                  d ? `about ${d}` : "a few minutes"
                }, between ${city.localTimes.totalityStart} and ${city.localTimes.totalityEnd} local time. In that window you look with the naked eye, no filter, and it is the only way to see the corona: through eclipse glasses you would see nothing at all.`
              : `From ${name} the eclipse is partial, so there is no safe moment to look without a filter at any point in the morning. The only way to see totality is to travel into the path.`,
          },
          {
            type: "callout",
            title: "Trust the Sun, not the clock",
            text: "The times on this site are computed to the second, but the real instant the last sliver disappears depends on the terrain of the lunar limb and on your exact position. The reliable cue is visual: when the last point of light goes out, filters off; the moment the first flash appears on the other side, filters back on without waiting to check anything.",
          },
          { type: "h2", text: "Watching with children" },
          {
            type: "ul",
            items: [
              "One adult per small child during the partial phase: the glasses slip, and a child's instinct is to look up.",
              "Projection is the zero-risk alternative: a kitchen colander or a card with a pinhole throws dozens of crescent Suns onto the ground.",
              "Explain what will happen beforehand. The drop in light and temperature during totality is startling, and it is better not to be a surprise.",
            ],
          },
          { type: "h2", text: "Checking a pair before you use them" },
          {
            type: "ul",
            items: [
              "Hold the filter up to a light and look for scratches, pinholes or creases. Any defect makes them useless.",
              "Check the filter is firmly attached to the frame and not lifting at a corner.",
              "Put them on in a lit room: you should see nothing except the brightest lights.",
              "Look for ISO 12312-2 and a manufacturer's name printed on them. No manufacturer means nobody is accountable.",
            ],
          },
          { type: "h2", text: "Where to get them" },
          {
            type: "p",
            text: `Planetariums, astronomy societies, opticians and telescope shops usually distribute them in the months beforehand, and many town councils inside the path hand out free batches. Avoid unbranded street sellers in the final days, which is when counterfeit stock appears. If you are travelling from abroad, buy from a recognised supplier at home and bring them with you rather than relying on finding stock on arrival.`,
          },
          { type: "faq", items: SAFETY_FAQ.en },
        ],
      };
    },
  },
};
