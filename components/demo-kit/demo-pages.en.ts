import type { DemoPagesText } from "./demo-pages";

// English texts of the demo pages (/en/agent, /en/automatisations) and shared blocks.
export const DEMO_PAGES_EN: DemoPagesText = {
  switchAria: "Live demos",
  switchAgent: "Quote agent",
  switchAuto: "Automations (email triage, invoices, customer service…)",
  agent: {
    title: "Quote agent — try it on your trade | Axel Remillat",
    description:
      "Pick your trade (windows & doors, renovation, building supply, bakery & catering, business services) and send a customer request: the agent prepares the quote with VAT, the questions to ask and the reply email.",
    kicker: "Live demo // quote agent",
    h1: "One customer request, one quote ready to send",
    lead: "Pick your trade and run a sample request. The agent searches the catalog, prices the job, lists what to ask the customer and writes the reply.",
    ctaSubject: "Quote agent live demo: I'd like the same with my own catalog",
  },
  auto: {
    title: "Automation live demos for small businesses — Axel Remillat",
    description:
      "Try automations for small businesses live: email triage, meeting notes, customer file cleanup and duplicates, invoices, customer service tailored to your trade.",
    kicker: "Live demos // automations",
    h1: "Try the automations",
    lead: "Repetitive small-business tasks, handled in seconds. Pick a demo, run a sample or try it with your own.",
  },
  cta: {
    aria: "What about your business?",
    title: "What about your business?",
    text: "The same thing, with your documents, your prices and your tools. We look at your case in 15 minutes, no strings attached.",
    book: "Book 15 min",
    describe: "Tell me what you need",
  },
};
