import { createRequire } from 'node:module';

// Les dépendances sont installées dans config_playwright/node_modules, que ce dossier ne voit pas par défaut.
const require = createRequire(`${import.meta.dirname}/../config_playwright/`);
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const playwright = require('eslint-plugin-playwright');
const prettier = require('eslint-config-prettier');

// Lancé depuis la racine du dépôt (voir le script "lint") : les chemins partent de là.
export default tseslint.config(
  { ignores: ['**/node_modules/', 'reports/', '**/.features-gen/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': 'error',
    },
  },
  {
    ...playwright.configs['flat/recommended'],
    files: [
      'Test_E2E/*/steps/**/*.ts',
      'Test_E2E/fixtures/**/*.ts',
      'Test_E2E/Support/pages/**/*.ts',
      'Test_E2E/Support/components/**/*.ts',
    ],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-force-option': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/expect-expect': ['error', { assertFunctionNames: ['expectNoAccessibilityViolations'] }],
    },
  },
  // Les steps Gherkin portent les assertions hors d'un bloc test() : c'est attendu en BDD.
  { files: ['Test_E2E/*/steps/**/*.ts'], rules: { 'playwright/no-standalone-expect': 'off' } },
  // Seul le logger a le droit d'écrire sur la console.
  { files: ['Test_E2E/Support/utils/logger.ts'], rules: { 'no-console': 'off' } },
  prettier,
);
