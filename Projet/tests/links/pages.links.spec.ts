import { PAGES_UNDER_TEST } from '../../data/test-data';
import { expect, test } from '../../fixtures/test.fixture';
import { checkUrls, isBroken } from '../../utils/api/http';
import { collectLinks } from '../../utils/helpers/links';

test.describe('Liens', { tag: ['@links', '@regression', '@feature:Liens'] }, () => {
  for (const { name, path } of PAGES_UNDER_TEST) {
    test(
      `${name} : aucun lien interne cassé`,
      { tag: ['@story:Liens_internes', '@severity:critical'] },
      async ({ page, request }, testInfo) => {
        await page.goto(path);
        const { internal } = await collectLinks(page);

        const checks = await checkUrls(request, internal);
        await testInfo.attach('liens-internes.json', {
          body: JSON.stringify(checks, null, 2),
          contentType: 'application/json',
        });

        expect(checks.filter(isBroken), `Liens internes cassés sur ${path}`).toEqual([]);
      },
    );

    test(
      `${name} : aucun lien externe inaccessible`,
      { tag: ['@story:Liens_externes', '@severity:minor'] },
      async ({ page, request }, testInfo) => {
        await page.goto(path);
        const { external } = await collectLinks(page);

        const checks = await checkUrls(request, external);
        await testInfo.attach('liens-externes.json', {
          body: JSON.stringify(checks, null, 2),
          contentType: 'application/json',
        });

        // Seuls 404/410, 5xx et échecs réseau comptent : beaucoup de sites tiers bloquent les robots (401/403/429).
        const broken = checks.filter(
          ({ status }) => status === 0 || status === 404 || status === 410 || status >= 500,
        );
        expect(broken, `Liens externes inaccessibles sur ${path}`).toEqual([]);
      },
    );
  }
});
