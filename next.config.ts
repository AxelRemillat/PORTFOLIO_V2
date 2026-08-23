import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
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
