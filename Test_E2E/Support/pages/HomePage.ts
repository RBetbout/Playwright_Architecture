import type { Page } from '@playwright/test';
import { ROUTES } from '../config/urls';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  protected readonly path = ROUTES.home;

  readonly header: Header;
  readonly footer: Footer;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.footer = new Footer(page);
  }
}
