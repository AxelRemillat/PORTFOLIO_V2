import Link from "next/link";

export const metadata = {
  title: "RISE — Site live",
  description:
    "Le site RISE en plein écran : plateforme EdTech de mobilité internationale étudiante.",
};

// Le site RISE (app Vite/React indépendante) est buildé en statique dans
// public/rise-app et servi ici en plein écran via une iframe.
// La fiche projet (/projets/rise) et le portail RISE du jeu 3D pointent ici
// pour l'expérience live.
export default function RiseLiveSitePage() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "#ffffff" }}>
      <iframe
        src="/rise-app/index.html"
        title="Site RISE"
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        allow="fullscreen; geolocation"
      />

      {/* Bouton retour à la fiche projet, en surimpression */}
      <Link
        href="/projets/rise"
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 10,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(8,6,25,0.82)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 999,
          padding: "8px 16px",
          color: "#fff",
          fontSize: 13,
          fontFamily: "system-ui, sans-serif",
          textDecoration: "none",
          backdropFilter: "blur(8px)",
        }}
      >
        ← Retour à la fiche RISE
      </Link>
    </div>
  );
}
