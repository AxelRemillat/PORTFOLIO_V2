import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // CSS inliné dans le <head> : supprime la requête bloquante au premier affichage.
  // Les visiteurs arrivent surtout d'un mail de prospection (première visite).
  experimental: {
    inlineCss: true,
  },
  async redirects() {
    return [
      // Renommage /preuves → /projets (308 permanent), slug conservé
      { source: "/preuves", destination: "/projets", permanent: true },
      { source: "/preuves/:slug*", destination: "/projets/:slug*", permanent: true },
      // /game supprimé → retour à l'accueil
      { source: "/game", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
