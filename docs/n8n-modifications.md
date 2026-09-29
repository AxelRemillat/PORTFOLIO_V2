# Modifications à faire dans n8n (refonte PME)

Deux démos de `/automatisations` exécutent leur logique dans n8n, pas dans ce
dépôt. Le site envoie déjà ce qu'il faut ; il reste à adapter les workflows.
Tant que ce n'est pas fait, les démos continuent de fonctionner comme avant (les
nouveaux champs sont simplement ignorés).

Ordre conseillé : dupliquer le workflow, modifier la copie, tester avec les
commandes ci-dessous, puis basculer l'URL du webhook dans Vercel
(`N8N_SAV_WEBHOOK_URL`, `N8N_DATACLEAN_WEBHOOK_URL`).

---

## 1. Service client (SAV) configurable par métier

### Ce que le site envoie désormais

`POST` sur `N8N_SAV_WEBHOOK_URL` (en-tête `x-demo-secret` inchangé) :

```json
{
  "question": "Mon volet roulant électrique ne répond plus",
  "metier": "menuiserie",
  "entreprise": "Atelier Boisclair",
  "activite": "Fenêtres, portes et volets sur mesure, fourniture et pose.",
  "base": [
    { "id": "M1", "question": "Ma fenêtre ferme mal ou frotte", "reponse": "…" },
    { "id": "M3", "question": "Mon volet roulant ne répond plus", "reponse": "…" }
  ]
}
```

`metier` vaut `menuiserie`, `btp`, `negoce`, `boulangerie` ou `services`. La
base vient du serveur (`lib/metiers/*.ts`, champ `sav`), jamais du navigateur.

### Changements dans le workflow

1. **Nœud de recherche dans la FAQ** (aujourd'hui branché sur la FAQ Flowbit) :
   le remplacer par un nœud **Code** qui cherche dans `body.base` quand elle est
   présente, et garde l'ancienne recherche sinon.

   ```js
   // Nœud Code « Recherche base » — mode "Run once for all items"
   const body = $input.first().json.body ?? $input.first().json;
   const norm = (s) => String(s ?? "").toLowerCase().normalize("NFD")
     .replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ");
   const mots = norm(body.question).split(/\s+/).filter((m) => m.length > 2);
   const base = Array.isArray(body.base) ? body.base : [];
   const extraits = base
     .map((e) => {
       const texte = norm(`${e.question} ${e.reponse}`);
       const score = mots.filter((m) => texte.includes(m)).length / Math.max(1, mots.length);
       return { id: e.id, question: e.question, reponse: e.reponse, score: Math.round(score * 100) / 100 };
     })
     .filter((e) => e.score > 0)
     .sort((a, b) => b.score - a.score)
     .slice(0, 3);
   return [{ json: { ...body, extraits } }];
   ```

   (Si le workflow utilise des embeddings, on peut à la place calculer
   l'embedding de chaque entrée de `base` à la volée : 6 entrées par métier,
   coût négligeable.)

2. **Prompt de l'agent de réponse** : remplacer « Flowbit » par les champs reçus.

   ```text
   Tu es l'assistant du service client de {{ $json.entreprise }} ({{ $json.activite }}).
   Réponds UNIQUEMENT à partir des extraits fournis, en vouvoyant, en 2 ou 3 phrases.
   Cite les identifiants des extraits utilisés.
   Si aucun extrait ne répond à la question : trouve=false, et propose de transmettre
   la demande à un conseiller. Ne dis jamais que la question « ne concerne pas » l'entreprise.
   ```

3. **Réponse du webhook** : le contrat ne change pas (`reponse`, `trouve`,
   `confiance`, `sources`, `extraits`), l'interface l'affiche déjà.

### Tester

```bash
curl -s -X POST "$N8N_SAV_WEBHOOK_URL" -H "Content-Type: application/json" \
  -H "x-demo-secret: $N8N_DEMO_SECRET" \
  -d '{"question":"Vous avez la garantie décennale ?","metier":"btp","entreprise":"Rénov'"'"'Artisans","activite":"Rénovation intérieure","base":[{"id":"B3","question":"Assurance et garantie décennale","reponse":"Nous sommes couverts en décennale ; l’attestation est jointe à chaque devis."}]}'
```

Attendu : `trouve: true`, source `B3`. Puis une question hors base
(« Vous faites aussi les piscines ? ») : `trouve: false`, transfert à un conseiller.

---

## 2. Fichier clients : doublons insensibles à la casse, aux accents et aux espaces

Objectif : « Dupont SARL », « dupont sarl » et «  Dupont  SARL  » sont un seul
client. Fichier de test ajouté : `public/samples/data/clients-doublons.csv`
(bouton « Doublons (majuscules, accents) » dans la démo). Il contient 10 lignes
pour 5 clients distincts.

### Changement dans le workflow

Dans le nœud **Code** qui déduplique (étape « Normalisation · dédup »),
remplacer la clé de comparaison actuelle (probablement la ligne brute ou
`JSON.stringify(row)`) par une clé normalisée. On garde la PREMIÈRE occurrence,
avec ses valeurs d'origine (on ne réécrit pas le nom du client).

```js
// Clé de dédup : minuscules, sans accents, espaces multiples réduits, ponctuation retirée.
const cle = (v) => String(v ?? "")
  .normalize("NFD").replace(/[̀-ͯ]/g, "")  // é → e
  .toLowerCase()
  .replace(/[^a-z0-9@.+]/g, " ")                      // tirets, virgules… → espace
  .replace(/\s+/g, " ")
  .trim();

// Colonnes qui identifient un client : email s'il existe, sinon nom/société.
// Le téléphone est comparé chiffres seuls (06-12… = 06 12… = 0612…).
const tel = (v) => String(v ?? "").replace(/\D/g, "").replace(/^33/, "0");
const identite = (row) => {
  const get = (re) => Object.keys(row).find((k) => re.test(cle(k)));
  const email = get(/mail/), nom = get(/societe|entreprise|raison|nom|client/), phone = get(/tel|phone/);
  if (email && cle(row[email]).includes("@")) return `e:${cle(row[email])}`;
  return `n:${cle(row[nom])}|t:${tel(row[phone])}`;
};

const vus = new Map();
const doublons = [];
for (const row of rows) {            // rows = lignes après normalisation des formats
  const k = identite(row);
  if (vus.has(k)) doublons.push(row); else vus.set(k, row);
}
const lignesUniques = [...vus.values()];
// stats.duplicates_removed = doublons.length ; apercu_doublons = doublons.slice(0, 5)
```

Si le nœud compare toutes les colonnes (pas seulement l'identité), appliquer
`cle()` à chaque valeur avant de construire la clé : `Object.values(row).map(cle).join("|")`.

### Tester

Dans `/automatisations?demo=dataclean`, bouton « Doublons (majuscules,
accents) ». Attendu : `rows_in: 10`, `rows_out: 5`, `duplicates_removed: 5`.
