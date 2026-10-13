import path from 'node:path';
import dotenv from 'dotenv';

export const ENVIRONMENTS = ['dev', 'staging', 'prod'] as const;
export type EnvironmentName = (typeof ENVIRONMENTS)[number];

export interface Credentials {
  readonly email: string;
  readonly password: string;
}

export const DB_ENGINES = ['postgresql', 'mysql'] as const;
export type DbEngine = (typeof DB_ENGINES)[number];

export interface DatabaseConfig {
  /** `null` tant que DB_ENGINE n'est pas renseigné : la base n'est requise que par les scénarios qui l'utilisent. */
  readonly engine: DbEngine | null;
  readonly host: string;
  readonly port: number;
  readonly database: string;
  readonly user: string;
  readonly password: string;
}

export interface EnvironmentConfig {
  readonly name: EnvironmentName;
  readonly baseUrl: string;
  readonly apiUrl: string;
  readonly apiToken: string;
  readonly database: DatabaseConfig;
  readonly credentials: Credentials;
  readonly timeouts: {
    readonly test: number;
    readonly expect: number;
    readonly action: number;
    readonly navigation: number;
  };
  readonly browser: {
    readonly headless: boolean;
    readonly slowMo: number;
  };
  readonly isCI: boolean;
}

function resolveEnvironmentName(): EnvironmentName {
  const raw = (process.env.TEST_ENV ?? 'dev').toLowerCase();
  if (!ENVIRONMENTS.includes(raw as EnvironmentName)) {
    throw new Error(`TEST_ENV="${raw}" est invalide. Valeurs acceptées : ${ENVIRONMENTS.join(', ')}.`);
  }
  return raw as EnvironmentName;
}

function required(key: string, envName: EnvironmentName): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(
      `Variable d'environnement "${key}" manquante pour l'environnement "${envName}". ` +
        `Renseignez-la dans Test_E2E/Support/config/environments/.env.${envName} ou dans les variables du job CI.`,
    );
  }
  return value;
}

function optional(key: string, fallback = ''): string {
  return process.env[key]?.trim() || fallback;
}

function toNumber(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw.trim() === '') return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`Variable d'environnement "${key}" doit être un nombre positif (reçu : "${raw}").`);
  }
  return parsed;
}

function toBoolean(key: string, fallback: boolean): boolean {
  const raw = process.env[key]?.trim().toLowerCase();
  if (!raw) return fallback;
  return raw === 'true' || raw === '1';
}

function resolveDbEngine(): DbEngine | null {
  const raw = optional('DB_ENGINE').toLowerCase();
  if (!raw) return null;
  if (!DB_ENGINES.includes(raw as DbEngine)) {
    throw new Error(`DB_ENGINE="${raw}" est invalide. Valeurs acceptées : ${DB_ENGINES.join(', ')}.`);
  }
  return raw as DbEngine;
}

function loadConfig(): EnvironmentConfig {
  const name = resolveEnvironmentName();

  // Les variables déjà présentes (CI, shell) restent prioritaires sur le fichier .env.
  dotenv.config({ path: path.resolve(__dirname, 'environments', `.env.${name}`), quiet: true });

  const dbEngine = resolveDbEngine();

  return Object.freeze({
    name,
    baseUrl: required('BASE_URL', name),
    apiUrl: optional('API_URL'),
    apiToken: optional('API_TOKEN'),
    database: {
      engine: dbEngine,
      host: optional('DB_HOST', 'localhost'),
      port: toNumber('DB_PORT', dbEngine === 'mysql' ? 3306 : 5432),
      database: optional('DB_NAME'),
      user: optional('DB_USER'),
      password: optional('DB_PASSWORD'),
    },
    credentials: {
      email: optional('USER_EMAIL'),
      password: optional('USER_PASSWORD'),
    },
    timeouts: {
      test: toNumber('TEST_TIMEOUT', 60_000),
      expect: toNumber('EXPECT_TIMEOUT', 10_000),
      action: toNumber('ACTION_TIMEOUT', 15_000),
      navigation: toNumber('NAVIGATION_TIMEOUT', 30_000),
    },
    browser: {
      headless: toBoolean('HEADLESS', true),
      slowMo: toNumber('SLOW_MO', 0),
    },
    isCI: toBoolean('CI', false),
  });
}

export const config: EnvironmentConfig = loadConfig();
