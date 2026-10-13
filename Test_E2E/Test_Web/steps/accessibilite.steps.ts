import { Then } from '../../fixtures/test.fixture';
import { expectNoAccessibilityViolations } from '../../Support/utils/assertions/accessibility';

Then("la page ne présente aucune violation d'accessibilité bloquante", async ({ page, $testInfo }) => {
  await expectNoAccessibilityViolations(page, $testInfo);
});
