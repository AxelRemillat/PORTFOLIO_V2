"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import SectionLabel from "./SectionLabel";
import { HORS_ECRAN, type HorsEcranItem } from "./hors-ecran-data";

// Grain léger (feTurbulence inline) posé sur les photos pour homogénéiser.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

function Card({ item }: { item: HorsEcranItem }) {
  // true tant que la photo n'a pas échoué : si le fichier n'existe pas,
  // onError bascule sur le fallback gradient. Le composant marche sans photo.
  const [hasPhoto, setHasPhoto] = useState(true);

  return (
    <div className="he-card">
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 10",
          borderRadius: 10,
          overflow: "hidden",
          background: item.grad,
          marginBottom: "1rem",
        }}
      >
        {hasPhoto && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/parcours/photos/${item.slug}.jpg`}
              alt={item.title}
              onError={() => setHasPhoto(false)}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Overlay sombre + grain : homogénéise des photos hétérogènes */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to top, rgba(8,8,16,0.55), rgba(8,8,16,0.1)), ${GRAIN}`,
                backgroundBlendMode: "normal, overlay",
                opacity: 0.9,
                pointerEvents: "none",
              }}
            />
          </>
        )}
        <span aria-hidden style={{ position: "absolute", left: 12, bottom: 8, fontSize: "1.6rem" }}>
          {item.emoji}
        </span>
      </div>
      <p style={{ margin: "0 0 0.4rem", fontWeight: 700, fontSize: "1rem", color: "var(--color-text)" }}>
        {item.title}
      </p>
      <p style={{ margin: 0, fontSize: "0.875rem", lineHeight: 1.6, color: "#94a3b8" }}>{item.text}</p>
    </div>
  );
}

export default function HorsEcranSection() {
  return (
    <section style={{ padding: "12vh 6vw", maxWidth: "1100px", margin: "0 auto" }}>
      <ScrollReveal>
        <SectionLabel>05 // HORS ÉCRAN</SectionLabel>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text)", margin: "0 0 2.5rem" }}>
          Ce qui ne rentre pas dans un CV
        </h2>
      </ScrollReveal>

      <div className="he-grid">
        {HORS_ECRAN.map((item, i) => (
          <ScrollReveal key={item.slug} delay={(i % 3) * 0.08}>
            <Card item={item} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
