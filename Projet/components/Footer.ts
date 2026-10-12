import type { Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

export class Footer extends BaseComponent {
  constructor(page: Page) {
    super(page, page.getByRole('contentinfo'));
  }

  async scrollIntoView(): Promise<void> {
    await this.root.scrollIntoViewIfNeeded();
  }
}
