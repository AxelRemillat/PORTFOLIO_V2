# Suivi des intentions (Umami)

Le site savait compter des pages vues ; il ne savait pas **ce que les gens
font**, ni **d'où ils viennent**. Ces deux manques font le reste : sans eux,
« 95 visites » ne dit pas s'il faut écrire plus sur LinkedIn ou envoyer plus de
mails.

Umami reste sans cookie, donc sans bandeau de consentement. **Aucune donnée
personnelle n'entre dans un événement** : jamais d'e-mail, de nom, de téléphone
ni le texte d'un formulaire — seulement des étiquettes courtes.

## Les événements

Noms en minuscules, stables. On ne les renomme pas sans migrer les objectifs
Umami : une série cassée ne se recolle pas.

| Événement | Quand | Propriétés |
| --- | --- | --- |
| `arrivee` | Une fois par session, au premier affichage | `canal`, `demo` et `v` si l'URL les portait |
| `cta_rdv` | Clic sur un lien de prise de rendez-vous (Google Agenda) | `page`, `canal` |
| `contact_submit` | **Après un envoi réussi** du formulaire de contact | `page`, `canal` |
| `contact_error` | Échec de cet envoi | `page`, `canal` |
| `demo_start` | Lancement d'une démo | `demo`, `canal` |
| `demo_result` | La démo a renvoyé un résultat | `demo`, `canal` |
| `offre_click` | Clic sur une offre depuis l'accueil | `offre`, `canal` |
| `sortie` | Clic sortant (LinkedIn, GitHub…) ou vers le formulaire depuis une démo | `cible`, `page`, `canal` |

Valeurs de `demo` : `agent-<métier>` (`agent-menuiserie`, `agent-btp`…) pour
l'agent devis, et `email`, `meeting`, `dataclean`, `invoice`, `sav` pour les
automatisations — les mêmes identifiants que `?demo=` dans les URL.

**L'écart entre `demo_start` et `demo_result` est le chiffre à regarder** : il
dit si les démos aboutissent ou si elles échouent en silence.

### Comment c'est branché

- `lib/analytics.ts` : l'envoi protégé (sans script, l'appel ne fait rien), la
  résolution du canal et son stockage de session.
- `components/TrackClicks.tsx` : **un seul** écouteur de clic en haut de
  l'arbre. Un élément suivi porte `data-ax-event` et, au choix,
  `data-ax-page`, `data-ax-offre`, `data-ax-cible`, `data-ax-demo`. Les liens
  restent des ancres rendues par le serveur — rien ne devient composant client,
  donc rien ne peut changer visuellement. C'est aussi le seul moyen d'ajouter
  le canal, que `data-umami-event` ne sait pas porter.
- `components/Attribution.tsx` : `arrivee` et l'exclusion `?moi=`.

> **Rupture de série du 09/10/2026.** Les anciens noms `cta-reserver`,
> `cta-demo`, `cta-besoin`, `offre`, `tuile-demo` et `demo-automatisation` ont
> été **remplacés**, pas doublés : deux attributs sur le même lien auraient
> compté chaque clic deux fois. Les relevés d'avant cette date portent les
> anciens noms.

## Les canaux

Au premier affichage de la session, le canal est résolu dans cet ordre :

1. **`?ref=`** s'il est présent — posé à la main, il fait foi. Valeurs
   reconnues : `linkedin`, `codeur`, `malt`, `upwork`, `comeup`, `signature`,
   `cv`, `orion`, `autre`. Une valeur inconnue devient `autre`.
2. **`?v=`** — le marqueur que les mails ORION mettent déjà dans leurs liens de
   démo → canal `orion`. (`?demo=` seul ne suffit pas : il sert aussi à la
   navigation interne du site.)
3. Le **referrer**, s'il est clair (linkedin, codeur, malt, upwork, comeup),
   sinon `autre`.
4. Sinon `direct`.

Le canal est retenu en `sessionStorage` et recollé à `cta_rdv`,
`contact_submit`, `contact_error`, `demo_start`, `demo_result`, `offre_click`
et `sortie`. **C'est ce qui permet de lire « tel canal → tant de contacts »**
au lieu de « tant de visites ».

Les paramètres existants ne changent pas : `?demo=invoice&v=2` continue
d'ouvrir l'onglet de la démo exactement comme avant.

## Les liens à utiliser, par canal

À copier tel quel. Le paramètre peut s'ajouter à n'importe quelle page.

| Canal | Lien |
| --- | --- |
| LinkedIn (profil, publications) | `https://axelremillat.com/?ref=linkedin` |
| LinkedIn → offres | `https://axelremillat.com/offres?ref=linkedin` |
| Codeur.com | `https://axelremillat.com/offres?ref=codeur` |
| Malt | `https://axelremillat.com/?ref=malt` |
| Upwork | `https://axelremillat.com/?ref=upwork` |
| ComeUp | `https://axelremillat.com/?ref=comeup` |
| Signature de mail | `https://axelremillat.com/pme?ref=signature` |
| CV (PDF, version en ligne) | `https://axelremillat.com/parcours?ref=cv` |
| Démo mise en avant sur LinkedIn | `https://axelremillat.com/agent?ref=linkedin` |
| Mails ORION | rien à faire : le `?v=` déjà présent vaut `orion` |

## Ne pas se compter soi-même

`https://axelremillat.com/?moi=1` sort ce navigateur des statistiques
(`localStorage` `umami.disabled`, la clé que le script d'Umami lit lui-même) et
affiche une ligne de confirmation. `?moi=0` l'y remet. À ouvrir une fois sur
chaque navigateur d'Axel et de sa famille. Aucune page indexée en plus, rien
dans le menu.

Cela n'écarte pas les robots d'aperçu de liens et les antivirus de messagerie —
les ~29 % de visites venues des États-Unis, d'Irlande, des Pays-Bas et de
Chine. Ceux-là se lisent dans Umami en filtrant sur le pays, ou se reconnaissent
à une visite sans aucun événement : un robot ne clique pas.

## À régler dans Umami

1. **Créer trois objectifs** (Website → Goals) : `contact_submit`, `cta_rdv`,
   `demo_start`. Ce sont les trois actions qui valent quelque chose.
2. **Lire les canaux** : Events → `arrivee`, puis la propriété `canal`. Croiser
   avec `contact_submit` pour savoir quel canal amène des gens qui agissent.
3. **Écarter les robots** : filtrer le rapport sur la France, ou comparer
   « visites » et « sessions ayant émis au moins un événement ».
