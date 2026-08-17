import { AD_SLOTS, type AdSlotName, adSlotEnabled, adsenseClientId } from "@/lib/ads";
import { Section } from "@/components/ui";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/eclipse/types";

/**
 * Hueco publicitario.
 *
 * Si el hueco no está configurado —falta el cliente de AdSense o el ID del bloque—
 * no se dibuja nada en absoluto: ni marcador, ni borde, ni altura reservada. Una web
 * con recuadros vacíos que dicen «espacio publicitario» parece abandonada y resta
 * credibilidad justo en las páginas que tienen que ganarla.
 *
 * El precio de esa decisión es que el día que se activen los anuncios el contenido
 * se desplazará una vez (CLS). Es un coste que se paga una sola vez, en el momento
 * de activar, y no todos los días de aquí a entonces. Cuando el hueco sí está activo
 * se reserva su altura, que es lo que evita el salto mientras carga cada anuncio.
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

  if (!client || !slot.id) return null;

  return (
    <div
      className={className}
      style={{ minHeight: slot.minHeight }}
      role="complementary"
      aria-label={getDictionary(locale).ads.label}
    >
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

/**
 * Anuncio que ocupa una sección propia entre bloques de contenido.
 *
 * Existe para que el contenedor desaparezca con el anuncio: `<Section>` tiene su
 * propio relleno vertical, así que envolver un `AdSlot` inactivo dejaría un hueco
 * en blanco de casi cien píxeles sin nada dentro.
 */
export function AdSection({ name, locale }: { name: AdSlotName; locale: Locale }) {
  if (!adSlotEnabled(name)) return null;
  return (
    <Section>
      <AdSlot name={name} locale={locale} />
    </Section>
  );
}
