import { C, Canvas, Disclaimer, EclipsedSun, Label, PartialSun, Pin, SkyGradient, type ArtProps } from "./primitives";
import { citiesByTotality, cityName, formatDuration } from "@/lib/eclipse/cities";
import { distanceToCenterlineKm } from "@/lib/eclipse/besselian";

const hm = (t: string | null) => (t ? t.slice(0, 5) : "—");

/**
 * La franja de totalidad cruzando el Estrecho.
 *
 * Es un esquema, y lo dice dentro del propio dibujo. La geometría real está en el
 * cálculo besseliano y en el localizador; lo que aporta esta ilustración es que se
 * entienda de un vistazo por qué Ceuta gana y por qué Sevilla se queda fuera, algo
 * que una tabla de segundos no transmite.
 */
export function PathStrait({ locale }: ArtProps) {
  const es = locale === "es";
  return (
    <Canvas
      label={es ? "Esquema de la franja de totalidad sobre el estrecho de Gibraltar" : "Diagram of the path of totality over the Strait of Gibraltar"}
      defs={<SkyGradient id="ps-sea" />}
    >
      <rect width="800" height="450" fill={C.sea} />

      {/* Península ibérica */}
      <path
        d="M0,0 H800 V150 C700,170 640,185 560,205 C480,225 420,235 380,262 C350,282 310,290 250,286 C170,280 80,262 0,245 Z"
        fill={C.land}
      />
      {/* Norte de África */}
      <path
        d="M0,450 H800 V332 C720,334 660,346 590,354 C520,362 470,354 420,342 C370,330 300,338 220,358 C140,378 60,394 0,402 Z"
        fill={C.land}
      />
      {/* Ceuta: península en la costa africana */}
      <path d="M432,344 l10,-22 l16,4 l6,20 z" fill={C.landHi} />

      {/* Franja de totalidad */}
      <path d="M0,185 L800,105 L800,450 L0,450 Z" fill={C.accent} opacity={0.13} />
      <line x1="0" y1="185" x2="800" y2="105" stroke={C.accent} strokeWidth={2} opacity={0.85} />
      <line x1="0" y1="330" x2="800" y2="250" stroke={C.accent} strokeWidth={1.6} strokeDasharray="10 8" opacity={0.9} />

      <Label x={16} y={176} size={13} color={C.accent}>
        {es ? "borde norte de la franja" : "northern limit of the path"}
      </Label>
      <Label x={16} y={324} size={13} color={C.accent}>
        {es ? "línea central · máxima duración" : "centreline · longest totality"}
      </Label>

      <Pin x={185} y={95} name={es ? "Sevilla · sin totalidad" : "Seville · no totality"} />
      <Pin x={105} y={210} name="Cádiz" />
      <Pin x={655} y={148} name={es ? "Málaga" : "Malaga"} />
      <Pin x={300} y={266} name="Tarifa" anchor="end" />
      <Pin x={382} y={248} name="Algeciras" />
      <Pin x={410} y={276} name="Gibraltar" dy={4} />
      <Pin x={445} y={330} name="Ceuta" highlight dy={16} />
      <Pin x={300} y={352} name={es ? "Tánger" : "Tangier"} anchor="end" dy={12} />
      <Pin x={470} y={392} name={es ? "Tetuán" : "Tetouan"} dy={12} />

      <Disclaimer text={es ? "Esquema orientativo, no a escala" : "Indicative diagram, not to scale"} />
    </Canvas>
  );
}

/** Los cinco contactos, con las horas reales de la ciudad del dominio. */
export function ContactsTimeline({ city, locale }: ArtProps) {
  const es = locale === "es";
  const marks = [
    { t: hm(city.localTimes.partialStart), k: "C1", label: es ? "empieza el parcial" : "partial begins", cover: 0 },
    { t: hm(city.localTimes.totalityStart), k: "C2", label: es ? "empieza la totalidad" : "totality begins", cover: 0.98 },
    { t: hm(city.localTimes.maximum), k: es ? "máx." : "max.", label: es ? "máximo" : "maximum", cover: 1 },
    { t: hm(city.localTimes.totalityEnd), k: "C3", label: es ? "termina la totalidad" : "totality ends", cover: 0.98 },
    { t: hm(city.localTimes.partialEnd), k: "C4", label: es ? "termina el parcial" : "partial ends", cover: 0 },
  ];
  const xs = [90, 300, 400, 500, 710];
  const duration = formatDuration(city.eclipse.totalitySeconds, locale);

  return (
    <Canvas
      height={360}
      label={
        es
          ? `Las cinco fases del eclipse en ${city.name}, con sus horas locales`
          : `The five phases of the eclipse in ${city.nameEn ?? city.name}, with local times`
      }
    >
      {/* Tramo de totalidad */}
      <rect x={300} y={168} width={200} height={30} rx={15} fill={C.accent} opacity={0.22} />
      <line x1="60" y1="183" x2="740" y2="183" stroke={C.border} strokeWidth={3} />
      <line x1="300" y1="183" x2="500" y2="183" stroke={C.accent} strokeWidth={4} />

      {marks.map((m, i) => (
        <g key={m.k}>
          {m.cover === 1 ? (
            <EclipsedSun cx={xs[i]} cy={95} r={20} />
          ) : m.cover > 0.9 ? (
            <EclipsedSun cx={xs[i]} cy={95} r={19} rays={false} />
          ) : (
            <PartialSun cx={xs[i]} cy={95} r={22} cover={0.02} id={`ct-m${i}`} />
          )}
          <line x1={xs[i]} y1={140} x2={xs[i]} y2={183} stroke={C.border} strokeWidth={1.5} />
          <circle cx={xs[i]} cy={183} r={6} fill={i >= 1 && i <= 3 ? C.accent : C.muted} />
          <Label x={xs[i]} y={228} anchor="middle" size={19} weight={800} color={C.text}>
            {m.t}
          </Label>
          <Label x={xs[i]} y={250} anchor="middle" size={13} color={C.accent} weight={700}>
            {m.k}
          </Label>
          <Label x={xs[i]} y={272} anchor="middle" size={12.5}>
            {m.label}
          </Label>
        </g>
      ))}

      <Label x={400} y={40} anchor="middle" size={16} weight={700} color={C.text}>
        {es ? `Hora local en ${city.name} · ${city.timeZone}` : `Local time in ${city.nameEn ?? city.name} · ${city.timeZone}`}
      </Label>
      {duration && (
        <Label x={400} y={322} anchor="middle" size={15} color={C.accent} weight={700}>
          {es ? `${duration} sin filtro, y solo ahí` : `${duration} without a filter, and only there`}
        </Label>
      )}
      <Disclaimer
        y={348}
        text={es ? "No uses el reloj para quitarte el filtro: guíate por lo que ves" : "Do not use the clock to remove your filter: go by what you see"}
      />
    </Canvas>
  );
}

/** La corona: lo único del eclipse que se puede mirar sin filtro. */
export function Corona({ locale }: ArtProps) {
  const es = locale === "es";
  return (
    <Canvas
      label={es ? "La corona solar durante la totalidad, con protuberancias y el cielo en crepúsculo" : "The solar corona during totality, with prominences and a twilight sky"}
      defs={<SkyGradient id="co-sky" />}
    >
      <rect width="800" height="450" fill="url(#co-sky)" />
      {/* Resplandor de 360° sobre el horizonte, que es lo que casi nadie espera */}
      <rect x="0" y="360" width="800" height="90" fill={C.accent} opacity={0.16} />
      <rect x="0" y="392" width="800" height="58" fill={C.accent} opacity={0.14} />

      {[
        [70, 90], [150, 60], [640, 70], [720, 120], [255, 55], [520, 45], [700, 300], [95, 250], [600, 330],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.2 : 1.4} fill={C.text} opacity={0.7} />
      ))}

      {/* Corona: penachos irregulares, que es como se ve de verdad */}
      <g>
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const len = 78 + 62 * Math.abs(Math.sin(a * 1.7 + 0.6)) + (i % 5 === 0 ? 34 : 0);
          return (
            <line
              key={i}
              x1={400 + Math.cos(a) * 76}
              y1={225 + Math.sin(a) * 76}
              x2={400 + Math.cos(a) * len}
              y2={225 + Math.sin(a) * len}
              stroke={C.accent}
              strokeWidth={i % 5 === 0 ? 2.4 : 1.3}
              opacity={0.42}
              strokeLinecap="round"
            />
          );
        })}
      </g>
      <circle cx={400} cy={225} r={104} fill={C.accent} opacity={0.09} />
      <circle cx={400} cy={225} r={78} fill={C.accent} opacity={0.75} />
      {/* Protuberancias: rosa salmón junto al limbo */}
      <path d="M400,225 m48,-56 a14,14 0 0 1 16,14 l-9,4 z" fill="#ff8a7a" opacity={0.9} />
      <path d="M400,225 m-40,58 a12,12 0 0 0 -18,6 l10,6 z" fill="#ff8a7a" opacity={0.85} />
      <circle cx={400} cy={225} r={72} fill={C.night} />

      <Label x={400} y={62} anchor="middle" size={17} weight={700} color={C.text}>
        {es ? "Totalidad: el único momento sin filtro" : "Totality: the only moment without a filter"}
      </Label>
      <Label x={400} y={415} anchor="middle" size={14}>
        {es
          ? "El horizonte sigue iluminado en los 360°: la sombra mide unos 260 km"
          : "The horizon stays lit all around: the shadow is only about 260 km wide"}
      </Label>
    </Canvas>
  );
}

/** Dónde está el Sol: altura y azimut reales calculados para la ciudad. */
export function SunPosition({ city, locale }: ArtProps) {
  const es = locale === "es";
  const alt = city.eclipse.sunAltitudeDeg;
  const az = city.eclipse.sunAzimuthDeg;
  // Arco de altura: 0° a la izquierda (horizonte), 90° arriba.
  const cx = 150;
  const cy = 340;
  const r = 250;
  const a = ((90 - alt) * Math.PI) / 180;
  const sx = cx + Math.sin(a) * r;
  const sy = cy - Math.cos(a) * r;

  return (
    <Canvas
      label={
        es
          ? `Posición del Sol en el máximo del eclipse desde ${city.name}: ${alt.toFixed(0)} grados de altura y azimut ${az.toFixed(0)} grados`
          : `Position of the Sun at maximum eclipse from ${city.nameEn ?? city.name}: ${alt.toFixed(0)} degrees altitude, azimuth ${az.toFixed(0)} degrees`
      }
      defs={<SkyGradient id="sp-sky" />}
    >
      <rect width="800" height="450" fill="url(#sp-sky)" />

      {/* Terreno */}
      <path d="M0,352 C120,344 200,348 300,340 C360,335 420,318 470,300 C520,282 560,290 610,312 C660,334 720,346 800,344 L800,450 L0,450 Z" fill={C.land} />
      <line x1="0" y1="340" x2="800" y2="340" stroke={C.border} strokeWidth={1.5} strokeDasharray="6 8" />

      {/* Arcos de referencia cada 30° */}
      {[30, 60].map((deg) => {
        const ar = ((90 - deg) * Math.PI) / 180;
        return (
          <g key={deg}>
            <line
              x1={cx}
              y1={cy}
              x2={cx + Math.sin(ar) * r}
              y2={cy - Math.cos(ar) * r}
              stroke={C.border}
              strokeWidth={1.2}
              strokeDasharray="4 7"
            />
            <Label x={cx + Math.sin(ar) * (r + 22)} y={cy - Math.cos(ar) * (r + 22)} size={12}>
              {deg}°
            </Label>
          </g>
        );
      })}
      <path d={`M${cx + r * 0.34},${cy} A${r * 0.34},${r * 0.34} 0 0 0 ${cx + Math.sin(a) * r * 0.34},${cy - Math.cos(a) * r * 0.34}`} fill="none" stroke={C.accent} strokeWidth={2} />
      <line x1={cx} y1={cy} x2={sx} y2={sy} stroke={C.accent} strokeWidth={2} opacity={0.6} />

      <EclipsedSun cx={sx} cy={sy} r={34} />
      <Label x={sx + 62} y={sy - 6} size={22} weight={800} color={C.text}>
        {`${alt.toFixed(0)}°`}
      </Label>
      <Label x={sx + 62} y={sy + 18} size={13}>
        {es ? "de altura sobre el horizonte" : "above the horizon"}
      </Label>

      {/* Brújula */}
      <rect x={80} y={392} width={640} height={40} rx={20} fill={C.surface} stroke={C.border} />
      {[
        { deg: 45, x: 150, t: "NE" },
        { deg: 90, x: 300, t: "E" },
        { deg: 135, x: 450, t: "SE" },
        { deg: 180, x: 600, t: "S" },
      ].map((m) => (
        <g key={m.t}>
          <line x1={m.x} y1={396} x2={m.x} y2={428} stroke={C.border} strokeWidth={1.2} />
          <Label x={m.x} y={418} anchor="middle" size={13}>
            {m.t}
          </Label>
        </g>
      ))}
      {/* Azimut real, interpolado en la escala 45°–180° = x 150–600 */}
      <g>
        <circle cx={150 + ((az - 45) / 135) * 450} cy={412} r={9} fill={C.accent} />
        <Label x={150 + ((az - 45) / 135) * 450} y={382} anchor="middle" size={14} weight={700} color={C.accent}>
          {`${az.toFixed(0)}°`}
        </Label>
      </g>

      <Label x={784} y={64} anchor="end" size={16} weight={700} color={C.text}>
        {es ? "Hacia dónde mirar" : "Where to look"}
      </Label>
      <Label x={784} y={88} anchor="end" size={13}>
        {es ? "A buena altura y al este-sureste: casi nada lo tapa" : "Comfortably high, east-southeast: almost nothing blocks it"}
      </Label>
    </Canvas>
  );
}

/** La sombra de la Luna llegando sobre el mar. */
export function ShadowSea({ locale }: ArtProps) {
  const es = locale === "es";
  return (
    <Canvas
      label={es ? "La sombra de la Luna avanzando sobre el mar hacia el observador" : "The Moon's shadow racing across the sea towards the observer"}
      defs={
        <>
          <SkyGradient id="ss-sky" />
          <linearGradient id="ss-shadow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#05070f" stopOpacity="0.92" />
            <stop offset="70%" stopColor="#05070f" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#05070f" stopOpacity="0" />
          </linearGradient>
        </>
      }
    >
      <rect width="800" height="450" fill="url(#ss-sky)" />
      <EclipsedSun cx={575} cy={120} r={40} />
      <rect x="0" y="250" width="800" height="200" fill={C.sea} />
      {/* Reflejos en el agua */}
      {Array.from({ length: 16 }, (_, i) => (
        <line
          key={i}
          x1={40 + i * 48}
          y1={280 + (i % 4) * 38}
          x2={110 + i * 48}
          y2={280 + (i % 4) * 38}
          stroke={C.accent}
          strokeWidth={1.5}
          opacity={0.14}
          strokeLinecap="round"
        />
      ))}
      {/* Frente de sombra, entrando por el oeste */}
      <path d="M0,250 H430 C400,320 360,390 330,450 H0 Z" fill="url(#ss-shadow)" />
      <path d="M430,250 C400,320 360,390 330,450" stroke={C.accent} strokeWidth={2.5} fill="none" opacity={0.7} />
      <path d="M470,330 l70,0 m-18,-12 l18,12 l-18,12" stroke={C.accent} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.9} />

      <Label x={30} y={300} size={15} weight={700} color={C.text}>
        {es ? "sombra" : "shadow"}
      </Label>
      <Label x={556} y={336} size={14} color={C.accent}>
        {es ? "avanza a más de 2.000 km/h" : "moving at over 2,000 km/h"}
      </Label>
      <Label x={400} y={54} anchor="middle" size={16} weight={700} color={C.text}>
        {es ? "Mira al oeste un minuto antes de la totalidad" : "Look west a minute before totality"}
      </Label>
    </Canvas>
  );
}

/** Levante y poniente: el factor que decide si se ve o no. */
export function LevanteCloud({ locale }: ArtProps) {
  const es = locale === "es";
  return (
    <Canvas
      height={400}
      label={es ? "Esquema del levante y el poniente sobre el Estrecho y su efecto en la nubosidad" : "Diagram of the levante and poniente winds over the Strait and their effect on cloud"}
      defs={<SkyGradient id="lc-sky" />}
    >
      <rect width="800" height="400" fill="url(#lc-sky)" />
      <rect x="0" y="300" width="800" height="100" fill={C.sea} />
      <path d="M480,300 C520,280 560,268 620,262 C700,255 760,268 800,282 L800,300 Z" fill={C.land} />
      <path d="M0,300 C60,286 130,278 210,282 C260,285 300,292 340,300 Z" fill={C.land} />

      <EclipsedSun cx={400} cy={92} r={30} rays={false} />

      {/* Poniente: atlántico, limpio */}
      <g opacity={0.9}>
        <path d="M30,200 h150 m-26,-13 l26,13 l-26,13" stroke={C.accent} strokeWidth={3} fill="none" strokeLinecap="round" />
        <Label x={30} y={182} size={15} weight={700} color={C.accent}>
          {es ? "poniente · del Atlántico" : "poniente · off the Atlantic"}
        </Label>
        <Label x={30} y={238} size={13}>
          {es ? "aire más fresco y seco, cielo limpio" : "cooler, drier air and clean skies"}
        </Label>
      </g>

      {/* Levante: mediterráneo, con nube baja pegada a la costa */}
      <g>
        <path d="M770,200 h-150 m26,-13 l-26,13 l26,13" stroke="#7fb4d6" strokeWidth={3} fill="none" strokeLinecap="round" />
        <Label x={770} y={182} anchor="end" size={15} weight={700} color="#7fb4d6">
          {es ? "levante · del Mediterráneo" : "levante · off the Mediterranean"}
        </Label>
        <Label x={770} y={238} anchor="end" size={13}>
          {es ? "aire húmedo: nube baja contra la costa" : "humid air: low cloud against the coast"}
        </Label>
        {[[560, 262], [620, 250], [680, 258], [520, 272]].map(([x, y], i) => (
          <g key={i} opacity={0.55}>
            <ellipse cx={x} cy={y} rx={46} ry={17} fill="#8fb8d4" />
            <ellipse cx={x + 24} cy={y - 8} rx={30} ry={14} fill="#8fb8d4" />
          </g>
        ))}
      </g>

      <Label x={400} y={340} anchor="middle" size={14} color={C.text} weight={600}>
        {es
          ? "Unos kilómetros tierra adentro o algo de altura bastan para salir de la capa"
          : "A few kilometres inland, or a little height, is often enough to clear the layer"}
      </Label>
      <Disclaimer y={384} text={es ? "Esquema conceptual" : "Conceptual diagram"} />
    </Canvas>
  );
}

/**
 * Duración de la totalidad por localidad, calculada.
 *
 * Es la única ilustración con cifras que no son decorativas: sale del mismo cálculo
 * besseliano que las tablas, así que si el cálculo cambia, el dibujo cambia con él.
 */
export function DurationBars({ city, locale }: ArtProps) {
  const es = locale === "es";
  const rows = citiesByTotality().slice(0, 9);
  const max = rows[0]?.eclipse.totalitySeconds ?? 1;
  const rowH = 38;
  const top = 84;
  // Columnas fijas. La duración no puede ir pegada al final de su barra: en las más
  // largas se montaba encima de la columna de kilómetros y se leían dos cifras
  // superpuestas, que es peor que no dar ninguna.
  const barX = 200;
  const barW = 330;
  const durX = 660;
  const kmX = 778;

  return (
    <Canvas
      height={top + rows.length * rowH + 64}
      label={es ? "Duración de la totalidad por localidad, de mayor a menor" : "Length of totality by location, longest first"}
    >
      <Label x={22} y={38} size={17} weight={800} color={C.text}>
        {es ? "Duración de la totalidad" : "Length of totality"}
      </Label>
      <Label x={kmX} y={68} anchor="end" size={12} color="hsl(var(--muted) / 0.8)">
        {es ? "duración · km a la línea central" : "duration · km from the centreline"}
      </Label>
      <line x1={22} y1={76} x2={778} y2={76} stroke={C.border} strokeWidth={1} />

      {rows.map((c, i) => {
        const y = top + i * rowH;
        const w = (c.eclipse.totalitySeconds / max) * barW;
        const mine = c.slug === city.slug;
        const km = distanceToCenterlineKm({ lat: c.lat, lon: c.lon, altitudeM: c.altitudeM });
        return (
          <g key={c.slug}>
            <Label x={186} y={y + 16} anchor="end" size={14} weight={mine ? 800 : 500} color={mine ? C.text : C.muted}>
              {cityName(c, locale)}
            </Label>
            <rect x={barX} y={y} width={barW} height={20} rx={10} fill={C.border} opacity={0.45} />
            <rect x={barX} y={y} width={w} height={20} rx={10} fill={C.accent} opacity={mine ? 1 : 0.5} />
            <Label x={durX} y={y + 16} anchor="end" size={13.5} weight={mine ? 800 : 600} color={mine ? C.accent : C.muted}>
              {formatDuration(c.eclipse.totalitySeconds, locale) ?? ""}
            </Label>
            <Label x={kmX} y={y + 16} anchor="end" size={13} weight={mine ? 700 : 400}>
              {km === null ? "—" : `${km.toFixed(0)} km`}
            </Label>
          </g>
        );
      })}

      <Label x={22} y={top + rows.length * rowH + 26} size={12.5}>
        {es
          ? "Calculado con elementos besselianos de la NASA. Cuanto más cerca de la línea central, más dura."
          : "Computed from NASA Besselian elements. The closer to the centreline, the longer it lasts."}
      </Label>
      <Label x={22} y={top + rows.length * rowH + 46} size={12.5}>
        {es
          ? "Incluye las dos orillas del Estrecho: Ceuta es el máximo del territorio español."
          : "Both shores of the Strait are included: Ceuta is the maximum on Spanish territory."}
      </Label>
    </Canvas>
  );
}
