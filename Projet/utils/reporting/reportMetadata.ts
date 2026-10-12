import { meta } from 'reporting-labs';

const SEVERITIES = ['blocker', 'critical', 'major', 'minor', 'trivial'] as const;
const KEYS = ['epic', 'feature', 'story', 'severity', 'priority', 'owner'] as const;

/**
 * Convertit les tags d'un test en métadonnées du rapport reportingLabs, pour les tests
 * Playwright comme pour les scénarios Gherkin :
 *   @feature:Navigation  @story:Menu_mobile  @severity:critical  @priority:P1  @owner:equipe_qa
 * Les "_" sont rendus comme des espaces (un tag Gherkin ne peut pas en contenir).
 */
export function applyReportMetadata(tags: readonly string[]): void {
  const values: Record<string, string> = {};

  for (const tag of tags) {
    const match = new RegExp(`^@(${KEYS.join('|')}):(.+)$`).exec(tag);
    if (!match) continue;
    const [, key, rawValue] = match;
    const value = (rawValue ?? '').replace(/_/g, ' ');

    if (key === 'severity' && !SEVERITIES.includes(value as (typeof SEVERITIES)[number])) {
      throw new Error(`Sévérité inconnue "${value}" (attendu : ${SEVERITIES.join(', ')}).`);
    }
    if (key) values[key] = value;
  }

  if (Object.keys(values).length > 0) meta(values);
}
