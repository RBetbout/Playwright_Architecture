import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

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
      'Projet/tests/**/*.ts',
      'Projet/steps/**/*.ts',
      'Projet/fixtures/**/*.ts',
      'Projet/pages/**/*.ts',
      'Projet/components/**/*.ts',
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
  { files: ['Projet/steps/**/*.ts'], rules: { 'playwright/no-standalone-expect': 'off' } },
  // Seul le logger a le droit d'écrire sur la console.
  { files: ['Projet/utils/helpers/logger.ts'], rules: { 'no-console': 'off' } },
  prettier,
);
