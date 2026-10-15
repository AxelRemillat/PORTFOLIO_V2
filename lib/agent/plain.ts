// Email de l'agent devis en TEXTE BRUT (Cowork #45). Le prompt le demande déjà ;
// ce nettoyage est le filet de sécurité : le Markdown (**gras**, __gras__, # titres,
// puces « * ») s'affichait tel quel dans « Mail de réponse » et partait dans « Copier ».
export function plainEmail(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*\*|__/g, "")
    .replace(/^[ \t]*#{1,6}[ \t]+/gm, "")
    .replace(/^([ \t]*)[*+][ \t]+/gm, "$1- ")
    .trim();
}
