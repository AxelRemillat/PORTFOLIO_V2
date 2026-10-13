import type { Metier } from "./types";

// B2B flat-rate services: cleaning, IT, maintenance. Sample prices excl. VAT.
export const SERVICES: Metier = {
  id: "services",
  label: "B2B services",
  entreprise: "Brightdesk Business Services",
  activite: "Office cleaning, IT support and building maintenance, at a flat rate.",
  tva: 0.2,
  remises: [{ seuil: 5000, taux: 0.05 }],
  minimum_ht: 100,
  livraison: { libelle: "Service start", frais: 0, franco: null, delai_jours: 5 },
  catalogue: [
    { ref: "NET-100", nom: "Office cleaning ≤ 100 m² — 2 visits/week", categorie: "office cleaning", description: "Floors, dusting, restrooms, trash.", unite: "month", prix_unitaire: 390, delai_jours: 0 },
    { ref: "NET-300", nom: "Office cleaning ≤ 300 m² — 3 visits/week", categorie: "office cleaning", description: "Floors, dusting, restrooms, kitchen, trash.", unite: "month", prix_unitaire: 980, delai_jours: 0 },
    { ref: "NET-VITRES", nom: "Window cleaning (up to 50 m²)", categorie: "cleaning windows", description: "Inside and outside, reachable without an aerial lift.", unite: "visit", prix_unitaire: 180, delai_jours: 0 },
    { ref: "NET-TRAVAUX", nom: "Post-construction cleaning", categorie: "cleaning", description: "Full dust removal, stain and residue stripping.", unite: "m²", prix_unitaire: 6.5, delai_jours: 0 },
    { ref: "IT-MAINT", nom: "IT maintenance per workstation", categorie: "IT", description: "Support, updates, antivirus, remote troubleshooting.", unite: "workstation/month", prix_unitaire: 29, delai_jours: 0 },
    { ref: "IT-INSTALL", nom: "Workstation installation and setup", categorie: "IT", description: "Setup, user accounts, email, printers.", unite: "workstation", prix_unitaire: 120, delai_jours: 0 },
    { ref: "IT-SAUVEGARDE", nom: "Offsite data backup 500 GB", categorie: "IT", description: "Encrypted daily backup, restore included.", unite: "month", prix_unitaire: 49, delai_jours: 0 },
    { ref: "IT-DIAG", nom: "IT and security audit (half day)", categorie: "IT", description: "Equipment review, backups, passwords, recommendations.", unite: "flat rate", prix_unitaire: 450, delai_jours: 0 },
    { ref: "DEMENAGEMENT", nom: "Office move (per workstation)", categorie: "moving", description: "Packing, transport, workstation reassembly.", unite: "workstation", prix_unitaire: 85, delai_jours: 5 },
    { ref: "CLIM-ENTRETIEN", nom: "Annual air conditioning service", categorie: "maintenance", description: "Filter cleaning, inspection, service certificate.", unite: "unit", prix_unitaire: 140, delai_jours: 0 },
    { ref: "EXTINCTEUR", nom: "Annual fire extinguisher inspection", categorie: "maintenance safety", description: "Mandatory inspection and tagging.", unite: "extinguisher", prix_unitaire: 12, delai_jours: 0 },
    { ref: "ACCUEIL", nom: "Outsourced phone answering", categorie: "reception", description: "Calls answered 9 am to 6 pm, messages forwarded by email.", unite: "month", prix_unitaire: 690, delai_jours: 0 },
    { ref: "URGENCE-4H", nom: "Emergency call-out within 4 hours", categorie: "maintenance", description: "Plumbing, locksmith or IT, parts not included.", unite: "visit", prix_unitaire: 190, delai_jours: 0 },
  ],
  exemples: [
    { label: "250 m² cleaning", texte: "We have 250 m² of offices in Paris: office cleaning 3 times a week and window cleaning once a month. What would that cost?" },
    { label: "8 IT workstations", texte: "We're setting up 8 new workstations: installation, monthly IT maintenance and data backup. Can you send me an offer?" },
    { label: "Off-catalog", texte: "An office move for 15 workstations next month, plus weekend security guarding for the premises. Is that possible?" },
  ],
  politique: {
    engagement: "Monthly contracts with no minimum term, one month's notice.",
    paiement: "Monthly invoicing, direct debit or bank transfer at 30 days.",
    delais: "Service starts within 5 business days of signing. Emergencies handled within 4 hours.",
    zone: "We cover the Paris region and France's major cities.",
    qualite: "Monthly quality check and a dedicated account manager.",
  },
  sav: [
    { id: "S1", question: "Starting a contract", reponse: "Service starts within 5 business days of signing, with a walkthrough of your premises." },
    { id: "S2", question: "Canceling the contract", reponse: "No minimum term: one month's notice by email is all it takes." },
    { id: "S3", question: "A cleaning visit was missed", reponse: "Let us know before 10 am: a cleaner comes back the same day, at no charge." },
    { id: "S4", question: "Urgent IT outage", reponse: "Included in maintenance: remote support within 1 business hour, on-site visit within 4 hours if needed." },
    { id: "S5", question: "Invoicing and payment", reponse: "Monthly invoice, direct debit or bank transfer at 30 days." },
    { id: "S6", question: "Cleaning products used", reponse: "Eco-certified products, supplied and included in the flat rate." },
  ],
  savExemples: ["The cleaner didn't come this morning. What should I do?", "How do I cancel the contract?", "Do you also do landscaping?"],
};
