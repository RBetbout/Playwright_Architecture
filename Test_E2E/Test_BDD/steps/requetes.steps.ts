import { expect, Then, When } from '../../fixtures/test.fixture';

/** La requête est fournie dans une chaîne multiligne (""") sous l'étape. */
When("j'exécute la requête SQL :", async ({ db, scenario, $testInfo }, sql: string) => {
  scenario.dbRows = await db.query(sql);
  await $testInfo.attach('resultat-sql.json', {
    body: JSON.stringify({ requete: sql, lignes: scenario.dbRows }, null, 2),
    contentType: 'application/json',
  });
});

Then('la requête retourne {int} ligne(s)', async ({ scenario }, count: number) => {
  expect(scenario.dbRows, 'Lignes retournées par la requête').toHaveLength(count);
});

Then('la requête retourne au moins {int} ligne(s)', async ({ scenario }, count: number) => {
  expect(scenario.dbRows.length, 'Nombre de lignes retournées par la requête').toBeGreaterThanOrEqual(count);
});

/** La valeur est comparée sous forme de texte : "42" correspond au nombre 42. */
Then(
  'la colonne {string} de la première ligne vaut {string}',
  async ({ scenario }, column: string, expected: string) => {
    expect(scenario.dbRows.length, 'Nombre de lignes retournées par la requête').toBeGreaterThan(0);
    expect(String(scenario.dbRows[0]?.[column]), `Colonne "${column}" de la première ligne`).toBe(expected);
  },
);

Then('la table {string} contient {int} ligne(s)', async ({ db }, table: string, count: number) => {
  // Un nom de table ne peut pas être passé en paramètre SQL : il est donc contrôlé avant d'être inséré.
  if (!/^[A-Za-z_][\w$]*(\.[A-Za-z_][\w$]*)?$/.test(table)) {
    throw new Error(`Nom de table invalide : "${table}".`);
  }
  const [row] = await db.query<{ total: unknown }>(`SELECT COUNT(*) AS total FROM ${table}`);
  expect(Number(row?.total), `Nombre de lignes de la table ${table}`).toBe(count);
});
