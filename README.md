# Pitch Clarity Score

Application web SaaS légère qui analyse un pitch écrit et retourne un score de clarté, d’impact et de conviction, avec diagnostic détaillé et réécriture.

## 1) Présentation du projet
Pitch Clarity Score aide entrepreneurs, dirigeants, managers, freelances et commerciaux à savoir si leur pitch est clair, synthétique, mémorable et orienté action.

## 2) Fonctionnalités principales
- Score global sur 100
- Verdict immédiat
- Analyse par 10 critères
- Forces (max 3)
- Faiblesses prioritaires (max 3)
- Erreurs détectées
- Recommandations actionnables
- Version améliorée du pitch
- Version courte (120 mots max)
- 3 propositions d’appel à l’action
- Compteur mots/caractères + indicateur de longueur
- Validation et gestion d’erreurs
- Mode IA + fallback local

## 3) Stack utilisée
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API (serveur uniquement)

## 4) Installation
```bash
npm install
```

## 5) Lancement en local
```bash
npm run dev
```
Puis ouvrez http://localhost:3000.

## 6) Variables d’environnement
Créer `.env.local` depuis `.env.example`:
```bash
cp .env.example .env.local
```
Variable disponible:
- `OPENAI_API_KEY` (optionnelle) : active le mode IA.

## 7) Fonctionnement du scoring
L’analyse suit 10 critères pondérés:
1. Message unique et lisible (15)
2. Bénéfice client (15)
3. Cible identifiée (10)
4. Problème ou besoin traité (10)
5. Proposition de valeur (15)
6. Structure (10)
7. Concision (10)
8. Curiosité (5)
9. Langage clair (5)
10. Appel à l’action (5)

Interprétation:
- 0–39: Pitch confus
- 40–59: Compréhensible mais flou
- 60–74: Correct mais perfectible
- 75–89: Bon pitch
- 90–100: Excellent pitch

## 8) Mode IA
Route: `POST /api/analyze`
- Validation serveur
- Limite de longueur
- Clé API non exposée au client
- Réponse contrainte en JSON schema

## 9) Mode fallback local
Si `OPENAI_API_KEY` est absente ou si l’API échoue, l’app bascule en analyse heuristique locale:
- nombre de mots
- longueur moyenne des phrases
- signaux de cible/problème/bénéfice/CTA
- détection de jargon/termes flous
- fin faible et dispersion

## 10) Exemples de pitchs à tester
Exemple faible:
> Je propose un accompagnement personnalisé pour aider les entreprises à améliorer leur communication grâce à une méthode innovante et complète.

Exemple meilleur:
> J’aide les dirigeants qui ont du mal à être clairs à l’oral à structurer leurs prises de parole pour convaincre plus vite, rassurer leurs équipes et faire passer leurs décisions avec plus d’impact.

Exemple trop long:
> Nous accompagnons toutes les entreprises sur l’ensemble des sujets de communication stratégique, opérationnelle, interne, externe, éditoriale et commerciale avec un programme global en plusieurs phases, basé sur des ateliers collaboratifs, des diagnostics approfondis, des plans d’action détaillés, des suivis hebdomadaires et une méthodologie complète qui couvre toutes les dimensions de la performance verbale et narrative afin d’apporter une valeur ajoutée maximale et durable sur le long terme pour chaque équipe et chaque manager.

## 11) Limites actuelles
- L’analyse IA dépend de la qualité du modèle et du prompt.
- Le fallback reste heuristique.
- Pas d’authentification ni d’historique utilisateur.

## 12) Améliorations futures
- Historique des analyses
- Export PDF
- Comparaison avant/après
- Coaching interactif tour par tour
- Internationalisation FR/EN
