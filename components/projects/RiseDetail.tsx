"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const SpaceBackground = dynamic(() => import("@/components/ui/SpaceBackground"), { ssr: false });

const ACCENT = "#38bdf8";
const GOLD = "#ffd700";
const SILVER = "#cbd5e1";

// ─── Données RISE (issues du repo source Portfolio-) ───────────────────────────

const STATS = [
  { value: "4", label: "Cofondateurs" },
  { value: "3", label: "Concours remportés" },
  { value: "400+", label: "Projets battus" },
  { value: "4 500€", label: "Dotations gagnées" },
  { value: "1 an ½", label: "De développement" },
];

const PODIUM = [
  { rank: "1er", color: GOLD, text: "Concours ESME — Calendrier de l'Avent" },
  { rank: "1er", color: GOLD, text: "Concours IONIS — 400+ candidatures" },
  { rank: "2e", color: SILVER, text: "Concours Galets du Rhône — Genève" },
];

const MILESTONES = [
  "Projet le plus avancé et prometteur de l'ESME",
  "Statut officiel d'association",
  "Protection juridique déposée",
  "Bêta en cours de déploiement",
  "Intégration en cours à l'incubateur de l'école",
];

const PROBLEM = [
  "Informations dispersées, témoignages difficiles à trouver",
  "Aucune centralisation privée propre à chaque université",
  "Peu de données fiables sur la vie locale (logement, coût, services)",
  "Les BRI manquent d'outils modernes pour piloter leurs étudiants",
];

const SOLUTION = [
  "Carte interactive des universités partenaires",
  "Fiches universités détaillées (infos, notes, contacts)",
  "Témoignages étudiants vérifiés par destination",
  "Conseils logement / services / vie locale",
  "Interface claire et structurée, un compte unique par étudiant",
];

const ROLE = [
  "Conception produit",
  "Développement web (React / Firebase)",
  "Architecture base NoSQL",
  "Business model & stratégie",
  "Pitch & concours",
  "Négociation direction & BRI",
  "Coordination équipe & timeline",
];

const STACK_RISE = [
  { name: "React", role: "Frontend", logo: "react" },
  { name: "Firebase", role: "Backend", logo: "firebase" },
  { name: "Firestore", role: "Base NoSQL", logo: "firebase" },
  { name: "Firebase Auth", role: "Authentification", logo: "firebase" },
  { name: "Figma", role: "Design", logo: "figma" },
  { name: "GitHub", role: "Versioning", logo: "github" },
];

// Outils du chatbot RAG intégré (repo CHAT_BOT_RAG_RISE)
const STACK_RAG = [
  { name: "Python", role: "Backend", logo: "python" },
  { name: "FastAPI", role: "API REST", logo: "fastapi" },
  { name: "OpenAI", role: "Embeddings & LLM", logo: "openai" },
  { name: "Google Cloud", role: "BigQuery · vecteurs", logo: "googlecloud" },
  { name: "Firestore", role: "Logs & feedback", logo: "firebase" },
  { name: "Docker", role: "Conteneurisation", logo: "docker" },
  { name: "Tailwind CSS", role: "UI du widget", logo: "tailwindcss" },
  { name: "Vite", role: "Build frontend", logo: "vite" },
];

// Logos officiels (tracés Simple Icons) + couleurs de marque
const LOGOS: Record<string, { color: string; path: string }> = {
  react: {
    color: "#61DAFB",
    path: "M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z",
  },
  firebase: {
    color: "#FFCA28",
    path: "M19.455 8.369c-.538-.748-1.778-2.285-3.681-4.569-.826-.991-1.535-1.832-1.884-2.245a146 146 0 0 0-.488-.576l-.207-.245-.113-.133-.022-.032-.01-.005L12.57 0l-.609.488c-1.555 1.246-2.828 2.851-3.681 4.64-.523 1.064-.864 2.105-1.043 3.176-.047.241-.088.489-.121.738-.209-.017-.421-.028-.632-.033-.018-.001-.035-.002-.059-.003a7.46 7.46 0 0 0-2.28.274l-.317.089-.163.286c-.765 1.342-1.198 2.869-1.252 4.416-.07 2.01.477 3.954 1.583 5.625 1.082 1.633 2.61 2.882 4.42 3.611l.236.095.071.025.003-.001a9.59 9.59 0 0 0 2.941.568q.171.006.342.006c1.273 0 2.513-.249 3.69-.742l.008.004.313-.145a9.63 9.63 0 0 0 3.927-3.335c1.01-1.49 1.577-3.234 1.641-5.042.075-2.161-.643-4.304-2.133-6.371m-7.083 6.695c.328 1.244.264 2.44-.191 3.558-1.135-1.12-1.967-2.352-2.475-3.665-.543-1.404-.87-2.74-.974-3.975.48.157.922.366 1.315.622 1.132.737 1.914 1.902 2.325 3.461zm.207 6.022c.482.368.99.712 1.513 1.028-.771.21-1.565.302-2.369.273a8 8 0 0 1-.373-.022c.458-.394.869-.823 1.228-1.279zm1.347-6.431c-.516-1.957-1.527-3.437-3.002-4.398-.647-.421-1.385-.741-2.194-.95.011-.134.026-.268.043-.4.014-.113.03-.216.046-.313.133-.689.332-1.37.589-2.025.099-.25.206-.499.321-.74l.004-.008c.177-.358.376-.719.61-1.105l.092-.152-.003-.001c.544-.851 1.197-1.627 1.942-2.311l.288.341c.672.796 1.304 1.548 1.878 2.237 1.291 1.549 2.966 3.583 3.612 4.48 1.277 1.771 1.893 3.579 1.83 5.375-.049 1.395-.461 2.755-1.195 3.933-.694 1.116-1.661 2.05-2.8 2.708-.636-.318-1.559-.839-2.539-1.599.79-1.575.952-3.28.479-5.072zm-2.575 5.397c-.725.939-1.587 1.55-2.09 1.856-.081-.029-.163-.06-.243-.093l-.065-.026c-1.49-.616-2.747-1.656-3.635-3.01-.907-1.384-1.356-2.993-1.298-4.653.041-1.19.338-2.327.882-3.379.316-.07.638-.114.96-.131l.084-.002c.162-.003.324-.003.478 0 .227.011.454.035.677.07.073 1.513.445 3.145 1.105 4.852.637 1.644 1.694 3.162 3.144 4.515z",
  },
  figma: {
    color: "#F24E1E",
    path: "M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z",
  },
  github: {
    color: "#ffffff",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
  python: {
    color: "#4B8BBE",
    path: "M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z",
  },
  fastapi: {
    color: "#009688",
    path: "M12 .0387C5.3729.0384.0003 5.3931 0 11.9988c-.001 6.6066 5.372 11.9628 12 11.9625 6.628.0003 12.001-5.3559 12-11.9625-.0003-6.6057-5.3729-11.9604-12-11.96m-.829 5.4153h7.55l-7.5805 5.3284h5.1828L5.279 18.5436q2.9466-6.5444 5.892-13.0896",
  },
  openai: {
    color: "#ffffff",
    path: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
  },
  googlecloud: {
    color: "#4285F4",
    path: "M12.19 2.38a9.344 9.344 0 0 0-9.234 6.893c.053-.02-.055.013 0 0-3.875 2.551-3.922 8.11-.247 10.941l.006-.007-.007.03a6.717 6.717 0 0 0 4.077 1.356h5.173l.03.03h5.192c6.687.053 9.376-8.605 3.835-12.35a9.365 9.365 0 0 0-2.821-4.552l-.043.043.006-.05A9.344 9.344 0 0 0 12.19 2.38zm-.358 4.146c1.244-.04 2.518.368 3.486 1.15a5.186 5.186 0 0 1 1.862 4.078v.518c3.53-.07 3.53 5.262 0 5.193h-5.193l-.008.009v-.04H6.785a2.59 2.59 0 0 1-1.067-.23h.001a2.597 2.597 0 1 1 3.437-3.437l3.013-3.012A6.747 6.747 0 0 0 8.11 8.24c.018-.01.04-.026.054-.023a5.186 5.186 0 0 1 3.67-1.69z",
  },
  docker: {
    color: "#2496ED",
    path: "M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z",
  },
  tailwindcss: {
    color: "#06B6D4",
    path: "M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z",
  },
  vite: {
    color: "#A87BFF",
    path: "M13.056 23.238a.57.57 0 0 1-1.02-.355v-5.202c0-.63-.512-1.143-1.144-1.143H5.148a.57.57 0 0 1-.464-.903l3.777-5.29c.54-.753 0-1.804-.93-1.804H.57a.574.574 0 0 1-.543-.746.6.6 0 0 1 .08-.157L5.008.78a.57.57 0 0 1 .467-.24h14.589a.57.57 0 0 1 .466.903l-3.778 5.29c-.54.755 0 1.806.93 1.806h5.745c.238 0 .424.138.513.322a.56.56 0 0 1-.063.603z",
  },
};

function Logo({ name }: { name: string }) {
  const l = LOGOS[name];
  if (!l) return null;
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill={l.color} aria-hidden style={{ flexShrink: 0, filter: `drop-shadow(0 0 6px ${l.color}55)` }}>
      <path d={l.path} />
    </svg>
  );
}

function GroupLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p className="rise-fade" style={{
      color: "rgba(255,255,255,0.55)", fontSize: "0.72rem", fontWeight: 700,
      letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 14px", ...style,
    }}>
      <span style={{ color: ACCENT }}>▍</span> {children}
    </p>
  );
}

function StackGrid({ items }: { items: { name: string; role: string; logo: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
      {items.map((t, i) => (
        <div key={t.name} className="rise-item rise-hover rise-tech" style={{
          animationDelay: `${i * 0.05}s`,
          display: "flex", alignItems: "center", gap: 12,
          background: "rgba(8,16,30,0.72)", border: `1px solid ${ACCENT}33`, borderRadius: 12, padding: "16px 14px",
        }}>
          <Logo name={t.logo} />
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.98rem" }}>{t.name}</div>
            <div style={{ color: ACCENT, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 5 }}>{t.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Mise en avant d'un mot-clé dans le texte courant
function Hl({ children, gold }: { children: React.ReactNode; gold?: boolean }) {
  return <span style={{ color: gold ? GOLD : ACCENT, fontWeight: 700 }}>{children}</span>;
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <p style={{ color: ACCENT, fontFamily: "monospace", fontSize: "0.75rem", letterSpacing: "0.16em", textTransform: "uppercase", margin: "0 0 10px" }}>
        {kicker}
      </p>
      <h2 style={{ color: "#fff", fontSize: "1.85rem", fontWeight: 800, margin: 0, lineHeight: 1.15 }}>{title}</h2>
      <div className="rise-underline" style={{
        height: 3, width: 64, borderRadius: 2, marginTop: 14,
        background: `linear-gradient(90deg, ${ACCENT}, transparent)`,
      }} />
    </div>
  );
}

function Card({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div className={className} style={{
      background: "rgba(8,16,30,0.72)",
      border: `1px solid ${ACCENT}33`,
      borderRadius: 16,
      padding: 28,
      backdropFilter: "blur(6px)",
      ...style,
    }}>
      {children}
    </div>
  );
}

// Puce check / croix typographique (pas d'emoji)
function Mark({ ok }: { ok: boolean }) {
  return (
    <span style={{
      flexShrink: 0,
      width: 20, height: 20, borderRadius: "50%",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, fontWeight: 800, marginTop: 1,
      background: ok ? `${ACCENT}22` : "rgba(248,113,113,0.16)",
      color: ok ? ACCENT : "#f87171",
      border: `1px solid ${ok ? ACCENT + "66" : "rgba(248,113,113,0.4)"}`,
    }}>
      {ok ? "✓" : "✕"}
    </span>
  );
}

// Trophée doré animé — centerpiece des récompenses (SVG + double halo de rayons)
function ChampionBanner() {
  return (
    <div className="rise-fade" style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "10px 0 46px" }}>
      <div style={{ position: "relative", width: 240, height: 240, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Lueur centrale */}
        <div className="rise-halo" style={{
          position: "absolute", width: 200, height: 200, borderRadius: "50%",
          background: `radial-gradient(circle, ${GOLD}55 0%, ${GOLD}1f 36%, transparent 68%)`,
        }} />
        {/* Rayons larges (tournent lentement) */}
        <div className="rise-rays" style={{
          position: "absolute", width: 240, height: 240, borderRadius: "50%",
          background: `repeating-conic-gradient(${GOLD}66 0deg 2.6deg, transparent 2.6deg 9deg)`,
          WebkitMaskImage: "radial-gradient(circle, transparent 25%, #000 39%, #000 52%, transparent 73%)",
          maskImage: "radial-gradient(circle, transparent 25%, #000 39%, #000 52%, transparent 73%)",
        }} />
        {/* Rayons fins (contra-rotatifs) */}
        <div className="rise-rays2" style={{
          position: "absolute", width: 220, height: 220, borderRadius: "50%", opacity: 0.55,
          background: `repeating-conic-gradient(${GOLD}40 0deg 1deg, transparent 1deg 6deg)`,
          WebkitMaskImage: "radial-gradient(circle, transparent 30%, #000 46%, transparent 70%)",
          maskImage: "radial-gradient(circle, transparent 30%, #000 46%, transparent 70%)",
        }} />

        {/* Trophée */}
        <svg className="rise-trophy" width="108" height="108" viewBox="0 0 64 64" fill="none" style={{ position: "relative", filter: `drop-shadow(0 8px 18px ${GOLD}aa)` }}>
          <defs>
            <linearGradient id="rgGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff6c2" />
              <stop offset="0.42" stopColor={GOLD} />
              <stop offset="1" stopColor="#b8860b" />
            </linearGradient>
            <linearGradient id="rgBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffe066" />
              <stop offset="1" stopColor="#9a6f08" />
            </linearGradient>
          </defs>
          {/* Anses */}
          <path d="M17 12 C7 12 7 25 18 25" stroke="url(#rgGold)" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M47 12 C57 12 57 25 46 25" stroke="url(#rgGold)" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          {/* Coupe */}
          <path d="M15 9 H49 V15 C49 27 41 34 32 34 C23 34 15 27 15 15 Z" fill="url(#rgGold)" />
          {/* Rebord */}
          <rect x="13.5" y="7.5" width="37" height="4.4" rx="2.2" fill="#fff0a0" />
          {/* Reflet */}
          <path d="M21 13 C21 23 25 29 30 31 C26 30 20 25 20 15 Z" fill="#ffffff" opacity="0.32" />
          {/* Pied */}
          <rect x="29" y="34" width="6" height="6" fill="url(#rgBase)" />
          <path d="M24 40 H40 L37.5 46 H26.5 Z" fill="url(#rgBase)" />
          <rect x="21" y="46" width="22" height="4.6" rx="2.3" fill="url(#rgBase)" />
          <rect x="17.5" y="50.6" width="29" height="4.8" rx="2.4" fill="url(#rgBase)" />
          {/* Étoile centrale */}
          <path d="M32 14 l1.9 4 4.3 .5 -3.2 2.9 .9 4.2 -3.9 -2.2 -3.9 2.2 .9 -4.2 -3.2 -2.9 4.3 -.5 Z" fill="#fff7d6" />
        </svg>

        {/* Étincelles */}
        <span className="rise-spark" style={{ position: "absolute", top: 22, right: 44, color: "#fff", fontSize: 15 }}>✦</span>
        <span className="rise-spark" style={{ position: "absolute", bottom: 52, left: 38, color: GOLD, fontSize: 11, animationDelay: "1s" }}>✦</span>
        <span className="rise-spark" style={{ position: "absolute", top: 64, left: 30, color: "#fff", fontSize: 9, animationDelay: "1.8s" }}>✦</span>
      </div>

      <div style={{
        marginTop: 2, fontWeight: 900, fontSize: "1.2rem", letterSpacing: "0.04em",
        background: `linear-gradient(90deg, #fff3b0, ${GOLD})`, WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>
        3 concours remportés · 400+ projets battus
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function RiseDetail() {
  return (
    <>
      <style>{`
        @keyframes riseFadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes riseGrow   { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes riseCtaPulse {
          0%, 100% { transform: scale(1);    box-shadow: 0 0 50px ${ACCENT}88, 0 10px 30px rgba(0,0,0,0.4); }
          50%      { transform: scale(1.04); box-shadow: 0 0 80px ${ACCENT}cc, 0 10px 30px rgba(0,0,0,0.4); }
        }
        .rise-fade { opacity: 0; animation: riseFadeUp 0.6s ease forwards; }
        .rise-item { opacity: 0; animation: riseFadeUp 0.5s ease forwards; }
        .rise-underline { transform-origin: left center; animation: riseGrow 0.7s ease forwards; }
        .rise-cta { animation: riseCtaPulse 2s ease-in-out infinite; transition: transform 0.2s ease; }
        .rise-cta:hover { transform: scale(1.06); }
        .rise-hover { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
        .rise-stat:hover  { transform: translateY(-4px); border-color: ${ACCENT}99 !important; box-shadow: 0 10px 32px ${ACCENT}33; }
        .rise-tech:hover  { transform: translateY(-3px); border-color: ${ACCENT}aa !important; box-shadow: 0 8px 22px ${ACCENT}22; }
        .rise-pod:hover   { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.35); }
        .rise-chip:hover  { color: #fff; border-color: ${ACCENT}88 !important; background: ${ACCENT}1a !important; }

        /* Trophée animé */
        @keyframes riseSpin    { to { transform: rotate(360deg); } }
        @keyframes riseSpinRev { to { transform: rotate(-360deg); } }
        @keyframes riseFloat   { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-9px) rotate(2deg); } }
        @keyframes riseGlow    { 0%,100% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 0.95; transform: scale(1.1); } }
        @keyframes riseSparkle { 0%,100% { opacity: 0.15; transform: scale(0.5) rotate(0deg); } 50% { opacity: 1; transform: scale(1.15) rotate(90deg); } }
        .rise-rays    { animation: riseSpin 18s linear infinite; }
        .rise-rays2   { animation: riseSpinRev 26s linear infinite; }
        .rise-trophy  { animation: riseFloat 4s ease-in-out infinite; transform-origin: center bottom; }
        .rise-halo    { animation: riseGlow 3.4s ease-in-out infinite; }
        .rise-spark   { animation: riseSparkle 2.6s ease-in-out infinite; }

        /* Brillance qui balaie les cartes podium */
        @keyframes riseShine { 0% { transform: translateX(-160%) skewX(-18deg); } 55%,100% { transform: translateX(320%) skewX(-18deg); } }
        .rise-shine { position: absolute; top: 0; left: 0; width: 45%; height: 100%; pointer-events: none;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.22), transparent);
          animation: riseShine 4s ease-in-out infinite; }
      `}</style>

      <SpaceBackground />

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "64px 24px 96px", position: "relative", zIndex: 1 }}>
        {/* Retour */}
        <Link href="/projets" style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, textDecoration: "none", display: "inline-flex", gap: 6, marginBottom: 40 }}>
          ← Retour aux projets
        </Link>

        {/* ─── Hero ─── */}
        <header className="rise-fade" style={{ marginBottom: 64 }}>
          <span style={{
            display: "inline-block", background: GOLD, color: "#1a1400", fontWeight: 800,
            fontSize: "0.72rem", fontFamily: "monospace", letterSpacing: "0.04em",
            padding: "6px 14px", borderRadius: 20, marginBottom: 20, textTransform: "uppercase",
          }}>
            Startup EdTech · 3× primée
          </span>
          <h1 style={{
            color: "#fff", fontSize: "3.4rem", fontWeight: 900, lineHeight: 1.02, margin: "0 0 14px",
            textShadow: `0 0 40px ${ACCENT}40`,
          }}>
            RISE
          </h1>
          <p style={{ color: ACCENT, fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.02em", margin: "0 0 18px" }}>
            Reach · Inspire · Study · Explore
          </p>
          <p style={{ color: "rgba(255,255,255,0.86)", fontSize: "1.08rem", lineHeight: 1.75, maxWidth: 680, margin: 0 }}>
            Plateforme <Hl>B2B</Hl> dédiée à la <Hl>mobilité internationale</Hl> des étudiants. RISE{" "}
            <Hl>centralise tout le parcours</Hl> : candidatures, informations partenaires, témoignages vérifiés
            et recommandations locales — les universités abonnent leurs étudiants à un accès privé et structuré.
          </p>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
            <Link href="/projets/rise/site" className="rise-cta" style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              background: ACCENT, color: "#001220", fontWeight: 900,
              fontSize: "1.4rem", letterSpacing: "0.01em",
              padding: "22px 48px", borderRadius: 16, textDecoration: "none",
              boxShadow: `0 0 50px ${ACCENT}88, 0 10px 30px rgba(0,0,0,0.4)`,
            }}>
              Ouvrir le site RISE en live →
            </Link>
          </div>
        </header>

        {/* ─── 1. Tractions & prix ─── */}
        <section style={{ marginBottom: 64 }}>
          <div className="rise-fade"><SectionTitle kicker="Traction & reconnaissance" title="Ce que le projet a accompli" /></div>

          <ChampionBanner />

          {/* Chiffres */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 14, marginBottom: 30 }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="rise-item rise-hover rise-stat" style={{
                animationDelay: `${i * 0.07}s`,
                background: `linear-gradient(160deg, ${ACCENT}1f, transparent)`,
                border: `1px solid ${ACCENT}33`, borderRadius: 14, padding: "20px 12px", textAlign: "center",
              }}>
                <div style={{ color: "#fff", fontSize: "1.9rem", fontWeight: 900, lineHeight: 1, textShadow: `0 0 22px ${ACCENT}66` }}>{s.value}</div>
                <div style={{ color: ACCENT, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 9 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Podium */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 16 }}>
            {PODIUM.map((p, i) => (
              <div key={p.text} className="rise-item rise-hover rise-pod" style={{
                animationDelay: `${0.2 + i * 0.07}s`,
                position: "relative", overflow: "hidden",
                display: "flex", alignItems: "center", gap: 14,
                background: "rgba(8,16,30,0.72)", border: `1px solid ${p.color}55`,
                borderRadius: 14, padding: "16px 18px",
              }}>
                <div className="rise-shine" style={{ animationDelay: `${i * 0.9}s` }} />
                <span style={{
                  flexShrink: 0, fontWeight: 900, fontSize: "1.05rem", color: "#0a0a0a",
                  background: p.color, borderRadius: 10, padding: "8px 12px", minWidth: 46, textAlign: "center",
                  boxShadow: `0 0 18px ${p.color}66`, position: "relative",
                }}>{p.rank}</span>
                <span style={{ color: "rgba(255,255,255,0.92)", fontSize: "0.92rem", lineHeight: 1.4, fontWeight: 500, position: "relative" }}>{p.text}</span>
              </div>
            ))}
          </div>

          {/* Jalons */}
          <Card style={{ borderColor: "#ffffff1a" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px 28px" }}>
              {MILESTONES.map((m, i) => (
                <div key={m} className="rise-item" style={{ animationDelay: `${0.4 + i * 0.06}s`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Mark ok />
                  <span style={{ color: "rgba(255,255,255,0.88)", fontSize: "0.95rem", lineHeight: 1.5 }}>{m}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ─── 2. Histoire du projet ─── */}
        <section style={{ marginBottom: 64 }}>
          <div className="rise-fade"><SectionTitle kicker="L'histoire du projet" title="Du constat à la startup" /></div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p className="rise-item" style={{ animationDelay: "0.1s", color: "rgba(255,255,255,0.88)", fontSize: "1.08rem", lineHeight: 1.85, margin: 0 }}>
              Chaque année, des milliers d&apos;étudiants choisissent une destination internationale{" "}
              <Hl>sans informations fiables ni personnalisées</Hl>. RISE est né de ce constat :{" "}
              <Hl gold>transformer un processus complexe</Hl> en une expérience claire, guidée et optimisée.
            </p>

            <Card className="rise-item" style={{ animationDelay: "0.18s", borderColor: "rgba(248,113,113,0.25)" }}>
              <h3 style={{ color: "#fca5a5", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>Le constat</h3>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {PROBLEM.map((p) => (
                  <li key={p} style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.98rem", lineHeight: 1.5, display: "flex", gap: 12 }}>
                    <Mark ok={false} />{p}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="rise-item" style={{ animationDelay: "0.26s", borderColor: `${ACCENT}44` }}>
              <h3 style={{ color: ACCENT, fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>La solution</h3>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", margin: "0 0 16px", lineHeight: 1.6 }}>
                Une plateforme <Hl>privée</Hl>, réservée aux étudiants d&apos;universités partenaires.
              </p>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {SOLUTION.map((s) => (
                  <li key={s} style={{ color: "rgba(255,255,255,0.88)", fontSize: "0.98rem", lineHeight: 1.5, display: "flex", gap: 12 }}>
                    <Mark ok />{s}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="rise-item" style={{ animationDelay: "0.34s", borderColor: "#ffffff1a" }}>
              <h3 style={{ color: "#fff", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 10px" }}>Le modèle économique</h3>
              <p style={{ color: "rgba(255,255,255,0.86)", fontSize: "1rem", lineHeight: 1.75, margin: 0 }}>
                Modèle <Hl>B2B</Hl> : les universités souscrivent un abonnement annuel pour un nombre défini de comptes
                étudiants. Tout le monde y gagne — les <Hl>étudiants</Hl> (meilleure décision), les{" "}
                <Hl>universités</Hl> (meilleure gestion) et les <Hl>équipes pédagogiques</Hl> (meilleur pilotage).
              </p>
            </Card>

            <Card className="rise-item" style={{ animationDelay: "0.42s", borderColor: `${GOLD}40` }}>
              <h3 style={{ color: GOLD, fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>
                Mon rôle — Cofondateur <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "none", letterSpacing: 0 }}>(équipe de 4)</span>
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {ROLE.map((r) => (
                  <span key={r} className="rise-hover rise-chip" style={{
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 8, padding: "7px 13px", fontSize: "0.88rem", color: "rgba(255,255,255,0.85)",
                  }}>{r}</span>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* ─── 3. Stack technique ─── */}
        <section>
          <div className="rise-fade"><SectionTitle kicker="Stack technique" title="Comment c'est construit" /></div>

          <GroupLabel>Plateforme RISE</GroupLabel>
          <StackGrid items={STACK_RISE} />

          <GroupLabel style={{ marginTop: 30 }}>Chatbot RAG intégré</GroupLabel>
          <StackGrid items={STACK_RAG} />
        </section>

        {/* ─── CTA final ─── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginTop: 72 }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", margin: 0 }}>
            Envie de voir RISE en action ?
          </p>
          <Link href="/projets/rise/site" className="rise-cta" style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            background: ACCENT, color: "#001220", fontWeight: 900,
            fontSize: "1.3rem", letterSpacing: "0.01em",
            padding: "20px 44px", borderRadius: 16, textDecoration: "none",
            boxShadow: `0 0 50px ${ACCENT}88, 0 10px 30px rgba(0,0,0,0.4)`,
          }}>
            Ouvrir le site RISE en live →
          </Link>
        </div>
      </div>
    </>
  );
}
