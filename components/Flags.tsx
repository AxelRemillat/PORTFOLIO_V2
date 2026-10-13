// Drapeaux du sélecteur de langue, en SVG INLINE : pas d'emoji (Windows affiche
// « FR » en lettres au lieu du drapeau), pas d'image externe, aucune dépendance.
// 18 × 12 px, coins légèrement arrondis par le conteneur (`frame`). Décoratifs :
// le lien porte déjà le nom de la langue (aria-hidden ici).

const box = { width: 18, height: 12, display: "block" } as const;
// Coins légèrement arrondis, liseré discret : le blanc du drapeau reste lisible sur fond sombre.
const frame = {
  display: "inline-block", width: 18, height: 12, flexShrink: 0,
  borderRadius: 2, overflow: "hidden", boxShadow: "0 0 0 1px rgba(255,255,255,0.18)",
} as const;

export function FlagFr() {
  return (
    <span className="nv-flag" style={frame} aria-hidden>
      <svg viewBox="0 0 3 2" style={box} preserveAspectRatio="none" focusable="false">
        <rect width="1" height="2" x="0" fill="#0055A4" />
        <rect width="1" height="2" x="1" fill="#FFFFFF" />
        <rect width="1" height="2" x="2" fill="#EF4135" />
      </svg>
    </span>
  );
}

// Union Jack simplifié, lisible à 18 px : fond bleu, sautoirs blanc et rouge,
// croix de Saint-Georges blanche bordant une croix rouge.
export function FlagGb() {
  return (
    <span className="nv-flag" style={frame} aria-hidden>
      <svg viewBox="0 0 60 40" style={box} preserveAspectRatio="none" focusable="false">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFFFFF" strokeWidth="8" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="3" />
        <path d="M30,0 V40 M0,20 H60" stroke="#FFFFFF" strokeWidth="12" />
        <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="7" />
      </svg>
    </span>
  );
}
