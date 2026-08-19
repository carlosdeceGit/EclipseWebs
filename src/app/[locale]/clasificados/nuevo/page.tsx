import { permanentRedirect } from "next/navigation";
import { notFound } from "next/navigation";
import { isLocale, localePath } from "@/i18n/config";

/**
 * El alta de clasificados vive ahora en `/publicar`.
 *
 * Antes había dos formularios distintos —uno aquí para particulares y ninguno
 * para negocios ni para eventos— y la gente no sabía cuál le tocaba. `/publicar`
 * pregunta primero qué quieres publicar y adapta el formulario, así que esta URL
 * se mantiene solo para no romper los enlaces que ya circulan.
 */
export default async function LegacyNewClassifiedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  permanentRedirect(`${localePath(locale, "/publicar")}?tipo=particular`);
}
