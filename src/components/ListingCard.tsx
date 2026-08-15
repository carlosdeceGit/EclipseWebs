import { Badge, Card } from "./ui";
import type { Listing } from "@/lib/db/listings";

/**
 * Ficha de anuncio, común a directorio y clasificados.
 *
 * Los enlaces salientes llevan `rel="sponsored nofollow"`: son enlaces
 * comerciales y marcarlos así es lo que exige Google. Marcarlos mal es
 * justo el tipo de cosa que hunde un dominio entero.
 */
export function ListingCard({ listing }: { listing: Listing }) {
  const isPaid = listing.tier !== "free";

  return (
    <Card className={`flex h-full flex-col ${isPaid ? "ring-1 ring-[hsl(var(--accent)/0.4)]" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold leading-snug">{listing.title}</h3>
        {isPaid && <Badge>{listing.tier === "sponsor" ? "Patrocina" : "Destacado"}</Badge>}
      </div>

      <p className="mt-2 flex-1 text-sm" style={{ color: "hsl(var(--muted))" }}>
        {listing.description.length > 220
          ? `${listing.description.slice(0, 220)}…`
          : listing.description}
      </p>

      {listing.price !== null && (
        <p className="mt-3 text-lg font-bold" style={{ color: "hsl(var(--accent))" }}>
          {listing.price.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {listing.website && (
          <a
            href={listing.website}
            rel="sponsored nofollow noopener"
            target="_blank"
            className="underline"
            style={{ color: "hsl(var(--accent))" }}
          >
            Web
          </a>
        )}
        {listing.contact_phone && (
          <a href={`tel:${listing.contact_phone}`} className="underline" style={{ color: "hsl(var(--accent))" }}>
            {listing.contact_phone}
          </a>
        )}
        {listing.contact_email && (
          <a href={`mailto:${listing.contact_email}`} className="underline" style={{ color: "hsl(var(--accent))" }}>
            Email
          </a>
        )}
      </div>
    </Card>
  );
}
