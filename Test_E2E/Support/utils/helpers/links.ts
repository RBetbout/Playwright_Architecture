import type { Page } from '@playwright/test';

export interface PageLinks {
  internal: string[];
  external: string[];
}

/** Liens http(s) uniques de la page courante, sans ancre, répartis en internes / externes. */
export async function collectLinks(page: Page): Promise<PageLinks> {
  const hrefs = await page
    .locator('a[href]')
    .evaluateAll((anchors) => anchors.map((anchor) => (anchor as HTMLAnchorElement).href));
  const origin = new URL(page.url()).origin;
  const internal = new Set<string>();
  const external = new Set<string>();

  for (const href of hrefs) {
    if (!/^https?:\/\//i.test(href)) continue;
    const url = new URL(href);
    url.hash = '';
    (url.origin === origin ? internal : external).add(url.toString());
  }

  return { internal: [...internal], external: [...external] };
}
