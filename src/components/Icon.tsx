import type { MobileDestination } from "@/i18n/navigation";

/*
  Iconos.

  Se dibujan a mano y en línea por la misma razón que las ilustraciones del blog:
  heredan `currentColor`, así que se tiñen solos con el acento del tenant, y no
  añaden ni una petición de red ni una dependencia que auditar.
*/
export function Icon({ name, className = "h-5 w-5" }: { name: MobileDestination["icon"]; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }
  if (name === "pin") {
    return (
      <svg {...common}>
        <path d="M12 21s7-5.4 7-10.5A7 7 0 0 0 5 10.5C5 15.6 12 21 12 21Z" />
        <circle cx="12" cy="10.5" r="2.5" />
      </svg>
    );
  }
  if (name === "camera") {
    return (
      <svg {...common}>
        <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.2-2h8.2l1.2 2h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5Z" />
        <circle cx="12" cy="13" r="3.2" />
      </svg>
    );
  }
  if (name === "book") {
    return (
      <svg {...common}>
        <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2.5 2.5 0 0 1 2 1 2.5 2.5 0 0 1 2-1h4.5A1.5 1.5 0 0 1 20 5.5v12a1.5 1.5 0 0 1-1.5 1.5H14a2.5 2.5 0 0 0-2 1 2.5 2.5 0 0 0-2-1H5.5A1.5 1.5 0 0 1 4 17.5Z" />
        <path d="M12 5v14" />
      </svg>
    );
  }
  if (name === "pen") {
    return (
      <svg {...common}>
        <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17Z" />
        <path d="M15 6.5 17.5 9" />
      </svg>
    );
  }
  if (name === "tag") {
    return (
      <svg {...common}>
        <path d="M4 11V5a1 1 0 0 1 1-1h6l8 8-7 7-8-8Z" />
        <circle cx="8.5" cy="8.5" r="1.2" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

/** El disco del eclipse. Es la marca, y late muy despacio. */
export function EclipseMark() {
  return (
    <span
      className="corona inline-block h-5 w-5 shrink-0 rounded-full"
      style={{ background: "hsl(var(--accent))" }}
      aria-hidden="true"
    />
  );
}

