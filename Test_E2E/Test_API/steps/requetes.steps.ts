import { expect, Then, When } from '../../fixtures/test.fixture';
import { HTTP_METHODS, type HttpMethod } from '../../Support/api/ApiClient';
import { schemaErrors } from '../../Support/api/schema';
import { readPath } from '../../Support/utils/helpers/jsonPath';

function toMethod(raw: string): HttpMethod {
  const method = raw.toUpperCase() as HttpMethod;
  if (!HTTP_METHODS.includes(method)) {
    throw new Error(`Méthode HTTP "${raw}" inconnue (attendu : ${HTTP_METHODS.join(', ')}).`);
  }
  return method;
}

When("j'envoie une requête {word} sur {string}", async ({ api }, method: string, path: string) => {
  await api.send(toMethod(method), path);
});

/** Le corps est fourni en JSON, dans une chaîne multiligne (""") sous l'étape. */
When(
  "j'envoie une requête {word} sur {string} avec le corps :",
  async ({ api }, method: string, path: string, body: string) => {
    await api.send(toMethod(method), path, { data: JSON.parse(body) });
  },
);

Then('le statut de la réponse est {int}', async ({ api }, status: number) => {
  expect(api.last.status, `Statut de ${api.last.method} ${api.last.url}`).toBe(status);
});

Then("l'API répond sans erreur serveur", async ({ api }) => {
  expect(api.last.status, `Statut de ${api.last.method} ${api.last.url}`).toBeLessThan(500);
});

Then('la réponse contient le champ {string}', async ({ api }, field: string) => {
  expect(readPath(api.last.body, field), `Champ "${field}" de la réponse`).toBeDefined();
});

/** La valeur est comparée sous forme de texte : "42" correspond au nombre 42. */
Then('le champ {string} de la réponse vaut {string}', async ({ api }, field: string, expected: string) => {
  expect(String(readPath(api.last.body, field)), `Champ "${field}" de la réponse`).toBe(expected);
});

/** Le schéma JSON est lu dans Support/data/schemas/<nom>.json. */
Then('la réponse respecte le schéma {string}', async ({ api }, schema: string) => {
  expect(schemaErrors(schema, api.last.body), `Écarts au schéma "${schema}"`).toEqual([]);
});

Then('la réponse arrive en moins de {int} ms', async ({ api }, maxDuration: number) => {
  expect(api.last.durationMs, `Durée de ${api.last.method} ${api.last.url}`).toBeLessThan(maxDuration);
});
