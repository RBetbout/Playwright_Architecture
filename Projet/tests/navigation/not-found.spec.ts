import { UNKNOWN_PATH } from '../../data/test-data';
import { expect, test } from '../../fixtures/test.fixture';

test(
  'une URL inexistante renvoie une erreur 404',
  {
    tag: ['@navigation', '@regression', '@feature:Navigation', '@story:Page_introuvable', '@severity:major'],
  },
  async ({ page }) => {
    const response = await page.goto(UNKNOWN_PATH);

    expect(response?.status(), `Statut HTTP de ${UNKNOWN_PATH}`).toBe(404);
  },
);
