"use client";

export function Lighting() {
  return (
    <>
      {/* Ambient de base — plancher lumineux pour que rien ne soit jamais noir */}
      <ambientLight color="#5a567e" intensity={1.3} />

      {/* Hemisphere — enveloppe TOUTE la sphère (ciel au-dessus, sol en-dessous).
          C'est elle qui rend la planète lisible partout, y compris la face
          opposée au soleil et le dessous où les directionnelles n'arrivent pas. */}
      <hemisphereLight color="#cac8da" groundColor="#6e5a74" intensity={1.7} />

      {/* Fill froid côté opposé au soleil — adoucit les zones mortes */}
      <directionalLight color="#3a4a8a" intensity={0.8} position={[-20, 5, 0]} />
    </>
  );
}
