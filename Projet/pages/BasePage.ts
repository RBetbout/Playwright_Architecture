import type { Locator, Page, Response } from '@playwright/test';

/**
 * Socle commun des Page Objects : navigation et lecture d'état.
 * Les assertions restent dans les tests / steps.
 */
export abstract class BasePage {
  /** Chemin relatif à BASE_URL, issu de config/urls.ts. */
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async goto(): Promise<Response | null> {
    return this.page.goto(this.path);
  }

  get mainHeading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  get mainContent(): Locator {
    return this.page.getByRole('main');
  }

  async title(): Promise<string> {
    return this.page.title();
  }

  currentUrl(): string {
    return this.page.url();
  }
}
