import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * Bandeau de consentement.
 * Les locators ci-dessous sont des valeurs par défaut génériques : ils sont à
 * ajuster sur le bandeau réel du site (CMP utilisée, libellés, iframe éventuelle).
 */
export class CookieBanner extends BaseComponent {
  constructor(page: Page) {
    super(page, page.getByRole('dialog', { name: /cookie|consentement|confidentialité/i }));
  }

  get acceptButton(): Locator {
    return this.button(/accepter|tout accepter|accept/i);
  }

  get rejectButton(): Locator {
    return this.button(/refuser|tout refuser|reject/i);
  }

  async accept(): Promise<void> {
    await this.acceptButton.click();
  }

  async reject(): Promise<void> {
    await this.rejectButton.click();
  }
}
