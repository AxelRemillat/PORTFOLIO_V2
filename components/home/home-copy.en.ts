import type { HomeCopy } from "./home-copy";

/**
 * Homepage copy (and the /pme sections that reuse it), in English. Written for
 * a native reader — same tone and arguments as the French, not a word-for-word
 * translation. Vocabulary: messages/GLOSSARY.md.
 */
export const HOME_EN: HomeCopy = {
  hero: {
    kicker: "Axel Remillat — AI engineer for small businesses",
    title: "I automate the repetitive work that slows your business down",
    subtitle: "Quotes, orders, follow-ups, paperwork: less retyping, faster replies. Try it before you sign anything.",
    ctaDemo: "Try a live demo",
    ctaCall: "Book a 15-min call",
  },
  meta: {
    title: "Axel Remillat — I automate the repetitive work in your business",
    description:
      "Quotes, orders, follow-ups, paperwork: less retyping, faster replies. Live demos you can test on your own trade before you sign.",
  },
  problems: {
    label: "01 // WHAT I AUTOMATE",
    title: "What I automate",
    lead: "Six tasks that come back every week in a small business. Each one has its own live demo: try it with a sample.",
    seeDemo: "See the demo →",
    tiles: [
      { t: "Requests & quotes", d: "A request lands in your inbox: the priced quote and the reply are ready in a minute. You review, you send." },
      { t: "Email & request triage", d: "Every email is sorted, prioritized and gets a draft reply. Nothing gets lost in the inbox anymore." },
      { t: "Invoices & documents", d: "Supplier invoices are read, amounts checked and copied into your spreadsheet. No retyping." },
      { t: "Meeting notes", d: "After a meeting or a site visit, the notes, decisions and action items are written up for you." },
      { t: "Customer files & duplicates", d: "Your customer list gets cleaned up: consistent formats, duplicates merged, errors flagged." },
      { t: "Customer support", d: "Common questions (lead times, warranties, orders) get an accurate answer, pulled from your own documents." },
    ],
  },
  featured: {
    label: "02 // FEATURED DEMO",
    title: "One customer request, one quote ready to send",
    lead: "Pick your trade (carpentry, construction, wholesale, bakery & catering, services) and send a request: the agent prices it, lists the questions to ask the customer and drafts the reply.",
    totalExcl: "Total excl. VAT (delivery included)",
    vat: "VAT 20%",
    totalIncl: "Total incl. VAT",
    delay: (days: number) => `Estimated lead time: ${days} business days · sample catalog`,
    cta: "Try it on my trade",
  },
  steps: {
    label: "03 // HOW IT WORKS",
    title: "How it works",
    step: (n: number) => `Step ${n}`,
    items: [
      { t: "A 15-minute call", d: "You tell me which task eats up your time. Free, no strings attached." },
      { t: "A prototype on your data", d: "I test it on your real examples: you judge the result before you commit." },
      { t: "Live in 2 to 3 weeks", d: "Connected to your tools, tested with you, explained to your team." },
      { t: "Ongoing support", d: "I monitor, fix and improve it. No long-term contract: you can stop any month." },
    ],
  },
  offers: {
    label: "04 // SERVICES",
    title: "Clear prices, set before we start",
    lead: "One scope, one price, one deadline. No surprise overruns.",
  },
  proofs: {
    label: "05 // PROOF",
    title: "Real projects, not promises",
    lead: "Everything that can be tested is testable, right here on this site.",
    all: "All projects →",
  },
  cta: {
    label: "06 // ABOUT",
    title: "Axel Remillat, AI engineer",
    about:
      "I build practical tools that save time: a quote ready in a minute, invoices that enter themselves, a clean customer list. Every project starts with your own examples, so you see the result before you decide.",
    journey: "About me →",
    question: "Got a task that wastes your time?",
    button: "Let's talk about your case — 15 min",
  },
  pme: {
    title: "Your quotes ready in a minute, not an evening",
    subtitle:
      "Try the quoting agent on your trade: it prices the request, lists the questions to ask the customer and drafts the reply. Two minutes, no sign-up.",
    metaTitle: "Try the quoting agent on your trade — Axel Remillat",
    metaDescription: "Send a typical customer request: the agent prepares the quote, the questions to ask and the reply. 2 minutes, no sign-up.",
  },
};
