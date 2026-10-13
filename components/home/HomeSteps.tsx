import SectionLabel from "@/components/parcours/SectionLabel";
import { section, h2, card, grid } from "./homeStyles";
import { getLocale } from "@/lib/i18n/server";
import { homeCopy } from "./copy";

// « Comment ça marche » : 4 étapes, du premier échange au suivi (textes : home-copy).
export default async function HomeSteps() {
  const c = homeCopy(await getLocale()).steps;
  const STEPS = c.items;
  return (
    <section id="methode" style={section()}>
      <div className="rv">
        <SectionLabel>{c.label}</SectionLabel>
        <h2 style={{ ...h2, marginBottom: "2rem" }}>{c.title}</h2>
      </div>
      <ol style={{ ...grid(230), listStyle: "none", padding: 0, margin: 0 }}>
        {STEPS.map((s, i) => (
          <li key={s.t} style={card}>
            <span className="font-mono" style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fb923c" }}>{c.step(i + 1)}</span>
            <h3 style={{ margin: "0.5rem 0 0.4rem", fontSize: "1.05rem", fontWeight: 800, color: "#fff" }}>{s.t}</h3>
            <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.55, color: "#b6b6c8" }}>{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
