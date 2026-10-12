import { expect, test } from '../../fixtures/test.fixture';

test.describe('Accueil', { tag: ['@smoke', '@feature:Accueil', '@story:Structure_de_la_page'] }, () => {
  test(
    "la page d'accueil se charge sans erreur",
    { tag: '@severity:blocker' },
    async ({ homePage, page }) => {
      const response = await homePage.goto();

      expect(response?.status(), "Statut HTTP de la page d'accueil").toBeLessThan(400);
      await expect(page).toHaveTitle(/\S/);
    },
  );

  test('les zones principales sont affichées', { tag: '@severity:critical' }, async ({ homePage }) => {
    await homePage.goto();

    await expect(homePage.header.root).toBeVisible();
    await expect(homePage.mainHeading).toBeVisible();
    await expect(homePage.footer.root).toBeVisible();
  });
});
