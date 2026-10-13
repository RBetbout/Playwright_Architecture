import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { config } from '../../Test_E2E/Support/config/config';
import reportingLabs from '../config_report/reporting-labs.config';

// Ce fichier vit dans Configuration_Playwright/config_playwright/ (outillage) ; le code de test est dans Test_E2E/ et les rapports dans reports/.
const projectDir = path.resolve(__dirname, '../../Test_E2E');
const reportsDir = path.resolve(__dirname, '../../reports');

/**
 * Tous les tests sont écrits en BDD. Chaque domaine a ses features et ses steps, et tous partagent la même
 * fixture (Test_E2E/fixtures). Les .feature d'un domaine sont compilés en tests Playwright dans reports/.features-gen/<domaine>/ (npm run bdd:gen).
 */
function bddTestDir(domain: 'Test_Web' | 'Test_API' | 'Test_BDD'): string {
  const domainDir = path.join(projectDir, domain);
  return defineBddConfig({
    language: 'fr',
    featuresRoot: domainDir,
    features: path.join(domainDir, 'features/**/*.feature'),
    steps: [path.join(domainDir, 'steps/**/*.ts'), path.join(projectDir, 'fixtures/test.fixture.ts')],
    outputDir: path.join(reportsDir, '.features-gen', domain),
  });
}

const webTestDir = bddTestDir('Test_Web');
const apiTestDir = bddTestDir('Test_API');
const bdTestDir = bddTestDir('Test_BDD');

const BROWSERS = {
  chromium: devices['Desktop Chrome'],
  // firefox: devices['Desktop Firefox'],
  // webkit: devices['Desktop Safari'],
  // tablet: devices['iPad (gen 7)'],
  // 'mobile-chrome': devices['Pixel 7'],
  // 'mobile-safari': devices['iPhone 14'],
};

const projects = [
  ...Object.entries(BROWSERS).map(([name, device]) => ({ name, testDir: webTestDir, use: { ...device } })),
  // Sans navigateur : ces scénarios passent par les fixtures `api` et `db`.
  { name: 'api', testDir: apiTestDir },
  { name: 'bd', testDir: bdTestDir },
];

export default defineConfig({
  outputDir: path.join(reportsDir, 'test-results'),
  // Test_E2E/ n'a pas de node_modules : ce tsconfig fait pointer ses imports vers config_playwright/node_modules.
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
