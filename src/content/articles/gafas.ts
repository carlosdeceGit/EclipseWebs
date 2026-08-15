import type { Article } from "./types";

/**
 * Gafas de eclipse: qué comprar y cómo no comprar una falsificación.
 *
 * Página con intención de compra altísima, así que el rigor aquí importa el doble:
 * es la que más tentación da de empujar producto. La regla es que el consejo debe
 * ser el mismo que daríamos sin vender nada.
 */
export const gafas: Article = {
  slug: "gafas-de-eclipse",
  content: {
    es: (city) => ({
      title: "Gafas de eclipse: cuáles comprar y cómo detectar una falsificación",
      description: `Qué certificación deben llevar las gafas de eclipse en España, cómo reconocer las falsas y cuántas necesitas para el eclipse del 2 de agosto de 2027 en ${city.name}.`,
      body: [
        {
          type: "p",
          text: "Unas gafas de eclipse cuestan poco y son lo único que separa una mañana inolvidable de una lesión permanente en la retina. El problema es que el mercado se llena de falsificaciones en los meses previos a cada eclipse, y a simple vista no se distinguen de las buenas.",
        },
        { type: "h2", text: "Qué certificación deben llevar en España" },
        {
          type: "p",
          text: "Aquí hay una confusión muy extendida que conviene aclarar. La norma técnica internacional es la ISO 12312-2, y es la que define cuánta luz puede dejar pasar el filtro. Pero en la Unión Europea las gafas de eclipse son además un equipo de protección individual de categoría II, regulado por el Reglamento (UE) 2016/425. Eso significa que, para venderse legalmente en España, no basta con cumplir la ISO: necesitan marcado CE respaldado por un certificado de examen UE de tipo emitido por un organismo notificado.",
        },
        {
          type: "ul",
          items: [
            "Busca la marca CE seguida del número de cuatro dígitos del organismo notificado.",
            "Busca la referencia a EN ISO 12312-2, que es la versión europea de la norma, idéntica a la internacional.",
            "Busca el nombre y la dirección del fabricante o del responsable en la UE. Sin responsable identificable no hay a quién reclamar.",
            "Desconfía de lo que solo diga «ISO 12312-2 certified» sin CE ni organismo notificado: es habitual en producto importado y no cumple los requisitos europeos.",
          ],
        },
        {
          type: "callout",
          title: "«Certificado ISO» no es lo mismo que «legal en España»",
          text: "Muchas gafas vendidas por internet anuncian conformidad con la ISO 12312-2 pero no llevan certificado de examen UE de tipo. Pueden ser ópticamente seguras o no serlo: sin el certificado, nadie lo ha comprobado de forma independiente para el mercado europeo.",
        },
        { type: "h2", text: "Cómo comprobar unas gafas que ya tienes" },
        {
          type: "ul",
          items: [
            "Póntelas en una habitación iluminada. No debes ver absolutamente nada salvo una bombilla muy potente. Si distingues muebles o ventanas, tíralas.",
            "Mira el filtro a contraluz buscando arañazos, agujeritos o pliegues. Cualquier defecto las inutiliza.",
            "Comprueba que el filtro esté firmemente pegado a la montura y no se levante por una esquina.",
            "Descarta las que estén arrugadas, dobladas o guardadas sueltas en un cajón desde otro eclipse.",
          ],
        },
        { type: "h2", text: "Cuántas necesitas y cuándo comprarlas" },
        {
          type: "p",
          text: `Una por persona, sin compartir: pasarse unas gafas de mano en mano durante la fase parcial es la forma más fácil de que alguien mire justo cuando no toca. Cómpralas con meses de antelación. En los eclipses recientes el stock certificado se agotó semanas antes, y lo que quedó a última hora fue precisamente el material sin trazabilidad. Si vienes desde fuera, cómpralas en tu país a un proveedor reconocido y tráelas contigo.`,
        },
        { type: "h2", text: "Alternativas seguras sin gafas" },
        {
          type: "ul",
          items: [
            "Proyección estenopeica: una cartulina con un agujero de alfiler proyecta la imagen del Sol sobre otra cartulina. Nunca se mira a través del agujero.",
            "Un colador de cocina proyecta decenas de soles en media luna sobre el suelo. Es lo que mejor funciona con niños.",
            "La sombra de un árbol hace lo mismo con sus hojas, gratis y sin preparar nada.",
            "Proyección por telescopio o prismáticos sobre una cartulina, sin mirar nunca por el ocular.",
          ],
        },
        { type: "h2", text: "Y durante la totalidad" },
        {
          type: "p",
          text: city.eclipse.isTotal
            ? `En ${city.name}, durante los ${Math.round(city.eclipse.totalitySeconds)} segundos de totalidad, las gafas se quitan. Es obligatorio quitárselas para ver algo: a través del filtro la corona es invisible. Y hay que volver a ponérselas en cuanto asome el primer destello de luz por el borde.`
            : `Desde ${city.name} no hay totalidad, así que las gafas no se quitan en ningún momento de la mañana.`,
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: "Eclipse glasses: what to buy and how to spot a fake",
        description: `What certification eclipse glasses need in Spain and the EU, how to recognise counterfeits, and how many you need for the 2 August 2027 eclipse in ${name}.`,
        body: [
          {
            type: "p",
            text: "Eclipse glasses cost very little and are the only thing standing between an unforgettable morning and permanent retinal injury. The problem is that the market fills with counterfeits in the months before every eclipse, and they are indistinguishable from good ones by eye.",
          },
          { type: "h2", text: "What certification they need in the EU" },
          {
            type: "p",
            text: "There is a widespread confusion worth clearing up. The international technical standard is ISO 12312-2, which defines how much light the filter may transmit. But in the European Union eclipse glasses are also Category II personal protective equipment, governed by Regulation (EU) 2016/425. That means that to be sold legally in Spain, meeting the ISO standard is not enough: they need CE marking backed by an EU type-examination certificate issued by a notified body.",
          },
          {
            type: "ul",
            items: [
              "Look for the CE mark followed by the notified body's four-digit number.",
              "Look for a reference to EN ISO 12312-2, the European version of the standard, identical to the international one.",
              "Look for the name and address of the manufacturer or the EU responsible person. With no identifiable party, there is nobody to hold accountable.",
              "Be wary of anything that says only 'ISO 12312-2 certified' with no CE mark and no notified body: this is common on imported stock and does not meet EU requirements.",
            ],
          },
          {
            type: "callout",
            title: "'ISO certified' is not the same as 'legal in the EU'",
            text: "Many glasses sold online claim conformity with ISO 12312-2 but carry no EU type-examination certificate. They may or may not be optically safe: without the certificate, nobody has verified it independently for the European market.",
          },
          { type: "h2", text: "How to check a pair you already own" },
          {
            type: "ul",
            items: [
              "Put them on in a lit room. You should see absolutely nothing except a very bright bulb. If you can make out furniture or windows, bin them.",
              "Hold the filter up to a light and look for scratches, pinholes or creases. Any defect makes them useless.",
              "Check the filter is firmly bonded to the frame and not lifting at a corner.",
              "Discard any that are crumpled, folded, or have been loose in a drawer since a previous eclipse.",
            ],
          },
          { type: "h2", text: "How many you need and when to buy" },
          {
            type: "p",
            text: `One per person, not shared: passing a single pair around during the partial phase is the easiest way for somebody to look at exactly the wrong moment. Buy months ahead. At recent eclipses, certified stock sold out weeks in advance, and what remained at the last minute was precisely the material with no traceability. If you are travelling in, buy from a recognised supplier at home and bring them with you.`,
          },
          { type: "h2", text: "Safe alternatives without glasses" },
          {
            type: "ul",
            items: [
              "Pinhole projection: a card with a pinhole projects the Sun's image onto a second card. You never look through the hole.",
              "A kitchen colander projects dozens of crescent Suns onto the ground. It works best with children.",
              "The shadow of a tree does the same through its leaves, free and with no preparation.",
              "Projection through a telescope or binoculars onto card, never looking through the eyepiece.",
            ],
          },
          { type: "h2", text: "And during totality" },
          {
            type: "p",
            text: city.eclipse.isTotal
              ? `In ${name}, during the ${Math.round(city.eclipse.totalitySeconds)} seconds of totality, the glasses come off. Taking them off is necessary to see anything at all: through the filter the corona is invisible. And they go back on the instant the first flash of light appears at the edge.`
              : `From ${name} there is no totality, so the glasses never come off at any point in the morning.`,
          },
        ],
      };
    },
  },
};
