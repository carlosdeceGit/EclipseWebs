import { formatDuration } from "@/lib/eclipse/cities";
import type { City } from "@/lib/eclipse/types";
import { SAFETY_FAQ, type FaqItem } from "./faq";
import { LEGAL_ARTICLES } from "./legal";

/**
 * Guías largas de la red.
 *
 * Cada artículo se genera a partir de la ciudad del dominio, de modo que
 * ceutaeclipse.com y tarifaeclipse.com no publican el mismo texto: cambian los
 * datos, los topónimos y los ejemplos. Duplicar contenido entre dominios propios
 * es la forma más rápida de que Google se quede con uno solo e ignore el resto.
 */

export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; title: string; text: string }
  | { type: "faq"; items: FaqItem[] };

export interface Article {
  slug: string;
  title: (city: City) => string;
  description: (city: City) => string;
  body: (city: City) => Block[];
  /** Si lleva FAQ, se emite también el JSON-LD de FAQPage. */
  faq?: (city: City) => FaqItem[];
}

const duracion = (city: City) => formatDuration(city.circumstances.totalitySeconds);

export const ARTICLES: Article[] = [
  {
    slug: "seguridad",
    title: (c) => `Cómo ver el eclipse sin dañarte los ojos en ${c.name}`,
    description: (c) =>
      `Filtros ISO 12312-2, errores habituales y el único momento seguro para mirar sin gafas durante el eclipse del 2 de agosto de 2027 en ${c.name}.`,
    faq: () => SAFETY_FAQ,
    body: (c) => [
      {
        type: "p",
        text: `Un eclipse solar es el único fenómeno astronómico masivo que puede dejar secuelas permanentes a quien lo mira mal. La retina no tiene receptores de dolor, así que el daño no avisa: la pérdida de visión central aparece horas después y a menudo no se recupera. Todo lo que sigue se resume en una regla: en ${c.name}, durante toda la fase parcial, filtro certificado sin excepciones.`,
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
        text: c.circumstances.inTotality
          ? `Durante la totalidad, y solo durante la totalidad. En ${c.name} eso significa ${
              duracion(c) ? `unos ${duracion(c)}` : "los pocos minutos"
            } en los que el disco solar queda tapado del todo y aparece la corona. En ese intervalo se mira a simple vista, sin filtro, y es la única forma de ver la corona: a través de las gafas de eclipse no se ve nada. En cuanto asome el primer destello de luz por el borde de la Luna, filtro puesto otra vez, sin esperar.`
          : `Desde ${c.name} el eclipse se ve parcial, así que no hay ningún momento seguro para mirar sin filtro. La única forma de ver la totalidad es desplazarse a la franja.`,
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
      { type: "h2", text: "Dónde conseguir gafas certificadas" },
      {
        type: "p",
        text: `Planetarios, agrupaciones astronómicas, ópticas y tiendas de astronomía suelen distribuirlas en los meses previos, y muchos ayuntamientos de la franja reparten lotes gratuitos. Evita las de venta ambulante sin marca los días previos, que es cuando se cuela el material falsificado. En el directorio de ${c.name} vamos publicando los puntos de venta confirmados.`,
      },
      { type: "faq", items: SAFETY_FAQ },
    ],
  },
  {
    slug: "alojamiento",
    title: (c) => `Alojamiento para el eclipse en ${c.name}: qué hacer y cuándo reservar`,
    description: (c) =>
      `Cómo encontrar sitio en ${c.name} para el eclipse del 2 de agosto de 2027, qué precios esperar y qué alternativas hay si se agota todo dentro de la franja.`,
    body: (c) => [
      {
        type: "p",
        text: `El eclipse cae un lunes de agosto, en plena temporada alta, sobre una franja estrecha de costa que ya está llena. Esa combinación es la que agota el alojamiento con meses de antelación en todos los eclipses recientes: en el de Estados Unidos de 2017 y en el de 2024, los hoteles dentro de la franja colgaron el cartel de completo más de un año antes, con tarifas de tres a cinco veces la habitual y estancias mínimas de tres noches.`,
      },
      { type: "h2", text: "Cuándo reservar" },
      {
        type: "p",
        text: `Cuanto antes, y con cancelación gratuita. La estrategia que mejor funciona es reservar ya algo cancelable dentro de la franja aunque no sea ideal, y seguir buscando con red debajo. Lo que no funciona es esperar a que bajen los precios: en un eclipse la demanda es un pico de un solo día que no se relaja.`,
      },
      { type: "h2", text: `Dormir en ${c.name} o dormir fuera` },
      {
        type: "p",
        text: c.circumstances.inTotality
          ? `Dormir dentro de la franja evita el problema real del día 2, que no es encontrar sitio para ver el eclipse sino llegar. La totalidad es a media mañana, así que quien duerma fuera tendrá que conducir esa misma mañana hacia una zona con carreteras saturadas. Si no encuentras nada en ${c.name}, un alojamiento algo más lejos pero dentro de la franja sigue siendo mejor que uno más cerca pero fuera.`
          : `Desde ${c.name} el eclipse se ve parcial, así que si el objetivo es la totalidad conviene buscar alojamiento directamente dentro de la franja y usar ${c.name} solo como base de apoyo.`,
      },
      { type: "h2", text: "Alternativas cuando se agotan los hoteles" },
      {
        type: "ul",
        items: [
          "Campings y áreas de autocaravana de la franja, que suelen abrir reservas más tarde que los hoteles.",
          "Alquiler vacacional completo repartiendo el coste entre varias personas, que es lo que mejor aguanta la subida de precios.",
          "Alojamiento en localidades del interior de la franja, menos demandadas que la primera línea de playa y con la misma totalidad.",
          "Ferry o tren nocturno para llegar de madrugada el mismo día 2, evitando la carretera en hora punta.",
        ],
      },
      {
        type: "callout",
        title: "Aviso sobre precios",
        text: "No publicamos precios concretos de hoteles porque cambian a diario y cualquier cifra fija envejece mal. En el directorio recogemos los alojamientos que confirman disponibilidad para esas fechas, con enlace directo a su propia web.",
      },
      { type: "h2", text: "Si vienes en autocaravana" },
      {
        type: "p",
        text: `Es la opción más flexible y la que más conflictos genera. La acampada libre está prohibida en la mayor parte del litoral andaluz y de ${c.province}, y para un evento de esta magnitud es previsible que los ayuntamientos habiliten zonas específicas y refuercen la vigilancia. Vamos publicando en la guía de eventos las áreas oficiales según se confirmen.`,
      },
    ],
  },
  {
    slug: "como-llegar",
    title: (c) => `Cómo llegar a ${c.name} para el eclipse del 2 de agosto de 2027`,
    description: (c) =>
      `Ferris, aeropuertos, trenes y carreteras para llegar a ${c.name} el día del eclipse, y cómo evitar quedarte atrapado en la carretera durante la totalidad.`,
    body: (c) => [
      {
        type: "p",
        text: `El problema logístico del 2 de agosto de 2027 no es ver el eclipse: es estar dentro de la franja a las ${"10:45"} de la mañana. La totalidad dura minutos y no espera. Todo lo que sigue está pensado para que no te pille en un atasco.`,
      },
      { type: "h2", text: "La regla de la noche anterior" },
      {
        type: "p",
        text: `Duerme dentro de la franja la noche del 1 al 2 de agosto. Es la única forma de no depender del tráfico. En los eclipses de 2017 y 2024 en Estados Unidos se registraron atascos de varias horas en carreteras secundarias que normalmente están vacías, y hubo gente que vio la totalidad desde el arcén porque no llegó a tiempo. Aquí el efecto puede ser mayor, porque la franja incluye tramos de costa con una sola vía de acceso.`,
      },
      { type: "h2", text: `Llegar a ${c.name}` },
      {
        type: "ul",
        items: [
          c.country === "ES" && (c.slug === "ceuta" || c.slug === "melilla")
            ? "Por mar: los ferris desde la Península son el acceso principal y se llenan. Reserva plaza, y con vehículo reserva con mucha más antelación aún; considera cruzar como pasajero y moverte a pie o en transporte público."
            : "En coche: la A-7 y la N-340 son los ejes principales de la costa, y el día del eclipse serán el cuello de botella. Cualquier desvío por carreteras locales estará igual de saturado.",
          "En avión: Málaga es el aeropuerto grande de referencia de la zona, con Jerez y Gibraltar como alternativas más pequeñas. Los vuelos de esas fechas suben de precio pronto.",
          "En tren: la red llega bien a Málaga, Cádiz y Jerez, pero no cubre buena parte de los municipios de la franja, así que casi siempre hay que combinar con autobús o coche.",
          "En autobús: es la opción más barata y la más expuesta al atasco. Sirve para llegar días antes, no para llegar esa mañana.",
        ],
      },
      { type: "h2", text: "Moverse el mismo día 2" },
      {
        type: "ul",
        items: [
          "Ten elegido el sitio de observación con antelación y una alternativa a menos de veinte minutos por si el cielo se cubre justo ahí.",
          "Llega al punto de observación al menos dos horas antes del inicio de la totalidad.",
          "Cuenta con que la cobertura móvil se degrade: decenas de miles de personas en la misma zona saturan la red. Descarga mapas y horarios sin conexión.",
          "Lleva agua y sombra. Es agosto en el sur y la espera es a pleno sol.",
          "No pares en el arcén de una autovía para mirar. Es peligroso y además es la escena que provoca los accidentes típicos de los días de eclipse.",
        ],
      },
      {
        type: "callout",
        title: "La vuelta es peor que la ida",
        text: "Todo el mundo se va a la vez, en cuanto termina la totalidad. Si puedes, quédate a comer donde estés y sal por la tarde: ganarás tiempo y de paso el negocio local lo agradece.",
      },
    ],
  },
  {
    slug: "clima",
    title: (c) => `¿Estará despejado en ${c.name} el día del eclipse?`,
    description: (c) =>
      `Qué dice la climatología de principios de agosto en ${c.name} y qué margen hay para moverse si amanece nublado el 2 de agosto de 2027.`,
    body: (c) => [
      {
        type: "p",
        text: `La buena noticia es que el eclipse cae a principios de agosto en el sur de España, que es de las combinaciones de fecha y lugar más favorables del mundo: es la época del año con menos nubosidad y menos lluvia de toda la región, y el Sol estará alto, entre 37° y 42° sobre el horizonte, lo que reduce el efecto de la bruma cercana al horizonte.`,
      },
      { type: "h2", text: "El matiz local: el Estrecho tiene su propio tiempo" },
      {
        type: "p",
        text: `En la zona del Estrecho conviven dos regímenes de viento con efectos opuestos. El levante empuja aire húmedo del Mediterráneo y puede formar una capa de nubes bajas que se pega a la costa y a las laderas, sobre todo por la mañana, que es justo cuando ocurre el eclipse. El poniente, más fresco y atlántico, suele dejar cielos más limpios. Es el factor que más puede estropear la observación en la zona, más que una tormenta.`,
      },
      { type: "h2", text: "Qué hacer con eso" },
      {
        type: "ul",
        items: [
          "No decidas el punto exacto de observación hasta 24 o 48 horas antes, cuando las predicciones ya son fiables.",
          "Ten una alternativa tierra adentro y otra a lo largo de la franja: unos kilómetros bastan para salir de una capa de nubes bajas costera.",
          "Gana altura si hay nubes bajas: los puntos elevados a menudo quedan por encima de la capa.",
          "Sigue la predicción de AEMET los días previos y no las apps genéricas, que en zonas de microclima fallan mucho.",
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
        text: `Incluso con el cielo cubierto, la totalidad se nota: la luz cae en picado hasta un crepúsculo profundo, la temperatura baja varios grados en minutos, el viento cambia y los animales se comportan como al anochecer. No es lo mismo que ver la corona, pero no es nada.`,
      },
    ],
  },
  {
    slug: "fotografia",
    title: (c) => `Fotografiar el eclipse en ${c.name}: equipo, ajustes y qué NO hacer`,
    description: (c) =>
      `Guía práctica para fotografiar el eclipse solar total del 2 de agosto de 2027 desde ${c.name} sin quemar el sensor ni perderte la totalidad.`,
    body: (c) => [
      {
        type: "callout",
        title: "Si es tu primer eclipse total, no lo fotografíes",
        text: `Es el consejo unánime de quien ya ha visto varios. ${
          duracion(c) ? `Tienes ${duracion(c)}` : "Tienes unos pocos minutos"
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
          "La corona tiene un rango dinámico enorme: haz una horquilla amplia de exposiciones, de 1/1000 s a 1 s a f/8 e ISO 400, y compón luego.",
          "Enfoca a infinito en manual y bloquéalo con cinta. El autofoco falla con el cielo oscuro.",
          "Trípode y disparador remoto o temporizador. A teleobjetivo, cualquier vibración se nota.",
        ],
      },
      { type: "h2", text: "Con el móvil" },
      {
        type: "p",
        text: `Los móviles actuales dan resultados dignos en totalidad si los estabilizas. Lo que no funciona es el zoom digital al Sol. Lo que sí funciona, y casi nadie hace, es lo contrario: un gran angular que capte el paisaje de ${c.name} bajo la luz de la totalidad, con el horizonte iluminado en 360° y la gente mirando arriba. Esa foto la puedes hacer tú y no la hay en ningún banco de imágenes.`,
      },
      { type: "h2", text: "Lo que sí merece la pena preparar" },
      {
        type: "ul",
        items: [
          "Un vídeo en time-lapse del paisaje durante la caída de luz.",
          "Grabar el sonido: el silencio de los pájaros y los gritos de la gente al empezar la totalidad.",
          "Las sombras en el suelo: durante la parcialidad, las hojas de los árboles proyectan cientos de soles con forma de media luna.",
          "Ensayar toda la secuencia una tarde cualquiera, con el Sol de verdad. El día 2 no hay segunda toma.",
        ],
      },
    ],
  },
  {
    slug: "eventos",
    title: (c) => `Eventos y observaciones del eclipse en ${c.name}`,
    description: (c) =>
      `Actividades, observaciones públicas y jornadas divulgativas alrededor del eclipse del 2 de agosto de 2027 en ${c.name}. Se actualiza a diario.`,
    body: (c) => [
      {
        type: "p",
        text: `Esta página recoge las actividades confirmadas alrededor del eclipse en ${c.name} y su entorno: observaciones públicas, charlas, jornadas de astronomía, repartos de gafas certificadas y actos organizados por ayuntamientos y agrupaciones astronómicas.`,
      },
      {
        type: "callout",
        title: "Todavía es pronto",
        text: `A más de un año vista, la mayoría de administraciones y agrupaciones aún no han publicado su programa. Un agente revisa a diario las fuentes oficiales y añade aquí cada acto en cuanto se anuncia, con enlace a la convocatoria original.`,
      },
      { type: "h2", text: "¿Organizas algo?" },
      {
        type: "p",
        text: `Si eres un ayuntamiento, una agrupación astronómica, un centro educativo o una empresa y organizas una actividad abierta relacionada con el eclipse, puedes darla de alta gratis en el directorio y aparecerá aquí. Las actividades gratuitas y divulgativas no pagan nada.`,
      },
      { type: "h2", text: "Qué esperamos que se anuncie" },
      {
        type: "ul",
        items: [
          "Observaciones públicas con telescopios filtrados en plazas, paseos marítimos y miradores.",
          "Reparto institucional de gafas certificadas en los días previos.",
          "Jornadas divulgativas en centros culturales y planetarios.",
          "Dispositivos especiales de tráfico, transporte y emergencias para el día 2.",
          "Actividades escolares en el curso 2026-2027, ya que el eclipse cae en periodo vacacional.",
        ],
      },
    ],
  },
  {
    slug: "guia",
    title: (c) => `Guía completa del eclipse solar total del 2 de agosto de 2027`,
    description: (c) =>
      `Qué es un eclipse total, qué se ve exactamente, cómo se prepara la observación desde ${c.name} y por qué este eclipse es distinto.`,
    body: (c) => [
      {
        type: "p",
        text: `Un eclipse solar total ocurre cuando la Luna se interpone exactamente entre la Tierra y el Sol y su sombra más oscura, la umbra, toca la superficie terrestre. Esa sombra es una mancha de unos cien kilómetros de ancho que barre el planeta a más de mil kilómetros por hora. Solo quien está dentro de esa mancha ve la totalidad; a unos pocos kilómetros fuera, el espectáculo desaparece por completo.`,
      },
      { type: "h2", text: "Por qué la franja importa tanto" },
      {
        type: "p",
        text: `La diferencia entre el 99% y el 100% de ocultación no es de grado, es de categoría. Con un 99% el cielo apenas se oscurece, no aparece la corona y no pasa nada memorable. Con el 100% desaparece el Sol, salen las estrellas, la temperatura cae y el horizonte se ilumina en todas direcciones como un atardecer circular. Por eso toda la planificación se reduce a una cosa: estar dentro de la franja.`,
      },
      { type: "h2", text: "Las fases, en orden" },
      {
        type: "ul",
        items: [
          "Primer contacto (C1): la Luna muerde el borde del Sol. Sin filtro no se aprecia nada. Empieza algo más de una hora de fase parcial.",
          "Últimos minutos: la luz se vuelve metálica, las sombras se afilan y la temperatura baja de forma perceptible.",
          "Segundo contacto (C2): el último trozo de Sol se rompe en puntos brillantes —las perlas de Baily— y queda un destello único, el anillo de diamante. Aquí se quita el filtro.",
          "Totalidad: aparece la corona, blanca y filamentosa, y a veces protuberancias rojas en el borde. El horizonte se ilumina en 360°.",
          "Tercer contacto (C3): reaparece el anillo de diamante por el otro lado. Filtro puesto de inmediato.",
          "Cuarto contacto (C4): termina la fase parcial y el Sol vuelve a estar entero.",
        ],
      },
      { type: "h2", text: "Qué tiene de especial el de 2027" },
      {
        type: "p",
        text: `Es uno de los eclipses totales más largos del siglo XXI: en su punto máximo, sobre Egipto, la totalidad supera los seis minutos, cuando lo habitual son dos o tres. La razón es una combinación afortunada: la Luna está cerca de su perigeo, así que se ve grande, y la Tierra cerca de su afelio, así que el Sol se ve pequeño. Además la franja cruza una de las regiones con más probabilidad de cielo despejado del planeta en agosto.`,
      },
      {
        type: "p",
        text: c.circumstances.inTotality
          ? `Para España es una oportunidad rara. ${c.name} queda dentro de la franja${
              duracion(c) ? `, con ${duracion(c)} de totalidad` : ""
            }, y después de este eclipse y del anular de enero de 2028 no vuelve a haber un eclipse total visible desde la España peninsular hasta 2053.`
          : `Desde ${c.name} el eclipse se verá parcial. La franja de totalidad pasa cerca, en el extremo sur, y merece mucho la pena el desplazamiento: no vuelve a haber otro total en la España peninsular hasta 2053.`,
      },
      { type: "h2", text: "La preparación mínima" },
      {
        type: "ul",
        items: [
          "Gafas certificadas ISO 12312-2 para cada persona, compradas con tiempo.",
          "Alojamiento dentro de la franja para la noche anterior.",
          "Un punto de observación elegido y una alternativa por si hay nubes.",
          "La hora exacta de la totalidad en tu localidad, apuntada y comprobada.",
          "Agua, sombra y paciencia: es agosto en el sur y la espera es larga.",
        ],
      },
    ],
  },
];

ARTICLES.push(
  {
    slug: "donde-verlo",
    title: (c) => `Dónde ver el eclipse en ${c.name}: mejores puntos de observación`,
    description: (c) =>
      `Cómo elegir el sitio para ver el eclipse total del 2 de agosto de 2027 en ${c.name} y qué condiciones debe cumplir un buen punto de observación.`,
    body: (c) => [
      {
        type: "p",
        text: c.circumstances.inTotality
          ? `${c.name} está dentro de la franja de totalidad, así que técnicamente el eclipse se ve desde cualquier punto del municipio con el cielo despejado. Lo que distingue un sitio bueno de uno malo no es la vista del Sol —estará alto, a unos 40° sobre el horizonte, por encima de casi cualquier obstáculo— sino el entorno: el horizonte lejano, el espacio y la huida.`
          : `Desde ${c.name} el eclipse se ve parcial. Para ver la totalidad hay que desplazarse a la franja; esta guía sirve igualmente para elegir el punto de observación una vez allí.`,
      },
      { type: "h2", text: "Qué hace bueno a un punto de observación" },
      {
        type: "ul",
        items: [
          "Horizonte despejado en 360°, no hacia el Sol. Lo espectacular de la totalidad es ver el resplandor anaranjado rodeándote por todos lados, y eso se pierde encajonado entre edificios.",
          "Algo de altura, que ayuda si hay nubes bajas de levante pegadas a la costa.",
          "Espacio suficiente para la gente que va a haber. Un mirador pequeño y famoso será un problema, no una ventaja.",
          "Acceso y salida razonables. Un sitio precioso con una única carretera de acceso se convierte en una trampa ese día.",
          "Sombra y agua cerca, o la posibilidad de llevarlas. La espera es de más de una hora a pleno sol de agosto.",
          "Sin farolas que se enciendan automáticamente al caer la luz: arruinan la visión nocturna justo en el momento clave.",
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
      {
        type: "callout",
        title: "Puntos concretos, con reservas",
        text: `Iremos publicando los puntos de observación habilitados oficialmente en ${c.name} según los confirmen ayuntamiento y agrupaciones astronómicas. Preferimos no señalar de antemano rincones que no soportarían la afluencia.`,
      },
      { type: "h2", text: "Lo que no hace falta" },
      {
        type: "p",
        text: `No hace falta telescopio ni prismáticos: la totalidad se ve mejor a simple vista, porque la corona es grande y el instrumento la recorta. No hace falta madrugar para coger sitio en el mejor mirador; hace falta llegar con margen a un sitio razonable. Y no hace falta subir a la montaña más alta: la diferencia de duración entre puntos cercanos la marca la distancia al centro de la franja, no la altitud.`,
      },
    ],
  },
  {
    slug: "fuentes",
    title: () => "Fuentes y metodología",
    description: (c) =>
      `De dónde salen los datos que publicamos sobre el eclipse del 2 de agosto de 2027 en ${c.name} y cómo los verificamos.`,
    body: (c) => [
      {
        type: "p",
        text: "Esta web publica datos astronómicos que la gente va a usar para planificar un viaje y para decidir cuándo quitarse unas gafas protectoras. Por eso tenemos una regla estricta: ningún número se publica sin fuente citable, y lo que no está verificado se marca como pendiente en lugar de rellenarse con una estimación.",
      },
      { type: "h2", text: "Fuentes primarias" },
      {
        type: "ul",
        items: [
          "Instituto Geográfico Nacional (IGN) para circunstancias locales del eclipse: horas de contacto, duración de la totalidad y altura del Sol.",
          "Junta de Andalucía para el listado oficial de municipios dentro de la franja de totalidad.",
          "AEMET para climatología y predicción meteorológica.",
          "Ayuntamientos y agrupaciones astronómicas locales para eventos, puntos habilitados y repartos de gafas.",
        ],
      },
      { type: "h2", text: "Cómo se actualiza" },
      {
        type: "p",
        text: "Un sistema de agentes revisa a diario las fuentes oficiales, detecta cambios y abre una propuesta de actualización que queda registrada antes de publicarse. Cada dato de la ficha lleva asociada la fuente concreta y la fecha de la última comprobación.",
      },
      { type: "h2", text: "Qué hacemos cuando no sabemos algo" },
      {
        type: "p",
        text: `Decirlo. En las fichas verás campos marcados como pendientes de verificar. Es intencionado: preferimos una ficha incompleta a una ficha completa y equivocada, sobre todo en las horas de contacto, donde un error de minutos puede hacer que alguien se quite el filtro cuando no debe.`,
      },
      { type: "h2", text: "Corrección de errores" },
      {
        type: "p",
        text: `Si detectas un dato incorrecto en la información de ${c.name}, escríbenos y lo corregimos citando la fuente. Las correcciones relevantes se anotan en la propia página.`,
      },
    ],
  },
);

// Las legales viven aparte porque no son contenido editorial y no deben aparecer
// en los listados de guías, aunque sí necesitan ruta y sitemap.
ARTICLES.push(...LEGAL_ARTICLES);

export const ARTICLES_BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, a]));
