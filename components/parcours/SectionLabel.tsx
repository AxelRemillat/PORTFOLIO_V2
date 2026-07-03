// Label HUD mono numéroté au-dessus des titres de section ("01 // MANIFESTO").
// Même famille visuelle que les labels de /demos.
export default function SectionLabel({ children }: { children: string }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: "var(--color-orange)",
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        margin: "0 0 0.75rem",
      }}
    >
      {children}
    </p>
  );
}
