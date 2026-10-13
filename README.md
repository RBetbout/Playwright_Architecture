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
| Tests d'API               | Client HTTP, steps Gherkin génériques, validation de schéma JSON              |
| Tests de base de données  | PostgreSQL et MySQL derrière une même interface, steps SQL génériques         |
| Conteneurs                | Image Docker d'exécution des tests et bases locales (Docker Compose)          |
| Accessibilité             | Analyse WCAG 2.1 AA avec axe-core                                             |
| Qualité du code           | ESLint et Prettier                                                            |
| Intégration continue      | Pipeline Jenkins                                                              |

## Organisation du dépôt

```
├── Configuration_Playwright/  Outillage
│   ├── config_playwright/     package.json, configuration Playwright, TypeScript, dépendances
│   ├── config_report/         Configuration du rapport reportingLabs et script d'ouverture
│   ├── config_qualite/        ESLint et Prettier
│   └── config_docker/         Dockerfile et docker-compose.yml
├── Test_E2E/                  Code de test
│   ├── Test_Web/              Tests de l'interface web : features/ et steps/
│   ├── Test_API/              Tests d'API : features/ et steps/
│   ├── Test_BDD/              Tests de base de données : features/ et steps/
│   ├── fixtures/              Fixture unique, partagée par les trois domaines
│   └── Support/               Tout ce dont les steps ont besoin
│       ├── config/            Environnements (.env) et routes
│       ├── api/               Client d'API et validation de schéma
│       ├── db/                Clients PostgreSQL et MySQL
│       ├── pages/             Page Objects
│       ├── components/        Composants réutilisables
│       ├── data/              Données de test et schémas JSON
│       └── utils/             Utilitaires (liens, SEO, accessibilité, journalisation, reporting)
├── CICD/                      Jenkinsfile
└── reports/                   Rapports générés (non versionnés)
```

Tous les tests sont écrits en BDD : un scénario dans `features/`, ses étapes dans `steps/`.
Il n'y a pas de tests Playwright écrits directement en `.spec.ts`.

## Démarrage rapide

Prérequis : Node.js 20 ou plus récent.

```bash
# 1. Installer les dépendances et le navigateur
cd Configuration_Playwright/config_playwright
npm ci
npx playwright install chromium

# 2. Créer la configuration de l'environnement, puis y renseigner BASE_URL
cp ../../Test_E2E/Support/config/environments/.env.example ../../Test_E2E/Support/config/environments/.env.dev

# 3. Lancer les tests
npm test
```

Le rapport est écrit à la fin de chaque exécution dans `reports/reporting-labs/index.html`.

## Commandes utiles

Elles se lancent depuis `Configuration_Playwright/config_playwright/` ou depuis la racine du dépôt.

| Commande                | Effet                                                |
| ----------------------- | ---------------------------------------------------- |
| `npm test`              | Tous les tests, sur l'environnement `dev`            |
| `npm run test:staging`  | Tous les tests, sur `staging` (`test:prod` pour prod) |
| `npm run test:smoke`    | Suite smoke uniquement                               |
| `npm run test:api`      | Scénarios de `Test_API/` uniquement (`test:bd` pour `Test_BDD/`) |
| `npm run test:headed`   | Navigateur visible                                   |
| `npm run test:debug`    | Pas à pas avec Playwright Inspector                  |
| `npm run report:open`   | Ouvre le dernier rapport reportingLabs               |
| `npm run lint`          | Contrôle ESLint                                      |

Les suites disponibles sont `smoke`, `regression`, `functional`, `navigation`, `forms`, `a11y`,
`seo` et `links` : chacune a sa commande `npm run test:<suite>`.

## Tests d'API et de base de données

Les étapes sont génériques : un scénario s'écrit sans code, dans `Test_API/features/` ou `Test_BDD/features/`.

```gherkin
Quand j'envoie une requête POST sur "/clients" avec le corps :
  """
  { "nom": "Ada" }
  """
Alors le statut de la réponse est 201
Et le champ "nom" de la réponse vaut "Ada"
Et la réponse respecte le schéma "client"
```

```gherkin
Quand j'exécute la requête SQL :
  """
  SELECT nom FROM clients WHERE id = 1
  """
Alors la requête retourne 1 ligne
Et la colonne "nom" de la première ligne vaut "Ada"
```

- L'API est appelée sur `API_URL`, avec `API_TOKEN` en `Authorization: Bearer` s'il est renseigné.
- Les schémas JSON sont des fichiers `Test_E2E/Support/data/schemas/<nom>.json`.
- Le moteur de base est choisi par `DB_ENGINE` (`postgresql` ou `mysql`) ; la connexion par `DB_HOST`,
  `DB_PORT`, `DB_NAME`, `DB_USER` et `DB_PASSWORD`.
- Sur l'environnement `prod`, seules les requêtes de lecture sont acceptées.
- La liste complète des étapes est dans `Test_API/steps/` et `Test_BDD/steps/`.

## Docker

Prérequis : Docker avec Docker Compose.

| Commande                  | Effet                                                              |
| ------------------------- | ------------------------------------------------------------------ |
| `npm run docker:db:up`    | Démarre une base PostgreSQL et une base MySQL locales, vides       |
| `npm run docker:db:down`  | Les arrête                                                         |
| `npm run docker:build`    | Construit l'image d'exécution des tests                            |
| `npm run docker:test`     | Lance les tests dans le conteneur (`-- --grep @smoke` pour filtrer) |

Les bases locales sont accessibles sur `localhost` (ports 5432 et 3306), avec `e2e` comme nom de base,
utilisateur et mot de passe. Depuis le conteneur de tests, leur hôte est `postgres` ou `mysql`.

Le conteneur lit le fichier `.env.<environnement>` du poste et écrit les rapports dans `reports/`.

## Principes d'architecture

- **Les suites sont définies par des tags** (`@smoke`, `@regression`…) posés sur les fonctionnalités
  et les scénarios Gherkin.
- **Les mêmes tags alimentent le rapport** : `@feature:Navigation`, `@story:Menu_mobile`,
  `@severity:critical` classent chaque scénario par fonctionnalité et par gravité.
- **Aucun identifiant dans le code** : les fichiers `.env.*` ne sont pas versionnés, et en CI les
  identifiants viennent des credentials Jenkins.
- **Locators robustes** : par rôle, libellé, texte ou `data-testid` ; pas de XPath ni d'attente fixe.

## État actuel

- Seul Chromium est activé. Firefox, WebKit, tablette et mobile sont prêts mais commentés dans
  `Configuration_Playwright/config_playwright/playwright.config.ts`.
- Les suites `functional` et `forms` sont vides : elles dépendent du site à tester.
- `Test_API/` et `Test_BDD/` contiennent chacun un scénario générique de disponibilité : ils échouent tant
  que `API_URL` et les variables `DB_*` ne sont pas renseignées.
- Le client MySQL et les fichiers Docker n'ont pas encore été exécutés.
- Le sélecteur du bandeau de cookies est générique et doit être ajusté au site cible.
- Le pipeline Jenkins est écrit mais n'a pas encore été exécuté sur un serveur.
