import type { Article } from "./articles";

/**
 * Páginas legales.
 *
 * Los datos identificativos del titular están marcados como PENDIENTE a propósito:
 * la LSSI obliga a publicar nombre o razón social, NIF, domicilio y contacto reales,
 * y eso no es algo que se pueda rellenar por aproximación. Hay que completarlos
 * antes de publicar los dominios, y con más razón antes de solicitar AdSense, que
 * revisa estas páginas en la aprobación.
 */
const PENDIENTE = "[PENDIENTE: completar antes de publicar]";

export const LEGAL_ARTICLES: Article[] = [
  {
    slug: "aviso-legal",
    title: () => "Aviso legal",
    description: (c) => `Información legal del sitio web y condiciones de uso de la guía del eclipse en ${c.name}.`,
    body: () => [
      { type: "h2", text: "Titular del sitio" },
      {
        type: "ul",
        items: [
          `Titular: ${PENDIENTE}`,
          `NIF/CIF: ${PENDIENTE}`,
          `Domicilio: ${PENDIENTE}`,
          `Correo de contacto: ${PENDIENTE}`,
        ],
      },
      { type: "h2", text: "Objeto" },
      {
        type: "p",
        text: "Este sitio es una guía informativa e independiente sobre el eclipse solar total del 2 de agosto de 2027. No está vinculado a ninguna administración pública ni a ningún organismo oficial, y las referencias a fuentes oficiales lo son únicamente a efectos de cita.",
      },
      { type: "h2", text: "Exactitud de la información astronómica" },
      {
        type: "p",
        text: "Los datos astronómicos se publican con la mayor diligencia posible y citando su fuente, pero se ofrecen a título informativo. Para decisiones que afecten a la seguridad ocular, la referencia debe ser siempre la publicación oficial del Instituto Geográfico Nacional y las instrucciones del fabricante del filtro solar. El titular no se responsabiliza de los daños derivados de una observación solar realizada sin protección adecuada.",
      },
      { type: "h2", text: "Contenidos de terceros" },
      {
        type: "p",
        text: "El directorio y el tablón de clasificados recogen anuncios publicados por terceros. Se moderan antes de publicarse, pero el titular no es parte de las relaciones que se establezcan entre anunciantes y usuarios ni responde de la veracidad de las ofertas. Cualquier transacción se realiza bajo la responsabilidad de quienes intervienen en ella.",
      },
      { type: "h2", text: "Propiedad intelectual" },
      {
        type: "p",
        text: "Los textos originales de este sitio pueden citarse y resumirse indicando la fuente y enlazando a la página de origen. Los datos procedentes de organismos oficiales pertenecen a sus titulares y se reproducen citando la procedencia.",
      },
      { type: "h2", text: "Legislación aplicable" },
      {
        type: "p",
        text: "Esta relación se rige por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales que correspondan conforme a la normativa vigente.",
      },
    ],
  },
  {
    slug: "privacidad",
    title: () => "Política de privacidad",
    description: () => "Qué datos personales tratamos, con qué finalidad y qué derechos tienes sobre ellos.",
    body: () => [
      {
        type: "p",
        text: "Esta política explica el tratamiento de datos personales en este sitio conforme al Reglamento General de Protección de Datos (RGPD) y a la LOPDGDD.",
      },
      { type: "h2", text: "Responsable del tratamiento" },
      { type: "ul", items: [`Responsable: ${PENDIENTE}`, `Contacto: ${PENDIENTE}`] },
      { type: "h2", text: "Qué datos tratamos y por qué" },
      {
        type: "ul",
        items: [
          "Publicación de anuncios: nombre del anuncio, descripción y datos de contacto que facilitas voluntariamente. Se publican tal cual en el tablón, así que solo debes incluir los que quieras que sean visibles. Base jurídica: tu consentimiento al enviar el formulario.",
          "Prevención de abuso: guardamos un hash irreversible de la dirección IP desde la que se publica un anuncio, no la IP en claro. Sirve para detectar publicaciones masivas. Base jurídica: interés legítimo.",
          "Consultas por correo: los datos que nos escribas, para responderte. Base jurídica: tu consentimiento.",
          "Publicidad: mostramos anuncios de terceros que pueden usar cookies. Ver la política de cookies.",
        ],
      },
      { type: "h2", text: "Plazos de conservación" },
      {
        type: "p",
        text: "Los anuncios clasificados caducan automáticamente y, en todo caso, dejan de publicarse tras el 2 de agosto de 2027. Las fichas de directorio se mantienen mientras el negocio lo desee. Puedes pedir la retirada de un anuncio en cualquier momento.",
      },
      { type: "h2", text: "Destinatarios" },
      {
        type: "p",
        text: "Los datos se alojan en proveedores de servicios de hosting y base de datos que actúan como encargados del tratamiento. No se venden ni se ceden a terceros con fines comerciales.",
      },
      { type: "h2", text: "Tus derechos" },
      {
        type: "p",
        text: "Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a la dirección de contacto. También puedes reclamar ante la Agencia Española de Protección de Datos si consideras que el tratamiento no es conforme a la normativa.",
      },
    ],
  },
  {
    slug: "cookies",
    title: () => "Política de cookies",
    description: () => "Qué cookies usa este sitio, para qué sirven y cómo puedes gestionarlas.",
    body: () => [
      {
        type: "p",
        text: "Una cookie es un pequeño archivo que un sitio web guarda en tu navegador. Este sitio usa las mínimas necesarias para funcionar y, cuando esté activada la publicidad, las que introduzca la red publicitaria.",
      },
      { type: "h2", text: "Cookies técnicas" },
      {
        type: "p",
        text: "Imprescindibles para que la web funcione: mantienen tu sesión si te registras y recuerdan tu elección sobre las cookies. No requieren consentimiento.",
      },
      { type: "h2", text: "Cookies de publicidad" },
      {
        type: "p",
        text: "Cuando la publicidad esté activa, Google AdSense podrá instalar cookies para mostrar anuncios y medir su rendimiento. Estas cookies solo se cargan si aceptas su uso en el banner de consentimiento. Puedes revisar la información de Google sobre cómo usa los datos de los sitios que utilizan sus servicios.",
      },
      { type: "h2", text: "Cómo gestionarlas" },
      {
        type: "ul",
        items: [
          "Puedes cambiar tu decisión en cualquier momento desde el enlace de configuración de cookies del pie de página.",
          "Todos los navegadores permiten bloquear o eliminar cookies desde sus ajustes de privacidad.",
          "Bloquear las cookies de publicidad no impide navegar por la web: solo hace que los anuncios sean menos relevantes.",
        ],
      },
      {
        type: "callout",
        title: "Estado actual",
        text: "Mientras la publicidad no esté activada, este sitio no instala cookies de terceros. Esta página se actualizará con el detalle de proveedores concretos en cuanto se active.",
      },
    ],
  },
  {
    slug: "contacto",
    title: (c) => `Contacto — ${c.name}`,
    description: (c) => `Cómo contactar para anunciarte, corregir un dato o proponer un evento del eclipse en ${c.name}.`,
    body: (c) => [
      { type: "h2", text: "Para anunciarte" },
      {
        type: "p",
        text: `Si tienes un negocio en ${c.name} o alrededores y quieres aparecer en el directorio, la ficha básica es gratuita y puedes darla de alta tú mismo. Para fichas destacadas o patrocinio, escríbenos contando qué negocio tienes y qué buscas.`,
      },
      { type: "h2", text: "Para corregir un dato" },
      {
        type: "p",
        text: "Si detectas un error en una hora, una duración o cualquier otro dato, dínoslo con la fuente y lo corregimos cuanto antes. Es la clase de aviso que más agradecemos: una guía de eclipse vale lo que valen sus datos.",
      },
      { type: "h2", text: "Para proponer un evento" },
      {
        type: "p",
        text: `Ayuntamientos, agrupaciones astronómicas, centros educativos y organizadores en general pueden mandarnos su convocatoria con el enlace oficial. Las actividades abiertas y gratuitas se publican sin coste.`,
      },
      { type: "h2", text: "Dirección de contacto" },
      { type: "ul", items: [`Correo: ${PENDIENTE}`] },
    ],
  },
];
