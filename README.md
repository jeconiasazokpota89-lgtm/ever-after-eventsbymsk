# Ever After Events — Site vitrine (Concours dev)

Site vitrine pour **Ever After Events**, agence spécialisée dans l'organisation de
mariages **traditionnels, civils et réceptions**. Projet réalisé par la **Team MSK**.

## Arborescence

```
ever-after-events/
├── index.html        → page unique, toutes les sections
├── css/
│   └── style.css     → tokens de design, composants, animations
└── js/
    └── main.js        → toutes les interactions (menu, galerie, simulateur, chat, etc.)
```

## Stack technique

- **HTML5** sémantique, responsive mobile-first
- **Tailwind CSS** via CDN (config étendue dans le `<script>` du `<head>` : couleurs, polices)
- **JavaScript vanilla**, sans framework ni dépendance lourde
- **AOS** (Animate On Scroll) — CDN, révélations au défilement
- **RemixIcon** — CDN, iconographie
- **Google Fonts** — Fraunces (titres), Work Sans (texte courant), Caveat (signature manuscrite)
- Images : photographies Unsplash libres de droit, chargées par URL directe
  (aucun poids ajouté au dépôt, faciles à remplacer par vos propres photos)

Aucune installation n'est nécessaire : ouvrez `index.html` dans un navigateur,
ou servez le dossier avec n'importe quel serveur statique.

## Identité visuelle

- **Vin profond** `#4A1128` (fond principal, header, sections sombres), **or cérémonie**
  `#C9A24D`, **ivoire rosé** `#FDF5F3`, **rose-vin** `#A32846` (accents, citations) —
  une palette inspirée des tissus de cérémonie et des roses de mariage plutôt que des
  tons "IA par défaut".
- Élément signature : un **sceau circulaire doré** (cachet de cire) qui rappelle
  le scellement d'un mariage civil — utilisé comme logo, séparateur de section et badge.
- Touche manuscrite (police Caveat) sur les citations et signatures des avis clients,
  écho au registre que l'on signe à la mairie.

## Localisation

Une **carte Google Maps intégrée** (iframe, sans clé API) est affichée dans la section
Contact, sous le formulaire, pointant sur Cotonou, Bénin. Pour pointer une adresse
précise (bureau réel), remplacez la valeur `q=` dans l'URL de l'iframe (`index.html`,
section `#contact`) par l'adresse exacte, par exemple
`q=Rue+de+l'Agence,+Cotonou,+Bénin`.

## Fonctionnalités ajoutées au-delà des 6 sections demandées

1. **Simulateur de devis interactif** (`#devis`) — estimation live en FCFA selon le
   type de cérémonie, le nombre d'invités et les options cochées.
2. **Mini-chatbot FAQ flottant** (`#chat-toggle` / `#chat-panel`) — assistant 100 %
   local par mots-clés (prix, délais, dot, civil, contact), aucune API externe :
   rapide, léger, fonctionne hors-ligne une fois la page chargée.
3. **Bouton WhatsApp flottant** pour un contact direct instantané.
4. **Galerie filtrable + lightbox** (`#galerie`) — catégories Traditionnel / Civil /
   Réceptions, ouverture en grand au clic, fermeture au clic extérieur ou Échap.
5. **Carrousel d'avis clients** auto-défilant, pause au survol, navigation par points.
6. **FAQ en accordéon**, **compteurs animés** (À propos), **formulaire de contact**
   validé en JS avec confirmation d'envoi, **menu burger** mobile avec panneau coulissant,
   **bouton retour en haut**.

## Pourquoi ces choix (et pas une IA de chat complète) ?

Le brief demandait un site qui se charge facilement. Un vrai chatbot IA nécessiterait
une clé API et un appel réseau à chaque message (latence, coût, dépendance externe).
Le mini-assistant ici est un moteur de correspondance de mots-clés en JavaScript pur :
il donne l'impression d'un assistant intelligent sur les questions les plus fréquentes,
sans ralentir le chargement ni dépendre d'un service tiers.

## Pour aller plus loin (mise en production réelle)

- Brancher le formulaire de contact à un vrai backend (Formspree, EmailJS, API interne) —
  actuellement simulé côté client par design (aucun serveur fourni dans ce livrable).
- Remplacer les coordonnées de démonstration (téléphone, e-mail, numéro WhatsApp) par
  les vraies coordonnées de l'agence.
- Remplacer les photographies Unsplash par vos propres visuels de mariages réalisés.
