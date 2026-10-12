import type { Page } from '@playwright/test';

export interface SeoSnapshot {
  title: string;
  description: string | null;
  canonical: string | null;
  robots: string | null;
  h1Count: number;
}

export async function readSeoSnapshot(page: Page): Promise<SeoSnapshot> {
  const attribute = async (selector: string, name: string): Promise<string | null> => {
    const element = page.locator(selector);
    return (await element.count()) > 0 ? element.first().getAttribute(name) : null;
  };

  return {
    title: await page.title(),
    description: await attribute('meta[name="description"]', 'content'),
    canonical: await attribute('link[rel="canonical"]', 'href'),
    robots: await attribute('meta[name="robots"]', 'content'),
    h1Count: await page.locator('h1').count(),
  };
}
