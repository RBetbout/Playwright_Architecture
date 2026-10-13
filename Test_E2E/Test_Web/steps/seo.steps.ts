import { ROUTES } from '../../Support/config/urls';
import { expect, Then } from '../../fixtures/test.fixture';
import { readSeoSnapshot } from '../../Support/utils/helpers/seo';

const INDEXING_FILES: Record<string, string> = {
  'robots.txt': ROUTES.robots,
  'sitemap.xml': ROUTES.sitemap,
};

Then('les balises SEO essentielles sont présentes', async ({ page }) => {
  const seo = await readSeoSnapshot(page);

  expect.soft(seo.title.trim(), 'Balise <title>').not.toBe('');
  expect.soft(seo.description?.trim() ?? '', 'Meta description').not.toBe('');
  expect.soft(seo.h1Count, 'Nombre de <h1>').toBe(1);
  expect.soft(seo.canonical, 'Lien canonical').toBeTruthy();
  expect.soft(seo.robots ?? '', 'Meta robots').not.toContain('noindex');
});

Then("le fichier d'indexation {string} est accessible", async ({ request }, file: string) => {
  const route = INDEXING_FILES[file];
  if (!route) {
    throw new Error(
      `Fichier d'indexation "${file}" inconnu (attendu : ${Object.keys(INDEXING_FILES).join(', ')}).`,
    );
  }
  const response = await request.get(route);

  expect(response.status(), `Statut HTTP de ${route}`).toBe(200);
});
