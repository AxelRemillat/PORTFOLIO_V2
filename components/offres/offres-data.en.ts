// Services + FAQ in English. Same type, same order, same prices as
// offres-data.ts — only the wording changes. Amounts follow the glossary
// (€1,200, €190/month). Vocabulary: messages/GLOSSARY.md.

import { CALENDAR_URL } from "@/lib/site-config";
import type { Faq, Offer } from "./offres-data";

export const OFFERS_EN: Offer[] = [
  {
    num: "01",
    name: "Automation audit",
    kind: "To get started",
    pitch: "Half a day to spot and price the 3 tasks worth automating first.",
    price: "From €290",
    priceNote: "flat fee",
    meta: "Duration: half a day, on-site or by video call",
    itemsLabel: "What you get",
    items: [
      "A walkthrough of your repetitive tasks, with you and your team",
      "The time lost every week, task by task",
      "The 3 tasks to automate first, each with its price",
      "A clear plan, with no commitment for what comes next",
    ],
    accent: "#f97316",
  },
  {
    num: "02",
    name: "Turnkey automation",
    kind: "Most popular",
    pitch: "One workflow delivered and tested in 2 to 3 weeks, connected to your tools.",
    price: "From €1,200",
    priceNote: "per workflow",
    meta: "Timeline: 2 to 3 weeks",
    itemsLabel: "What you get",
    items: [
      "A trial run on your real examples before anything goes live",
      "Connected to your tools: email, spreadsheets, quoting or invoicing software",
      "Tested with you on real cases before launch",
      "A simple guide and a hands-on session with your team",
    ],
    accent: "#10b981",
  },
  {
    num: "03",
    name: "Support & improvements",
    kind: "After delivery",
    pitch: "I monitor, fix and improve your automations.",
    price: "From €190/month",
    priceNote: "per month",
    meta: "No long-term contract, cancel any month",
    itemsLabel: "Included",
    items: [
      "A daily check that everything is running",
      "Fixes whenever something goes wrong",
      "Small improvements: a new case, a new document template",
      "A 15-minute check-in every month",
    ],
    accent: "#a855f7",
  },
  {
    num: "04",
    name: "AI to production",
    kind: "You already have a prototype",
    pitch: "For teams that already have an AI prototype and want to use it every day, without nasty surprises.",
    price: "From €1,900",
    priceNote: "depending on the project",
    meta: "Timeline: 2 to 4 weeks",
    itemsLabel: "What you get",
    items: [
      "Your prototype made reliable and stable for daily use",
      "An alert as soon as something goes wrong",
      "A log of what the AI does, so you can check and correct it",
      "Documentation and a proper handover to your team",
    ],
    accent: "#06b6d4",
  },
];

export const FAQ_EN: Faq[] = [
  {
    q: "How much does it cost?",
    a: "The audit starts at €290, a turnkey automation at €1,200, and support at €190 a month. The exact price is put in writing before we start: no surprise overruns.",
  },
  {
    q: "How long does it take to get up and running?",
    a: "Allow 2 to 3 weeks for one automation: a few days for a trial run on your examples, then the setup and testing with you.",
  },
  {
    q: "Will it work with my tools?",
    a: "In most cases, yes: your email (Gmail, Outlook), your spreadsheets (Excel, Google Sheets), your quoting or invoicing software if it supports exports or integrations. We check it together during the 15-minute call.",
  },
  {
    q: "Where does my data go?",
    a: "It stays yours. I only use what the automation needs, nothing is sold or reused elsewhere, and I can sign an NDA before we start. For sensitive tasks, the AI suggests and you approve before anything is sent.",
  },
  {
    q: "What happens after delivery?",
    a: "The automation is yours, with a simple guide. You can run it on your own, or take the monthly support plan, with no long-term contract, for fixes and small improvements.",
  },
  {
    q: "How do we get started?",
    a: "A free 15-minute call: you tell me which task eats up your time. I come back with a written proposal (what gets done, the price, the timeline). You approve, we start.",
    link: { label: "Book a 15-min call →", href: CALENDAR_URL },
  },
];
