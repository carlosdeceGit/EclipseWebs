import { hm } from "../helpers";
import type { BlogPost } from "../types";

const PUBLISHED = "2026-08-17";

/**
 * Gastronomía.
 *
 * Sin nombres de restaurantes. No porque no importen, sino porque una lista de
 * locales escrita a un año de la fecha y sin haberlos visitado sería exactamente el
 * tipo de contenido de relleno que abarata una web. Se explican los platos, que es
 * la información que no caduca, y se dice claramente que las recomendaciones
 * concretas llegarán del directorio.
 */
export const queComer: BlogPost = {
  slug: "que-comer-en-ceuta-guia-para-el-viaje-del-eclipse",
  citySlug: "ceuta",
  category: "ciudad",
  published: PUBLISHED,
  cover: "gastronomy",
  related: [
    "ceuta-en-dos-dias-mas-alla-del-eclipse",
    "donde-dormir-la-noche-del-eclipse-en-ceuta",
    "movilidad-y-atascos-el-dia-del-eclipse-en-ceuta",
  ],
  content: {
    es: (city) => ({
      title: `Qué comer en ${city.name}: cuatro cocinas en la misma mesa`,
      description: `La cocina de ${city.name} mezcla lo andaluz, lo magrebí, lo hebreo y lo hindú en 19 km². Qué platos buscar, qué se pesca en el Estrecho y cómo organizar las comidas el día del eclipse.`,
      lead: `${city.name} es una ciudad pequeña con una cocina desproporcionadamente variada: el recetario andaluz de fritura y pescado convive con el magrebí de especias y brasa, y con las tradiciones hebrea e hindú de las otras dos comunidades históricas de la ciudad. Es una de las razones para venir dos días y no uno.`,
      body: [
        {
          type: "p",
          text: `Lo primero, porque condiciona el resto: ${city.name} está en el Estrecho, donde el Atlántico y el Mediterráneo se cruzan. Eso significa pescado, y significa pescado de paso —especies que migran por el Estrecho— además del de roca de toda la vida. La segunda clave es la frontera: las especias, las brasas y la repostería del otro lado no son una influencia lejana, están a quince minutos.`,
        },
        {
          type: "figure",
          art: "gastronomy",
          caption:
            "Cuatro familias de platos que resumen la mesa ceutí: el pescado del Estrecho, la brasa especiada, el té y la repostería de almendra.",
        },
        { type: "h2", text: "El pescado y el marisco" },
        {
          type: "p",
          text: `El pescaíto frito es andaluz y en ${city.name} se hace como en toda la provincia de Cádiz: harina gruesa, aceite muy caliente y poco más. Pero el catálogo local mira también al Mediterráneo. El **atún rojo** cruza el Estrecho en su migración y en toda la zona —de Barbate a Tarifa y hasta aquí— es producto de temporada con un peso cultural enorme. Aparecen también el **voraz**, la **urta** y los pescados de roca, además de las gambas y los langostinos de la bahía.`,
        },
        {
          type: "ul",
          items: [
            "Pescado frito o a la plancha, en cualquier chiringuito de playa. Es lo más sencillo y lo más difícil de hacer mal aquí.",
            "Atún, si estás en temporada: en tataki, en tartar, encebollado o a la plancha. El recetario del atún de almadraba de la zona es una cocina en sí misma.",
            "Marisco de la bahía, en tapa. Con una caña, es la comida de mediodía perfecta en agosto.",
          ],
        },
        { type: "h2", text: "La brasa y las especias" },
        {
          type: "p",
          text: `Los **pinchitos** son el plato de calle por excelencia: carne especiada —cúrcuma, comino, pimentón, cilantro— en brocheta y a la brasa. Se comen de pie, con pan, y son la comida más práctica que existe si estás fuera de casa todo el día. Junto a ellos aparecen los guisos y las carnes especiadas de tradición magrebí, y la repostería de almendra, miel y sésamo que se comparte entre las cuatro cocinas de la ciudad.`,
        },
        { type: "h2", text: "El té con hierbabuena" },
        {
          type: "p",
          text: `Muy dulce, muy caliente y servido desde arriba para que haga espuma. Tomarlo a media tarde en agosto suena a contradicción y no lo es: es un ritual de hospitalidad y funciona. Si vienes desde la Península, es probablemente la cosa más ceutí que vas a hacer en el viaje.`,
        },
        {
          type: "callout",
          title: "Sin IVA, y eso se nota",
          text: `${city.name} tiene régimen fiscal propio: no se aplica IVA sino el impuesto local, el IPSI, con tipos generalmente más bajos. Eso abarata bastantes cosas —tabaco, perfumería, electrónica, alcohol— y algo la hostelería. No es la razón para venir, pero explica por qué las compras son parte del viaje para mucha gente.`,
        },
        {
          type: "figure",
          art: "day-plan",
          caption:
            "El eclipse ocupa toda la media mañana y termina justo antes de la hora de comer, con todo el mundo saliendo a la vez.",
        },
        { type: "h2", text: "Cómo organizar las comidas el día del eclipse" },
        {
          type: "p",
          text: `Aquí sí hay un consejo práctico que cambia el día. El eclipse ocupa toda la media mañana: empieza a las ${hm(city.localTimes.partialStart)} y termina a las ${hm(city.localTimes.partialEnd)}. Es decir, la franja horaria del almuerzo cae justo después, y con miles de personas saliendo del mismo sitio a la vez.`,
        },
        {
          type: "ol",
          items: [
            "Desayuna fuerte antes de salir de casa. En el punto de observación habrá cola en todo lo que tenga mostrador.",
            "Lleva comida contigo: fruta, frutos secos, algo salado. Vas a estar tres horas al sol.",
            `Reserva mesa para después de las ${hm(city.localTimes.partialEnd)} si quieres comer sentado. Sin reserva, la primera hora tras el eclipse es imposible.`,
            "O al revés, que es lo que haríamos: come tarde y tranquilo, cuando el gentío ya se haya movido. Es también la mejor forma de esquivar el atasco.",
          ],
        },
        { type: "h2", text: "Por qué aquí no hay nombres de restaurantes" },
        {
          type: "p",
          text: `Porque no los hemos visitado, y una lista de locales copiada de otras webs no ayuda a nadie: es exactamente el relleno que hace que una guía deje de ser fiable. Lo que sí vamos a hacer es abrir el **directorio de negocios** de la ciudad, donde los establecimientos aparecen con su ficha y su categoría, y donde se distingue con claridad lo que es una ficha pagada de lo que es una recomendación. Preferimos ese modelo a una lista de favoritos inventada.`,
        },
      ],
      faq: [
        {
          q: `¿Qué se come típicamente en ${city.name}?`,
          a: "Pescado y marisco del Estrecho —pescaíto frito, atún rojo en temporada, voraz, urta—, carnes especiadas a la brasa como los pinchitos, repostería de almendra y miel, y té con hierbabuena. La mezcla viene de las cuatro comunidades históricas de la ciudad: cristiana, musulmana, hebrea e hindú.",
        },
        {
          q: "¿Es cierto que en Ceuta no hay IVA?",
          a: "Sí. Ceuta tiene un régimen fiscal propio en el que no se aplica el IVA sino un impuesto local, el IPSI, con tipos generalmente inferiores. Eso abarata perceptiblemente algunos productos, sobre todo tabaco, perfumería, alcohol y electrónica.",
        },
        {
          q: "¿Podré comer bien el día del eclipse?",
          a: `Con previsión, sí. El eclipse termina a las ${hm(city.localTimes.partialEnd)}, justo antes de la hora del almuerzo, y habrá mucha gente buscando mesa a la vez. Lo mejor es desayunar fuerte, llevar comida al punto de observación y comer tarde, cuando el gentío se haya dispersado.`,
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: `What to eat in ${name}: four kitchens at the same table`,
        description: `The cooking of ${name} mixes Andalusian, Maghrebi, Jewish and Hindu traditions within 19 km². Which dishes to look for, what is caught in the Strait, and how to plan meals on eclipse day.`,
        lead: `${name} is a small city with a disproportionately varied kitchen: the Andalusian repertoire of fried fish sits alongside the Maghrebi one of spice and charcoal, and alongside the Jewish and Hindu traditions of the city's other two historic communities. It is one of the reasons to come for two days rather than one.`,
        body: [
          {
            type: "p",
            text: `First, because it shapes everything else: ${name} sits on the Strait, where the Atlantic and the Mediterranean meet. That means fish, and it means migratory fish — species that pass through the Strait — alongside the usual rock species. The second key is the border: the spices, the grills and the pastries from the other side are not a distant influence, they are fifteen minutes away.`,
          },
          {
            type: "figure",
            art: "gastronomy",
            caption:
              "Four families of dishes that sum up the Ceuta table: fish from the Strait, spiced charcoal grilling, mint tea, and almond pastries.",
          },
          { type: "h2", text: "Fish and shellfish" },
          {
            type: "p",
            text: `Fried fish is Andalusian, and in ${name} it is done as it is across Cadiz province: coarse flour, very hot oil, and little else. But the local catalogue looks to the Mediterranean too. **Bluefin tuna** crosses the Strait on its migration and throughout the area — from Barbate to Tarifa and here — it is a seasonal product with enormous cultural weight. You will also find **voraz** (blackspot seabream), **urta** and rock fish, plus prawns from the bay.`,
          },
          {
            type: "ul",
            items: [
              "Fish fried or grilled, at any beach bar. It is the simplest thing here and the hardest to get wrong.",
              "Tuna, if you are in season: tataki, tartare, stewed with onions or simply grilled. The local almadraba tuna repertoire is a cuisine in its own right.",
              "Shellfish from the bay, as a tapa. With a beer, it is the perfect August lunch.",
            ],
          },
          { type: "h2", text: "Charcoal and spice" },
          {
            type: "p",
            text: `**Pinchitos** are the street dish par excellence: spiced meat — turmeric, cumin, paprika, coriander — on a skewer over charcoal. Eaten standing, with bread, they are the most practical food there is if you are out all day. Alongside them come the spiced stews and grilled meats of the Maghrebi tradition, and the almond, honey and sesame pastries shared across all four of the city's kitchens.`,
          },
          { type: "h2", text: "Mint tea" },
          {
            type: "p",
            text: `Very sweet, very hot, and poured from a height so it foams. Drinking it mid-afternoon in August sounds like a contradiction and is not: it is a ritual of hospitality and it works. If you are coming from the mainland, it is probably the most Ceutan thing you will do on the trip.`,
          },
          {
            type: "callout",
            title: "No VAT, and you notice",
            text: `${name} has its own tax regime: instead of Spanish VAT it applies a local tax, the IPSI, generally at lower rates. That makes a fair few things cheaper — tobacco, perfume, electronics, alcohol — and hospitality slightly so. It is not the reason to come, but it explains why shopping is part of the trip for many people.`,
          },
          {
          type: "figure",
          art: "day-plan",
          caption:
            "The eclipse fills the whole of mid-morning and ends right before lunch, with everyone leaving at once.",
        },
        { type: "h2", text: "Planning meals on eclipse day" },
          {
            type: "p",
            text: `Here there is one practical piece of advice that changes the day. The eclipse takes up the whole of mid-morning: it starts at ${hm(city.localTimes.partialStart)} and ends at ${hm(city.localTimes.partialEnd)}. Which means the lunch window falls immediately afterwards, with thousands of people leaving the same place at once.`,
          },
          {
            type: "ol",
            items: [
              "Eat a substantial breakfast before you leave. Anything with a counter at the viewing spot will have a queue.",
              "Carry food with you: fruit, nuts, something salty. You will be out in the sun for three hours.",
              `Book a table for after ${hm(city.localTimes.partialEnd)} if you want to sit down. Without a booking, the first hour after the eclipse is hopeless.`,
              "Or invert it, which is what we would do: eat late and unhurried, once the crowd has moved. It is also the best way to dodge the traffic.",
            ],
          },
          { type: "h2", text: "Why there are no restaurant names here" },
          {
            type: "p",
            text: `Because we have not eaten in them, and a list of venues copied from other websites helps nobody: it is exactly the filler that makes a guide stop being trustworthy. What we will do instead is open the city's **business directory**, where establishments appear with their own listing and category, and where a paid listing is clearly distinguishable from a recommendation. We prefer that model to an invented list of favourites.`,
          },
        ],
        faq: [
          {
            q: `What is the typical food in ${name}?`,
            a: "Fish and shellfish from the Strait — fried fish, bluefin tuna in season, voraz, urta — spiced charcoal-grilled meats such as pinchitos, almond and honey pastries, and mint tea. The mix comes from the city's four historic communities: Christian, Muslim, Jewish and Hindu.",
          },
          {
            q: "Is it true there is no VAT in Ceuta?",
            a: "Yes. Ceuta has its own tax regime in which Spanish VAT does not apply; instead there is a local tax, the IPSI, generally at lower rates. That noticeably reduces the price of some goods, particularly tobacco, perfume, alcohol and electronics.",
          },
          {
            q: "Will I be able to eat properly on eclipse day?",
            a: `With planning, yes. The eclipse ends at ${hm(city.localTimes.partialEnd)}, just before lunchtime, and a lot of people will be looking for a table at once. Best approach: a big breakfast, food carried to your viewing spot, and a late lunch once the crowd has dispersed.`,
          },
        ],
      };
    },
  },
};

/** Turismo. El post que convierte un viaje de un día en uno de tres. */
export const dosDias: BlogPost = {
  slug: "ceuta-en-dos-dias-mas-alla-del-eclipse",
  citySlug: "ceuta",
  category: "ciudad",
  published: PUBLISHED,
  cover: "four-cultures",
  related: [
    "que-comer-en-ceuta-guia-para-el-viaje-del-eclipse",
    "donde-ver-el-eclipse-en-ceuta",
    "como-llegar-a-ceuta-para-el-eclipse",
  ],
  content: {
    es: (city) => ({
      title: `${city.name} en dos días: qué ver además del eclipse`,
      description: `Qué visitar en ${city.name} en el viaje del eclipse: las Murallas Reales y el foso navegable, el Monte Hacho, el Parque Marítimo, la ciudad de las cuatro culturas y el Estrecho.`,
      lead: `Vas a estar en ${city.name} al menos dos noches por logística del eclipse, así que conviene aprovecharlas. La ciudad cabe en 19 km² y se recorre andando, lo que la convierte en uno de esos destinos donde dos días dan para mucho más de lo que parece.`,
      body: [
        {
          type: "p",
          text: `${city.name} es una ciudad de frontera con más de dos mil años de historia acumulada en una península estrecha: fenicios, romanos, bizantinos, el reino visigodo, los omeyas, los portugueses y España. Todo eso en un territorio que se cruza a pie en una mañana. Y sigue siendo una ciudad de cuatro comunidades —cristiana, musulmana, hebrea e hindú— que conviven en el mismo casco urbano, con sus templos a pocas calles unos de otros.`,
        },
        {
          type: "figure",
          art: "four-cultures",
          caption:
            "Las cuatro culturas no son una etiqueta turística: son cuatro comunidades con sus templos, sus calendarios y sus cocinas en la misma ciudad.",
        },
        { type: "h2", text: "Las Murallas Reales y el Foso de San Felipe" },
        {
          type: "p",
          text: `Es el monumento que define la ciudad. Un conjunto defensivo levantado sobre el istmo, con un foso **navegable** —el único de España, y uno de los pocos de Europa— que separa físicamente la península de la Almina del continente. Se puede recorrer, cruzar por sus puentes y navegar. Si solo tienes tiempo para una cosa en ${city.name}, es ésta.`,
        },
        { type: "h2", text: "El Monte Hacho y el mirador de San Antonio" },
        {
          type: "p",
          text: `Doscientos metros al final de la Almina, con vistas al Estrecho, a la costa peninsular y a Marruecos en el mismo giro de cabeza. Es el mejor lugar para entender la geografía de todo esto: desde arriba se ve por qué esta península ha sido disputada durante dos milenios. La fortaleza es zona militar, pero el entorno de la ermita de San Antonio es accesible y es donde está el mirador.`,
        },
        { type: "h2", text: "El Parque Marítimo del Mediterráneo" },
        {
          type: "p",
          text: `Un conjunto de lagos de agua salada, piscinas y jardines diseñado por **César Manrique**, el artista lanzaroteño, junto al mar. Es la mejor manera de pasar las horas de calor de agosto sin salir de la ciudad, y arquitectónicamente es una pieza que en otra ciudad sería el reclamo principal.`,
        },
        { type: "h2", text: "El casco: cuatro templos y un paseo" },
        {
          type: "ul",
          items: [
            "La catedral y el santuario de África, en el corazón del casco antiguo.",
            "La mezquita de Muley el Mehdi, con su cúpula visible desde buena parte de la ciudad.",
            "La sinagoga y el templo hindú, testimonio de las otras dos comunidades históricas.",
            "La Casa de los Dragones, edificio modernista con sus cuatro dragones en la esquina, que es la fotografía urbana más reconocible de la ciudad.",
            "Los baños árabes y los restos arqueológicos que aparecen intercalados en el trazado urbano.",
          ],
        },
        {
          type: "callout",
          title: "Un consejo de calendario",
          text: `Reserva el día 3 de agosto para hacer turismo, no el 2. El día del eclipse la ciudad va a estar saturada, con los aforos llenos y la gente moviéndose en masa; el día siguiente, mucha de esa gente ya se habrá ido y tendrás la ciudad casi para ti. Es la mejor razón para reservar la vuelta el 3 y no el 2.`,
        },
        {
          type: "figure",
          art: "viewpoints-map",
          caption:
            "La ciudad cabe en una península estrecha: del istmo y las murallas al Monte Hacho hay un paseo.",
        },
        { type: "h2", text: "El Estrecho como espectáculo" },
        {
          type: "p",
          text: `No hace falta un monumento: el Estrecho lo es. Desde ${city.name} se ven pasar los cargueros por uno de los pasos marítimos más transitados del mundo, con la costa de la Península enfrente y el macizo marroquí al oeste. Los avistamientos de cetáceos son habituales en la zona del Estrecho y hay operadores en ambas orillas. Y al atardecer, con el sol cayendo por el lado atlántico, se entiende por qué a los antiguos les parecía el final del mundo.`,
        },
        { type: "h2", text: "Un plan de dos días que funciona" },
        {
          type: "table",
          head: ["", "Mañana", "Tarde"],
          rows: [
            ["Día 1 (1 de agosto)", "Llegada y Murallas Reales", "Casco antiguo y los cuatro templos"],
            ["Día 2 (2 de agosto)", `Eclipse, de ${hm(city.localTimes.partialStart)} a ${hm(city.localTimes.partialEnd)}`, "Comida tardía y descanso: no te muevas"],
            ["Día 3 (3 de agosto)", "Monte Hacho y mirador", "Parque Marítimo y vuelta con calma"],
          ],
        },
        {
          type: "p",
          text: `Y si te sobra un día: **Tetuán y Tánger están cerca**, y son dos ciudades que merecen el viaje por sí solas. Antes de contar con ello, comprueba las condiciones de paso de la frontera en los días previos: pueden cambiar y no conviene que tu plan dependa de ello.`,
        },
      ],
      faq: [
        {
          q: `¿Qué hay que ver en ${city.name}?`,
          a: "Las Murallas Reales con su foso navegable, el único de España; el Monte Hacho y el mirador de San Antonio, con vistas al Estrecho y a dos continentes; el Parque Marítimo del Mediterráneo, diseñado por César Manrique; y el casco antiguo, con los templos de las cuatro comunidades históricas de la ciudad y la modernista Casa de los Dragones.",
        },
        {
          q: `¿Cuántos días hacen falta para ver ${city.name}?`,
          a: "Dos días completos permiten ver lo esencial con calma, y encajan bien con la logística del eclipse: llegar el 1 de agosto, ver el eclipse el 2 y hacer turismo el 3, cuando la ciudad se habrá vaciado de visitantes.",
        },
        {
          q: "¿Se puede visitar Marruecos desde Ceuta en el mismo viaje?",
          a: "Tetuán y Tánger están cerca por carretera desde la frontera de El Tarajal. Las condiciones de paso pueden cambiar, así que conviene consultar la información oficial en los días previos y no construir el plan del viaje alrededor de ese cruce.",
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: `${name} in two days: what to see besides the eclipse`,
        description: `What to visit in ${name} on your eclipse trip: the Royal Walls and their navigable moat, Monte Hacho, the Maritime Park, the city of four cultures, and the Strait itself.`,
        lead: `You will be in ${name} for at least two nights because of eclipse logistics, so it is worth using them. The city fits into 19 km² and is walkable, which makes it one of those destinations where two days go a lot further than you would expect.`,
        body: [
          {
            type: "p",
            text: `${name} is a border city with more than two thousand years of history packed onto a narrow peninsula: Phoenicians, Romans, Byzantines, the Visigothic kingdom, the Umayyads, the Portuguese and Spain. All of it in a territory you can cross on foot in a morning. And it remains a city of four communities — Christian, Muslim, Jewish and Hindu — living in the same town centre, their places of worship a few streets apart.`,
          },
          {
            type: "figure",
            art: "four-cultures",
            caption:
              "The four cultures are not a tourist label: they are four communities with their own temples, calendars and kitchens in the same city.",
          },
          { type: "h2", text: "The Royal Walls and the San Felipe moat" },
          {
            type: "p",
            text: `This is the monument that defines the city. A defensive complex raised across the isthmus, with a **navigable** moat — the only one in Spain, and one of very few in Europe — physically separating the Almina peninsula from the continent. You can walk it, cross its bridges and take a boat along it. If you only have time for one thing in ${name}, this is it.`,
          },
          { type: "h2", text: "Monte Hacho and the San Antonio viewpoint" },
          {
            type: "p",
            text: `Two hundred metres at the end of the Almina, with views of the Strait, the Spanish coast and Morocco in a single turn of the head. It is the best place to grasp the geography of all this: from up there you can see why this peninsula has been contested for two millennia. The fortress is a military zone, but the area around the San Antonio chapel is accessible and that is where the viewpoint is.`,
          },
          { type: "h2", text: "The Parque Marítimo del Mediterráneo" },
          {
            type: "p",
            text: `A complex of saltwater lakes, pools and gardens beside the sea, designed by **César Manrique**, the Lanzarote artist. It is the best way to get through August's hot hours without leaving the city, and architecturally it is a piece that in another city would be the main attraction.`,
          },
          { type: "h2", text: "The old town: four temples and a walk" },
          {
            type: "ul",
            items: [
              "The cathedral and the sanctuary of Our Lady of Africa, at the heart of the old town.",
              "The Muley el Mehdi mosque, its dome visible from much of the city.",
              "The synagogue and the Hindu temple, evidence of the other two historic communities.",
              "The Casa de los Dragones, a modernist building with four dragons on its corner — the most recognisable urban photograph in the city.",
              "The Arab baths and the archaeological remains threaded through the street plan.",
            ],
          },
          {
            type: "callout",
            title: "A note on scheduling",
            text: `Save 3 August for sightseeing, not the 2nd. On eclipse day the city will be saturated, venues full and people moving in crowds; the following day much of that has gone and you will have the place nearly to yourself. It is the best argument for booking your return for the 3rd rather than the 2nd.`,
          },
          {
          type: "figure",
          art: "viewpoints-map",
          caption:
            "The city fits onto a narrow peninsula: from the isthmus and the walls to Monte Hacho is a walk.",
        },
        { type: "h2", text: "The Strait as a spectacle" },
          {
            type: "p",
            text: `You do not need a monument: the Strait is one. From ${name} you watch cargo ships file through one of the busiest sea lanes in the world, with the Spanish coast opposite and the Moroccan massif to the west. Cetacean sightings are common in the Strait and there are operators on both shores. And at sunset, with the light going down the Atlantic side, you understand why the ancients thought this was the end of the world.`,
          },
          { type: "h2", text: "A two-day plan that works" },
          {
            type: "table",
            head: ["", "Morning", "Afternoon"],
            rows: [
              ["Day 1 (1 August)", "Arrival and the Royal Walls", "Old town and the four temples"],
              ["Day 2 (2 August)", `Eclipse, ${hm(city.localTimes.partialStart)} to ${hm(city.localTimes.partialEnd)}`, "Late lunch and rest: do not move"],
              ["Day 3 (3 August)", "Monte Hacho and the viewpoint", "Maritime Park, then an unhurried journey home"],
            ],
          },
          {
            type: "p",
            text: `And if you have a spare day: **Tetouan and Tangier are close**, and both are worth a trip in their own right. Before counting on it, check border crossing conditions in the days beforehand: they can change, and your plan should not depend on it.`,
          },
        ],
        faq: [
          {
            q: `What is there to see in ${name}?`,
            a: "The Royal Walls with their navigable moat, the only one in Spain; Monte Hacho and the San Antonio viewpoint, looking over the Strait and two continents; the Parque Marítimo del Mediterráneo, designed by César Manrique; and the old town, with the places of worship of the city's four historic communities and the modernist Casa de los Dragones.",
          },
          {
            q: `How many days do you need in ${name}?`,
            a: "Two full days cover the essentials without rushing, and they fit the eclipse logistics well: arrive on 1 August, watch the eclipse on the 2nd, and sightsee on the 3rd once the visitors have left.",
          },
          {
            q: "Can I visit Morocco from Ceuta on the same trip?",
            a: "Tetouan and Tangier are a short drive from the El Tarajal border. Crossing conditions can change, so check official information in the days beforehand and do not build the trip around that crossing.",
          },
        ],
      };
    },
  },
};
