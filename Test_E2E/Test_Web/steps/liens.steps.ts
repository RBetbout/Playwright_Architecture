import { expect, Then, When } from '../../fixtures/test.fixture';
import { checkUrls, isBroken } from '../../Support/utils/helpers/urlCheck';
import { collectLinks } from '../../Support/utils/helpers/links';

When('les liens internes de la page sont vérifiés', async ({ page, request, scenario, $testInfo }) => {
  const { internal } = await collectLinks(page);

  scenario.linkChecks = await checkUrls(request, internal);
  await $testInfo.attach('liens-internes.json', {
    body: JSON.stringify(scenario.linkChecks, null, 2),
    contentType: 'application/json',
  });
});

When('les liens externes de la page sont vérifiés', async ({ page, request, scenario, $testInfo }) => {
  const { external } = await collectLinks(page);

  scenario.linkChecks = await checkUrls(request, external);
  await $testInfo.attach('liens-externes.json', {
    body: JSON.stringify(scenario.linkChecks, null, 2),
    contentType: 'application/json',
  });
});

Then("aucun lien interne n'est cassé", async ({ page, scenario }) => {
  expect(scenario.linkChecks.filter(isBroken), `Liens internes cassés sur ${page.url()}`).toEqual([]);
});

Then("aucun lien externe n'est inaccessible", async ({ page, scenario }) => {
  // Seuls 404/410, 5xx et échecs réseau comptent : beaucoup de sites tiers bloquent les robots (401/403/429).
  const broken = scenario.linkChecks.filter(
    ({ status }) => status === 0 || status === 404 || status === 410 || status >= 500,
  );
  expect(broken, `Liens externes inaccessibles sur ${page.url()}`).toEqual([]);
});
