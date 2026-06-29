import RiseDetail from "@/components/projects/RiseDetail";

export const metadata = {
  title: "RISE — Plateforme de mobilité internationale étudiante",
  description:
    "RISE : startup EdTech B2B 3× primée. Tractions, prix, histoire du projet et stack technique. Site live accessible.",
};

// Fiche projet RISE (tractions/prix → histoire → stack & chiffres clés).
// Le site RISE live est servi en iframe sous /projets/rise/site ; la modal de la
// page projets pointe ici, le portail RISE du jeu 3D pointe vers /projets/rise/site.
export default function RisePage() {
  return <RiseDetail />;
}
