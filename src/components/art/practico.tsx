import { C, Canvas, Label, type ArtProps } from "./primitives";

/**
 * Qué mirar en unas gafas de eclipse, y qué no sirve.
 *
 * La ilustración da el mismo consejo que daría si no vendiéramos nada, que es la
 * regla del proyecto: la marca ISO sola no basta en la UE, hace falta el CE con
 * certificado de examen UE de tipo detrás.
 */
export function GlassesMarks({ locale }: ArtProps) {
  const es = locale === "es";
  return (
    <Canvas
      height={420}
      label={es ? "Marcas que deben llevar unas gafas de eclipse y filtros que no sirven" : "Markings that eclipse glasses must carry, and filters that do not work"}
    >
      <rect width="800" height="420" fill={C.night} />

      {/* Gafas certificadas */}
      <g>
        <Label x={40} y={44} size={16} weight={800} color={C.accent}>
          {es ? "Sí sirven" : "These work"}
        </Label>
        <rect x={40} y={70} width={330} height={150} rx={14} fill={C.surface} stroke={C.accent} strokeWidth={2} />
        <rect x={70} y={112} width={110} height={66} rx={8} fill={C.night} stroke={C.border} />
        <rect x={230} y={112} width={110} height={66} rx={8} fill={C.night} stroke={C.border} />
        <path d="M40,132 h-24 M370,132 h24" stroke={C.border} strokeWidth={4} strokeLinecap="round" />
        <Label x={205} y={98} anchor="middle" size={13} weight={700} color={C.text}>
          {es ? "marcado en la propia montura" : "printed on the frame itself"}
        </Label>
        <Label x={205} y={202} anchor="middle" size={13} weight={800} color={C.accent}>
          CE · EN ISO 12312-2
        </Label>

        {[
          es ? "«CE» con el número del organismo notificado" : "“CE” with the notified body's number",
          es ? "«EN ISO 12312-2» o «ISO 12312-2:2015»" : "“EN ISO 12312-2” or “ISO 12312-2:2015”",
          es ? "Nombre y dirección del fabricante" : "Manufacturer's name and address",
          es ? "Sin arañazos, agujeros ni pliegues" : "No scratches, pinholes or creases",
        ].map((t, i) => (
          <g key={t}>
            <circle cx={54} cy={252 + i * 32} r={7} fill={C.accent} opacity={0.25} />
            <path
              d={`M${50},${252 + i * 32} l3,4 l6,-8`}
              stroke={C.accent}
              strokeWidth={2.2}
              fill="none"
              strokeLinecap="round"
            />
            <Label x={72} y={257 + i * 32} size={13.5}>
              {t}
            </Label>
          </g>
        ))}
      </g>

      {/* Lo que no sirve */}
      <g>
        <Label x={430} y={44} size={16} weight={800} color="#ff8a7a">
          {es ? "No sirven, nunca" : "Never safe"}
        </Label>
        {[
          es ? "Gafas de sol, aunque sean muy oscuras" : "Sunglasses, however dark",
          es ? "Varias gafas de sol superpuestas" : "Several pairs of sunglasses stacked",
          es ? "Negativos, radiografías, CD, cristal ahumado" : "Negatives, X-rays, CDs, smoked glass",
          es ? "Filtros de cámara puestos delante del ojo" : "Camera filters held up to the eye",
          es ? "El móvil como pantalla para mirar el Sol" : "Using a phone screen to look at the Sun",
          es ? "Gafas que solo dicen «ISO certified» y nada más" : "Glasses that only say “ISO certified” and nothing else",
        ].map((t, i) => (
          <g key={t}>
            <circle cx={444} cy={84 + i * 34} r={8} fill="#ff8a7a" opacity={0.18} />
            <path
              d={`M${440},${80 + i * 34} l8,8 m0,-8 l-8,8`}
              stroke="#ff8a7a"
              strokeWidth={2.2}
              strokeLinecap="round"
            />
            <Label x={464} y={89 + i * 34} size={13.5}>
              {t}
            </Label>
          </g>
        ))}

        <rect x={430} y={296} width={338} height={92} rx={12} fill={C.surface} stroke={C.border} />
        <Label x={448} y={322} size={13.5} weight={700} color={C.text}>
          {es ? "La trampa más común" : "The most common trap"}
        </Label>
        <Label x={448} y={344} size={12.5}>
          {es ? "«ISO 12312-2 certified» impreso en la caja no es" : "“ISO 12312-2 certified” printed on the box is not"}
        </Label>
        <Label x={448} y={362} size={12.5}>
          {es ? "un certificado. En la UE hace falta el CE con un" : "a certificate. In the EU you need the CE mark backed"}
        </Label>
        <Label x={448} y={380} size={12.5}>
          {es ? "examen UE de tipo detrás." : "by an EU type-examination certificate."}
        </Label>
      </g>
    </Canvas>
  );
}

/** Proyección indirecta: la forma segura de que lo vean los niños. */
export function Pinhole({ locale }: ArtProps) {
  const es = locale === "es";
  return (
    <Canvas
      height={400}
      label={es ? "Cómo proyectar el eclipse con un colador o una caja de zapatos" : "How to project the eclipse with a colander or a shoebox"}
    >
      <rect width="800" height="400" fill={C.night} />
      <Label x={400} y={40} anchor="middle" size={16} weight={700} color={C.text}>
        {es ? "Sin mirar al Sol: proyéctalo" : "Without looking at the Sun: project it"}
      </Label>

      {/* Colador */}
      <g>
        <Label x={200} y={80} anchor="middle" size={14} weight={700} color={C.accent}>
          {es ? "Con un colador" : "With a colander"}
        </Label>
        <path d="M132,132 a68,44 0 0 0 136,0 z" fill={C.surface} stroke={C.border} strokeWidth={1.6} />
        <ellipse cx={200} cy={132} rx={68} ry={16} fill={C.landHi} />
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} cx={148 + (i % 7) * 17} cy={148 + Math.floor(i / 7) * 16} r={2.4} fill={C.night} />
        ))}
        {/* Haces */}
        {Array.from({ length: 7 }, (_, i) => (
          <line
            key={i}
            x1={148 + i * 17}
            y1={152}
            x2={140 + i * 20}
            y2={268}
            stroke={C.accent}
            strokeWidth={1}
            opacity={0.22}
          />
        ))}
        {/* Suelo con crecientes */}
        <rect x={96} y={268} width={208} height={82} rx={8} fill={C.surface} stroke={C.border} />
        {Array.from({ length: 10 }, (_, i) => {
          const cx = 124 + (i % 5) * 40;
          const cy = 292 + Math.floor(i / 5) * 34;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={11} fill={C.accent} opacity={0.75} />
              <circle cx={cx - 7} cy={cy - 3} r={10} fill={C.surface} />
            </g>
          );
        })}
        <Label x={200} y={372} anchor="middle" size={12.5}>
          {es ? "cada agujero proyecta el Sol mordido" : "each hole projects the bitten Sun"}
        </Label>
      </g>

      {/* Caja de zapatos */}
      <g>
        <Label x={580} y={80} anchor="middle" size={14} weight={700} color={C.accent}>
          {es ? "Con una caja de zapatos" : "With a shoebox"}
        </Label>
        <path d="M452,152 l248,-38 l52,34 l-248,40 z" fill={C.landHi} opacity={0.8} />
        <path d="M452,152 v122 l52,34 V188 z" fill={C.surface} stroke={C.border} />
        <path d="M504,188 l248,-40 v122 l-248,42 z" fill={C.land} stroke={C.border} />
        {/* Agujero de entrada */}
        <circle cx={478} cy={196} r={5} fill={C.accent} />
        <Label x={442} y={214} anchor="end" size={12}>
          {es ? "agujero" : "pinhole"}
        </Label>
        {/* Pantalla interior con el Sol proyectado */}
        <line x1={478} y1={196} x2={700} y2={268} stroke={C.accent} strokeWidth={1} opacity={0.4} />
        <g>
          <circle cx={700} cy={268} r={14} fill={C.accent} opacity={0.8} />
          <circle cx={692} cy={262} r={13} fill={C.land} />
        </g>
        <Label x={700} y={306} anchor="middle" size={12}>
          {es ? "mirilla al lado" : "viewing slot beside it"}
        </Label>
        <Label x={580} y={372} anchor="middle" size={12.5}>
          {es ? "se mira dentro de la caja, nunca al Sol" : "you look inside the box, never at the Sun"}
        </Label>
      </g>
    </Canvas>
  );
}

/** Ajustes de cámara: parcial con filtro y totalidad sin él. */
export function CameraSettings({ locale }: ArtProps) {
  const es = locale === "es";
  const cols = es
    ? [
        {
          t: "Fase parcial",
          badge: "CON filtro solar",
          rows: [
            ["Filtro", "Solar, delante del objetivo"],
            ["ISO", "100"],
            ["Diafragma", "f/8"],
            ["Velocidad", "1/500 – 1/2000 s"],
            ["Enfoque", "Manual, al infinito"],
          ],
        },
        {
          t: "Totalidad",
          badge: "SIN filtro, solo aquí",
          rows: [
            ["Filtro", "Fuera, en cuanto empiece C2"],
            ["ISO", "400 – 800"],
            ["Diafragma", "f/5,6 – f/8"],
            ["Velocidad", "Horquilla: 1/1000 a 1 s"],
            ["Enfoque", "No lo toques"],
          ],
        },
      ]
    : [
        {
          t: "Partial phase",
          badge: "WITH a solar filter",
          rows: [
            ["Filter", "Solar, over the lens"],
            ["ISO", "100"],
            ["Aperture", "f/8"],
            ["Shutter", "1/500 – 1/2000 s"],
            ["Focus", "Manual, at infinity"],
          ],
        },
        {
          t: "Totality",
          badge: "NO filter, here only",
          rows: [
            ["Filter", "Off, as soon as C2 starts"],
            ["ISO", "400 – 800"],
            ["Aperture", "f/5.6 – f/8"],
            ["Shutter", "Bracket: 1/1000 to 1 s"],
            ["Focus", "Do not touch it"],
          ],
        },
      ];

  return (
    <Canvas
      height={400}
      label={es ? "Ajustes de cámara para la fase parcial y para la totalidad" : "Camera settings for the partial phase and for totality"}
    >
      <rect width="800" height="400" fill={C.night} />
      <Label x={400} y={38} anchor="middle" size={16} weight={700} color={C.text}>
        {es ? "Dos ajustes distintos, y un cambio a media faena" : "Two different setups, and one change mid-event"}
      </Label>

      {cols.map((col, i) => {
        const x = 30 + i * 388;
        return (
          <g key={col.t}>
            <rect x={x} y={66} width={352} height={296} rx={14} fill={C.surface} stroke={i === 1 ? C.accent : C.border} strokeWidth={i === 1 ? 2 : 1} />
            <Label x={x + 22} y={100} size={16} weight={800} color={C.text}>
              {col.t}
            </Label>
            <rect x={x + 22} y={112} width={200} height={26} rx={13} fill={i === 1 ? C.accent : C.border} opacity={i === 1 ? 0.22 : 0.5} />
            <Label x={x + 34} y={130} size={12.5} weight={700} color={i === 1 ? C.accent : C.muted}>
              {col.badge}
            </Label>
            {col.rows.map((row, k) => (
              <g key={row[0]}>
                <line x1={x + 22} y1={158 + k * 40} x2={x + 330} y2={158 + k * 40} stroke={C.border} strokeWidth={1} />
                <Label x={x + 22} y={180 + k * 40} size={13}>
                  {row[0]}
                </Label>
                <Label x={x + 330} y={180 + k * 40} anchor="end" size={13.5} weight={600} color={C.text}>
                  {row[1]}
                </Label>
              </g>
            ))}
          </g>
        );
      })}

      <Label x={400} y={386} anchor="middle" size={12.5}>
        {es
          ? "Punto de partida, no dogma: prueba en casa con la Luna antes del día del eclipse"
          : "A starting point, not gospel: rehearse on the Moon at home before eclipse day"}
      </Label>
    </Canvas>
  );
}
