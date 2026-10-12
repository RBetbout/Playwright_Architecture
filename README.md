# Playwright Architecture

Architecture de tests automatisés de bout en bout (E2E), prête à être branchée sur n'importe quel
site web : il suffit de renseigner l'URL cible pour commencer à écrire des parcours.

Le dépôt fournit le socle (structure, configuration, outillage, rapport, pipeline) et quelques
tests génériques qui servent de modèles. Il ne contient pas encore de tests propres à un site.

## Ce que contient le projet

| Besoin                    | Solution retenue                                                              |
| ------------------------- | ----------------------------------------------------------------------------- |
| Exécution des tests       | [Playwright](https://playwright.dev/) + TypeScript en mode strict             |
| Structuration du code     | Page Object Model et Component Objects (en-tête, navigation, pied de page…)   |
| Spécifications            | BDD / Gherkin en français, via `playwright-bdd`                               |
| Multi-environnements      | `dev`, `staging`, `prod` : un fichier `.env` par environnement                |
| Fixtures                  | Un point d'entrée unique qui fournit Page Objects, configuration et reporting |
| Données de test           | Séparées du code ; identifiants lus dans les variables d'environnement        |
| Rapport                   | [reportingLabs](https://www.reportinglabs.dev/) (HTML + PDF) et rapport HTML Playwright |
| Analyse des échecs        | Screenshot, vidéo, trace et diagnostic de la page (console, requêtes en erreur) |
| Accessibilité             | Analyse WCAG 2.1 AA avec axe-core                                             |
| Qualité du code           | ESLint et Prettier                                                            |
| Intégration continue      | Pipeline Jenkins                                                              |

## Organisation du dépôt

```
├── Playwright/     Outillage : package.json, configuration Playwright, ESLint, Prettier, rapport
├── Projet/         Code de test
│   ├── spec/       Scénarios Gherkin (.feature)
│   ├── steps/      Implémentation des étapes Gherkin
│   ├── tests/      Tests Playwright, rangés par suite (smoke, navigation, formulaires, SEO, liens…)
│   ├── pages/      Page Objects
│   ├── components/ Composants réutilisables
│   ├── fixtures/   Fixtures partagées
│   ├── data/       Données de test
│   ├── utils/      Utilitaires (liens, SEO, accessibilité, journalisation, reporting)
│   └── config/     Environnements et routes
├── CICD/           Jenkinsfile
└── reports/        Rapports générés (non versionnés)
```

## Démarrage rapide

Prérequis : Node.js 20 ou plus récent.

```bash
# 1. Installer les dépendances et le navigateur
cd Playwright
npm ci
npx playwright install chromium

# 2. Créer la configuration de l'environnement, puis y renseigner BASE_URL
cp ../Projet/config/environments/.env.example ../Projet/config/environments/.env.dev

# 3. Lancer les tests
npm test
```

Le rapport est écrit à la fin de chaque exécution dans `reports/reporting-labs/index.html`.

## Commandes utiles

Elles se lancent depuis `Playwright/` ou depuis la racine du dépôt.

| Commande                | Effet                                                |
| ----------------------- | ---------------------------------------------------- |
| `npm test`              | Tous les tests, sur l'environnement `dev`            |
| `npm run test:staging`  | Tous les tests, sur `staging` (`test:prod` pour prod) |
| `npm run test:smoke`    | Suite smoke uniquement                               |
| `npm run test:bdd`      | Scénarios Gherkin uniquement                         |
| `npm run test:headed`   | Navigateur visible                                   |
| `npm run test:debug`    | Pas à pas avec Playwright Inspector                  |
| `npm run report:open`   | Ouvre le dernier rapport reportingLabs               |
| `npm run lint`          | Contrôle ESLint                                      |

Les suites disponibles sont `smoke`, `regression`, `functional`, `navigation`, `forms`, `a11y`,
`seo` et `links` : chacune a sa commande `npm run test:<suite>`.

## Principes d'architecture

- **Les suites sont définies par des tags** (`@smoke`, `@regression`…), valables aussi bien pour
  un test Playwright que pour un scénario Gherkin.
- **Les mêmes tags alimentent le rapport** : `@feature:Navigation`, `@story:Menu_mobile`,
  `@severity:critical` classent chaque test par fonctionnalité et par gravité.
- **Aucun identifiant dans le code** : les fichiers `.env.*` ne sont pas versionnés, et en CI les
  identifiants viennent des credentials Jenkins.
- **Locators robustes** : par rôle, libellé, texte ou `data-testid` ; pas de XPath ni d'attente fixe.

## État actuel

- Seul Chromium est activé. Firefox, WebKit, tablette et mobile sont prêts mais commentés dans
  `Playwright/playwright.config.ts`.
- Les suites `regression`, `functional` et `forms` sont vides : elles dépendent du site à tester.
- Le sélecteur du bandeau de cookies est générique et doit être ajusté au site cible.
- Le pipeline Jenkins est écrit mais n'a pas encore été exécuté sur un serveur.
