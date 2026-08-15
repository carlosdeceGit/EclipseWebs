import type { Article } from "./types";

/**
 * Páginas legales.
 *
 * Los datos identificativos del titular están marcados como PENDIENTE a propósito:
 * la LSSI obliga a publicar nombre o razón social, NIF, domicilio y contacto reales,
 * y eso no se puede rellenar por aproximación. Hay que completarlos antes de
 * publicar los dominios, y con más razón antes de solicitar AdSense, que revisa
 * estas páginas en la aprobación.
 */
const PENDIENTE = "[PENDIENTE: completar antes de publicar]";
const PENDING = "[TO DO: complete before going live]";

export const avisoLegal: Article = {
  slug: "aviso-legal",
  legal: true,
  content: {
    es: (city) => ({
      title: "Aviso legal",
      description: `Información legal del sitio y condiciones de uso de la guía del eclipse en ${city.name}.`,
      body: [
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
          text: "Los datos astronómicos se calculan con elementos besselianos publicados por la NASA y se validan contra fuentes oficiales, pero se ofrecen a título informativo. Para decisiones que afecten a la seguridad ocular, la referencia debe ser siempre la publicación oficial del Instituto Geográfico Nacional y las instrucciones del fabricante del filtro solar. El titular no se responsabiliza de los daños derivados de una observación solar realizada sin protección adecuada.",
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
    }),
    en: () => ({
      title: "Legal notice",
      description: "Legal information about this site and its terms of use.",
      body: [
        { type: "h2", text: "Site owner" },
        {
          type: "ul",
          items: [
            `Owner: ${PENDING}`,
            `Tax ID: ${PENDING}`,
            `Registered address: ${PENDING}`,
            `Contact email: ${PENDING}`,
          ],
        },
        { type: "h2", text: "Purpose" },
        {
          type: "p",
          text: "This site is an independent informational guide to the total solar eclipse of 2 August 2027. It is not affiliated with any public administration or official body, and references to official sources are made solely by way of citation.",
        },
        { type: "h2", text: "Accuracy of astronomical information" },
        {
          type: "p",
          text: "Astronomical data is computed from Besselian elements published by NASA and validated against official sources, but is provided for information only. For decisions affecting eye safety, the reference must always be the official publications of Spain's Instituto Geográfico Nacional and the instructions supplied with your solar filter. The owner accepts no liability for harm arising from solar observation carried out without adequate protection.",
        },
        { type: "h2", text: "Third-party content" },
        {
          type: "p",
          text: "The directory and classifieds board carry listings published by third parties. They are moderated before publication, but the owner is not party to any relationship established between advertisers and users and does not warrant the accuracy of any offer. Transactions are the responsibility of the parties involved.",
        },
        { type: "h2", text: "Intellectual property" },
        {
          type: "p",
          text: "Original text on this site may be quoted and summarised with attribution and a link to the source page. Data originating from official bodies belongs to those bodies and is reproduced with attribution.",
        },
        { type: "h2", text: "Applicable law" },
        {
          type: "p",
          text: "This relationship is governed by Spanish law. Any dispute falls under the jurisdiction of the courts designated by the applicable legislation.",
        },
      ],
    }),
  },
};

export const privacidad: Article = {
  slug: "privacidad",
  legal: true,
  content: {
    es: () => ({
      title: "Política de privacidad",
      description: "Qué datos personales tratamos, con qué finalidad y qué derechos tienes sobre ellos.",
      body: [
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
            "Publicación de anuncios: título, descripción y datos de contacto que facilitas voluntariamente. Se publican tal cual en el tablón, así que solo debes incluir los que quieras que sean visibles. Base jurídica: tu consentimiento al enviar el formulario.",
            "Prevención de abuso: guardamos un hash irreversible de la dirección IP desde la que se publica un anuncio, no la IP en claro. Sirve para detectar publicaciones masivas. Base jurídica: interés legítimo.",
            "Consultas por correo: los datos que nos escribas, para responderte. Base jurídica: tu consentimiento.",
            "Publicidad: mostramos anuncios de terceros que pueden usar cookies. Ver la política de cookies.",
          ],
        },
        { type: "h2", text: "Qué NO tratamos" },
        {
          type: "p",
          text: "El localizador calcula las circunstancias del eclipse en tu posición dentro de tu propio navegador o en la petición, y no guardamos las coordenadas que introduzcas ni la ubicación que comparta tu dispositivo.",
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
    }),
    en: () => ({
      title: "Privacy policy",
      description: "What personal data we process, why, and what rights you have over it.",
      body: [
        {
          type: "p",
          text: "This policy explains how personal data is processed on this site under the General Data Protection Regulation (GDPR) and Spanish data protection law.",
        },
        { type: "h2", text: "Data controller" },
        { type: "ul", items: [`Controller: ${PENDING}`, `Contact: ${PENDING}`] },
        { type: "h2", text: "What we process and why" },
        {
          type: "ul",
          items: [
            "Publishing listings: the title, description and contact details you provide. They are published as-is on the board, so only include details you want visible. Legal basis: your consent when submitting the form.",
            "Abuse prevention: we store an irreversible hash of the IP address a listing is posted from, not the IP itself. It is used to detect bulk posting. Legal basis: legitimate interest.",
            "Email enquiries: whatever you write to us, in order to reply. Legal basis: your consent.",
            "Advertising: we display third-party ads which may use cookies. See the cookie policy.",
          ],
        },
        { type: "h2", text: "What we do NOT process" },
        {
          type: "p",
          text: "The locator computes eclipse circumstances for your position in your own browser or within the request, and we do not store the coordinates you enter or the location your device shares.",
        },
        { type: "h2", text: "Retention" },
        {
          type: "p",
          text: "Classified listings expire automatically and in any case stop being published after 2 August 2027. Directory entries remain as long as the business wants them. You can request removal at any time.",
        },
        { type: "h2", text: "Recipients" },
        {
          type: "p",
          text: "Data is hosted with hosting and database providers acting as data processors. It is not sold or transferred to third parties for commercial purposes.",
        },
        { type: "h2", text: "Your rights" },
        {
          type: "p",
          text: "You may exercise your rights of access, rectification, erasure, objection, restriction and portability by writing to the contact address. You may also complain to the Spanish Data Protection Agency if you consider the processing unlawful.",
        },
      ],
    }),
  },
};

export const cookies: Article = {
  slug: "cookies",
  legal: true,
  content: {
    es: () => ({
      title: "Política de cookies",
      description: "Qué cookies usa este sitio, para qué sirven y cómo puedes gestionarlas.",
      body: [
        {
          type: "p",
          text: "Una cookie es un pequeño archivo que un sitio web guarda en tu navegador. Este sitio usa las mínimas necesarias para funcionar y, cuando esté activada la publicidad, las que introduzca la red publicitaria.",
        },
        { type: "h2", text: "Cookies técnicas" },
        {
          type: "p",
          text: "Imprescindibles para que la web funcione: mantienen tu sesión si te registras, recuerdan tu idioma y tu decisión sobre las cookies. No requieren consentimiento.",
        },
        { type: "h2", text: "Cookies de publicidad" },
        {
          type: "p",
          text: "Cuando la publicidad esté activa, Google AdSense podrá instalar cookies para mostrar anuncios y medir su rendimiento. Estas cookies solo se cargan si aceptas su uso en el banner de consentimiento.",
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
    }),
    en: () => ({
      title: "Cookie policy",
      description: "What cookies this site uses, what they do, and how to manage them.",
      body: [
        {
          type: "p",
          text: "A cookie is a small file a website stores in your browser. This site uses the minimum needed to function and, once advertising is switched on, whatever the ad network introduces.",
        },
        { type: "h2", text: "Technical cookies" },
        {
          type: "p",
          text: "Essential for the site to work: they keep your session if you register, and remember your language and your cookie decision. They do not require consent.",
        },
        { type: "h2", text: "Advertising cookies" },
        {
          type: "p",
          text: "Once advertising is active, Google AdSense may set cookies to serve ads and measure their performance. These load only if you accept them in the consent banner.",
        },
        { type: "h2", text: "Managing them" },
        {
          type: "ul",
          items: [
            "You can change your decision at any time from the cookie settings link in the footer.",
            "Every browser lets you block or delete cookies from its privacy settings.",
            "Blocking advertising cookies does not stop you browsing the site: it only makes the ads less relevant.",
          ],
        },
        {
          type: "callout",
          title: "Current status",
          text: "While advertising is not active, this site sets no third-party cookies. This page will be updated with specific providers as soon as it is.",
        },
      ],
    }),
  },
};

export const contacto: Article = {
  slug: "contacto",
  legal: true,
  content: {
    es: (city) => ({
      title: `Contacto — ${city.name}`,
      description: `Cómo contactar para anunciarte, corregir un dato o proponer un evento del eclipse en ${city.name}.`,
      body: [
        { type: "h2", text: "Para anunciarte" },
        {
          type: "p",
          text: `Si tienes un negocio en ${city.name} o alrededores y quieres aparecer en el directorio, la ficha básica es gratuita y puedes darla de alta tú mismo. Para fichas destacadas o patrocinio, escríbenos contando qué negocio tienes y qué buscas.`,
        },
        { type: "h2", text: "Para corregir un dato" },
        {
          type: "p",
          text: "Si detectas un error en una hora, una duración o cualquier otro dato, dínoslo con la fuente y lo corregimos cuanto antes. Es la clase de aviso que más agradecemos: una guía de eclipse vale lo que valen sus datos.",
        },
        { type: "h2", text: "Para proponer un evento" },
        {
          type: "p",
          text: "Ayuntamientos, agrupaciones astronómicas, centros educativos y organizadores en general pueden mandarnos su convocatoria con el enlace oficial. Las actividades abiertas y gratuitas se publican sin coste.",
        },
        { type: "h2", text: "Dirección de contacto" },
        { type: "ul", items: [`Correo: ${PENDIENTE}`] },
      ],
    }),
    en: (city) => {
      const name = city.nameEn ?? city.name;
      return {
        title: `Contact — ${name}`,
        description: `How to get in touch to advertise, correct a figure, or submit an eclipse event in ${name}.`,
        body: [
          { type: "h2", text: "To advertise" },
          {
            type: "p",
            text: `If you run a business in or around ${name} and want to appear in the directory, the basic listing is free and you can add it yourself. For featured listings or sponsorship, write to us describing your business and what you are after.`,
          },
          { type: "h2", text: "To correct a figure" },
          {
            type: "p",
            text: "If you spot an error in a time, a duration or any other figure, tell us with the source and we will fix it quickly. It is the kind of message we most appreciate: an eclipse guide is worth exactly what its data is worth.",
          },
          { type: "h2", text: "To submit an event" },
          {
            type: "p",
            text: "Councils, astronomy societies, schools and organisers in general can send us their announcement with the official link. Open, free activities are published at no cost.",
          },
          { type: "h2", text: "Contact address" },
          { type: "ul", items: [`Email: ${PENDING}`] },
        ],
      };
    },
  },
};
