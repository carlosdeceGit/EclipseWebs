import { ceuta } from "./ceuta";
import { cadiz } from "./cadiz";
import { tarifa } from "./tarifa";
import { gibraltar } from "./gibraltar";
import type { LocalProfile } from "./types";
import type { Block } from "../articles/types";
import type { Locale } from "@/lib/eclipse/types";

export type { LocalProfile, LocalSpot, LocalNote } from "./types";

/**
 * Perfiles locales, indexados por ciudad.
 *
 * Solo están las ciudades con dominio propio: escribir un perfil es trabajo de
 * campo, no plantilla, y un perfil a medias es peor que ninguno. Las ciudades sin
 * perfil siguen sirviendo las guías genéricas, que son correctas aunque no sean
 * específicas.
 */
const PROFILES: LocalProfile[] = [ceuta, cadiz, tarifa, gibraltar];

const BY_CITY = new Map(PROFILES.map((p) => [p.citySlug, p]));

export function localProfile(citySlug: string): LocalProfile | undefined {
  return BY_CITY.get(citySlug);
}

export function hasLocalProfile(citySlug: string): boolean {
  return BY_CITY.has(citySlug);
}

/**
 * Miradores con nombre propio, cada uno con su pega.
 *
 * Se emiten como `h3` para que cada punto de observación sea un ancla propia: son
 * justo las consultas de cola larga ("eclipse La Caleta", "mirador del Estrecho
 * eclipse") que ningún dominio de la red se disputa con otro.
 */
export function localSpotBlocks(citySlug: string, locale: Locale): Block[] {
  const profile = BY_CITY.get(citySlug);
  if (!profile) return [];

  const label = locale === "es" ? "El pero:" : "The catch:";

  return profile.spots.flatMap((spot): Block[] => [
    { type: "h3", text: locale === "en" ? (spot.nameEn ?? spot.name) : spot.name },
    { type: "p", text: spot.why[locale] },
    { type: "p", text: `${label} ${spot.caveat[locale]}` },
  ]);
}

export function localAngle(citySlug: string, locale: Locale): string | null {
  return BY_CITY.get(citySlug)?.angle[locale] ?? null;
}

export function localWhyHere(citySlug: string, locale: Locale): string | null {
  return BY_CITY.get(citySlug)?.whyHere[locale] ?? null;
}

export function localAccessItems(citySlug: string, locale: Locale): string[] | null {
  return BY_CITY.get(citySlug)?.access[locale] ?? null;
}

export function localStayItems(citySlug: string, locale: Locale): string[] | null {
  return BY_CITY.get(citySlug)?.stay[locale] ?? null;
}

export function localBottleneckBlock(citySlug: string, locale: Locale): Block | null {
  const note = BY_CITY.get(citySlug)?.bottleneck;
  if (!note) return null;
  return { type: "callout", title: note.title[locale], text: note.text[locale] };
}

export function localWeatherBlocks(citySlug: string, locale: Locale): Block[] {
  const note = BY_CITY.get(citySlug)?.weather;
  if (!note) return [];
  return [
    { type: "h2", text: note.title[locale] },
    { type: "p", text: note.text[locale] },
  ];
}
