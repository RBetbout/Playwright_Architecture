import { PAGES_UNDER_TEST } from '../../data/test-data';
import { test } from '../../fixtures/test.fixture';
import { expectNoAccessibilityViolations } from '../../utils/assertions/accessibility';

test.describe(
  'Accessibilité WCAG 2.1 AA',
  { tag: ['@a11y', '@feature:Accessibilité', '@severity:major'] },
  () => {
    for (const { name, path } of PAGES_UNDER_TEST) {
      test(`${name} : aucune violation bloquante`, { tag: `@story:${name}` }, async ({ page }, testInfo) => {
        await page.goto(path);

        await expectNoAccessibilityViolations(page, testInfo);
      });
    }
  },
);
