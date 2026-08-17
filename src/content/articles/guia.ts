import { formatDuration } from "@/lib/eclipse/cities";
import { localWhyHere } from "../local";
import type { Article, Block } from "./types";

/** La guía troncal: qué es, qué se ve y por qué este eclipse es distinto. */
export const guia: Article = {
  slug: "guia",
  content: {
    es: (city) => {
      const d = formatDuration(city.eclipse.totalitySeconds);
      const whyHere = localWhyHere(city.slug, "es");
      return {
        title: "Guía completa del eclipse solar total del 2 de agosto de 2027",
        description: `Qué es un eclipse total, qué se ve exactamente, cómo se prepara la observación desde ${city.name} y por qué este eclipse es excepcional.`,
        body: [
          {
            type: "p",
            text: `Un eclipse solar total ocurre cuando la Luna se interpone exactamente entre la Tierra y el Sol y su sombra más oscura, la umbra, toca la superficie terrestre. Esa sombra es una mancha de unos 258 kilómetros de ancho que barre el planeta a más de mil kilómetros por hora. Solo quien está dentro de esa mancha ve la totalidad; a unos pocos kilómetros fuera, el espectáculo desaparece por completo.`,
          },
          { type: "h2", text: "Por qué la franja lo es todo" },
          {
            type: "p",
            text: `La diferencia entre el 99% y el 100% de ocultación no es de grado, es de categoría. Con un 99% el cielo apenas se oscurece, no aparece la corona y no pasa nada memorable: en Sevilla el Sol quedará cubierto al 98% y no se verá nada parecido a un eclipse total. Con el 100% desaparece el Sol, salen las estrellas y los planetas, la temperatura cae y el horizonte se ilumina en todas direcciones como un atardecer circular. Por eso toda la planificación se reduce a una cosa: estar dentro de la franja.`,
          },
          { type: "h2", text: "Las fases, en orden" },
          {
            type: "ul",
            items: [
              "Primer contacto (C1): la Luna muerde el borde del Sol. Sin filtro no se aprecia nada. Empieza algo más de una hora de fase parcial.",
              "Últimos minutos: la luz se vuelve metálica, las sombras se afilan y la temperatura baja de forma perceptible. En el suelo, bajo los árboles, aparecen cientos de soles con forma de media luna.",
              "Bandas de sombra: segundos antes de la totalidad, ondas tenues de luz y sombra recorren las superficies claras. Son difíciles de ver y no siempre aparecen.",
              "Segundo contacto (C2): el último trozo de Sol se rompe en puntos brillantes —las perlas de Baily— y queda un destello único, el anillo de diamante. Aquí se quita el filtro.",
              "Totalidad: aparece la corona, blanca y filamentosa, y a veces protuberancias rojas en el borde. El horizonte se ilumina en 360°.",
              "Tercer contacto (C3): reaparece el anillo de diamante por el otro lado. Filtro puesto de inmediato.",
              "Cuarto contacto (C4): termina la fase parcial y el Sol vuelve a estar entero.",
            ],
          },
          { type: "h2", text: "Qué tiene de especial el de 2027" },
          {
            type: "p",
            text: `Es uno de los eclipses totales más largos del siglo XXI: en su punto máximo, sobre Egipto, la totalidad llega a 6 minutos y 23 segundos, cuando lo habitual son dos o tres. La razón es una combinación afortunada: la Luna está cerca de su perigeo, así que se ve grande, y la Tierra cerca de su afelio, así que el Sol se ve pequeño. Además la franja cruza una de las regiones con más probabilidad de cielo despejado del planeta en agosto.`,
          },
          {
            type: "p",
            text: city.eclipse.isTotal
              ? `Para España es una oportunidad rara. ${city.name} queda dentro de la franja${
                  d ? `, con ${d} de totalidad` : ""
                }, y después de este eclipse y del anular de enero de 2028 no vuelve a haber un eclipse total visible desde la España peninsular hasta 2053.`
              : `Desde ${city.name} el eclipse se verá parcial. La franja de totalidad pasa por el extremo sur y merece mucho la pena el desplazamiento: no vuelve a haber otro total en la España peninsular hasta 2053.`,
          },
          ...(whyHere
            ? ([
                { type: "h2", text: `Qué significa este eclipse para ${city.name}` },
                { type: "p", text: whyHere },
              ] as Block[])
            : []),
          { type: "h2", text: "Qué se ve exactamente durante la totalidad" },
          {
            type: "ul",
            items: [
              "La corona solar: la atmósfera exterior del Sol, blanca y con estructura filamentosa. Es lo que ninguna foto reproduce bien.",
              "Protuberancias: lenguas de gas rosadas asomando por el borde del disco lunar.",
              "Planetas y estrellas brillantes en pleno día. En agosto de 2027, Venus y Mercurio estarán cerca del Sol.",
              "El horizonte iluminado en los 360°, con colores de atardecer en todas direcciones a la vez.",
              "La sombra de la Luna acercándose y alejándose, visible sobre el mar o desde un punto elevado.",
            ],
          },
          { type: "h2", text: "La preparación mínima" },
          {
            type: "ul",
            items: [
              "Gafas certificadas ISO 12312-2 para cada persona, compradas con tiempo.",
              "Alojamiento dentro de la franja para la noche anterior.",
              "Un punto de observación elegido y una alternativa por si hay nubes.",
              "La hora exacta de la totalidad en tu localidad, comprobada en el localizador con tus coordenadas.",
              "Agua, sombra y paciencia: es agosto en el sur y la espera es larga.",
            ],
          },
          {
            type: "callout",
            title: "El mejor consejo de quien ya ha visto varios",
            text: "No lo fotografíes si es tu primero. Mira. La totalidad se acaba antes de lo que crees y la memoria de haberla mirado con los ojos vale más que cualquier archivo.",
          },
        ],
      };
    },
    en: (city) => {
      const d = formatDuration(city.eclipse.totalitySeconds, "en");
      const name = city.nameEn ?? city.name;
      const whyHere = localWhyHere(city.slug, "en");
      return {
        title: "Complete guide to the total solar eclipse of 2 August 2027",
        description: `What a total eclipse is, what you actually see, how to prepare from ${name}, and why this particular eclipse is exceptional.`,
        body: [
          {
            type: "p",
            text: `A total solar eclipse happens when the Moon passes exactly between the Earth and the Sun and its darkest shadow, the umbra, touches the surface. That shadow is a patch about 258 kilometres wide sweeping across the planet at over a thousand kilometres an hour. Only those inside the patch see totality; a few kilometres outside it, the spectacle disappears entirely.`,
          },
          { type: "h2", text: "Why the path is everything" },
          {
            type: "p",
            text: `The difference between 99% and 100% coverage is not one of degree, it is one of kind. At 99% the sky barely darkens, no corona appears and nothing memorable happens: Seville will see 98% coverage and will experience nothing resembling a total eclipse. At 100% the Sun disappears, stars and planets come out, the temperature drops and the horizon glows in every direction like a circular sunset. That is why all planning reduces to one thing: being inside the path.`,
          },
          { type: "h2", text: "The phases, in order" },
          {
            type: "ul",
            items: [
              "First contact (C1): the Moon bites into the edge of the Sun. Nothing is noticeable without a filter. Just over an hour of partial phase begins.",
              "The last minutes: the light turns metallic, shadows sharpen and the temperature drops perceptibly. On the ground under trees, hundreds of crescent Suns appear.",
              "Shadow bands: seconds before totality, faint ripples of light and shade race across pale surfaces. They are hard to see and do not always appear.",
              "Second contact (C2): the last sliver of Sun breaks into bright points — Baily's beads — leaving a single flash, the diamond ring. This is when filters come off.",
              "Totality: the corona appears, white and filamentary, sometimes with red prominences at the edge. The horizon glows through all 360°.",
              "Third contact (C3): the diamond ring reappears on the other side. Filters back on immediately.",
              "Fourth contact (C4): the partial phase ends and the Sun is whole again.",
            ],
          },
          { type: "h2", text: "What makes 2027 special" },
          {
            type: "p",
            text: `It is one of the longest total eclipses of the 21st century: at its maximum, over Egypt, totality reaches 6 minutes 23 seconds, where two or three minutes is typical. The reason is a fortunate combination: the Moon is near perigee, so it appears large, and the Earth is near aphelion, so the Sun appears small. The path also crosses one of the most reliably cloud-free regions on the planet in August.`,
          },
          {
            type: "p",
            text: city.eclipse.isTotal
              ? `For Spain this is a rare opportunity. ${name} sits inside the path${
                  d ? `, with ${d} of totality` : ""
                }, and after this eclipse and the annular one of January 2028, no total solar eclipse is visible from mainland Spain again until 2053.`
              : `From ${name} the eclipse will be partial. The path of totality crosses the far south and the trip is very much worth making: there is no other total eclipse visible from mainland Spain until 2053.`,
          },
          ...(whyHere
            ? ([
                { type: "h2", text: `What this eclipse means for ${name}` },
                { type: "p", text: whyHere },
              ] as Block[])
            : []),
          { type: "h2", text: "What you actually see during totality" },
          {
            type: "ul",
            items: [
              "The solar corona: the Sun's outer atmosphere, white and filamentary. It is the thing no photograph reproduces properly.",
              "Prominences: pink tongues of gas peeking past the edge of the lunar disc.",
              "Planets and bright stars in broad daylight. In August 2027 Venus and Mercury will be near the Sun.",
              "The horizon lit through 360°, with sunset colours in every direction at once.",
              "The Moon's shadow approaching and receding, visible over the sea or from high ground.",
            ],
          },
          { type: "h2", text: "The minimum preparation" },
          {
            type: "ul",
            items: [
              "ISO 12312-2 certified glasses for every person, bought well in advance.",
              "Accommodation inside the path for the night before.",
              "A chosen viewing spot and a backup in case of cloud.",
              "The exact time of totality where you will be, checked in the locator with your own coordinates.",
              "Water, shade and patience: it is August in the far south and the wait is long.",
            ],
          },
          {
            type: "callout",
            title: "The best advice from people who have seen several",
            text: "Do not photograph your first one. Watch it. Totality ends sooner than you expect, and the memory of having actually looked at it is worth more than any file.",
          },
        ],
      };
    },
  },
};

/** Fotografía: guía práctica, con el aviso de que no la sigas si es tu primero. */
export const fotografia: Article = {
  slug: "fotografia",
  content: {
    es: (city) => {
      const d = formatDuration(city.eclipse.totalitySeconds);
      return {
        title: `Fotografiar el eclipse en ${city.name}: equipo, ajustes y qué no hacer`,
        description: `Guía práctica para fotografiar el eclipse solar total del 2 de agosto de 2027 desde ${city.name} sin quemar el sensor ni perderte la totalidad.`,
        body: [
          {
            type: "callout",
            title: "Si es tu primer eclipse total, no lo fotografíes",
            text: `Es el consejo unánime de quien ya ha visto varios. ${
              d ? `Tienes ${d}` : "Tienes unos pocos minutos"
            } y se van en un suspiro peleando con la cámara. Pon el móvil a grabar en gran angular, olvídate de él y mira.`,
          },
          { type: "h2", text: "Fase parcial: filtro obligatorio" },
          {
            type: "p",
            text: "Durante toda la fase parcial necesitas un filtro solar delante del objetivo, no detrás. Sin él quemas el sensor y, si usas visor óptico, el ojo. Con filtro, un punto de partida razonable es ISO 100, f/8 y ajustar la velocidad hasta que el disco quede bien expuesto; cada filtro es distinto, así que prueba días antes con el Sol normal.",
          },
          { type: "h2", text: "Totalidad: fuera el filtro" },
          {
            type: "ul",
            items: [
              "Quita el filtro en cuanto desaparezca el último trozo de Sol, y vuelve a ponerlo antes de que reaparezca.",
              "La corona tiene un rango dinámico enorme: haz una horquilla amplia, de 1/1000 s a 1 s a f/8 e ISO 400, y compón luego.",
              "Enfoca a infinito en manual y bloquéalo con cinta. El autofoco falla con el cielo oscuro.",
              "Trípode y disparador remoto o temporizador. A teleobjetivo, cualquier vibración se nota.",
              "Desactiva la revisión automática en pantalla: te roba segundos y te destroza la visión nocturna.",
            ],
          },
          { type: "h2", text: "Con el móvil" },
          {
            type: "p",
            text: `Los móviles actuales dan resultados dignos en totalidad si los estabilizas. Lo que no funciona es el zoom digital al Sol. Lo que sí funciona, y casi nadie hace, es lo contrario: un gran angular que capte el paisaje de ${city.name} bajo la luz de la totalidad, con el horizonte iluminado en 360° y la gente mirando arriba. Esa foto la puedes hacer tú y no la hay en ningún banco de imágenes.`,
          },
          { type: "h2", text: "Lo que sí merece la pena preparar" },
          {
            type: "ul",
            items: [
              "Un time-lapse del paisaje durante la caída de luz.",
              "Grabar el sonido: el silencio de los pájaros y los gritos de la gente al empezar la totalidad.",
              "Las sombras en el suelo durante la parcialidad: cientos de soles en media luna bajo los árboles.",
              "Ensayar toda la secuencia una tarde cualquiera, con el Sol de verdad. El día 2 no hay segunda toma.",
            ],
          },
        ],
      };
    },
    en: (city) => {
      const d = formatDuration(city.eclipse.totalitySeconds, "en");
      const name = city.nameEn ?? city.name;
      return {
        title: `Photographing the eclipse in ${name}: gear, settings and what not to do`,
        description: `A practical guide to photographing the total solar eclipse of 2 August 2027 from ${name} without frying your sensor or missing totality.`,
        body: [
          {
            type: "callout",
            title: "If this is your first total eclipse, do not photograph it",
            text: `This is the unanimous advice of people who have seen several. ${
              d ? `You have ${d}` : "You have a few minutes"
            } and they vanish while you fight with the camera. Set a phone recording on wide angle, forget about it, and watch.`,
          },
          { type: "h2", text: "Partial phase: filter mandatory" },
          {
            type: "p",
            text: "Throughout the partial phase you need a solar filter in front of the lens, not behind it. Without one you will burn the sensor and, with an optical viewfinder, your eye. With a filter, a reasonable starting point is ISO 100, f/8, adjusting shutter speed until the disc is well exposed; every filter differs, so test on the ordinary Sun days beforehand.",
          },
          { type: "h2", text: "Totality: filter off" },
          {
            type: "ul",
            items: [
              "Remove the filter the moment the last sliver of Sun disappears, and replace it before it returns.",
              "The corona has an enormous dynamic range: bracket widely, from 1/1000 s to 1 s at f/8 and ISO 400, and blend afterwards.",
              "Focus at infinity manually and tape it down. Autofocus fails against a dark sky.",
              "Tripod and remote release or timer. At long focal lengths any vibration shows.",
              "Turn off image review on screen: it steals seconds and wrecks your dark adaptation.",
            ],
          },
          { type: "h2", text: "With a phone" },
          {
            type: "p",
            text: `Modern phones give respectable results during totality if you steady them. Digital zoom at the Sun does not work. What does work, and almost nobody does, is the opposite: a wide angle capturing the landscape of ${name} under the light of totality, with the horizon glowing in 360° and people looking up. That is a photograph you can take and no stock library has.`,
          },
          { type: "h2", text: "What is genuinely worth preparing" },
          {
            type: "ul",
            items: [
              "A time-lapse of the landscape as the light collapses.",
              "Recording the sound: the birds falling silent and the crowd shouting as totality begins.",
              "The shadows on the ground during the partial phase: hundreds of crescent Suns under the trees.",
              "Rehearsing the whole sequence on an ordinary afternoon with the real Sun. There is no second take on the day.",
            ],
          },
        ],
      };
    },
  },
};
