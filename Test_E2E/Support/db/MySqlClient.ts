import { createPool, type Pool } from 'mysql2/promise';
import type { DbClient, DbConnection, DbRow } from './DbClient';

export class MySqlClient implements DbClient {
  private readonly pool: Pool;

  constructor(connection: DbConnection) {
    this.pool = createPool({ ...connection, connectionLimit: 2 });
  }

  async query<Row extends DbRow = DbRow>(sql: string, params: readonly unknown[] = []): Promise<Row[]> {
    const [rows] = await this.pool.query(sql, [...params]);
    // Une requête d'écriture renvoie un en-tête de résultat, pas des lignes.
    return Array.isArray(rows) ? (rows as Row[]) : [];
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
