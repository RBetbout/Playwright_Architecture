import { Pool } from 'pg';
import type { DbClient, DbConnection, DbRow } from './DbClient';

export class PostgresClient implements DbClient {
  private readonly pool: Pool;

  constructor(connection: DbConnection) {
    this.pool = new Pool({ ...connection, max: 2 });
  }

  async query<Row extends DbRow = DbRow>(sql: string, params: readonly unknown[] = []): Promise<Row[]> {
    const result = await this.pool.query(sql, [...params]);
    return (result.rows ?? []) as Row[];
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
