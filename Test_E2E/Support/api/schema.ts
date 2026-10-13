import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';

const SCHEMAS_DIR = path.resolve(__dirname, '../data/schemas');
const ajv = new Ajv({ allErrors: true });

/**
 * Valide une donnée contre le schéma JSON `data/schemas/<nom>.json`.
 * Retourne la liste des écarts (vide si la donnée est conforme).
 */
export function schemaErrors(name: string, data: unknown): string[] {
  const file = path.join(SCHEMAS_DIR, `${name}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Schéma "${name}" introuvable (attendu : ${file}).`);
  }
  const validate =
    ajv.getSchema(name) ?? ajv.addSchema(JSON.parse(fs.readFileSync(file, 'utf8')), name).getSchema(name);
  if (!validate) throw new Error(`Schéma "${name}" invalide.`);

  validate(data);
  return (validate.errors ?? []).map((error) =>
    `${error.instancePath || '(racine)'} ${error.message ?? ''}`.trim(),
  );
}
