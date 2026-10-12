import type { Response } from '@playwright/test';
import { createBdd, test as base } from 'playwright-bdd';
import { CookieBanner } from '../components/CookieBanner';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { config, type EnvironmentConfig } from '../config/config';
import { HomePage } from '../pages/HomePage';
import { PageDiagnostics } from '../utils/helpers/pageDiagnostics';
import { applyReportMetadata } from '../utils/reporting/reportMetadata';

/** État partagé entre les steps d'un même scénario (recréé à chaque test). */
export interface ScenarioContext {
  lastResponse: Response | null;
}

interface Fixtures {
  env: EnvironmentConfig;
  scenario: ScenarioContext;
  homePage: HomePage;
  header: Header;
  footer: Footer;
  cookieBanner: CookieBanner;
  reportMetadata: void;
}

/**
 * Point d'entrée unique des tests (Playwright et BDD) : importer `test` et `expect` d'ici,
 * jamais de '@playwright/test', pour bénéficier des Page Objects et du reporting.
 */
export const test = base.extend<Fixtures>({
  env: async ({}, use) => {
    await use(config);
  },

  scenario: async ({}, use) => {
    await use({ lastResponse: null });
  },

  // Surcharge de `page` : joint au rapport ce que l'application a remonté si le test échoue.
  page: async ({ page }, use, testInfo) => {
    const diagnostics = new PageDiagnostics(page);
    await use(page);
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach('diagnostic-page.json', {
        body: JSON.stringify(diagnostics.report(), null, 2),
        contentType: 'application/json',
      });
    }
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },
  footer: async ({ page }, use) => {
    await use(new Footer(page));
  },
  cookieBanner: async ({ page }, use) => {
    await use(new CookieBanner(page));
  },

  reportMetadata: [
    async ({}, use, testInfo) => {
      applyReportMetadata(testInfo.tags);
      await use();
    },
    { auto: true },
  ],
});

export const expect = test.expect;
export const { Given, When, Then } = createBdd(test);
