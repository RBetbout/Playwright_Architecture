export type DbRow = Record<string, unknown>;

/** Contrat commun aux moteurs supportés : les steps ne dépendent jamais d'un driver. */
export interface DbClient {
  /** Paramètres positionnels : `$1, $2` en PostgreSQL, `?` en MySQL. */
  query<Row extends DbRow = DbRow>(sql: string, params?: readonly unknown[]): Promise<Row[]>;
  close(): Promise<void>;
}

export interface DbConnection {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}
