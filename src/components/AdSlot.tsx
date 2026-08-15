import { AD_SLOTS, type AdSlotName, adsenseClientId } from "@/lib/ads";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/eclipse/types";

/**
 * Hueco publicitario.
 *
 * Mientras no haya `NEXT_PUBLIC_ADSENSE_CLIENT_ID` configurado (o mientras AdSense
 * no haya aprobado el dominio) se reserva el espacio con un marcador propio. Así el
 * layout no salta el día que se activen los anuncios, que es lo que penaliza CLS.
 */
export function AdSlot({
  name,
  locale,
  className = "",
}: {
  name: AdSlotName;
  locale: Locale;
  className?: string;
}) {
  const client = adsenseClientId();
  const slot = AD_SLOTS[name];

  if (!client || !slot.id) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-dashed text-xs ${className}`}
        style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted))", minHeight: slot.minHeight }}
        aria-hidden="true"
      >
        {getDictionary(locale).ads.placeholder}
      </div>
    );
  }

  return (
    <div className={className} style={{ minHeight: slot.minHeight }}>
      <ins
        className="adsbygoogle block"
        style={{ display: "block", minHeight: slot.minHeight }}
        data-ad-client={client}
        data-ad-slot={slot.id}
        data-ad-format={slot.format}
        data-full-width-responsive="true"
      />
      <script dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }} />
    </div>
  );
}
