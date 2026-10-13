// English interface copy for the VEGA demo (/en/demos). Same type as VEGA_UI_FR.
import type { VegaUi } from "./vega-ui";

export const VEGA_UI_EN: VegaUi = {
  hudTitle: "VEGA — AI ASSISTANT // AXEL REMILLAT",
  greeting:
    "Hi, I'm VEGA, Axel Remillat's assistant. Tell me what your business does, and I'll explain what can be automated for you, how it works, and what it starts at.",
  unavailable: "VEGA is temporarily unavailable. Please try again.",
  error: "Error: VEGA is temporarily unavailable. Please try again.",
  thinking: "searching the vector database",
  speechLang: "en-US",
  input: {
    placeholder: "Ask your question…",
    aria: "Ask VEGA a question",
    micStop: "Stop dictation",
    micStart: "Dictate your question",
    micListening: "Listening… (click to stop)",
    micTitle: "Voice input",
    send: "Send",
  },
  history: {
    justNow: "just now",
    minutesAgo: (n) => `${n} min ago`,
    hoursAgo: (n) => `${n} h ago`,
    dateLocale: "en-US",
    empty: "No saved conversations yet.",
    newConversation: "+ New conversation",
    back: "‹ History",
    you: "YOU",
    deleteAria: (title) => `Delete ${title}`,
  },
  drawer: { menuAria: "VEGA menu", questions: "Questions", history: "History", close: "Close" },
  controls: {
    resume: "Resume",
    pause: "Pause",
    pauseTitle: "Pause",
    deleteAria: "Delete the current conversation",
    deleteTitle: "Delete",
    speedAria: (speed) => `Playback speed: ${speed}×. Click to change.`,
    speedTitle: "Playback speed",
  },
  sound: {
    onAria: "Sound on: mute VEGA",
    offAria: "Sound off: unmute VEGA",
    muteTitle: "Mute",
    unmuteTitle: "Unmute",
  },
  panels: { questions: "QUESTIONS", history: "HISTORY", open: "Open", close: "Close", openQuestions: "Open the questions", openHistory: "Open the history" },
  chezVous: {
    aria: "What about your business?",
    title: "What about your business?",
    book: "Book 15 min",
    describe: "Tell me what you need",
    subject: "VEGA demo: an assistant like this one for my business",
  },
};
