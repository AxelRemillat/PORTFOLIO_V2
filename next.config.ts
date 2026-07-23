import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      // Migration /projets → /preuves (308 permanent)
      { source: "/projets", destination: "/preuves", permanent: true },
      // :slug* capture aussi les anciennes sous-pages (ex. /projets/rise/site)
      { source: "/projets/:slug*", destination: "/preuves", permanent: true },
      // /game supprimé → retour à l'accueil
      { source: "/game", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
