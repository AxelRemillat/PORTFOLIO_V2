// Guided questions, English version of questionsData.ts (same structure, same
// ids, 5 × 10). Written for an English-speaking visitor, not translated word for
// word: each question asks for the same fact as its French twin.
import type { QuestionCategory } from "./questionsData";

export const QUESTION_CATEGORIES: QuestionCategory[] = [
  {
    id: "metier",
    label: "Your business",
    questions: [
      "I run a joinery business. What can you do for me?",
      "I'm in construction. What can be automated?",
      "I own a bakery with several shops",
      "I run a building materials supplier",
      "What about a real estate agency?",
      "What about transport and logistics?",
      "I sell services to other businesses",
      "Which tasks should I automate first?",
      "Can you prepare my quotes?",
      "Can you sort my emails?",
    ],
  },
  {
    id: "prix",
    label: "Pricing and timing",
    questions: [
      "How much does it cost?",
      "How long does it take to set up?",
      "How does a project work?",
      "What is the audit?",
      "What does the monthly support include?",
      "What happens after delivery?",
      "What if it doesn't work?",
      "How do we get started?",
      "Do I have to sign a long-term contract?",
      "Give me a quote for 3 windows",
    ],
  },
  {
    id: "donnees",
    label: "Data and tools",
    questions: [
      "Is my data safe?",
      "Does it work with my quoting software?",
      "Does it work with Excel or Google Sheets?",
      "Does it work with Gmail or Outlook?",
      "What about my CRM?",
      "Who checks before anything goes to a client?",
      "Will you sign an NDA?",
      "Where does my data go?",
      "Do I need to change my tools?",
      "Will my team need training?",
    ],
  },
  {
    id: "demos",
    label: "Live demos",
    questions: [
      "What can I try on this site?",
      "Show me the demo for my business",
      "What is the quoting agent?",
      "What are the 5 automations?",
      "Who have you done this for?",
      "How does invoice reading work?",
      "How do the meeting notes work?",
      "What is the contact scoring?",
      "What is the customer service assistant?",
      "Do the demos use real data?",
    ],
  },
  {
    id: "axel",
    label: "Axel and VEGA",
    questions: [
      "Who is Axel?",
      "Why work with a freelancer?",
      "How can I contact Axel?",
      "How do I book a 15-minute call?",
      "What projects has he worked on?",
      "What was RISE?",
      "Who are you, VEGA?",
      "How do you work?",
      "Can you make mistakes?",
      "Why the name VEGA?",
    ],
  },
];

// Bottom ticker: EVERY question in the catalog (5 × 10 = 50), shuffled client-side.
export const ALL_QUESTIONS: string[] = QUESTION_CATEGORIES.flatMap((c) => c.questions);
