import type { APIRequestContext, TestInfo } from '@playwright/test';
import { createLogger } from '../utils/logger';

const logger = createLogger('api');

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
export const HTTP_METHODS: readonly HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'];

export interface ApiRequestOptions {
  /** Corps de la requête, envoyé en JSON. */
  data?: unknown;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

export interface ApiResult {
  method: HttpMethod;
  url: string;
  status: number;
  headers: Record<string, string>;
  /** Corps décodé en JSON lorsque c'est possible, sinon texte brut. */
  body: unknown;
  durationMs: number;
}

/**
 * Client de l'API testée : résout les chemins par rapport à API_URL, ajoute le jeton
 * d'authentification et joint chaque échange au rapport.
 */
export class ApiClient {
  private lastResult: ApiResult | null = null;

  constructor(
    private readonly request: APIRequestContext,
    private readonly testInfo: TestInfo,
    private readonly baseUrl: string,
    private readonly token: string,
  ) {}

  /** Dernier échange du scénario ; lève une erreur si aucune requête n'a encore été envoyée. */
  get last(): ApiResult {
    if (!this.lastResult) throw new Error("Aucune requête d'API n'a été envoyée dans ce scénario.");
    return this.lastResult;
  }

  async send(method: HttpMethod, path: string, options: ApiRequestOptions = {}): Promise<ApiResult> {
    const url = this.resolve(path);
    const startedAt = Date.now();
    const response = await this.request.fetch(url, {
      method,
      data: options.data,
      params: options.params,
      headers: { ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}), ...options.headers },
      failOnStatusCode: false,
    });
    const text = await response.text();

    this.lastResult = {
      method,
      url: response.url(),
      status: response.status(),
      headers: response.headers(),
      body: parseBody(text),
      durationMs: Date.now() - startedAt,
    };
    logger.debug(`${method} ${url} -> ${this.lastResult.status} (${this.lastResult.durationMs} ms)`);

    // Les en-têtes de la requête ne sont pas joints : ils contiennent le jeton.
    await this.testInfo.attach(`api-${method}-${this.lastResult.status}.json`, {
      body: JSON.stringify(
        { requete: { method, url, ...options, headers: undefined }, reponse: this.lastResult },
        null,
        2,
      ),
      contentType: 'application/json',
    });
    return this.lastResult;
  }

  private resolve(path: string): string {
    if (/^https?:\/\//i.test(path)) return path;
    if (!this.baseUrl) {
      throw new Error("API_URL n'est pas renseignée : impossible d'appeler l'API (voir le fichier .env).");
    }
    return `${this.baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }
}

function parseBody(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
