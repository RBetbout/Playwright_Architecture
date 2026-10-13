import type { Locator, Page } from '@playwright/test';

/**
 * Socle des Component Objects : tout locator d'un composant est cherché
 * à l'intérieur de sa racine, ce qui évite les collisions entre zones de la page.
 */
export abstract class BaseComponent {
  constructor(
    protected readonly page: Page,
    readonly root: Locator,
  ) {}

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  get links(): Locator {
    return this.root.getByRole('link');
  }

  link(name: string | RegExp): Locator {
    return this.root.getByRole('link', { name });
  }

  button(name: string | RegExp): Locator {
    return this.root.getByRole('button', { name });
  }
}
