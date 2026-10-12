import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { config } from '../Projet/config/config';
import reportingLabs from './reporting-labs.config';

// Ce fichier vit dans Playwright/ (outillage) ; le code de test est dans Projet/ et les rapports dans reports/.
const projectDir = path.resolve(__dirname, '../Projet');
const reportsDir = path.resolve(__dirname, '../reports');

// Les fichiers .feature de Projet/spec/ sont compilés en tests Playwright dans Playwright/.features-gen/ (npm run bdd:gen).
const bddOutputDir = defineBddConfig({
  language: 'fr',
  featuresRoot: projectDir,
  features: path.join(projectDir, 'spec/**/*.feature'),
  steps: [path.join(projectDir, 'steps/**/*.ts'), path.join(projectDir, 'fixtures/test.fixture.ts')],
  outputDir: path.join(__dirname, '.features-gen'),
});

const DEVICES = {
  chromium: devices['Desktop Chrome'],
  // firefox: devices['Desktop Firefox'],
  // webkit: devices['Desktop Safari'],
  // tablet: devices['iPad (gen 7)'],
  // 'mobile-chrome': devices['Pixel 7'],
  // 'mobile-safari': devices['iPhone 14'],
};

// playwright-bdd impose un testDir dédié aux tests générés : chaque navigateur a donc
// un projet "<nom>" (tests/) et un projet "<nom>-bdd" (scénarios Gherkin).
const projects = Object.entries(DEVICES).flatMap(([name, device]) => [
  { name, testDir: path.join(projectDir, 'tests'), use: { ...device } },
  { name: `${name}-bdd`, testDir: bddOutputDir, use: { ...device } },
]);

export default defineConfig({
  outputDir: path.join(reportsDir, 'test-results'),
  // Projet/ n'a pas de node_modules : ce tsconfig fait pointer ses imports vers Playwright/node_modules.
  tsconfig: path.join(__dirname, 'tsconfig.json'),

  fullyParallel: true,
  forbidOnly: config.isCI,
  retries: config.isCI ? 2 : 0,
  workers: config.isCI ? 4 : undefined,

  timeout: config.timeouts.test,
  expect: { timeout: config.timeouts.expect },

  reporter: [
    [config.isCI ? 'line' : 'list'],
    ['html', { outputFolder: path.join(reportsDir, 'html-report'), open: 'never' }],
    ['junit', { outputFile: path.join(reportsDir, 'junit/results.xml') }],
    ['reporting-labs', reportingLabs],
  ],

  use: {
    baseURL: config.baseUrl,
    headless: config.browser.headless,
    launchOptions: { slowMo: config.browser.slowMo },
    actionTimeout: config.timeouts.action,
    navigationTimeout: config.timeouts.navigation,
    trace: 'retain-on-failure',
    screenshot: { mode: 'only-on-failure', fullPage: true },
    video: 'retain-on-failure',
    testIdAttribute: 'data-testid',
  },

  projects,
});
