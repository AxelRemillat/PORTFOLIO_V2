/**
 * Textes de l'accueil (et de /pme, qui en reprend des sections), en français.
 * Le jumeau anglais `home-copy.en.ts` a le même type : une clé manquante ou en
 * trop est une erreur tsc. Ces chaînes reprennent MOT POUR MOT le français
 * d'avant le bilingue (13/10/2026).
 */
export const HOME_FR = {
  hero: {
    kicker: "Axel Remillat — ingénieur IA pour les PME",
    title: "J'automatise les tâches répétitives de votre PME avec l'IA",
    subtitle: "Devis, commandes, relances, documents : moins de ressaisie, des réponses plus rapides. Testable avant de signer.",
    ctaDemo: "Tester une démo",
    ctaCall: "Réserver 15 min",
  },
  meta: {
    title: "Axel Remillat — J'automatise les tâches répétitives de votre PME",
    description:
      "Devis, commandes, relances, documents : moins de ressaisie, des réponses plus rapides. Démos testables sur votre métier avant de signer.",
  },
  problems: {
    label: "01 // CE QUE J'AUTOMATISE",
    title: "Ce que j'automatise",
    lead: "Six tâches qui reviennent chaque semaine dans une PME. Chacune a sa démo : essayez-la avec un exemple.",
    seeDemo: "Voir la démo →",
    tiles: [
      { t: "Demandes & devis", d: "Une demande arrive par email : le devis chiffré et la réponse sont prêts en une minute, vous relisez et vous envoyez." },
      { t: "Tri des emails et demandes", d: "Chaque email est classé, priorisé et reçoit un brouillon de réponse : plus rien ne se perd dans la boîte." },
      { t: "Factures & documents", d: "Les factures fournisseurs sont lues, les montants vérifiés et reportés dans votre tableau, sans ressaisie." },
      { t: "Comptes rendus", d: "Après une réunion ou un rendez-vous de chantier, le compte rendu avec décisions et actions est rédigé pour vous." },
      { t: "Fichiers clients & doublons", d: "Votre fichier clients est remis au propre : formats harmonisés, doublons fusionnés, erreurs signalées." },
      { t: "Service client", d: "Les questions fréquentes (délais, garanties, commandes) reçoivent une réponse juste, tirée de vos documents." },
    ],
  },
  featured: {
    label: "02 // DÉMO PHARE",
    title: "Une demande client, un devis prêt à envoyer",
    lead: "Choisissez votre métier (menuiserie, BTP, négoce, boulangerie-traiteur, services), envoyez une demande : l'agent chiffre, liste les questions à poser au client et rédige la réponse.",
    totalExcl: "Total HT (livraison incluse)",
    vat: "TVA 20 %",
    totalIncl: "Total TTC",
    delay: (days: number) => `Délai estimé : ${days} jours ouvrés · catalogue d'exemple`,
    cta: "Tester sur mon métier",
  },
  steps: {
    label: "03 // COMMENT ÇA MARCHE",
    title: "Comment ça marche",
    step: (n: number) => `Étape ${n}`,
    items: [
      { t: "Échange de 15 min", d: "Vous me décrivez la tâche qui vous fait perdre du temps. Gratuit, sans engagement." },
      { t: "Prototype sur vos données", d: "Je le teste sur vos vrais exemples : vous jugez le résultat avant de vous engager." },
      { t: "Mise en place en 2 à 3 semaines", d: "Branché sur vos outils, testé avec vous, expliqué à votre équipe." },
      { t: "Suivi", d: "Je surveille, je corrige et je fais évoluer. Sans engagement, arrêt possible chaque mois." },
    ],
  },
  offers: {
    label: "04 // OFFRES",
    title: "Des prix clairs, fixés avant de commencer",
    lead: "Un périmètre, un prix, un délai. Pas de dépassement surprise.",
  },
  proofs: {
    label: "05 // PREUVES",
    title: "Des projets réels, pas des promesses",
    lead: "Tout ce qui est testable l'est, directement sur ce site.",
    all: "Tous les projets →",
  },
  cta: {
    label: "06 // À PROPOS",
    title: "Axel Remillat, ingénieur IA",
    about:
      "Je conçois des outils concrets qui font gagner du temps : un devis préparé en une minute, des factures saisies toutes seules, un fichier clients propre. Chaque projet commence sur vos propres exemples, pour que vous voyiez le résultat avant de décider.",
    journey: "Mon parcours →",
    question: "Une tâche qui vous fait perdre du temps ?",
    button: "Parlons de votre cas — 15 min",
  },
  pme: {
    title: "Vos devis prêts en une minute, pas en une soirée",
    subtitle:
      "Testez l'agent devis sur votre métier : il chiffre la demande, liste les questions à poser au client et rédige la réponse. Deux minutes, sans inscription.",
    metaTitle: "Testez l'agent devis sur votre métier — Axel Remillat",
    metaDescription: "Envoyez une demande client type : l'agent prépare le devis, les questions à poser et la réponse. 2 minutes, sans inscription.",
  },
};

export type HomeCopy = typeof HOME_FR;
