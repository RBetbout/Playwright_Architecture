import type { Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';
import { Navigation } from './Navigation';

export class Header extends BaseComponent {
  readonly navigation: Navigation;

  constructor(page: Page) {
    super(page, page.getByRole('banner'));
    this.navigation = new Navigation(page, this.root);
  }
}
