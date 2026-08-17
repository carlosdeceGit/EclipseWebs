import type { ReactElement } from "react";
import {
  ContactsTimeline,
  Corona,
  DurationBars,
  LevanteCloud,
  PathStrait,
  ShadowSea,
  SunPosition,
} from "./eclipse";
import { DayPlan, FerryRoute, FourCultures, Gastronomy, ViewpointsMap } from "./ceuta";
import { CameraSettings, GlassesMarks, Pinhole } from "./practico";
import { C, type ArtProps } from "./primitives";
import type { CityWithCircumstances, Locale } from "@/lib/eclipse/types";

export type { ArtProps } from "./primitives";

/**
 * Registro de ilustraciones.
 *
 * Cada post declara el nombre de la que usa, así que el registro es el contrato: si
 * un post pide una ilustración que no existe, TypeScript lo dice en el momento y no
 * en producción con un hueco vacío.
 *
 * Todas reciben la ciudad resuelta y el idioma. Eso permite que las que muestran
 * cifras —horarios, altura del Sol, duraciones— salgan del mismo cálculo besseliano
 * que las tablas, y no de números escritos a mano dentro de un dibujo, que es la
 * clase de dato que se queda obsoleto sin que nadie se dé cuenta.
 */
export const ART = {
  "path-strait": PathStrait,
  "contacts-timeline": ContactsTimeline,
  corona: Corona,
  "sun-position": SunPosition,
  "shadow-sea": ShadowSea,
  "levante-cloud": LevanteCloud,
  "duration-bars": DurationBars,
  "viewpoints-map": ViewpointsMap,
  "ferry-route": FerryRoute,
  "four-cultures": FourCultures,
  gastronomy: Gastronomy,
  "day-plan": DayPlan,
  "glasses-marks": GlassesMarks,
  pinhole: Pinhole,
  "camera-settings": CameraSettings,
} satisfies Record<string, (props: ArtProps) => ReactElement>;

export type ArtName = keyof typeof ART;

/**
 * Ilustración con su pie.
 *
 * El pie no repite el título: añade el dato o el matiz que el dibujo no puede decir.
 * Un pie que describe lo que ya se ve es ruido.
 *
 * No lleva márgenes propios: los pone quien la coloca. Dentro de un artículo hace
 * falta separación vertical, y dentro de una tarjeta del índice sobra; dejar el
 * margen aquí obligaría a anularlo desde fuera, que con Tailwind depende del orden
 * en la hoja de estilos y no del orden de las clases.
 */
export function Figure({
  art,
  caption,
  city,
  locale,
  className = "",
}: {
  art: ArtName;
  caption?: string;
  city: CityWithCircumstances;
  locale: Locale;
  className?: string;
}) {
  const Art = ART[art];
  return (
    <figure className={className}>
      <div
        className="overflow-hidden rounded-xl border"
        style={{ borderColor: "hsl(var(--border))", background: C.night }}
      >
        <Art city={city} locale={locale} />
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-sm" style={{ color: "hsl(var(--muted))" }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
