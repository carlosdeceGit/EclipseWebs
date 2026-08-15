import { publicClient } from "./supabase";

/**
 * Directorio de negocios y tablón de clasificados.
 *
 * Son la misma tabla con dos usos distintos: el directorio recoge negocios
 * permanentes (hoteles, restaurantes, guías) y los clasificados, ofertas puntuales
 * ligadas al eclipse (una habitación libre, plazas en una furgoneta, gafas
 * certificadas de sobra). Todo pasa por moderación antes de publicarse.
 */

export const DIRECTORY_CATEGORIES = [
  { slug: "alojamiento", label: { es: "Alojamiento", en: "Accommodation" }, icon: "🛏️" },
  { slug: "restauracion", label: { es: "Bares y restaurantes", en: "Bars and restaurants" }, icon: "🍽️" },
  { slug: "actividades", label: { es: "Actividades y excursiones", en: "Activities and tours" }, icon: "🧭" },
  { slug: "transporte", label: { es: "Transporte y traslados", en: "Transport and transfers" }, icon: "🚐" },
  { slug: "optica-astronomia", label: { es: "Ópticas y astronomía", en: "Opticians and astronomy" }, icon: "🔭" },
  { slug: "comercio", label: { es: "Comercio local", en: "Local shops" }, icon: "🛍️" },
  { slug: "servicios", label: { es: "Otros servicios", en: "Other services" }, icon: "🔧" },
] as const;

export const CLASSIFIED_CATEGORIES = [
  { slug: "alojamiento-particular", label: { es: "Alojamiento particular", en: "Private accommodation" }, icon: "🏠" },
  { slug: "transporte-compartido", label: { es: "Comparto coche o furgoneta", en: "Sharing a car or van" }, icon: "🚗" },
  { slug: "material", label: { es: "Compra-venta de material", en: "Buying and selling gear" }, icon: "🔭" },
  { slug: "servicios-puntuales", label: { es: "Servicios para esos días", en: "Services for those days" }, icon: "🤝" },
  { slug: "busco", label: { es: "Busco / demando", en: "Wanted" }, icon: "🔎" },
] as const;

export type ListingKind = "directory" | "classified";
export type ListingStatus = "pending" | "approved" | "rejected" | "expired";
export type ListingTier = "free" | "featured" | "sponsor";

export interface Listing {
  id: string;
  kind: ListingKind;
  status: ListingStatus;
  tier: ListingTier;
  city_slug: string;
  category: string;
  title: string;
  description: string;
  /** Precio en euros, solo para clasificados de compra-venta. */
  price: number | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  image_url: string | null;
  created_at: string;
  /** Los clasificados caducan solos; el directorio no. */
  expires_at: string | null;
}

/**
 * Anuncios publicados de una ciudad.
 *
 * Los destacados van primero porque es exactamente lo que se paga. Dentro de cada
 * nivel, el más reciente arriba.
 */
export async function getListings(opts: {
  kind: ListingKind;
  citySlug: string;
  category?: string;
  limit?: number;
}): Promise<Listing[]> {
  const supabase = publicClient();
  if (!supabase) return [];

  let query = supabase
    .from("listings")
    .select("*")
    .eq("kind", opts.kind)
    .eq("city_slug", opts.citySlug)
    .eq("status", "approved")
    .order("tier_rank", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 50);

  if (opts.category) query = query.eq("category", opts.category);

  const { data, error } = await query;
  if (error) {
    console.error("[listings] consulta fallida:", error.message);
    return [];
  }
  return (data ?? []) as Listing[];
}

export async function countListings(kind: ListingKind, citySlug: string): Promise<number> {
  const supabase = publicClient();
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from("listings")
    .select("id", { count: "exact", head: true })
    .eq("kind", kind)
    .eq("city_slug", citySlug)
    .eq("status", "approved");

  if (error) return 0;
  return count ?? 0;
}
