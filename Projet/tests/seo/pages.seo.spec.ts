import { ROUTES } from '../../config/urls';
import { PAGES_UNDER_TEST } from '../../data/test-data';
import { expect, test } from '../../fixtures/test.fixture';
import { readSeoSnapshot } from '../../utils/helpers/seo';

test.describe('SEO technique', { tag: ['@seo', '@feature:SEO', '@severity:minor'] }, () => {
  for (const { name, path } of PAGES_UNDER_TEST) {
    test(`${name} : balises essentielles présentes`, { tag: '@story:Balises' }, async ({ page }) => {
      await page.goto(path);
      const seo = await readSeoSnapshot(page);

      expect.soft(seo.title.trim(), 'Balise <title>').not.toBe('');
      expect.soft(seo.description?.trim() ?? '', 'Meta description').not.toBe('');
      expect.soft(seo.h1Count, 'Nombre de <h1>').toBe(1);
      expect.soft(seo.canonical, 'Lien canonical').toBeTruthy();
      expect.soft(seo.robots ?? '', 'Meta robots').not.toContain('noindex');
    });
  }

  for (const [label, route] of [
    ['robots.txt', ROUTES.robots],
    ['sitemap.xml', ROUTES.sitemap],
  ] as const) {
    test(`${label} est accessible`, { tag: '@story:Fichiers_d_indexation' }, async ({ request }) => {
      const response = await request.get(route);

      expect(response.status(), `Statut HTTP de ${route}`).toBe(200);
    });
  }
});
