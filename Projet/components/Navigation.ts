import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

export class Navigation extends BaseComponent {
  constructor(page: Page, scope?: Locator) {
    super(page, (scope ?? page).getByRole('navigation').first());
  }

  async goTo(linkName: string | RegExp): Promise<void> {
    await this.link(linkName).click();
  }

  async linkNames(): Promise<string[]> {
    const names = await this.links.allInnerTexts();
    return names.map((name) => name.trim()).filter(Boolean);
  }
}
