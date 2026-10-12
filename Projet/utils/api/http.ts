import type { APIRequestContext } from '@playwright/test';
import { createLogger } from '../helpers/logger';

const logger = createLogger('http');

export interface UrlCheck {
  url: string;
  /** 0 lorsque la requête n'a pas abouti (DNS, timeout, TLS...). */
  status: number;
  finalUrl: string;
  redirected: boolean;
  error?: string;
}

/** Vérifie une URL en HEAD, avec repli en GET pour les serveurs qui refusent HEAD. */
export async function checkUrl(request: APIRequestContext, url: string, timeout = 15_000): Promise<UrlCheck> {
  try {
    let response = await request.head(url, { timeout, failOnStatusCode: false });
    if ([403, 405, 501].includes(response.status())) {
      response = await request.get(url, { timeout, failOnStatusCode: false });
    }
    return { url, status: response.status(), finalUrl: response.url(), redirected: response.url() !== url };
  } catch (error) {
    const message = error instanceof Error ? (error.message.split('\n')[0] ?? error.message) : String(error);
    logger.warn(`Requête impossible vers ${url}`, message);
    return { url, status: 0, finalUrl: url, redirected: false, error: message };
  }
}

export async function checkUrls(
  request: APIRequestContext,
  urls: readonly string[],
  concurrency = 8,
): Promise<UrlCheck[]> {
  const results: UrlCheck[] = [];
  for (let index = 0; index < urls.length; index += concurrency) {
    const batch = urls.slice(index, index + concurrency);
    results.push(...(await Promise.all(batch.map((url) => checkUrl(request, url)))));
  }
  return results;
}

export function isBroken(check: UrlCheck): boolean {
  return check.status === 0 || check.status >= 400;
}
