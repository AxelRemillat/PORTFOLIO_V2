"use client";

// Rendu de sortie temporaire (démos 2–5, tant qu'elles n'ont pas leur renderResult
// dédié) : affiche le JSON du result de façon lisible.
export default function GenericResult({ result }: { result: unknown }) {
  return (
    <>
      <p className="wc-res-lbl">Résultat (brut)</p>
      <pre className="wc-res-json">{JSON.stringify(result, null, 2)}</pre>
    </>
  );
}
