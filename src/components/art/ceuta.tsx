import { C, Canvas, Disclaimer, EclipsedSun, Label, Pin, SkyGradient, type ArtProps } from "./primitives";

/**
 * Esquema de Ceuta con las zonas de observación.
 *
 * La forma es reconocible —istmo, Almina, Monte Hacho— pero es un esquema, no un
 * mapa: por eso lo dice en el propio dibujo y por eso las zonas están marcadas como
 * áreas y no como puntos exactos. Señalar un rincón concreto que después no soporte
 * la afluencia sería un flaco favor a quien nos lea.
 */
export function ViewpointsMap({ locale }: ArtProps) {
  const es = locale === "es";
  const zones = [
    { x: 210, y: 190, t: es ? "Benzú y la frontera norte" : "Benzu and the northern edge" },
    { x: 400, y: 168, t: es ? "Playas del norte" : "Northern beaches" },
    { x: 452, y: 262, t: es ? "Murallas y Foso" : "Walls and moat" },
    { x: 600, y: 210, t: es ? "Monte Hacho" : "Monte Hacho" },
    { x: 560, y: 320, t: es ? "Costa sur de la Almina" : "Southern Almina coast" },
  ];

  return (
    <Canvas
      label={es ? "Esquema de Ceuta con las zonas donde se puede observar el eclipse" : "Diagram of Ceuta showing areas where the eclipse can be watched"}
      defs={<SkyGradient id="vm-sky" />}
    >
      <rect width="800" height="450" fill={C.sea} />
      {/* Mediterráneo al norte, con textura de agua */}
      {Array.from({ length: 10 }, (_, i) => (
        <line key={i} x1={30 + i * 78} y1={40 + (i % 3) * 22} x2={92 + i * 78} y2={40 + (i % 3) * 22} stroke={C.text} strokeWidth={1} opacity={0.08} />
      ))}

      {/* Tierra: continente al oeste, istmo, península de la Almina y el Hacho */}
      <path
        d="M60,450 L60,250 C90,215 130,196 180,190 C232,183 280,198 320,214
           C356,228 392,236 424,240 L436,232 C452,222 476,222 494,236
           C520,214 556,196 596,196 C650,196 690,224 700,264
           C710,308 682,346 636,354 C592,362 552,342 536,306
           C520,320 494,324 476,314 C458,326 436,332 416,330
           C384,326 352,336 322,352 C282,374 232,392 176,398 C130,403 92,414 60,450 Z"
        fill={C.land}
      />
      {/* Monte Hacho */}
      <path d="M596,196 C640,198 676,226 686,262 C660,246 626,238 596,242 C572,246 550,258 536,276 C544,236 566,206 596,196 Z" fill={C.landHi} />
      <Label x={628} y={288} anchor="middle" size={12.5} color={C.text}>
        {es ? "204 m" : "204 m"}
      </Label>

      {/* Casco urbano, esquemático */}
      {Array.from({ length: 22 }, (_, i) => (
        <rect
          key={i}
          x={352 + (i % 8) * 22}
          y={252 + Math.floor(i / 8) * 20}
          width={14}
          height={13}
          rx={2}
          fill={C.text}
          opacity={0.1}
        />
      ))}

      <EclipsedSun cx={150} cy={92} r={26} />
      <Label x={150} y={148} anchor="middle" size={12.5} color={C.accent}>
        {es ? "el Sol, al este-sureste" : "the Sun, east-southeast"}
      </Label>

      {zones.map((z, i) => (
        <g key={z.t}>
          <circle cx={z.x} cy={z.y} r={17} fill={C.accent} opacity={0.18} />
          <circle cx={z.x} cy={z.y} r={13} fill="none" stroke={C.accent} strokeWidth={1.8} />
          <Label x={z.x} y={z.y + 5} anchor="middle" size={13} weight={800} color={C.accent}>
            {String(i + 1)}
          </Label>
        </g>
      ))}

      <g>
        <rect x={30} y={330} width={286} height={104} rx={12} fill={C.night} opacity={0.78} />
        {zones.map((z, i) => (
          <Label key={z.t} x={44} y={354 + i * 18} size={12.5}>
            {`${i + 1}. ${z.t}`}
          </Label>
        ))}
      </g>

      <Label x={700} y={54} anchor="end" size={13} color={C.muted}>
        {es ? "Mar Mediterráneo" : "Mediterranean Sea"}
      </Label>
      <Disclaimer text={es ? "Esquema orientativo, no a escala" : "Indicative diagram, not to scale"} />
    </Canvas>
  );
}

/** El cruce del Estrecho: la única forma de llegar con coche. */
export function FerryRoute({ locale }: ArtProps) {
  const es = locale === "es";
  return (
    <Canvas
      height={400}
      label={es ? "Esquema de la travesía en ferry entre Algeciras y Ceuta" : "Diagram of the ferry crossing between Algeciras and Ceuta"}
    >
      <rect width="800" height="400" fill={C.sea} />
      <path d="M0,0 H800 V96 C700,112 600,120 480,116 C360,112 240,96 120,72 C80,64 40,56 0,52 Z" fill={C.land} />
      <path d="M0,400 H800 V300 C700,300 620,312 520,320 C420,328 300,318 180,330 C110,337 50,352 0,362 Z" fill={C.land} />
      <path d="M430,318 l14,-26 l20,6 l6,22 z" fill={C.landHi} />

      <path d="M300,96 C330,150 380,230 442,300" stroke={C.accent} strokeWidth={2.4} strokeDasharray="9 8" fill="none" />
      {/* Ferry */}
      <g transform="translate(352,186) rotate(38)">
        <path d="M-26,0 h52 l-8,14 h-36 z" fill={C.accent} />
        <rect x={-12} y={-14} width={24} height={14} rx={3} fill={C.accent} opacity={0.75} />
      </g>

      <Pin x={300} y={96} name="Algeciras" anchor="end" dy={-16} />
      <Pin x={445} y={300} name="Ceuta" highlight dy={20} />
      <Pin x={190} y={112} name="Tarifa" anchor="end" dy={4} />
      <Pin x={620} y={104} name={es ? "Málaga · a 2 h por carretera" : "Malaga · 2 h by road"} anchor="end" dy={-14} />

      <g>
        <rect x={496} y={150} width={272} height={112} rx={12} fill={C.night} opacity={0.75} />
        <Label x={514} y={176} size={14} weight={700} color={C.text}>
          {es ? "La travesía" : "The crossing"}
        </Label>
        <Label x={514} y={200} size={13}>
          {es ? "Unos 14 km de mar abierto" : "About 14 km of open sea"}
        </Label>
        <Label x={514} y={220} size={13}>
          {es ? "Ferry convencional o rápido" : "Conventional or fast ferry"}
        </Label>
        <Label x={514} y={240} size={13}>
          {es ? "Es frontera: llévate el DNI" : "It is a border: bring your ID"}
        </Label>
      </g>

      <Label x={30} y={44} size={13} color={C.muted}>
        {es ? "Península" : "Spanish mainland"}
      </Label>
      <Label x={30} y={384} size={13} color={C.muted}>
        {es ? "Norte de África" : "North Africa"}
      </Label>
      <Disclaimer y={368} text={es ? "Horarios y navieras cambian: consúltalos antes" : "Timetables and operators change: check before travelling"} />
    </Canvas>
  );
}

/** Las cuatro culturas, que es la seña de identidad de la ciudad. */
export function FourCultures({ locale }: ArtProps) {
  const es = locale === "es";
  const items = es
    ? ["cristiana", "musulmana", "hebrea", "hindú"]
    : ["Christian", "Muslim", "Jewish", "Hindu"];

  return (
    <Canvas
      height={380}
      label={es ? "Motivo de las cuatro culturas de Ceuta bajo el eclipse" : "A motif of Ceuta's four cultures beneath the eclipse"}
      defs={<SkyGradient id="fc-sky" />}
    >
      <rect width="800" height="380" fill="url(#fc-sky)" />
      <EclipsedSun cx={400} cy={92} r={34} />

      {items.map((label, i) => {
        const x = 130 + i * 180;
        return (
          <g key={label}>
            <rect x={x - 62} y={196} width={124} height={128} rx={8} fill={C.surface} stroke={C.border} />
            {/* Cada silueta es un arco distinto: de medio punto, de herradura, apuntado y lobulado */}
            {i === 0 && <path d="M0,0" fill="none" />}
            <g transform={`translate(${x},196)`}>
              {i === 0 && <path d="M-34,128 V44 A34,34 0 0 1 34,44 V128 Z" fill={C.accent} opacity={0.22} />}
              {i === 1 && (
                <path d="M-32,128 V52 A34,38 0 0 1 32,52 V128 h-12 V56 A22,26 0 0 0 -20,56 V128 Z" fill={C.accent} opacity={0.22} />
              )}
              {i === 2 && <path d="M-32,128 V60 L0,20 L32,60 V128 Z" fill={C.accent} opacity={0.22} />}
              {i === 3 && (
                <path d="M-34,128 V56 A18,18 0 0 1 -6,42 A18,18 0 0 1 12,30 A20,20 0 0 1 34,56 V128 Z" fill={C.accent} opacity={0.22} />
              )}
              <circle cx={0} cy={96} r={5} fill={C.accent} opacity={0.5} />
            </g>
            <Label x={x} y={348} anchor="middle" size={14} weight={600} color={C.text}>
              {label}
            </Label>
          </g>
        );
      })}

      <Label x={400} y={168} anchor="middle" size={15} color={C.muted}>
        {es
          ? "Cuatro comunidades en 19 km², y sus calendarios conviviendo el mismo día"
          : "Four communities in 19 km², their calendars sharing the same day"}
      </Label>
    </Canvas>
  );
}

/** La mesa: lo que se come en Ceuta y de dónde viene cada cosa. */
export function Gastronomy({ locale }: ArtProps) {
  const es = locale === "es";
  const dishes = es
    ? [
        { t: "pescaíto del Estrecho", d: "voraz, urta, atún" },
        { t: "pinchitos", d: "especiados, a la brasa" },
        { t: "té con hierbabuena", d: "muy dulce, muy caliente" },
        { t: "dulces de almendra", d: "de las cuatro cocinas" },
      ]
    : [
        { t: "fish from the Strait", d: "voraz, urta, tuna" },
        { t: "pinchitos", d: "spiced, off the grill" },
        { t: "mint tea", d: "very sweet, very hot" },
        { t: "almond pastries", d: "from all four kitchens" },
      ];

  return (
    <Canvas
      height={400}
      label={es ? "Cuatro platos representativos de la cocina de Ceuta" : "Four dishes that represent the cooking of Ceuta"}
    >
      <rect width="800" height="400" fill={C.night} />
      <rect x="0" y="0" width="800" height="400" fill={C.accent} opacity={0.04} />

      {dishes.map((dish, i) => {
        const x = 100 + (i % 2) * 400;
        const y = 110 + Math.floor(i / 2) * 172;
        return (
          <g key={dish.t}>
            {/* Plato */}
            <circle cx={x} cy={y} r={58} fill={C.surface} stroke={C.border} strokeWidth={1.5} />
            <circle cx={x} cy={y} r={44} fill="none" stroke={C.border} strokeWidth={1} />
            {i === 0 && (
              <g>
                <path d={`M${x - 30},${y} C${x - 14},${y - 22} ${x + 14},${y - 22} ${x + 28},${y} C${x + 14},${y + 22} ${x - 14},${y + 22} ${x - 30},${y} Z`} fill={C.accent} opacity={0.55} />
                <path d={`M${x + 28},${y} l14,-11 v22 z`} fill={C.accent} opacity={0.55} />
                <circle cx={x - 16} cy={y - 5} r={3} fill={C.night} />
              </g>
            )}
            {i === 1 && (
              <g>
                <line x1={x - 34} y1={y + 16} x2={x + 34} y2={y - 16} stroke={C.muted} strokeWidth={2.5} />
                {[-20, 0, 20].map((o) => (
                  <rect key={o} x={x + o - 9} y={y - o * 0.5 - 9} width={18} height={18} rx={4} fill={C.accent} opacity={0.6} />
                ))}
              </g>
            )}
            {i === 2 && (
              <g>
                <path d={`M${x - 18},${y - 26} h36 l-6,52 h-24 z`} fill={C.accent} opacity={0.3} />
                <path d={`M${x - 15},${y - 4} h30 l-4,30 h-22 z`} fill={C.accent} opacity={0.6} />
                <path d={`M${x},${y - 34} c-8,-10 4,-16 0,-22 c10,8 6,16 0,22 z`} fill={C.muted} opacity={0.7} />
              </g>
            )}
            {i === 3 && (
              <g>
                {[[-22, -8], [4, -14], [-6, 14], [22, 6]].map(([dx, dy], k) => (
                  <path
                    key={k}
                    d={`M${x + dx},${y + dy - 12} l12,10 l-12,10 l-12,-10 z`}
                    fill={C.accent}
                    opacity={0.45 + k * 0.08}
                  />
                ))}
              </g>
            )}
            <Label x={x + 82} y={y - 4} size={15} weight={700} color={C.text}>
              {dish.t}
            </Label>
            <Label x={x + 82} y={y + 18} size={13}>
              {dish.d}
            </Label>
          </g>
        );
      })}

      <Label x={400} y={38} anchor="middle" size={16} weight={700} color={C.text}>
        {es ? "Cuatro cocinas en la misma mesa" : "Four kitchens at the same table"}
      </Label>
    </Canvas>
  );
}

/** El día del eclipse, hora a hora. */
export function DayPlan({ city, locale }: ArtProps) {
  const es = locale === "es";
  const hm = (t: string | null) => (t ? t.slice(0, 5) : "—");
  const steps = es
    ? [
        { t: "08:00", d: "Desayuna en casa y sal con el depósito lleno" },
        { t: "09:00", d: "En el punto elegido, con sombra, agua y sitio" },
        { t: hm(city.localTimes.partialStart), d: "Primer mordisco a la derecha del disco. Filtro puesto" },
        { t: hm(city.localTimes.totalityStart), d: "Filtro fuera. Mira la corona, el horizonte, la gente" },
        { t: hm(city.localTimes.totalityEnd), d: "Primer destello: filtro puesto otra vez, sin dudar" },
        { t: hm(city.localTimes.partialEnd), d: "Termina el parcial. Ahora empieza el atasco: espera" },
      ]
    : [
        { t: "08:00", d: "Breakfast at home, leave with a full tank" },
        { t: "09:00", d: "At your chosen spot, with shade, water and room" },
        { t: hm(city.localTimes.partialStart), d: "First bite out of the disc. Filters on" },
        { t: hm(city.localTimes.totalityStart), d: "Filters off. Watch the corona, the horizon, the people" },
        { t: hm(city.localTimes.totalityEnd), d: "First flash of Sun: filters straight back on" },
        { t: hm(city.localTimes.partialEnd), d: "Partial ends. Now the traffic starts: wait it out" },
      ];

  const top = 78;
  const rowH = 52;

  return (
    <Canvas
      height={top + steps.length * rowH + 30}
      label={es ? `Plan hora a hora del día del eclipse en ${city.name}` : `Hour-by-hour plan for eclipse day in ${city.nameEn ?? city.name}`}
    >
      <Label x={30} y={44} size={17} weight={800} color={C.text}>
        {es ? "El 2 de agosto de 2027, hora a hora" : "2 August 2027, hour by hour"}
      </Label>
      <line x1={116} y1={top - 6} x2={116} y2={top + steps.length * rowH - 26} stroke={C.border} strokeWidth={2} />

      {steps.map((s, i) => {
        const y = top + i * rowH;
        const key = i >= 3 && i <= 4;
        return (
          <g key={`${s.t}-${i}`}>
            <Label x={98} y={y + 6} anchor="end" size={16} weight={800} color={key ? C.accent : C.text}>
              {s.t}
            </Label>
            <circle cx={116} cy={y} r={key ? 8 : 5.5} fill={key ? C.accent : C.muted} />
            <Label x={140} y={y + 6} size={14} color={key ? C.text : C.muted} weight={key ? 600 : 400}>
              {s.d}
            </Label>
          </g>
        );
      })}
    </Canvas>
  );
}
