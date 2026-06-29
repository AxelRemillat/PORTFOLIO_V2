import Link from "next/link";

export const metadata = {
  title: "RISE — Plateforme de mobilité internationale",
  description:
    "Le site RISE : plateforme EdTech qui accompagne les étudiants dans leur mobilité internationale.",
};

// Le site RISE (app Vite/React indépendante) est buildé en statique dans
// public/rise-app et servi ici en plein écran via une iframe. Le portail RISE
// du jeu 3D (router.push("/projets/rise")) et la modal de la page projets
// (ctaUrl: "/projets/rise") pointent tous les deux ici.
export default function RiseSitePage() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "#ffffff" }}>
      <iframe
        src="/rise-app/index.html"
        title="Site RISE"
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        allow="fullscreen; geolocation"
      />

      {/* Bouton retour au portfolio, en surimpression */}
      <Link
        href="/projets"
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
        ← Retour au portfolio
      </Link>
    </div>
  );
}
