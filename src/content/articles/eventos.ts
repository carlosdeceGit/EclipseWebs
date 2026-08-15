import type { Article } from "./types";

/**
 * Agenda de eventos.
 *
 * Es la página que más se va a mover: el agente de eventos la alimenta a diario y
 * el texto fijo solo explica el marco. Nada de inventar actividades para rellenar.
 */
export const eventos: Article = {
  slug: "eventos",
  content: {
    es: (city) => ({
      title: `Eventos y observaciones del eclipse en ${city.name}`,
      description: `Actividades, observaciones públicas y jornadas divulgativas alrededor del eclipse del 2 de agosto de 2027 en ${city.name}. Se actualiza a diario.`,
      body: [
        {
          type: "p",
          text: `Esta página recoge las actividades confirmadas alrededor del eclipse en ${city.name} y su entorno: observaciones públicas, charlas, jornadas de astronomía, repartos de gafas certificadas y actos organizados por ayuntamientos y agrupaciones astronómicas.`,
        },
        {
          type: "callout",
          title: "Todavía es pronto",
          text: `A casi un año vista, la mayoría de administraciones y agrupaciones aún no han publicado su programa. Un agente revisa a diario las fuentes oficiales y añade aquí cada acto en cuanto se anuncia, con enlace a la convocatoria original. Si esta lista está vacía, es que no hay nada confirmado, no que no lo hayamos mirado.`,
        },
        { type: "h2", text: "¿Organizas algo?" },
        {
          type: "p",
          text: `Si eres un ayuntamiento, una agrupación astronómica, un centro educativo o una empresa y organizas una actividad abierta relacionada con el eclipse, puedes darla de alta gratis y aparecerá aquí. Las actividades gratuitas y divulgativas no pagan nada.`,
        },
        { type: "h2", text: "Qué esperamos que se anuncie" },
        {
          type: "ul",
          items: [
            "Observaciones públicas con telescopios filtrados en plazas, paseos marítimos y miradores.",
            "Reparto institucional de gafas certificadas en los días previos.",
            "Jornadas divulgativas en centros culturales y planetarios.",
            "Dispositivos especiales de tráfico, transporte y emergencias para el día 2.",
            "Habilitación de zonas de observación y de estacionamiento para autocaravanas.",
            "Actividades escolares durante el curso 2026-2027, ya que el eclipse cae en periodo vacacional.",
          ],
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: `Eclipse events and public viewings in ${name}`,
        description: `Activities, public observations and outreach events around the 2 August 2027 eclipse in ${name}. Updated daily.`,
        body: [
          {
            type: "p",
            text: `This page collects confirmed activities around the eclipse in ${name} and nearby: public observing sessions, talks, astronomy days, distributions of certified glasses, and events organised by town councils and astronomy societies.`,
          },
          {
            type: "callout",
            title: "It is still early",
            text: `With almost a year to go, most authorities and societies have not published their programmes yet. An agent checks official sources daily and adds each event here as soon as it is announced, linking to the original notice. An empty list means nothing is confirmed, not that nobody looked.`,
          },
          { type: "h2", text: "Organising something?" },
          {
            type: "p",
            text: `If you are a town council, an astronomy society, a school or a company running an open eclipse activity, you can list it free and it will appear here. Free outreach activities pay nothing.`,
          },
          { type: "h2", text: "What we expect to be announced" },
          {
            type: "ul",
            items: [
              "Public observing sessions with filtered telescopes in squares, seafronts and viewpoints.",
              "Official distribution of certified glasses in the days beforehand.",
              "Outreach events at cultural centres and planetariums.",
              "Special traffic, transport and emergency arrangements for the day.",
              "Designated viewing areas and motorhome parking.",
              "School activities during the 2026-2027 academic year, since the eclipse itself falls in the holidays.",
            ],
          },
        ],
      };
    },
  },
};

/** Fuentes y metodología: la página que sostiene la credibilidad de todo lo demás. */
export const fuentes: Article = {
  slug: "fuentes",
  content: {
    es: (city) => ({
      title: "Fuentes y metodología",
      description: `De dónde salen los datos que publicamos sobre el eclipse del 2 de agosto de 2027 en ${city.name} y cómo los calculamos y verificamos.`,
      body: [
        {
          type: "p",
          text: "Esta web publica datos astronómicos que la gente va a usar para planificar un viaje y para decidir cuándo quitarse unas gafas protectoras. Por eso los calculamos nosotros en lugar de copiarlos, y contrastamos el resultado contra fuentes oficiales independientes.",
        },
        { type: "h2", text: "Cómo se calculan las horas" },
        {
          type: "p",
          text: "Las circunstancias locales —los cinco contactos, la duración de la totalidad, la magnitud, el porcentaje de disco cubierto y la posición del Sol— se calculan a partir de los elementos besselianos publicados por la NASA para este eclipse, resueltos con el procedimiento clásico del Explanatory Supplement to the Astronomical Almanac. Eso permite dar datos correctos para cualquier coordenada, y no solo para las localidades que alguien haya tabulado.",
        },
        { type: "h2", text: "Cómo se valida" },
        {
          type: "p",
          text: "El cálculo se comprueba automáticamente contra valores publicados de forma independiente antes de cada despliegue: la duración en el punto de máximo eclipse en Egipto según la NASA, las duraciones municipales del IGN para Ceuta, Tarifa, Melilla, Algeciras, La Línea, Los Barrios, San Roque, Cádiz y Málaga, y el porcentaje de ocultación en Sevilla. Si alguna comprobación falla, el despliegue se detiene.",
        },
        {
          type: "p",
          text: "En la última validación, la diferencia con el punto de máximo de la NASA fue de una décima de segundo, y con las duraciones del IGN, de entre 0 y 2 segundos en casi todas las localidades. Las diferencias residuales se explican por el punto de referencia concreto que usa cada fuente dentro del municipio y por pequeñas diferencias de convención en el radio lunar.",
        },
        { type: "h2", text: "Margen de error honesto" },
        {
          type: "ul",
          items: [
            "Duración de la totalidad: fiable dentro de unos pocos segundos.",
            "Horas de contacto: fiables dentro de unos segundos. Pueden diferir ligeramente de las tablas del IGN por el valor de ΔT y la convención de radio lunar empleados.",
            "El instante real de C2 y C3 depende además del relieve del limbo lunar, que introduce una variación de uno o dos segundos imposible de eliminar.",
            "Por eso la guía de seguridad insiste en lo mismo: no te fíes del reloj para quitarte el filtro, fíate de lo que ves.",
          ],
        },
        { type: "h2", text: "Fuentes" },
        {
          type: "ul",
          items: [
            "NASA/GSFC (Espenak & Meeus, Five Millennium Canon of Solar Eclipses) para los elementos besselianos.",
            "Instituto Geográfico Nacional (IGN) para las circunstancias locales de referencia y la descripción de la franja en España.",
            "Junta de Andalucía para el listado oficial de municipios dentro de la franja.",
            "AEMET para climatología y predicción meteorológica.",
            "Ayuntamientos y agrupaciones astronómicas locales para eventos y puntos habilitados.",
          ],
        },
        { type: "h2", text: "Actualización automática" },
        {
          type: "p",
          text: "Un sistema de agentes revisa a diario las fuentes oficiales y publica novedades verificables. Los datos astronómicos son la excepción: un agente puede proponer un cambio y avisar de una discrepancia, pero no puede modificar por su cuenta una hora de contacto. Ese cambio pasa siempre por revisión.",
        },
        { type: "h2", text: "Corrección de errores" },
        {
          type: "p",
          text: `Si detectas un dato incorrecto en la información de ${city.name}, escríbenos y lo corregimos citando la fuente. Las correcciones relevantes se anotan en la propia página.`,
        },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: "Sources and method",
        description: `Where our data on the 2 August 2027 eclipse in ${name} comes from, and how we compute and verify it.`,
        body: [
          {
            type: "p",
            text: "This site publishes astronomical data that people will use to plan a trip and to decide when to remove protective glasses. That is why we compute it ourselves rather than copying it, and check the result against independent official sources.",
          },
          { type: "h2", text: "How the timings are computed" },
          {
            type: "p",
            text: "Local circumstances — the five contacts, the length of totality, magnitude, obscuration and the Sun's position — are computed from the Besselian elements published by NASA for this eclipse, solved with the classical procedure in the Explanatory Supplement to the Astronomical Almanac. That yields correct data for any coordinates, not just for places somebody has tabulated.",
          },
          { type: "h2", text: "How it is validated" },
          {
            type: "p",
            text: "The calculation is checked automatically against independently published values before every deployment: the duration at the point of greatest eclipse in Egypt per NASA, the municipal durations published by Spain's IGN for Ceuta, Tarifa, Melilla, Algeciras, La Línea, Los Barrios, San Roque, Cadiz and Malaga, and the obscuration percentage in Seville. If any check fails, the deployment stops.",
          },
          {
            type: "p",
            text: "At the last validation, the difference against NASA's point of greatest eclipse was one tenth of a second, and against the IGN durations, between 0 and 2 seconds for almost every location. Residual differences come from the specific reference point each source uses within a municipality and from small differences in lunar radius convention.",
          },
          { type: "h2", text: "Honest error margins" },
          {
            type: "ul",
            items: [
              "Length of totality: reliable to within a few seconds.",
              "Contact times: reliable to within a few seconds. They may differ slightly from IGN tables because of the ΔT value and lunar radius convention used.",
              "The real instant of C2 and C3 also depends on the terrain of the lunar limb, which adds a second or two of variation that cannot be eliminated.",
              "This is why the safety guide keeps repeating it: do not trust the clock to remove your filter, trust what you see.",
            ],
          },
          { type: "h2", text: "Sources" },
          {
            type: "ul",
            items: [
              "NASA/GSFC (Espenak & Meeus, Five Millennium Canon of Solar Eclipses) for the Besselian elements.",
              "Instituto Geográfico Nacional (IGN), Spain, for reference local circumstances and the description of the path across Spain.",
              "Junta de Andalucía for the official list of municipalities inside the path.",
              "AEMET for climatology and weather forecasting.",
              "Local councils and astronomy societies for events and designated viewing areas.",
            ],
          },
          { type: "h2", text: "Automatic updating" },
          {
            type: "p",
            text: "A system of agents checks official sources daily and publishes verifiable updates. Astronomical data is the exception: an agent can propose a change and flag a discrepancy, but it cannot alter a contact time on its own. That change always goes through review.",
          },
          { type: "h2", text: "Corrections" },
          {
            type: "p",
            text: `If you spot an incorrect figure in our data for ${name}, tell us with the source and we will fix it. Significant corrections are noted on the page itself.`,
          },
        ],
      };
    },
  },
};
