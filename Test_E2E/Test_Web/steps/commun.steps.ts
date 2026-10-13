import { PAGES_UNDER_TEST } from '../../Support/data/test-data';
import { expect, Then, When } from '../../fixtures/test.fixture';

/** Le nom est celui déclaré dans PAGES_UNDER_TEST (data/test-data.ts). */
When('le visiteur ouvre la page {string}', async ({ page, scenario }, name: string) => {
  const target = PAGES_UNDER_TEST.find((candidate) => candidate.name === name);
  if (!target) {
    throw new Error(
      `Page "${name}" inconnue. Pages déclarées : ${PAGES_UNDER_TEST.map((candidate) => candidate.name).join(', ')}.`,
    );
  }
  scenario.lastResponse = await page.goto(target.path);
});

Then('la page répond sans erreur', async ({ page, scenario }) => {
  expect(scenario.lastResponse?.status(), `Statut HTTP de ${page.url()}`).toBeLessThan(400);
});

Then('la page répond avec le statut {int}', async ({ page, scenario }, status: number) => {
  expect(scenario.lastResponse?.status(), `Statut HTTP de ${page.url()}`).toBe(status);
});
