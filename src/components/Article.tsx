import Link from "next/link";
import type { ReactNode } from "react";
import { headingId } from "@/components/Blocks";
import type { Block } from "@/content/articles";
import type { Locale } from "@/lib/eclipse/types";
import { getDictionary } from "@/i18n/dictionary";
import { localePath } from "@/i18n/config";

/**
 * El armazón de las páginas largas: guías y posts del blog.
 *
 * Las dos eran prosa corrida dentro de una columna centrada. Con cinco secciones
 * de media y varios miles de palabras, eso obliga a leer entero para saber si
 * dentro está lo que uno buscaba —y son justo las páginas donde más tiempo pasa
 * la gente—. Aquí se les da lo que le falta a un texto largo en pantalla: saber
 * qué hay dentro antes de bajar, poder saltar a una sección concreta, poder
 * enlazarla, y no quedarse sin salida al llegar al final.
 *
 * Lo comparten las dos rutas a propósito. Una guía y un post son el mismo objeto
 * de lectura para quien llega desde un buscador; que se comporten distinto solo
 * obligaría a aprender dos veces la misma página.
 */

export interface Section {
  id: string;
  text: string;
}

/**
 * Las secciones de un cuerpo, para el índice.
 *
 * Salen de los propios `h2`, que ya llevaban ancla estable desde el renderizador
 * de bloques. No hay una lista de secciones escrita a mano en ningún sitio: si
 * alguien añade, quita o renombra un `h2`, el índice le sigue solo. Un índice que
 * hay que mantener aparte es un índice que acaba mintiendo.
 */
export function sectionsOf(blocks: Block[]): Section[] {
  return blocks
    .filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2")
    .map((b) => ({ id: headingId(b.text), text: b.text }));
}

/**
 * Índice de secciones.
 *
 * Con menos de tres secciones no se dibuja: un índice de dos entradas ocupa más
 * de lo que ahorra y empuja el texto hacia abajo sin resolver nada.
 *
 * No marca la sección activa. Hacerlo sin JavaScript no es fiable —lo que hay
 * son aproximaciones que se desincronizan al saltar— y un índice que señala la
 * sección equivocada es peor que uno que no señala ninguna.
 */
export function ArticleToc({ sections, locale }: { sections: Section[]; locale: Locale }) {
  const t = getDictionary(locale);
  if (sections.length < 3) return null;

  return (
    <nav
      aria-label={t.article.sectionsNav}
      className="surface mb-10 rounded-2xl p-5 lg:mb-0 lg:sticky"
      style={{ top: "calc(var(--header-h) + 1.5rem)" }}
    >
      <p className="datum-label mb-3">{t.article.onThisPage}</p>
      {/* Sin numerar. Varios posts ya numeran sus propios apartados —«1. El Monte
          Hacho»— y una numeración del índice encima de la del titular deja
          «01 1. El Monte Hacho», que además desalinea las dos cuentas en cuanto
          el artículo mete una sección sin numerar. La lista ya se ve entera. */}
      <ul className="space-y-2 text-sm">
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="toc-link">
              {s.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * La rejilla de lectura: columna de texto y carril del índice.
 *
 * El índice va en el DOM entre la cabecera y el cuerpo, que es su sitio en móvil
 * —después del titular, antes del texto—. En pantalla ancha la colocación
 * automática de la rejilla lo manda al carril de la derecha sin duplicar nada:
 * un solo `<nav>` en el documento, no dos con uno escondido. Duplicar el índice
 * y ocultar uno con `hidden` mete dos veces la misma navegación en el árbol de
 * accesibilidad de algunos lectores.
 */
export function ArticleLayout({
  header,
  toc,
  children,
}: {
  header: ReactNode;
  toc: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-6xl gap-x-12 px-4 pb-4 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,42rem)_15rem] lg:justify-center">
      <header>{header}</header>
      {/* Ocupa las dos filas para que el carril tenga toda la altura del artículo:
          un elemento pegajoso dentro de una celda de la altura de su contenido no
          tiene por dónde desplazarse y se queda quieto. */}
      <div className="lg:row-span-2">{toc}</div>
      {/* Un `div`, no un `main`: el layout ya envuelve todo el contenido en
          `<main id="contenido">`, que es el destino del enlace de salto. Anidar
          otro sería marcado inválido y dejaría a los lectores de pantalla con dos
          regiones principales en el mismo documento. */}
      <div>{children}</div>
    </div>
  );
}

/**
 * Cabecera de artículo.
 *
 * Emite el `<h1>`, igual que `PageHeader`, pero con la entradilla a tamaño de
 * lectura y un renglón de metadatos —categoría, minutos, fecha— por encima del
 * titular. Las dos rutas lo hacían por su cuenta con marcado suelto y ya habían
 * divergido en tamaño de titular y color de entradilla.
 */
export function ArticleHeader({
  meta,
  title,
  lead,
  after,
}: {
  meta?: ReactNode;
  title: string;
  lead: ReactNode;
  /** Fecha, aviso de actualización o lo que vaya bajo la entradilla. */
  after?: ReactNode;
}) {
  return (
    <>
      {meta && (
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm" style={{ color: "hsl(var(--muted))" }}>
          {meta}
        </div>
      )}
      {/* Un escalón por debajo de `PageHeader` a propósito. El titular de una
          página es una etiqueta corta —«Localidades dentro de la franja»— y
          aguanta el tamaño mayor; el de un artículo es una frase entera y al
          máximo tamaño ocupa cuatro líneas antes de que empiece el texto. */}
      <h1 className="font-black" style={{ fontSize: "var(--step-3)", lineHeight: 1.08 }}>
        {title}
      </h1>
      <p className="mt-5" style={{ color: "hsl(var(--muted))", fontSize: "var(--step-1)" }}>
        {lead}
      </p>
      {after}
    </>
  );
}

export interface ArticleLink {
  href: string;
  title: string;
}

/**
 * Anterior y siguiente al final del artículo.
 *
 * Sin esto, una guía terminaba y dejaba al lector en un callejón: la única salida
 * era el menú. Quien acaba de leer entera la guía de seguridad es exactamente
 * quien va a leer la de las gafas, y hasta ahora no se lo decía nadie.
 *
 * El orden es el editorial del registro de guías o del blog, no el alfabético ni
 * el de fecha: es el orden en el que se escribieron para ser leídas.
 */
export function ArticleNav({
  prev,
  next,
  locale,
}: {
  prev?: ArticleLink;
  next?: ArticleLink;
  locale: Locale;
}) {
  const t = getDictionary(locale);
  if (!prev && !next) return null;

  return (
    <nav aria-label={t.article.moreReading} className="mt-12 grid gap-4 sm:grid-cols-2">
      {prev ? <NavCard link={prev} label={t.article.previous} side="prev" locale={locale} /> : <div />}
      {next && <NavCard link={next} label={t.article.next} side="next" locale={locale} />}
    </nav>
  );
}

function NavCard({
  link,
  label,
  side,
  locale,
}: {
  link: ArticleLink;
  label: string;
  side: "prev" | "next";
  locale: Locale;
}) {
  return (
    <Link
      href={localePath(locale, link.href)}
      className={`card-interactive surface rounded-2xl p-5 ${side === "next" ? "text-right" : ""}`}
    >
      <span className="datum-label block">
        {side === "prev" ? "← " : ""}
        {label}
        {side === "next" ? " →" : ""}
      </span>
      <span className="mt-2 block font-semibold leading-snug">{link.title}</span>
    </Link>
  );
}
