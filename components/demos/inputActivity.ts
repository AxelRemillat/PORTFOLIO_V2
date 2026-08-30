// État partagé « utilisateur en saisie active » (singleton module, comme
// speechControl.ts). Vrai quand le champ de message est focus ET non vide, OU
// que le micro (STT) est en écoute. Consommé par useIdleBanter pour suspendre le
// planificateur de répliques ambiantes et couper toute réplique déjà en cours,
// afin de ne jamais parler par-dessus la question de l'utilisateur.

let typing = false; // champ focus + non vide
let mic = false;    // micro en écoute (dictée)
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export function setTyping(v: boolean) {
  if (v !== typing) { typing = v; emit(); }
}

export function setMicActive(v: boolean) {
  if (v !== mic) { mic = v; emit(); }
}

// Vrai tant que l'utilisateur est en train de poser sa question (écrit ou oral).
export function isUserInputting(): boolean {
  return typing || mic;
}

// S'abonne aux changements d'état. Renvoie une fonction de désabonnement.
export function subscribeInputActivity(fn: () => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
