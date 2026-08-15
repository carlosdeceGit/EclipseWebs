/**
 * Preguntas frecuentes.
 *
 * Están escritas para responder en la primera frase, sin rodeos: es lo que hace que
 * un motor generativo pueda citar la respuesta entera y lo que gana el fragmento
 * destacado en Google. Cada respuesta debe sostenerse fuera de contexto.
 */
export interface FaqItem {
  q: string;
  a: string;
}

export const HOME_FAQ: FaqItem[] = [
  {
    q: "¿Cuándo es el eclipse solar total de España?",
    a: "El lunes 2 de agosto de 2027. En el sur de España la fase de totalidad ocurre entre las 10:45 y las 10:53 de la mañana, hora peninsular, y la fase parcial empieza aproximadamente una hora y cuarto antes.",
  },
  {
    q: "¿Dónde se verá el eclipse total en España?",
    a: "En Ceuta y Melilla al completo y en 115 municipios de Andalucía: 58 de Málaga, 31 de Cádiz, 16 de Granada y 10 de Almería. Cádiz y Málaga son las únicas capitales de provincia dentro de la franja de totalidad.",
  },
  {
    q: "¿Cuál es el mejor sitio de España para ver el eclipse de 2027?",
    a: "Ceuta, con unos 4 minutos y 48 segundos de totalidad, es el punto de España donde más dura. En la Península el mejor punto es el Campo de Gibraltar, con Algeciras rozando los 4 minutos y medio.",
  },
  {
    q: "¿Cuánto dura el eclipse total?",
    a: "Depende de lo cerca que estés del centro de la franja. Va desde casi 4 minutos y 50 segundos en Ceuta hasta menos de 2 minutos en Málaga capital, que queda cerca del borde. Fuera de la franja no hay totalidad en ningún momento, solo un eclipse parcial.",
  },
  {
    q: "¿Hace falta gafas especiales para ver el eclipse?",
    a: "Sí, durante toda la fase parcial hay que usar gafas de eclipse certificadas según la norma ISO 12312-2. Solo se pueden quitar durante los minutos exactos de totalidad, cuando el disco solar está tapado del todo, y hay que volver a ponérselas en cuanto reaparece el primer destello de Sol.",
  },
  {
    q: "¿Se verá el eclipse desde Madrid o Barcelona?",
    a: "Se verá, pero solo como eclipse parcial: el Sol quedará mordido pero nunca tapado del todo, y no habrá oscuridad ni corona solar. Para ver la totalidad hay que desplazarse dentro de la franja, en el extremo sur de la Península.",
  },
  {
    q: "¿Cuándo será el próximo eclipse total visible en España?",
    a: "Después del de 2027 hay un eclipse anular el 26 de enero de 2028, en el que el Sol queda como un anillo, pero el siguiente eclipse total de Sol visible desde la España peninsular no llega hasta 2053.",
  },
  {
    q: "¿Conviene reservar alojamiento con antelación?",
    a: "Sí. El eclipse cae en pleno agosto, con la costa ya llena de turismo de temporada, y la franja de totalidad es estrecha. En eclipses anteriores en otros países el alojamiento dentro de la franja se agotó con más de un año de antelación y los precios se multiplicaron.",
  },
];

export const SAFETY_FAQ: FaqItem[] = [
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
    a: "Deben llevar impresa la referencia a la norma ISO 12312-2 y el fabricante. Con ellas puestas no deberías ver absolutamente nada salvo el filamento de una bombilla muy potente o el propio Sol. Si ves formas de la habitación, no sirven. Desconfía de las que se venden sueltas sin marca.",
  },
];
