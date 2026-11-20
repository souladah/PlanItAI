# PlanItAI

PlanItAI est une application web qui transforme le brief d’un projet en plan de travail composé de tâches. La génération de plan utilise l’API Gemini ; un mode démo permet de découvrir l’application sans clé API.

## Fonctionnalités

- Créer un projet en renseignant son nom, sa description, sa durée, son équipe et ses technologies.
- Générer un plan de tâches avec des user stories, des critères d’acceptation, des estimations et des dépendances.
- Consulter l’avancement des projets depuis le dashboard.
- Suivre, modifier et supprimer les tâches dans un tableau Kanban.
- Charger des projets d’exemple avec le mode démo.

## Démarrer en local

Le projet ne nécessite pas d’étape de compilation. Comme il utilise des modules JavaScript et charge des données JSON, servez les fichiers via HTTP plutôt que d’ouvrir `index.html` directement.

1. Ouvrez un terminal à la racine du projet.
2. Lancez un serveur local :

   ```powershell
   python -m http.server 8000
   ```

3. Ouvrez [http://localhost:8000](http://localhost:8000) dans un navigateur moderne.

## Utiliser la génération IA

1. Dans l’application, ouvrez **Paramètres**.
2. Saisissez une clé API Gemini et enregistrez-la.
3. Ouvrez **Nouveau projet**, remplissez le formulaire puis envoyez-le pour générer le plan.

La clé est conservée dans le stockage de session du navigateur et l’application appelle Gemini directement depuis le navigateur. Ne placez pas une clé réelle dans le code source ni dans un commit Git. Le mode démo fonctionne sans clé API.

## Technologies

- HTML
- JavaScript avec modules ES6
- Tailwind CSS chargé depuis le CDN du navigateur
- API Gemini pour la génération des plans

## Structure du projet

- `index.html` : dashboard des projets
- `new-projet.html` : formulaire de création
- `Detail-projet.html` : détails du projet et tableau Kanban
- `js/` : modules d’interface, validation, stockage et génération IA
- `data/data.json` : données des projets de démonstration

## Démo

[planitai.vercel.app](https://planitai.vercel.app)
