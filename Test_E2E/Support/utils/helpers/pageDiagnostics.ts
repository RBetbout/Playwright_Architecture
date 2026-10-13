import type { Page } from '@playwright/test';

export interface PageDiagnosticsReport {
  url: string;
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: { url: string; method: string; failure: string }[];
  httpErrors: { url: string; status: number }[];
}

/**
 * Collecte ce que l'application expose pendant un test (erreurs console,
 * exceptions JS, requêtes en échec, réponses 4xx/5xx) pour l'attacher au rapport en cas d'échec.
 */
export class PageDiagnostics {
  private readonly consoleErrors: string[] = [];
  private readonly pageErrors: string[] = [];
  private readonly failedRequests: PageDiagnosticsReport['failedRequests'] = [];
  private readonly httpErrors: PageDiagnosticsReport['httpErrors'] = [];

  constructor(private readonly page: Page) {
    page.on('console', (message) => {
      if (message.type() === 'error') this.consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => this.pageErrors.push(error.message));
    page.on('requestfailed', (request) =>
      this.failedRequests.push({
        url: request.url(),
        method: request.method(),
        failure: request.failure()?.errorText ?? 'inconnue',
      }),
    );
    page.on('response', (response) => {
      if (response.status() >= 400) this.httpErrors.push({ url: response.url(), status: response.status() });
    });
  }

  report(): PageDiagnosticsReport {
    return {
      url: this.page.isClosed() ? 'page fermée' : this.page.url(),
      consoleErrors: this.consoleErrors,
      pageErrors: this.pageErrors,
      failedRequests: this.failedRequests,
      httpErrors: this.httpErrors,
    };
  }
}
