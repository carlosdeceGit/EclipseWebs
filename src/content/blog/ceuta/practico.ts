import { durationWords, hm } from "../helpers";
import type { BlogPost } from "../types";

const PUBLISHED = "2026-08-17";

/**
 * Gafas de eclipse.
 *
 * Este post da el mismo consejo que daría si no vendiéramos nada, que es la regla del
 * proyecto y no una pose: en cuanto se note que está escrito para empujar producto,
 * pierde la credibilidad que lo hace útil, y con ella el posicionamiento.
 */
export const gafasEnCeuta: BlogPost = {
  slug: "gafas-de-eclipse-en-ceuta-como-elegirlas",
  citySlug: "ceuta",
  category: "observacion",
  published: PUBLISHED,
  cover: "glasses-marks",
  related: [
    "los-cinco-contactos-del-eclipse-explicados",
    "el-eclipse-con-ninos-en-ceuta",
    "plan-hora-a-hora-del-dia-del-eclipse-en-ceuta",
  ],
  content: {
    es: (city) => ({
      title: "Gafas de eclipse: cómo elegirlas sin que te cuelen unas malas",
      description: `Qué marcas debe llevar un filtro solar para ser seguro en la Unión Europea, por qué «ISO 12312-2 certified» no basta, y cómo comprobarlas antes del 2 de agosto de 2027 en ${city.name}.`,
      lead: `Unas gafas de eclipse seguras en la Unión Europea llevan dos cosas impresas: **CE** y **EN ISO 12312-2**. La frase «ISO 12312-2 certified» en la caja, sola, no acredita nada: es la trampa más común del mercado y la que más gafas malas coloca.`,
      body: [
        {
          type: "p",
          text: `Durante toda la fase parcial del eclipse —de las ${hm(city.localTimes.partialStart)} a las ${hm(city.localTimes.totalityStart)} y de las ${hm(city.localTimes.totalityEnd)} a las ${hm(city.localTimes.partialEnd)} en ${city.name}— mirar al Sol sin un filtro certificado puede provocar una quemadura en la retina. No duele mientras ocurre, porque la retina no tiene receptores de dolor, y el daño puede ser permanente. Por eso este asunto no admite ni improvisación ni ahorro.`,
        },
        { type: "h2", text: "Las dos marcas, y por qué hacen falta las dos" },
        {
          type: "p",
          text: `**ISO 12312-2** es la norma técnica: define cuánta radiación visible, ultravioleta e infrarroja puede pasar un filtro para mirar al Sol directamente. Es la referencia correcta y es la que se cita en todo el mundo.`,
        },
        {
          type: "p",
          text: `Lo que casi nadie explica es que en la Unión Europea eso no basta. Unas gafas de eclipse son un **equipo de protección individual de categoría II** según el Reglamento (UE) 2016/425, y eso obliga a algo más: marcado **CE** respaldado por un **certificado de examen UE de tipo** emitido por un organismo notificado independiente. Es decir, la norma dice cómo tiene que ser el filtro; el CE acredita que un tercero lo ha comprobado. Buena parte del producto que se anuncia como «ISO 12312-2 certified» en tiendas online no tiene ese certificado detrás.`,
        },
        {
          type: "figure",
          art: "glasses-marks",
          caption:
            "Lo que hay que buscar impreso en la propia montura, y la lista de filtros improvisados que no sirven en ningún caso.",
        },
        { type: "h2", text: "Cómo comprobar unas gafas que ya tienes" },
        {
          type: "ol",
          items: [
            "Busca «CE» y «EN ISO 12312-2» o «ISO 12312-2:2015» impresas en la montura, no solo en el envase. Si están únicamente en la caja, sospecha.",
            "Busca el nombre y la dirección del fabricante. Un producto sin fabricante identificable no tiene a quién reclamar.",
            "Mírala a contraluz contra una bombilla potente. Si ves algo más que el filamento —el marco de la ventana, tu mano, la forma de la lámpara— el filtro no es lo bastante denso o está dañado.",
            "Pásale la mano por delante buscando arañazos, pliegues o agujeros minúsculos. Un solo pinchazo la invalida.",
            "Compruébalas al aire libre antes del día: mirando al Sol un instante, solo debes ver un disco anaranjado o blanquecino, nítido y sin halo. Nada más del entorno.",
          ],
        },
        {
          type: "callout",
          title: "Lo que no sirve, por mucho que se repita",
          text: `Gafas de sol, aunque sean muy oscuras o muy caras. Varias gafas de sol superpuestas. Negativos fotográficos, radiografías, CD, DVD, cristales ahumados, cristal de soldador de grado insuficiente, botellas de color, filtros de densidad neutra de cámara. Y no, mirar a través de la pantalla del móvil tampoco protege: protege al móvil, no al ojo.`,
        },
        { type: "h2", text: "Dónde comprarlas para el eclipse de Ceuta" },
        {
          type: "p",
          text: `A un año del eclipse, la oferta local aún no existe: es previsible que ópticas, museos, planetarios, agrupaciones astronómicas y comercios de ${city.name} vendan gafas en los meses previos, pero **hoy no podemos recomendar ningún punto de venta concreto porque no lo hay**. Cuando existan, y cuando podamos comprobar que el producto lleva el CE con su certificado, lo publicaremos aquí con nombres.`,
        },
        {
          type: "p",
          text: `Mientras tanto, dos consejos que sirven igual: **compra con antelación**, porque la última semana el producto bueno se agota y aparece el malo; y si compras online, exige al vendedor el número del certificado de examen UE de tipo y el del organismo notificado, y comprueba ese organismo en la base de datos NANDO de la Comisión Europea. Un vendedor serio te lo da; uno que se va por las ramas te está diciendo que no lo tiene.`,
        },
        {
          type: "figure",
          art: "contacts-timeline",
          caption:
            "El filtro va puesto de C1 a C2 y de C3 a C4. Solo se retira en el tramo naranja, y se vuelve a poner al primer destello.",
        },
        { type: "h2", text: "Cuántas comprar" },
        {
          type: "p",
          text: `Una por persona, más una o dos de repuesto por grupo. Es un producto de cartón que se dobla, se raya y se pierde, y la fase parcial dura más de dos horas. Compartir un par entre cinco personas significa que cuatro están mirando al Sol sin filtro mientras esperan su turno, que es exactamente el escenario que se quiere evitar.`,
        },
        {
          type: "p",
          text: `Y recuerda lo único bueno de todo esto: durante los ${durationWords(city, "es")} de totalidad **no hace falta filtro ninguno**, porque no hay disco solar que filtrar. Ése es el momento de guardarlas y mirar.`,
        },
      ],
      faq: [
        {
          q: "¿Basta con que las gafas digan «ISO 12312-2»?",
          a: "En la Unión Europea, no. Las gafas de eclipse son EPI de categoría II y necesitan marcado CE respaldado por un certificado de examen UE de tipo de un organismo notificado. La mención a la norma ISO, sola y sobre todo si solo está en la caja, no acredita que nadie independiente lo haya comprobado.",
        },
        {
          q: "¿Sirven las gafas de sol para ver el eclipse?",
          a: "No, en ningún caso, ni superponiendo varias. Un filtro solar certificado transmite del orden de cien mil veces menos luz que unas gafas de sol. Mirar al Sol con gafas de sol durante la fase parcial puede provocar daño retiniano permanente.",
        },
        {
          q: `¿Dónde puedo comprar gafas de eclipse en ${city.name}?`,
          a: `Todavía no hay puntos de venta locales: falta demasiado para el eclipse. Es previsible que ópticas y comercios de la ciudad las vendan en los meses previos. Cuando existan y podamos verificar que el producto lleva el marcado CE correspondiente, lo publicaremos aquí.`,
        },
        {
          q: "¿Se pueden reutilizar unas gafas de eclipses anteriores?",
          a: "Solo si están íntegras: sin arañazos, agujeros ni pliegues, y con las marcas legibles. La recomendación antigua de descartarlas a los tres años ya no está en la norma, pero el estado físico del filtro sí importa, y el cartón se maltrata guardado en un cajón.",
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: "Eclipse glasses: how to choose a pair that actually protects you",
        description: `Which markings a solar filter must carry to be safe in the European Union, why "ISO 12312-2 certified" is not enough, and how to check yours before 2 August 2027 in ${name}.`,
        lead: `Eclipse glasses that are safe in the European Union carry two things printed on them: **CE** and **EN ISO 12312-2**. The phrase "ISO 12312-2 certified" on the box, on its own, proves nothing — it is the most common trap on the market and the one that shifts the most bad glasses.`,
        body: [
          {
            type: "p",
            text: `Throughout the partial phase of the eclipse — from ${hm(city.localTimes.partialStart)} to ${hm(city.localTimes.totalityStart)} and from ${hm(city.localTimes.totalityEnd)} to ${hm(city.localTimes.partialEnd)} in ${name} — looking at the Sun without a certified filter can burn your retina. It does not hurt while it is happening, because the retina has no pain receptors, and the damage can be permanent. This is not a subject for improvising or for saving money.`,
          },
          { type: "h2", text: "The two markings, and why you need both" },
          {
            type: "p",
            text: `**ISO 12312-2** is the technical standard: it defines how much visible, ultraviolet and infrared radiation a filter may transmit for looking directly at the Sun. It is the right reference and it is cited worldwide.`,
          },
          {
            type: "p",
            text: `What almost nobody explains is that in the European Union that is not sufficient. Eclipse glasses are **category II personal protective equipment** under Regulation (EU) 2016/425, and that requires something more: a **CE** mark backed by an **EU type-examination certificate** issued by an independent notified body. The standard says what the filter must be like; the CE mark evidences that a third party checked it. A large share of the product advertised online as "ISO 12312-2 certified" has no such certificate behind it.`,
          },
          {
            type: "figure",
            art: "glasses-marks",
            caption:
              "What to look for printed on the frame itself, and the list of improvised filters that are never safe.",
          },
          { type: "h2", text: "How to check a pair you already own" },
          {
            type: "ol",
            items: [
              "Look for “CE” and “EN ISO 12312-2” or “ISO 12312-2:2015” printed on the frame, not just on the packaging. If they only appear on the box, be suspicious.",
              "Look for the manufacturer's name and address. A product with no identifiable manufacturer leaves nobody to complain to.",
              "Hold them up to a bright bulb. If you can see anything besides the filament — the window frame, your hand, the shape of the lamp — the filter is not dense enough, or it is damaged.",
              "Run a hand over the film looking for scratches, creases or pinholes. A single pinhole voids them.",
              "Test them outdoors before the day: glancing at the Sun, you should see only an orange or whitish disc, sharp and without a halo. Nothing else from the surroundings.",
            ],
          },
          {
            type: "callout",
            title: "What does not work, however often it is repeated",
            text: `Sunglasses, however dark or expensive. Several pairs stacked. Photographic negatives, X-rays, CDs, DVDs, smoked glass, welder's glass below the required shade, coloured bottles, camera neutral-density filters. And no, looking through a phone screen does not protect you either: it protects the phone, not your eye.`,
          },
          { type: "h2", text: "Where to buy them for the Ceuta eclipse" },
          {
            type: "p",
            text: `A year out, local supply does not exist yet: opticians, museums, planetariums, astronomy groups and shops in ${name} can be expected to sell glasses in the months before, but **today we cannot recommend a specific outlet because there is none**. When there is, and once we can verify that the product carries a CE mark with its certificate, we will publish it here with names.`,
          },
          {
            type: "p",
            text: `In the meantime, two pieces of advice that hold regardless. **Buy early**, because in the final week the good product sells out and the bad product appears. And if you buy online, ask the seller for the number of the EU type-examination certificate and of the notified body, then check that body in the European Commission's NANDO database. A serious seller gives you both; one who changes the subject is telling you they do not have them.`,
          },
          {
          type: "figure",
          art: "contacts-timeline",
          caption:
            "The filter stays on from C1 to C2 and from C3 to C4. It comes off only in the orange stretch, and goes back on at the first flash.",
        },
        { type: "h2", text: "How many to buy" },
          {
            type: "p",
            text: `One per person, plus one or two spares per group. These are cardboard products that bend, scratch and get lost, and the partial phase lasts over two hours. Sharing one pair between five people means four of them are looking at the Sun unfiltered while they wait their turn — exactly the scenario you are trying to avoid.`,
          },
          {
            type: "p",
            text: `And remember the one piece of good news: during the ${durationWords(city, "en")} of totality **no filter is needed at all**, because there is no solar disc left to filter. That is the moment to put them away and look.`,
          },
        ],
        faq: [
          {
            q: "Is it enough for the glasses to say “ISO 12312-2”?",
            a: "In the European Union, no. Eclipse glasses are category II PPE and require a CE mark backed by an EU type-examination certificate from a notified body. A reference to the ISO standard on its own — especially if it only appears on the box — does not evidence that anyone independent checked the product.",
          },
          {
            q: "Can I use sunglasses to watch the eclipse?",
            a: "No, never, not even stacked. A certified solar filter transmits on the order of a hundred thousand times less light than sunglasses. Looking at the Sun through sunglasses during the partial phase can cause permanent retinal damage.",
          },
          {
            q: `Where can I buy eclipse glasses in ${name}?`,
            a: `There are no local outlets yet — the eclipse is still too far off. Opticians and shops in the city can be expected to stock them in the months beforehand. When they do, and once we can verify the CE marking, we will publish it here.`,
          },
          {
            q: "Can I reuse glasses from a previous eclipse?",
            a: "Only if they are intact: no scratches, pinholes or creases, and with the markings still legible. The old advice to discard them after three years is no longer in the standard, but the physical condition of the filter matters, and cardboard suffers in a drawer.",
          },
        ],
      };
    },
  },
};

/** Fotografía. Post técnico, y el que más enlaces externos suele atraer. */
export const fotografiar: BlogPost = {
  slug: "fotografiar-el-eclipse-en-ceuta",
  citySlug: "ceuta",
  category: "observacion",
  published: PUBLISHED,
  cover: "camera-settings",
  related: [
    "que-se-ve-durante-la-totalidad-en-ceuta",
    "hacia-donde-mirar-la-posicion-del-sol-en-ceuta",
    "donde-ver-el-eclipse-en-ceuta",
  ],
  content: {
    es: (city) => ({
      title: `Cómo fotografiar el eclipse en ${city.name} sin perdértelo`,
      description: `Ajustes, filtros y planificación para fotografiar el eclipse total del 2 de agosto de 2027 en ${city.name}, con el Sol a ${city.eclipse.sunAltitudeDeg.toFixed(0)}° de altura. Incluye el consejo que casi nadie sigue.`,
      lead: `El primer consejo es el que menos gusta: si es tu primer eclipse total, no lo fotografíes. Los ${durationWords(city, "es")} se van en un suspiro peleando con la cámara, y la foto que consigas será peor que las miles que ya existen. Si aun así vas a hacerlo, esto es lo que hay que saber.`,
      body: [
        {
          type: "p",
          text: `Fotografiar un eclipse total tiene una particularidad que lo complica: son dos escenas radicalmente distintas separadas por un segundo. La fase parcial es el objeto más brillante del cielo y exige un filtro solar potente. La totalidad es un objeto tenue —la corona— que exige quitarlo. El cambio hay que hacerlo en C2, a las ${hm(city.localTimes.totalityStart)}, y deshacerlo en C3, a las ${hm(city.localTimes.totalityEnd)}, con prisa y con el pulso alterado.`,
        },
        { type: "h2", text: "El filtro no es opcional, y no es un ND" },
        {
          type: "p",
          text: `Para la fase parcial hace falta un **filtro solar** delante del objetivo: película solar o filtro de vidrio diseñado para observación solar. Un filtro de densidad neutra fotográfico no vale, aunque el histograma parezca correcto: no bloquea el infrarrojo, y con un teleobjetivo apuntando al Sol eso puede dañar el sensor y, en una cámara con visor óptico, el ojo. El filtro va **delante** del objetivo, nunca detrás.`,
        },
        {
          type: "figure",
          art: "camera-settings",
          caption:
            "Punto de partida para las dos fases. Los valores exactos dependen del filtro y del equipo: hay que probarlos antes con el Sol, no el día del eclipse.",
        },
        { type: "h2", text: "Qué focal usar" },
        {
          type: "ul",
          items: [
            "200–300 mm en formato completo: el Sol sale pequeño pero con contexto, y perdona errores de seguimiento. Buena elección para una primera vez.",
            "400–600 mm: el disco llena una parte razonable del cuadro y la corona cabe entera. Es el rango clásico.",
            "Más de 800 mm: solo con montura muy estable. La corona interna se recorta y el seguimiento se vuelve exigente.",
            `Gran angular: la mejor foto que casi nadie hace. Con el Sol a ${city.eclipse.sunAltitudeDeg.toFixed(0)}° no cabe en el mismo plano que el paisaje sin un angular muy generoso y una composición vertical, pero un plano amplio con el cielo oscurecido, el horizonte naranja y la gente mirando cuenta el eclipse mucho mejor que un disco negro aislado.`,
          ],
        },
        { type: "h2", text: "La planificación específica de Ceuta" },
        {
          type: "p",
          text: `En ${city.name} el Sol estará a unos ${city.eclipse.sunAltitudeDeg.toFixed(0)}° de altura y hacia el ${city.eclipse.sunAzimuthDeg.toFixed(0)}° de azimut. Eso descarta de entrada la foto «eclipse justo encima de las murallas» con teleobjetivo: a esa altura el Sol y cualquier referencia a nivel del suelo no comparten encuadre. Las dos composiciones que sí funcionan son el plano cerrado del disco, en cualquier sitio, y el plano general muy amplio, donde el Sol sale pequeño pero el paisaje oscurecido hace el trabajo.`,
        },
        {
          type: "callout",
          title: "Ensaya con la Luna, y ensaya con el Sol",
          text: `Prueba el enfoque, el filtro y los tiempos semanas antes: el Sol tiene el mismo tamaño aparente cualquier día del año, así que una sesión con el filtro puesto en junio te resuelve todas las dudas de exposición. Y practica el gesto de quitar el filtro a ciegas: el día del eclipse tendrás un segundo y no querrás estar buscando la rosca.`,
        },
        {
          type: "figure",
          art: "sun-position",
          caption:
            "La altura y la dirección del Sol condicionan el encuadre: a esta altura no comparte plano con el paisaje sin un gran angular muy generoso.",
        },
        { type: "h2", text: "La horquilla de la totalidad" },
        {
          type: "p",
          text: `La corona tiene un rango dinámico enorme: la parte interna es miles de veces más brillante que la externa. No existe una exposición correcta, existen varias. Lo estándar es disparar una horquilla amplia —de 1/1000 s a 1 s, dos o tres pasos entre tomas— y combinarlas después. Con ${durationWords(city, "es")} de totalidad hay tiempo de sobra para dos horquillas completas y aun así levantar la vista.`,
        },
        { type: "h2", text: "Y con el móvil" },
        {
          type: "p",
          text: `Un móvil no va a sacar una buena foto del disco eclipsado: la focal es corta y el disco sale como un punto. Lo que sí hace muy bien es lo otro: **el vídeo del ambiente**. La luz cayendo, la gente gritando, el horizonte naranja. Es lo que después nadie tiene y todo el mundo quiere. Ponlo a grabar en un trípode pequeño desde un minuto antes de C2 y olvídate de él. Y no apuntes al Sol sin filtro durante la fase parcial: el sensor lo paga.`,
        },
        {
          type: "p",
          text: `Y la regla de oro: **dedica los primeros veinte segundos de la totalidad a mirar, sin cámara**. Es el único momento irrepetible del día; la foto puede esperar veinte segundos.`,
        },
      ],
      faq: [
        {
          q: "¿Se puede fotografiar el eclipse sin filtro solar?",
          a: `Solo durante la totalidad, entre las ${hm(city.localTimes.totalityStart)} y las ${hm(city.localTimes.totalityEnd)} en ${city.name}. En la fase parcial hace falta un filtro solar delante del objetivo; un filtro de densidad neutra fotográfico no sirve porque no bloquea el infrarrojo y puede dañar el sensor.`,
        },
        {
          q: "¿Qué objetivo necesito para fotografiar el eclipse?",
          a: "Entre 400 y 600 mm en formato completo es el rango clásico: el disco ocupa buena parte del cuadro y la corona cabe entera. Con 200-300 mm sale más pequeño pero es más fácil de seguir. Un gran angular sirve para otra foto distinta y a menudo mejor: el paisaje oscurecido con el cielo en crepúsculo.",
        },
        {
          q: "¿Merece la pena fotografiar mi primer eclipse total?",
          a: "La mayoría de fotógrafos experimentados dicen que no. La totalidad es corta, la secuencia técnica es exigente y el resultado difícilmente superará las fotos que ya existen. Una alternativa razonable: grabar vídeo del ambiente con el móvil en un trípode y mirar el eclipse con los ojos.",
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: `How to photograph the eclipse in ${name} without missing it`,
        description: `Settings, filters and planning for photographing the total eclipse of 2 August 2027 in ${name}, with the Sun ${city.eclipse.sunAltitudeDeg.toFixed(0)}° high. Including the advice almost nobody takes.`,
        lead: `The first piece of advice is the least popular: if this is your first total eclipse, do not photograph it. The ${durationWords(city, "en")} vanish in an instant while you fight the camera, and the picture you get will be worse than the thousands that already exist. If you are going to do it anyway, here is what to know.`,
        body: [
          {
            type: "p",
            text: `Photographing a total eclipse has one complication built in: it is two radically different scenes separated by a single second. The partial phase is the brightest object in the sky and demands a strong solar filter. Totality is a faint object — the corona — that demands taking it off. You have to make that change at C2, at ${hm(city.localTimes.totalityStart)}, and undo it at C3, at ${hm(city.localTimes.totalityEnd)}, in a hurry and with your pulse up.`,
          },
          { type: "h2", text: "The filter is not optional, and it is not an ND" },
          {
            type: "p",
            text: `For the partial phase you need a **solar filter** in front of the lens: solar film or a glass filter designed for solar observation. A photographic neutral-density filter will not do, even if the histogram looks right: it does not block infrared, and a telephoto pointed at the Sun can damage the sensor and, on a camera with an optical viewfinder, your eye. The filter goes **in front of** the lens, never behind it.`,
          },
          {
            type: "figure",
            art: "camera-settings",
            caption:
              "A starting point for both phases. Exact values depend on your filter and your gear: test them on the Sun beforehand, not on eclipse day.",
          },
          { type: "h2", text: "Which focal length" },
          {
            type: "ul",
            items: [
              "200–300 mm full frame: the Sun comes out small but with context, and it forgives tracking errors. A good choice for a first attempt.",
              "400–600 mm: the disc fills a reasonable part of the frame and the corona still fits. This is the classic range.",
              "Over 800 mm: only on a very stable mount. The inner corona gets cropped and tracking becomes demanding.",
              `Wide angle: the best photograph almost nobody takes. With the Sun at ${city.eclipse.sunAltitudeDeg.toFixed(0)}° it will not share a frame with the landscape without a very generous wide angle and a vertical composition, but a wide shot with a darkened sky, an orange horizon and people looking up tells the story far better than an isolated black disc.`,
            ],
          },
          { type: "h2", text: "Planning specific to Ceuta" },
          {
            type: "p",
            text: `In ${name} the Sun will be around ${city.eclipse.sunAltitudeDeg.toFixed(0)}° high at an azimuth of roughly ${city.eclipse.sunAzimuthDeg.toFixed(0)}°. That rules out the "eclipse right above the walls" telephoto shot from the start: at that altitude the Sun and any ground-level reference do not share a frame. The two compositions that do work are the tight shot of the disc, from anywhere, and the very wide landscape, where the Sun is small but the darkened scene does the work.`,
          },
          {
            type: "callout",
            title: "Rehearse on the Moon, and rehearse on the Sun",
            text: `Test focus, filter and exposures weeks in advance: the Sun has the same apparent size on any day of the year, so one filtered session in June answers every exposure question you have. And practise removing the filter blind: on eclipse day you will have one second and you will not want to be hunting for the thread.`,
          },
          {
          type: "figure",
          art: "sun-position",
          caption:
            "The Sun's altitude and direction dictate the framing: at this height it will not share a frame with the landscape without a very generous wide angle.",
        },
        { type: "h2", text: "Bracketing totality" },
          {
            type: "p",
            text: `The corona has an enormous dynamic range: the inner part is thousands of times brighter than the outer. There is no single correct exposure — there are several. The standard approach is a wide bracket, 1/1000 s to 1 s, two or three stops between frames, combined afterwards. With ${durationWords(city, "en")} of totality there is time for two full brackets and still time to look up.`,
          },
          { type: "h2", text: "And with a phone" },
          {
            type: "p",
            text: `A phone is not going to take a good picture of the eclipsed disc: the focal length is short and the disc comes out as a dot. What it does superbly is the other thing: **video of the atmosphere**. The light collapsing, people shouting, the orange horizon. That is the footage nobody has afterwards and everybody wants. Set it recording on a small tripod a minute before C2 and forget about it. And do not point it at the Sun unfiltered during the partial phase: the sensor pays for it.`,
          },
          {
            type: "p",
            text: `And the golden rule: **give the first twenty seconds of totality to looking, with no camera in your hands**. It is the one irreplaceable moment of the day; the photograph can wait twenty seconds.`,
          },
        ],
        faq: [
          {
            q: "Can I photograph the eclipse without a solar filter?",
            a: `Only during totality, between ${hm(city.localTimes.totalityStart)} and ${hm(city.localTimes.totalityEnd)} in ${name}. The partial phase needs a solar filter in front of the lens; a photographic neutral-density filter will not do because it does not block infrared and can damage the sensor.`,
          },
          {
            q: "What lens do I need to photograph the eclipse?",
            a: "400 to 600 mm on full frame is the classic range: the disc fills much of the frame and the corona still fits. At 200-300 mm it comes out smaller but is easier to track. A wide angle serves a different and often better photograph: the darkened landscape under a twilight sky.",
          },
          {
            q: "Is it worth photographing my first total eclipse?",
            a: "Most experienced photographers say no. Totality is short, the technical sequence is demanding, and the result will struggle to beat the pictures that already exist. A reasonable alternative: record ambient video on a phone on a tripod, and watch the eclipse with your eyes.",
          },
        ],
      };
    },
  },
};

/** Con niños. Post de servicio, y de los que más se comparten en grupos de familia. */
export const conNinos: BlogPost = {
  slug: "el-eclipse-con-ninos-en-ceuta",
  citySlug: "ceuta",
  category: "observacion",
  published: PUBLISHED,
  cover: "pinhole",
  related: [
    "gafas-de-eclipse-en-ceuta-como-elegirlas",
    "donde-ver-el-eclipse-en-ceuta",
    "plan-hora-a-hora-del-dia-del-eclipse-en-ceuta",
  ],
  content: {
    es: (city) => ({
      title: `Ver el eclipse con niños en ${city.name}: seguridad, paciencia y un colador`,
      description: `Cómo preparar el eclipse total del 2 de agosto de 2027 con niños en ${city.name}: proyección indirecta, gafas certificadas, cuánto aguantan de espera y qué contarles antes.`,
      lead: `Un eclipse total es uno de los mejores regalos que se le pueden hacer a un niño, y también un riesgo real para su vista si se hace mal. La solución no es prohibir mirar: es **proyectar** durante las dos horas de fase parcial y reservar la mirada directa para los ${durationWords(city, "es")} en los que es segura.`,
      body: [
        {
          type: "p",
          text: `El problema de los niños con el Sol no es que sean imprudentes: es que su cristalino es más transparente que el de un adulto y transmite más luz azul y ultravioleta a la retina. A eso se suma que un niño no va a mantener unas gafas de cartón bien colocadas durante dos horas seguidas, y que las gafas de eclipse mal puestas —caídas, apoyadas en la nariz, mordidas— dejan de proteger.`,
        },
        { type: "h2", text: "La solución que funciona: no mirar, proyectar" },
        {
          type: "p",
          text: `Durante la fase parcial, de las ${hm(city.localTimes.partialStart)} a las ${hm(city.localTimes.totalityStart)}, hay dos métodos de proyección que se montan con lo que hay en casa y que además son mucho más entretenidos que mirar al cielo. Nadie mira al Sol: se mira al suelo o al interior de una caja.`,
        },
        {
          type: "figure",
          art: "pinhole",
          caption:
            "Dos formas de proyección indirecta. Con el colador se ve el Sol mordido repetido decenas de veces; con la caja, una sola imagen más grande y nítida.",
        },
        { type: "h2", text: "El colador: cinco segundos de montaje" },
        {
          type: "p",
          text: `Coge un colador de cocina, ponte de espaldas al Sol y proyecta su sombra sobre una cartulina blanca o el suelo claro. Cada agujero actúa como una cámara estenopeica y proyecta una imagen del Sol: mientras esté eclipsado, todas las manchas de luz serán crecientes en vez de círculos. Es inmediato, funciona con cualquier edad y a los niños les fascina que las decenas de manchitas cambien de forma a lo largo de la mañana.`,
        },
        { type: "h2", text: "La caja de zapatos: el proyecto de la semana anterior" },
        {
          type: "ol",
          items: [
            "Coge una caja de zapatos y forra el interior de negro (pintura, cartulina o rotulador).",
            "Haz un agujero pequeño y limpio —de un par de milímetros— en un extremo, y pega papel de aluminio por dentro con el agujero hecho en él.",
            "En el otro extremo, pega un papel blanco: es la pantalla.",
            "Abre una mirilla lateral cerca de la pantalla para poder mirar dentro.",
            "De espaldas al Sol, orienta el agujero hacia él hasta que aparezca el disco en la pantalla. Cuanto más larga sea la caja, más grande la imagen.",
          ],
        },
        {
          type: "callout",
          title: "La regla que hay que repetir en voz alta",
          text: `Con la caja y con el colador, **se mira siempre al suelo o al interior de la caja, nunca al Sol**. Dicho así, y varias veces. La proyección es segura precisamente porque nadie apunta la vista al cielo.`,
        },
        { type: "h2", text: "Y la totalidad, ¿pueden mirarla?" },
        {
          type: "p",
          text: `Sí, y deben. Entre las ${hm(city.localTimes.totalityStart)} y las ${hm(city.localTimes.totalityEnd)} el disco solar está completamente tapado y no hay nada que filtrar: la corona es tenue. Es el momento de quitar las gafas —de todos— y mirar. La regla para un adulto es sencilla: **una persona mayor asignada a cada niño**, con una sola tarea, que es volver a ponerle las gafas al primer destello de Sol. No delegues eso en el niño.`,
        },
        {
          type: "figure",
          art: "glasses-marks",
          caption:
            "Si hay gafas de por medio, tienen que llevar estas marcas. Y un adulto por niño, con la única tarea de volver a ponérselas en C3.",
        },
        { type: "h2", text: "Cuánto aguantan, y cómo se gestiona" },
        {
          type: "p",
          text: `Un eclipse dura dos horas y media, hace calor de agosto y durante la primera hora no se ve nada llamativo. Ningún niño aguanta eso mirando al cielo, ni tiene por qué. El plan realista es: llegar, montar el campamento con sombra, jugar y comer durante la primera hora, montar la proyección a mitad de la parcial cuando el mordisco ya es evidente, y concentrar la atención en los diez minutos previos a la totalidad, cuando la luz empieza a hacer cosas raras y el fenómeno se explica solo.`,
        },
        {
          type: "ul",
          items: [
            `Sombra propia: una sombrilla o un toldo ligero. En agosto, a media mañana y con el Sol a ${city.eclipse.sunAltitudeDeg.toFixed(0)}°, no hay sombra natural que valga.`,
            "Agua, y más agua. Y algo salado.",
            "Un sitio con baño cerca. Es el factor que decide el punto de observación más veces que el horizonte.",
            `En ${city.name}, la costa sur y el entorno del Parque Marítimo son las zonas más cómodas para esto: hay servicios, sombra y sitio donde sentarse.`,
          ],
        },
        { type: "h2", text: "Qué contarles antes" },
        {
          type: "p",
          text: `Que la Luna se va a poner justo delante del Sol y que, durante unos minutos, se va a hacer de noche a media mañana. Que verán estrellas. Que los pájaros se van a callar y que va a hacer frío de repente. Y que eso último no volverá a pasar en Ceuta en su vida: el próximo eclipse total visible desde aquí no está a la vuelta de la esquina. Funciona mejor que cualquier explicación de mecánica celeste, y es verdad.`,
        },
      ],
      faq: [
        {
          q: "¿Pueden los niños mirar el eclipse con gafas de eclipse?",
          a: "Sí, si las gafas están certificadas (CE y EN ISO 12312-2) y un adulto comprueba que están bien colocadas en todo momento. Aun así, para las dos horas de fase parcial es mucho más práctico y seguro usar proyección indirecta con un colador o una caja.",
        },
        {
          q: `¿Pueden mirar directamente durante la totalidad?`,
          a: `Sí. Entre las ${hm(city.localTimes.totalityStart)} y las ${hm(city.localTimes.totalityEnd)} en ${city.name} el Sol está completamente tapado y mirar es seguro para cualquier edad. La responsabilidad del adulto es volver a ponerles las gafas al primer destello de luz, sin esperar.`,
        },
        {
          q: "¿Cómo se hace la proyección con un colador?",
          a: "De espaldas al Sol, se sostiene un colador de cocina de forma que su sombra caiga sobre una cartulina blanca o el suelo claro. Cada agujero proyecta una imagen del Sol, así que durante el eclipse todas las manchas de luz aparecen como crecientes en vez de círculos.",
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: `Watching the eclipse with children in ${name}: safety, patience and a colander`,
        description: `How to prepare for the total eclipse of 2 August 2027 with children in ${name}: indirect projection, certified glasses, how long they will really wait, and what to tell them beforehand.`,
        lead: `A total eclipse is one of the best gifts you can give a child, and also a real risk to their eyesight if handled badly. The answer is not to forbid looking: it is to **project** through the two hours of partial phase and save direct viewing for the ${durationWords(city, "en")} when it is safe.`,
        body: [
          {
            type: "p",
            text: `The problem with children and the Sun is not that they are reckless: their lens is more transparent than an adult's and transmits more blue and ultraviolet light to the retina. On top of that, a child will not keep cardboard glasses properly positioned for two hours straight, and eclipse glasses worn badly — slipped down, resting on the nose, chewed — stop protecting.`,
          },
          { type: "h2", text: "The solution that works: do not look, project" },
          {
            type: "p",
            text: `During the partial phase, from ${hm(city.localTimes.partialStart)} to ${hm(city.localTimes.totalityStart)}, there are two projection methods you can build from things already in the kitchen, and both are far more entertaining than staring at the sky. Nobody looks at the Sun: you look at the ground, or inside a box.`,
          },
          {
            type: "figure",
            art: "pinhole",
            caption:
              "Two forms of indirect projection. The colander shows the bitten Sun repeated dozens of times; the box gives one larger, sharper image.",
          },
          { type: "h2", text: "The colander: five seconds to set up" },
          {
            type: "p",
            text: `Take a kitchen colander, turn your back to the Sun and cast its shadow onto white card or pale ground. Each hole acts as a pinhole camera and projects an image of the Sun: while it is eclipsed, every patch of light will be a crescent instead of a circle. It works instantly, at any age, and children are delighted that dozens of little patches change shape through the morning.`,
          },
          { type: "h2", text: "The shoebox: the week-before project" },
          {
            type: "ol",
            items: [
              "Take a shoebox and line the inside in black (paint, card or marker pen).",
              "Make a small, clean hole — a couple of millimetres — at one end, and tape foil inside with the hole pierced through it.",
              "At the other end, tape white paper: that is the screen.",
              "Cut a viewing slot in the side near the screen so you can look inside.",
              "With your back to the Sun, aim the hole at it until the disc appears on the screen. The longer the box, the bigger the image.",
            ],
          },
          {
            type: "callout",
            title: "The rule to say out loud",
            text: `With the box and with the colander, **you always look at the ground or inside the box, never at the Sun**. Say it in those words, and say it more than once. Projection is safe precisely because nobody points their eyes at the sky.`,
          },
          { type: "h2", text: "And totality — can they look?" },
          {
            type: "p",
            text: `Yes, and they should. Between ${hm(city.localTimes.totalityStart)} and ${hm(city.localTimes.totalityEnd)} the solar disc is completely covered and there is nothing to filter: the corona is faint. That is the moment for everybody's glasses to come off. The rule for adults is simple: **one grown-up assigned to each child**, with a single job — putting the glasses back on at the first flash of Sun. Do not delegate that to the child.`,
          },
          {
          type: "figure",
          art: "glasses-marks",
          caption:
            "If glasses are involved, these are the markings they must carry. And one adult per child, whose only job is putting them back on at C3.",
        },
        { type: "h2", text: "How long they will actually last" },
          {
            type: "p",
            text: `An eclipse lasts two and a half hours, it is August, and for the first hour nothing visibly happens. No child will sit through that watching the sky, nor should they have to. The realistic plan: arrive, set up camp with shade, play and eat through the first hour, build the projection halfway through the partial phase once the bite is obvious, and concentrate attention on the ten minutes before totality, when the light starts doing strange things and the phenomenon explains itself.`,
          },
          {
            type: "ul",
            items: [
              `Bring your own shade: a parasol or light awning. In August, mid-morning, with the Sun at ${city.eclipse.sunAltitudeDeg.toFixed(0)}°, there is no useful natural shade.`,
              "Water, and more water. And something salty.",
              "Somewhere with a toilet nearby. It decides the choice of spot more often than the horizon does.",
              `In ${name}, the southern coast and the area around the Maritime Park are the most comfortable for this: services, shade and somewhere to sit.`,
            ],
          },
          { type: "h2", text: "What to tell them beforehand" },
          {
            type: "p",
            text: `That the Moon is going to pass right in front of the Sun and that, for a few minutes, night will fall mid-morning. That they will see stars. That the birds will go quiet and it will suddenly turn cold. And that the last part will not happen again in Ceuta in their lifetime: the next total eclipse visible from here is not around the corner. It works better than any explanation of celestial mechanics, and it is true.`,
          },
        ],
        faq: [
          {
            q: "Can children watch the eclipse through eclipse glasses?",
            a: "Yes, if the glasses are certified (CE and EN ISO 12312-2) and an adult checks they stay correctly positioned throughout. Even so, for the two hours of partial phase indirect projection with a colander or a box is far more practical and far safer.",
          },
          {
            q: "Can they look directly during totality?",
            a: `Yes. Between ${hm(city.localTimes.totalityStart)} and ${hm(city.localTimes.totalityEnd)} in ${name} the Sun is completely covered and looking is safe at any age. The adult's job is to put the glasses back on at the first flash of light, without waiting.`,
          },
          {
            q: "How does colander projection work?",
            a: "With your back to the Sun, hold a kitchen colander so its shadow falls on white card or pale ground. Each hole projects an image of the Sun, so during the eclipse every patch of light appears as a crescent instead of a circle.",
          },
        ],
      };
    },
  },
};

/** Movilidad. Es el post que salva el día, y el que casi nadie escribe. */
export const movilidad: BlogPost = {
  slug: "movilidad-y-atascos-el-dia-del-eclipse-en-ceuta",
  citySlug: "ceuta",
  category: "viaje",
  published: PUBLISHED,
  cover: "day-plan",
  related: [
    "como-llegar-a-ceuta-para-el-eclipse",
    "plan-hora-a-hora-del-dia-del-eclipse-en-ceuta",
    "donde-dormir-la-noche-del-eclipse-en-ceuta",
  ],
  content: {
    es: (city) => ({
      title: `Moverse por ${city.name} el día del eclipse: aparcar, andar y no perder el ferry`,
      description: `Cómo evitar el atasco del 2 de agosto de 2027 en ${city.name}: por qué el coche es un problema, cuánto margen dejar para el ferry de vuelta y qué hacer después de C4.`,
      lead: `El eclipse en ${city.name} durará ${durationWords(city, "es")}. El atasco puede durar más. En un territorio de 19 km² con una sola carretera principal y un solo puerto, la movilidad es el factor que decide si el día sale bien, y es lo que menos gente planifica.`,
      body: [
        {
          type: "p",
          text: `Merece la pena entender la geometría del problema. ${city.name} tiene unos ${(city.population ?? 83000).toLocaleString("es-ES")} habitantes en 19 km². Un eclipse total con la máxima duración de España atrae visitantes en un número que ningún municipio pequeño absorbe con comodidad, y aquí no hay una red de carreteras alternativas por donde repartir el tráfico. Todo pasa por los mismos ejes.`,
        },
        { type: "h2", text: "La conclusión, primero: ese día no cojas el coche" },
        {
          type: "p",
          text: `Es la recomendación más útil de todo este post. ${city.name} es una ciudad caminable: desde el centro se llega andando al frente marítimo, a las murallas y a buena parte de la costa. Si tu punto de observación está a media hora a pie, ir andando es más rápido, más barato y sin riesgo. El coche solo tiene sentido si vas a una zona periférica —Benzú, el Hacho— y aun así con la condición de subir muy temprano y aceptar que la bajada será lenta.`,
        },
        { type: "h2", text: "Si vas en coche, tres reglas" },
        {
          type: "ol",
          items: [
            "Aparca lejos y anda el último tramo. Buscar sitio junto al mirador de moda es perder media hora y acabar peor colocado que quien aparcó a un kilómetro.",
            "Aparca mirando hacia la salida. Suena a tontería y ahorra veinte minutos cuando cinco mil personas maniobran a la vez.",
            `No cuentes con moverte entre C1 y C4. Si a las ${hm(city.localTimes.partialStart)} no estás donde vas a ver el eclipse, ya vas tarde.`,
          ],
        },
        {
          type: "figure",
          art: "day-plan",
          caption: `Las horas del eclipse están calculadas para ${city.name}. La parte que hay que planificar de verdad es la de después de las ${hm(city.localTimes.partialEnd)}.`,
        },
        {
          type: "figure",
          art: "ferry-route",
          caption:
            "Todo el que vuelva a la Península ese día pasa por el mismo puerto y por el mismo control fronterizo.",
        },
        { type: "h2", text: "El cuello de botella real: el ferry de vuelta" },
        {
          type: "p",
          text: `Aquí está el riesgo serio del día. Miles de personas van a querer volver a la Península en la tarde del 2 de agosto, y el puerto tiene un aforo y una cadencia de barcos que no se pueden ampliar por decreto. Además hay control fronterizo, que añade su propio tiempo.`,
        },
        {
          type: "ul",
          items: [
            "Si tienes barco reservado esa tarde, llega al puerto con mucha más antelación de la que pedirías cualquier otro día. Dos horas no es exagerado.",
            "Mejor todavía: no vuelvas el mismo día. Dormir en Ceuta la noche del 2 y volver el 3 convierte el peor tramo del viaje en el más tranquilo.",
            "Si vuelves el mismo día, come en Ceuta y sal a media tarde, no inmediatamente después de C4. La primera hora tras el eclipse es la peor.",
            "Lleva el billete descargado y en papel. Con la red saturada, depender de una app es una mala apuesta.",
          ],
        },
        {
          type: "callout",
          title: "Sobre la frontera del Tarajal",
          text: `${city.name} tiene frontera terrestre con Marruecos, y para quien venga o vaya por ahí las condiciones de paso pueden cambiar y han cambiado en el pasado sin apenas aviso. No hacemos previsiones sobre cómo estará en agosto de 2027: consulta la información oficial en los días previos y no construyas el plan del día alrededor de un paso fronterizo.`,
        },
        { type: "h2", text: "Lo que va a fallar y conviene prever" },
        {
          type: "ul",
          items: [
            "La cobertura móvil. Miles de personas en el mismo punto saturan las antenas: se cae el WhatsApp, se cae el pago con tarjeta y se cae el mapa. Lleva efectivo, capturas de pantalla de lo que necesites y un punto de encuentro acordado de viva voz.",
            "El taxi. La demanda superará la oferta con mucho, sobre todo en la hora posterior al eclipse.",
            "Los baños y el agua en los puntos concurridos. Es lo primero que se agota.",
            "El aparcamiento en cualquier sitio cómodo, desde primera hora de la mañana.",
          ],
        },
        { type: "h2", text: "El plan de mínimo riesgo" },
        {
          type: "p",
          text: `Duerme en ${city.name} la noche del 1 al 2 y también la del 2 al 3. Elige un punto de observación al que puedas llegar andando. Sal de casa hacia las nueve. Lleva agua, sombra y comida. Después de C4 no te muevas: come, descansa y vuelve al alojamiento a pie. Y el día 3 vuelve con calma. Este plan cuesta una noche de hotel más y elimina prácticamente todo lo que puede salir mal.`,
        },
      ],
      faq: [
        {
          q: `¿Habrá atascos en ${city.name} el día del eclipse?`,
          a: `Es previsible. Con 19 km², una red viaria limitada y un solo puerto, la concentración de visitantes en las horas centrales del 2 de agosto de 2027 sobrecargará los accesos y el puerto. La recomendación es no usar coche ese día y no intentar volver a la Península inmediatamente después del eclipse.`,
        },
        {
          q: "¿Cuánta antelación hay que dejar para el ferry de vuelta?",
          a: "Mucha más de lo habitual: dos horas no es exagerado para un barco de la tarde del 2 de agosto, sumando aforo, control fronterizo y la salida en masa. Lo más seguro es no volver ese mismo día.",
        },
        {
          q: `¿Se puede ver el eclipse en ${city.name} sin coche?`,
          a: `Sí, y es la mejor opción. La ciudad es caminable y desde el centro se llega a pie al frente marítimo, a las murallas y a buena parte de la costa, que son zonas con buen horizonte. El coche solo hace falta para las zonas periféricas.`,
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: `Getting around ${name} on eclipse day: parking, walking and not missing the ferry`,
        description: `How to avoid the jam on 2 August 2027 in ${name}: why the car is a liability, how much margin to leave for the ferry home, and what to do after C4.`,
        lead: `The eclipse in ${name} will last ${durationWords(city, "en")}. The traffic could last longer. In 19 km² with one main road and one port, mobility is what decides whether the day goes well — and it is what fewest people plan for.`,
        body: [
          {
            type: "p",
            text: `It helps to see the shape of the problem. ${name} has around ${(city.population ?? 83000).toLocaleString("en-GB")} inhabitants in 19 km². A total eclipse with the longest duration in Spain draws visitors in numbers no small municipality absorbs comfortably, and there is no alternative road network here to spread the traffic across. Everything funnels through the same few axes.`,
          },
          { type: "h2", text: "The conclusion first: do not drive that day" },
          {
            type: "p",
            text: `This is the single most useful line in this post. ${name} is a walkable city: the seafront, the walls and much of the coast are within walking distance of the centre. If your viewing spot is half an hour on foot, walking is faster, cheaper and risk-free. A car only makes sense for outlying areas — Benzú, Monte Hacho — and even then only if you go up very early and accept that coming down will be slow.`,
          },
          { type: "h2", text: "If you do drive, three rules" },
          {
            type: "ol",
            items: [
              "Park far out and walk the last stretch. Hunting for a space beside the fashionable viewpoint costs half an hour and ends worse placed than whoever parked a kilometre back.",
              "Park facing the exit. It sounds trivial and it saves twenty minutes when five thousand people manoeuvre at once.",
              `Do not count on moving between C1 and C4. If you are not where you intend to watch by ${hm(city.localTimes.partialStart)}, you are already late.`,
            ],
          },
          {
            type: "figure",
            art: "day-plan",
            caption: `Eclipse times are computed for ${name}. The part that genuinely needs planning is what happens after ${hm(city.localTimes.partialEnd)}.`,
          },
          {
          type: "figure",
          art: "ferry-route",
          caption:
            "Everyone returning to the mainland that day goes through the same port and the same border check.",
        },
        { type: "h2", text: "The real bottleneck: the ferry home" },
          {
            type: "p",
            text: `This is the serious risk of the day. Thousands of people will want to return to the mainland on the afternoon of 2 August, and the port has a capacity and a sailing frequency that cannot be expanded by decree. There is border control too, which adds its own time.`,
          },
          {
            type: "ul",
            items: [
              "If you have a boat booked that afternoon, get to the port far earlier than you would on any other day. Two hours is not excessive.",
              "Better still: do not travel back the same day. Sleeping in Ceuta on the night of the 2nd and returning on the 3rd turns the worst leg of the trip into the calmest.",
              "If you must return the same day, eat in Ceuta and leave mid-afternoon rather than straight after C4. The first hour after the eclipse is the worst.",
              "Carry your ticket downloaded and on paper. With the network saturated, depending on an app is a poor bet.",
            ],
          },
          {
            type: "callout",
            title: "About the Tarajal border",
            text: `${name} has a land border with Morocco, and for anyone travelling through it the crossing conditions can change — and have changed in the past with little notice. We make no forecast about how it will be in August 2027: check official information in the days beforehand, and do not build your eclipse-day plan around a border crossing.`,
          },
          { type: "h2", text: "What will fail, and how to prepare" },
          {
            type: "ul",
            items: [
              "Mobile coverage. Thousands of people in one place saturate the masts: messaging drops, card payments drop, and so does the map. Carry cash, screenshots of anything you need, and a meeting point agreed out loud.",
              "Taxis. Demand will far outstrip supply, especially in the hour after the eclipse.",
              "Toilets and water at busy spots. They are the first thing to run out.",
              "Parking anywhere convenient, from early in the morning.",
            ],
          },
          { type: "h2", text: "The minimum-risk plan" },
          {
            type: "p",
            text: `Sleep in ${name} on the night of 1 August and on the night of the 2nd as well. Choose a viewing spot you can walk to. Leave your accommodation around nine. Take water, shade and food. After C4, do not move: eat, rest, and walk back. Then travel home on the 3rd. That plan costs one extra hotel night and removes almost everything that can go wrong.`,
          },
        ],
        faq: [
          {
            q: `Will there be traffic jams in ${name} on eclipse day?`,
            a: `It should be expected. With 19 km², a limited road network and a single port, the concentration of visitors around midday on 2 August 2027 will overload both access roads and the port. The advice is not to use a car that day, and not to attempt the return to the mainland immediately after the eclipse.`,
          },
          {
            q: "How much margin should I leave for the ferry back?",
            a: "Far more than usual: two hours is not excessive for an afternoon sailing on 2 August, once you add capacity, border control and the mass departure. The safest choice is not to travel back that day at all.",
          },
          {
            q: `Can I watch the eclipse in ${name} without a car?`,
            a: `Yes, and it is the better option. The city is walkable, and the seafront, the walls and much of the coast — all areas with good horizons — are reachable on foot from the centre. A car is only needed for outlying areas.`,
          },
        ],
      };
    },
  },
};
