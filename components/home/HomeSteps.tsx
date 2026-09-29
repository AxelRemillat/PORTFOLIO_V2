import SectionLabel from "@/components/parcours/SectionLabel";
import { section, h2, card, grid } from "./homeStyles";

// « Comment ça marche » : 4 étapes, du premier échange au suivi.
const STEPS = [
  { t: "Échange de 15 min", d: "Vous me décrivez la tâche qui vous fait perdre du temps. Gratuit, sans engagement." },
  { t: "Prototype sur vos données", d: "Je le teste sur vos vrais exemples : vous jugez le résultat avant de vous engager." },
  { t: "Mise en place en 2 à 3 semaines", d: "Branché sur vos outils, testé avec vous, expliqué à votre équipe." },
  { t: "Suivi", d: "Je surveille, je corrige et je fais évoluer. Sans engagement, arrêt possible chaque mois." },
];

export default function HomeSteps() {
  return (
    <section id="methode" style={section()}>
      <div className="rv">
        <SectionLabel>03 // COMMENT ÇA MARCHE</SectionLabel>
        <h2 style={{ ...h2, marginBottom: "2rem" }}>Comment ça marche</h2>
      </div>
      <ol style={{ ...grid(230), listStyle: "none", padding: 0, margin: 0 }}>
        {STEPS.map((s, i) => (
          <li key={s.t} style={card}>
            <span className="font-mono" style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fb923c" }}>{`Étape ${i + 1}`}</span>
            <h3 style={{ margin: "0.5rem 0 0.4rem", fontSize: "1.05rem", fontWeight: 800, color: "#fff" }}>{s.t}</h3>
            <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.55, color: "#b6b6c8" }}>{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
