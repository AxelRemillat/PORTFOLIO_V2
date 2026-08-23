// Données des 3 projets affichés sur /projets.
// Repurposé depuis l'ancien projects-data : ne reste que ce qui tourne vraiment
// (VEGA en prod) ou se déploie en ce moment (N8N, infra self-hosted).

export type PreuveModel = "robot" | "drone" | "satellite";
export type PreuveState = "live" | "wip" | "building";

export interface CtaLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;        // accroche courte affichée sur la card
  badge: string;          // libellé du badge de statut
  state: PreuveState;     // pilote la pastille (vert / ambre / bleu)
  model: PreuveModel;     // canvas 3D réutilisé depuis components/projects
  accent: string;         // couleur d'accent
  cardBg: string;         // dégradé de fond de la card
  glow: string;           // nom d'animation de halo (breathe…)
  stack: string[];
  demoUrl?: string;       // cible testable directe (VEGA → /demos)
  primaryCta?: CtaLink;   // CTA principal de la card
  detailCta: CtaLink;     // CTA vers la fiche détail
  // Fiche détail (Contexte → Problème → … → Résultats → offre)
  context: string;
  problem: string;
  result: string;
  offer: CtaLink;         // CTA vers l'offre correspondante
}

export const projects: Project[] = [
  {
    slug: "vega",
    title: "VEGA — Assistant RAG",
    tagline:
      "Un CV qu'on interroge à la voix. Pipeline RAG complet, en production sur ce site.",
    badge: "LIVE — testable",
    state: "live",
    model: "robot",
    accent: "#ff6b35",
    cardBg: "linear-gradient(120deg, #1a0500 0%, #3d0e00 40%, #5a1500 100%)",
    glow: "breatheOrange 3s ease-in-out infinite",
    stack: ["Next.js", "Supabase", "OpenAI", "pgvector"],
    demoUrl: "/demos",
    primaryCta: { label: "Tester VEGA →", href: "/demos" },
    detailCta: { label: "Voir l'architecture", href: "/projets/vega" },
    context:
      "Un CV PDF est passif : un recruteur ou un prospect ne peut ni poser une question précise, ni vérifier une compétence en quelques secondes. Je voulais une preuve vivante de ce que je livre — un système RAG complet en production, pas une démo jetable.",
    problem:
      "Rendre un profil interrogeable en langage naturel, et à la voix, avec des réponses sourcées, une latence acceptable et des coûts maîtrisés — le tout hébergé en production, pas en local sur ma machine.",
    result:
      "En production sur ce site. Pipeline déployé sur Vercel + Supabase : ingestion de documents → embeddings → recherche vectorielle (pgvector) → génération (gpt-4o-mini) → synthèse vocale. Garde-fou tokens/jour et rate-limit par IP pour contrôler les coûts. Testable maintenant.",
    offer: { label: "Voir l'offre — Déploiement IA en production →", href: "/offres" },
  },
  {
    slug: "n8n",
    title: "Automatisations N8N pour PME",
    tagline:
      "Tri d'email par IA, testable en direct. Factures, SAV, comptes rendus… en préparation.",
    badge: "LIVE — testable",
    state: "live",
    model: "drone",
    accent: "#10b981",
    cardBg: "linear-gradient(135deg, #010a04 0%, #021508 50%, #033014 100%)",
    glow: "breatheGreen 3s ease-in-out infinite",
    stack: ["n8n", "OpenAI", "Webhooks", "Python"],
    demoUrl: "/automatisations",
    primaryCta: { label: "Tester les automatisations →", href: "/automatisations" },
    detailCta: { label: "Voir l'architecture", href: "/projets/n8n" },
    context:
      "Les PME accumulent des tâches répétitives à faible valeur : ressaisie de factures, tri d'emails, comptes rendus, réponses SAV. Prises une par une elles semblent anodines ; cumulées, elles coûtent des heures chaque semaine.",
    problem:
      "Concevoir des workflows fiables plutôt que des scripts fragiles : orchestrés, rate-limités face aux APIs, monitorés, avec reprise sur erreur. Et les rendre testables publiquement sans jamais exposer de données clientes.",
    result:
      "12 automatisations métier conçues (factures, emails, comptes rendus, SAV…). 5 sont en cours de déploiement en version publique testable ; les autres tournent en environnement client. Statut honnête : les workflows existent, la vitrine testable arrive.",
    offer: { label: "Voir l'offre — Automatisation métier →", href: "/offres" },
  },
  {
    slug: "infra",
    title: "Infrastructure IA self-hosted",
    tagline:
      "Mon propre serveur GPU de production : Docker, LLM local, API TTS, tunnel sécurisé, monitoring, backups.",
    badge: "En construction",
    state: "building",
    model: "satellite",
    accent: "#a855f7",
    cardBg: "radial-gradient(ellipse at 60% 40%, #3d0f72 0%, #1c0540 45%, #080118 100%)",
    glow: "breathePurple 3.5s ease-in-out infinite",
    stack: ["Docker", "Ollama", "API TTS", "Tunnel", "Monitoring"],
    detailCta: { label: "Voir l'architecture →", href: "/projets/infra" },
    context:
      "Tout louer à des API tierces (LLM, TTS, hébergement) plafonne les marges et crée une dépendance. Je veux opérer moi-même l'infrastructure que je vends à mes clients — et pouvoir le prouver.",
    problem:
      "Monter un serveur GPU de production maison : conteneurisation, LLM local, API de synthèse vocale, exposition sécurisée vers l'extérieur, supervision et sauvegardes. Reproductible et fiable, pas un montage jetable.",
    result:
      "En construction. Cible : serveur GPU (RTX) sous Docker, LLM local via Ollama, API TTS self-hosted, tunnel sécurisé, monitoring et backups planifiés. Objectif assumé : « j'opère ce que je vends ». Statut : socle en cours de montage.",
    offer: { label: "Voir l'offre — Run & infrastructure →", href: "/offres" },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
