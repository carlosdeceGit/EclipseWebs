import type { Locale } from "@/lib/eclipse/types";

/**
 * Preguntas frecuentes.
 *
 * Escritas para responder en la primera frase, sin rodeos: es lo que permite que un
 * motor generativo cite la respuesta entera y lo que gana el fragmento destacado en
 * Google. Cada respuesta debe sostenerse fuera de contexto.
 *
 * El inglés no es una traducción literal: cambian los ejemplos y las referencias,
 * porque quien busca en inglés viene de fuera y necesita otro encuadre.
 */
export interface FaqItem {
  q: string;
  a: string;
}

export const HOME_FAQ: Record<Locale, FaqItem[]> = {
  es: [
    {
      q: "¿Cuándo es el eclipse solar total de España?",
      a: "El lunes 2 de agosto de 2027. En el sur de España la fase de totalidad ocurre entre las 10:44 y las 10:52 de la mañana, hora peninsular, y la fase parcial empieza aproximadamente una hora antes y termina algo más de una hora después.",
    },
    {
      q: "¿Dónde se verá el eclipse total en España?",
      a: "En Ceuta y Melilla al completo y en 115 municipios de Andalucía: 58 de Málaga, 31 de Cádiz, 16 de Granada y 10 de Almería. Cádiz y Málaga son las únicas capitales de provincia dentro de la franja de totalidad.",
    },
    {
      q: "¿Cuál es el mejor sitio de España para ver el eclipse de 2027?",
      a: "Ceuta, con unos 4 minutos y 48 segundos de totalidad, es el punto de España donde más dura. En la Península el mejor punto es el Campo de Gibraltar: Algeciras roza los 4 minutos y medio y Tarifa supera los 4 minutos y medio con horizonte marino.",
    },
    {
      q: "¿Cuánto dura el eclipse total?",
      a: "Depende de lo cerca que estés del centro de la franja. Va desde casi 4 minutos y 50 segundos en Ceuta hasta poco más de un minuto en localidades del borde como Vélez-Málaga o Ronda. Málaga capital, cerca del límite norte, tiene menos de dos minutos. Fuera de la franja no hay totalidad en ningún momento, solo un eclipse parcial.",
    },
    {
      q: "¿Hace falta gafas especiales para ver el eclipse?",
      a: "Sí, durante toda la fase parcial hay que usar gafas de eclipse certificadas según la norma ISO 12312-2. Solo se pueden quitar durante los minutos exactos de totalidad, cuando el disco solar está tapado del todo, y hay que volver a ponérselas en cuanto reaparece el primer destello de Sol.",
    },
    {
      q: "¿Se verá el eclipse desde Madrid o Barcelona?",
      a: "Se verá, pero solo como eclipse parcial: en Madrid el Sol llegará a estar cubierto en torno al 86%, y aun así no habrá oscuridad ni corona solar. La diferencia entre el 99% y el 100% no es de grado sino de categoría. Para ver la totalidad hay que desplazarse dentro de la franja.",
    },
    {
      q: "¿Cuándo será el próximo eclipse total visible en España?",
      a: "Después del de 2027 hay un eclipse anular el 26 de enero de 2028, en el que el Sol queda como un anillo, pero el siguiente eclipse total de Sol visible desde la España peninsular no llega hasta 2053.",
    },
    {
      q: "¿Conviene reservar alojamiento con antelación?",
      a: "Sí. El eclipse cae en pleno agosto, con la costa ya llena de turismo de temporada, y la franja de totalidad es estrecha. En eclipses anteriores en otros países el alojamiento dentro de la franja se agotó con más de un año de antelación y los precios se multiplicaron.",
    },
    {
      q: "¿A qué altura estará el Sol durante el eclipse?",
      a: "Entre 37° y 41° sobre el horizonte según la localidad, es decir, bastante alto. Eso es una gran ventaja: no necesitas un horizonte despejado hacia el Sol, casi cualquier sitio sin un edificio justo encima sirve. Lo que sí conviene es tener vistas amplias alrededor, porque durante la totalidad el horizonte se ilumina en los 360°.",
    },
    {
      q: "¿Hacia dónde hay que mirar?",
      a: "Hacia el este-sureste, con el Sol a unos 95° de azimut y bastante alto. A media mañana de agosto el Sol está en esa zona del cielo, así que basta con orientarse hacia donde amanece y levantar la vista.",
    },
  ],
  en: [
    {
      q: "When is the total solar eclipse in Spain?",
      a: "Monday 2 August 2027. In southern Spain totality happens between 10:44 and 10:52 in the morning, local time (CEST, UTC+2). The partial phase begins about an hour earlier and ends a little over an hour later.",
    },
    {
      q: "Where will the total eclipse be visible in Spain?",
      a: "Across all of Ceuta and Melilla, and in 115 municipalities in Andalusia: 58 in Malaga, 31 in Cadiz, 16 in Granada and 10 in Almeria. Cadiz and Malaga are the only provincial capitals inside the path of totality. Gibraltar is also inside the path.",
    },
    {
      q: "What is the best place to see the 2027 eclipse in Spain?",
      a: "Ceuta, with around 4 minutes 48 seconds of totality, is the longest in Spanish territory. On the mainland the best area is the Campo de Gibraltar: Algeciras gets close to four and a half minutes, and Tarifa gets over four and a half with an open sea horizon. Gibraltar itself sees about 4 minutes 27 seconds.",
    },
    {
      q: "How long does totality last?",
      a: "It depends on how close you are to the centre of the path. It ranges from almost 4 minutes 50 seconds in Ceuta down to just over a minute in edge towns. Malaga city, near the northern limit, gets under two minutes. Outside the path there is no totality at all, only a partial eclipse.",
    },
    {
      q: "Do I need special glasses to watch the eclipse?",
      a: "Yes. Throughout the entire partial phase you must use eclipse glasses certified to ISO 12312-2. You can only take them off during the exact minutes of totality, when the solar disc is completely covered, and you must put them back on the instant the first flash of Sun reappears.",
    },
    {
      q: "Is this a good eclipse for travelling to?",
      a: "Exceptionally good. It is one of the longest total eclipses of the 21st century, the Sun sits high in the sky at around 40°, and early August in southern Spain and North Africa is one of the most reliably cloud-free combinations of date and place anywhere on the planet. Logistics in Spain are straightforward, which is not always the case for long eclipses.",
    },
    {
      q: "When is the next total eclipse visible from Spain?",
      a: "After 2027 there is an annular eclipse on 26 January 2028, where the Sun becomes a ring of light, but the next total solar eclipse visible from mainland Spain is not until 2053.",
    },
    {
      q: "Should I book accommodation in advance?",
      a: "Yes. The eclipse falls in the middle of August, when the Spanish coast is already at peak season, and the path of totality is narrow. In recent eclipses elsewhere, accommodation inside the path sold out more than a year ahead and prices multiplied several times over.",
    },
    {
      q: "How high will the Sun be during the eclipse?",
      a: "Between 37° and 41° above the horizon depending on where you are, which is comfortably high. That is a real advantage: you do not need a clear horizon towards the Sun, so almost any spot without a building directly overhead will work. What does help is a wide view all around, because during totality the horizon glows in all 360°.",
    },
    {
      q: "Which direction should I look?",
      a: "East-southeast, with the Sun at roughly 95° azimuth and fairly high up. At mid-morning in August the Sun sits in that part of the sky, so face towards sunrise and look up.",
    },
  ],
};

export const SAFETY_FAQ: Record<Locale, FaqItem[]> = {
  es: [
    {
      q: "¿Sirven las gafas de sol normales para ver el eclipse?",
      a: "No. Unas gafas de sol, incluso las de categoría 4, dejan pasar miles de veces más luz de la que el ojo tolera mirando directamente al Sol. Solo valen los filtros certificados ISO 12312-2.",
    },
    {
      q: "¿Se puede mirar sin filtro durante la totalidad?",
      a: "Sí, y es el único momento en que se debe hacer: durante la totalidad el disco solar está completamente tapado y la corona solo es visible a simple vista. En cuanto reaparece el primer punto de luz hay que volver a poner el filtro de inmediato.",
    },
    {
      q: "¿Puedo mirar el eclipse con el móvil o hacer fotos?",
      a: "Apuntar la cámara del móvil al Sol sin filtro puede dañar el sensor durante la fase parcial, y mirar la pantalla no protege el ojo si de reojo miras al Sol. Para la fase parcial hace falta un filtro solar delante del objetivo; durante la totalidad se puede fotografiar sin filtro.",
    },
    {
      q: "¿Cómo sé si mis gafas de eclipse son auténticas?",
      a: "Deben llevar impresa la referencia a la norma ISO 12312-2 y un fabricante identificable. Con ellas puestas no deberías ver absolutamente nada salvo el filamento de una bombilla muy potente o el propio Sol. Si ves formas de la habitación, no sirven. Desconfía de las que se venden sueltas sin marca los días previos.",
    },
    {
      q: "¿Caducan las gafas de eclipse?",
      a: "El material filtrante no caduca por sí solo, pero sí se estropea. La regla práctica es descartar cualquier gafa con arañazos, agujeros, pliegues en el filtro o el filtro despegado de la montura. Si tienes dudas, no las uses: cuestan poco y una retina no se repone.",
    },
    {
      q: "¿Es seguro para los niños?",
      a: "Sí, con supervisión. Lo prudente es un adulto por cada niño pequeño durante la fase parcial, porque las gafas se resbalan. Para los más pequeños, la proyección con un colador de cocina o una cartulina agujereada es la alternativa sin ningún riesgo.",
    },
  ],
  en: [
    {
      q: "Will ordinary sunglasses work for the eclipse?",
      a: "No. Sunglasses, even category 4 ones, let through thousands of times more light than the eye can tolerate when looking directly at the Sun. Only filters certified to ISO 12312-2 are safe.",
    },
    {
      q: "Can I look without a filter during totality?",
      a: "Yes, and it is the only moment when you should: during totality the solar disc is completely covered and the corona is only visible to the naked eye. The instant the first point of light reappears, the filter goes straight back on.",
    },
    {
      q: "Can I photograph the eclipse with my phone?",
      a: "Pointing a phone camera at the Sun without a filter can damage the sensor during the partial phase, and looking at the screen does not protect your eyes if you glance at the Sun. The partial phase needs a solar filter in front of the lens; during totality you can shoot without one.",
    },
    {
      q: "How do I know if my eclipse glasses are genuine?",
      a: "They must be printed with a reference to ISO 12312-2 and an identifiable manufacturer. With them on you should see absolutely nothing except the filament of a very bright bulb or the Sun itself. If you can make out shapes in the room, they are not safe. Be wary of unbranded glasses sold loose in the days before.",
    },
    {
      q: "Do eclipse glasses expire?",
      a: "The filter material does not expire on its own, but it does get damaged. The practical rule is to discard any pair with scratches, pinholes, creases in the filter, or a filter coming away from the frame. If in doubt, do not use them: they cost very little and a retina cannot be replaced.",
    },
    {
      q: "Is it safe for children?",
      a: "Yes, with supervision. One adult per small child during the partial phase is sensible, because the glasses slip. For very young children, projecting the Sun through a kitchen colander or a card with a pinhole is a completely risk-free alternative.",
    },
  ],
};
