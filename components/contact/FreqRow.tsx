import type { CSSProperties } from "react";

interface FreqRowProps {
  num: string;
  type: string;
  value: string;
  href?: string;
  /** Étiquette du clic sortant (docs/tracking.md) : « linkedin », « github »… */
  cible?: string;
  download?: boolean;
  badge?: string;
}

const numStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  color: "#444466",
  width: 24,
  flexShrink: 0,
};
const typeStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 13,
  color: "#94a3b8",
  textTransform: "uppercase",
  width: 110,
  flexShrink: 0,
};
const badgeStyle: CSSProperties = {
  border: "1px solid #2a2a42",
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  color: "#94a3b8",
  padding: "2px 6px",
  borderRadius: 3,
  flexShrink: 0,
};

// Une ligne de coordonnée style "fréquence" numérotée. <a> si href, sinon <div>.
export default function FreqRow({ num, type, value, href, download, badge, cible }: FreqRowProps) {
  const isExternal = href?.startsWith("http");
  const inner = (
    <>
      <span style={numStyle}>{num}</span>
      <span style={typeStyle}>{type}</span>
      <span className="freq-value" style={{ flex: 1, fontSize: 19, fontWeight: 600 }}>
        {value}
      </span>
      {badge && <span style={badgeStyle}>{badge}</span>}
      <span className="freq-arrow" style={{ fontSize: 18 }}>
        {download ? "↓" : "↗"}
      </span>
    </>
  );

  if (!href) {
    return (
      <div className="freq-row" style={{ width: "100%" }}>
        {inner}
      </div>
    );
  }

  return (
    <a
      className="freq-row"
      href={href}
      style={{ width: "100%" }}
      {...(download ? { download: true } : {})}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(cible ? { "data-ax-event": "sortie", "data-ax-cible": cible } : {})}
    >
      {inner}
    </a>
  );
}
