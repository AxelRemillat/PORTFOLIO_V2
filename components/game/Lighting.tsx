"use client";

export function Lighting() {
  return (
    <>
      {/* Ambient — garantit qu'aucune face n'est dans le noir complet */}
      <ambientLight intensity={1.5} color="#99aabb" />
      {/* Soleil — côté +X/+Z, lumière principale chaude */}
      <directionalLight position={[35, 18, 28]}  intensity={2.8} color="#ffe060" />
      <pointLight       position={[22, 10, 16]}  intensity={1.4} color="#ffcc44" distance={70} decay={1.4} />
      {/* Lune — côté −X/−Z, lumière froide */}
      <directionalLight position={[-28, 6, -22]} intensity={1.2} color="#7799dd" />
      <pointLight       position={[-16, 4, -13]} intensity={0.7} color="#5566bb" distance={55} decay={1.4} />
      {/* Fill sous la planète */}
      <directionalLight position={[0, -14, 0]}   intensity={0.8} color="#aabbcc" />
    </>
  );
}
