import { expect, Then, When } from '../fixtures/test.fixture';

When("le visiteur ouvre la page d'accueil", async ({ homePage, scenario }) => {
  scenario.lastResponse = await homePage.goto();
});

Then("la page d'accueil répond sans erreur", async ({ scenario }) => {
  expect(scenario.lastResponse?.status(), "Statut HTTP de la page d'accueil").toBeLessThan(400);
});

Then('la page possède un titre', async ({ page }) => {
  await expect(page).toHaveTitle(/\S/);
});

Then("l'en-tête du site est visible", async ({ header }) => {
  await expect(header.root).toBeVisible();
});
