import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, type TestInfo } from '@playwright/test';

type Impact = 'minor' | 'moderate' | 'serious' | 'critical';

export interface AccessibilityOptions {
  /** Référentiels axe analysés. */
  tags?: string[];
  /** Niveaux d'impact qui font échouer le test ; les autres sont seulement rapportés. */
  failOn?: Impact[];
  /** Sélecteurs CSS exclus de l'analyse (widgets tiers, iframes...). */
  exclude?: string[];
}

/** Analyse axe-core de la page courante ; le détail des violations est joint au rapport. */
export async function expectNoAccessibilityViolations(
  page: Page,
  testInfo: TestInfo,
  options: AccessibilityOptions = {},
): Promise<void> {
  const {
    tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    failOn = ['serious', 'critical'],
    exclude = [],
  } = options;

  let builder = new AxeBuilder({ page }).withTags(tags);
  for (const selector of exclude) builder = builder.exclude(selector);
  const { violations } = await builder.analyze();

  await testInfo.attach('axe-violations.json', {
    body: JSON.stringify(violations, null, 2),
    contentType: 'application/json',
  });

  const blocking = violations
    .filter((violation) => failOn.includes(violation.impact as Impact))
    .map((violation) => ({
      regle: violation.id,
      impact: violation.impact,
      description: violation.help,
      elements: violation.nodes.map((node) => node.target.join(' ')),
    }));

  expect(blocking, `Violations d'accessibilité bloquantes sur ${page.url()}`).toEqual([]);
}
