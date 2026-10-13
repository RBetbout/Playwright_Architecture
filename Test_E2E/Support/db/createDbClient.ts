import type { DatabaseConfig, EnvironmentName } from '../config/config';
import type { DbClient, DbRow } from './DbClient';
import { MySqlClient } from './MySqlClient';
import { PostgresClient } from './PostgresClient';

const READ_ONLY = /^\s*(select|with|show|explain|describe)\b/i;

/** Ouvre le client du moteur déclaré dans DB_ENGINE. Sur `prod`, seules les lectures sont autorisées. */
export function createDbClient(database: DatabaseConfig, environment: EnvironmentName): DbClient {
  const { engine, ...connection } = database;
  if (!engine) {
    throw new Error("DB_ENGINE n'est pas renseigné (postgresql ou mysql) : impossible d'ouvrir la base.");
  }
  if (!connection.database || !connection.user) {
    throw new Error(`DB_NAME et DB_USER sont requis pour l'environnement "${environment}".`);
  }

  const client = engine === 'postgresql' ? new PostgresClient(connection) : new MySqlClient(connection);
  if (environment !== 'prod') return client;

  return {
    query: <Row extends DbRow = DbRow>(sql: string, params?: readonly unknown[]): Promise<Row[]> => {
      if (!READ_ONLY.test(sql)) {
        throw new Error(`Requête refusée sur prod (lecture seule) : ${sql.trim().split('\n')[0]}`);
      }
      return client.query<Row>(sql, params);
    },
    close: () => client.close(),
  };
}
