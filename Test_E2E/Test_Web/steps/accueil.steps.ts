import { expect, Then, When } from '../../fixtures/test.fixture';

When("le visiteur ouvre la page d'accueil", async ({ homePage, scenario }) => {
  scenario.lastResponse = await homePage.goto();
});

Then('la page possède un titre', async ({ page }) => {
  await expect(page).toHaveTitle(/\S/);
});

Then("l'en-tête du site est visible", async ({ header }) => {
  await expect(header.root).toBeVisible();
});

Then('le titre principal est visible', async ({ homePage }) => {
  await expect(homePage.mainHeading).toBeVisible();
});

Then('le pied de page est visible', async ({ footer }) => {
  await expect(footer.root).toBeVisible();
});
