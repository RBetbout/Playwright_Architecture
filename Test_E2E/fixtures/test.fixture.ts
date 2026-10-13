import type { Response } from '@playwright/test';
import { createBdd, test as base } from 'playwright-bdd';
import { ApiClient } from '../Support/api/ApiClient';
import { CookieBanner } from '../Support/components/CookieBanner';
import { Footer } from '../Support/components/Footer';
import { Header } from '../Support/components/Header';
import { config, type EnvironmentConfig } from '../Support/config/config';
import { createDbClient } from '../Support/db/createDbClient';
import type { DbClient, DbRow } from '../Support/db/DbClient';
import { HomePage } from '../Support/pages/HomePage';
import { PageDiagnostics } from '../Support/utils/helpers/pageDiagnostics';
import type { UrlCheck } from '../Support/utils/helpers/urlCheck';
import { applyReportMetadata } from '../Support/utils/reportMetadata';

/** État partagé entre les steps d'un même scénario (recréé à chaque test). */
export interface ScenarioContext {
  lastResponse: Response | null;
  linkChecks: UrlCheck[];
  dbRows: DbRow[];
}

interface Fixtures {
  env: EnvironmentConfig;
  scenario: ScenarioContext;
  homePage: HomePage;
  header: Header;
  footer: Footer;
  cookieBanner: CookieBanner;
  api: ApiClient;
  reportMetadata: void;
}

interface WorkerFixtures {
  db: DbClient;
}

/**
 * Point d'entrée unique des steps Web, API et BD : importer `Given`, `When`, `Then` et `expect` d'ici,
 * jamais de '@playwright/test'. Une fixture n'est créée que si un step la demande : un scénario
 * d'API ou de base n'ouvre donc pas de navigateur.
 */
export const test = base.extend<Fixtures, WorkerFixtures>({
  // --- Commun ---
  env: async ({}, use) => {
    await use(config);
  },

  scenario: async ({}, use) => {
    await use({ lastResponse: null, linkChecks: [], dbRows: [] });
  },

  reportMetadata: [
    async ({}, use, testInfo) => {
      applyReportMetadata(testInfo.tags);
      await use();
    },
    { auto: true },
  ],

  // --- Web ---
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

  // --- API ---
  api: async ({ request }, use, testInfo) => {
    await use(new ApiClient(request, testInfo, config.apiUrl, config.apiToken));
  },

  // --- BD ---
  // Une connexion par worker, ouverte au premier scénario qui la demande et fermée à la fin.
  db: [
    async ({}, use) => {
      const client = createDbClient(config.database, config.name);
      await use(client);
      await client.close();
    },
    { scope: 'worker' },
  ],
});

export const expect = test.expect;
export const { Given, When, Then } = createBdd(test);
