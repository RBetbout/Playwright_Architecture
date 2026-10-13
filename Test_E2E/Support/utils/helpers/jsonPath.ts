/**
 * Lit une valeur dans un objet à partir d'un chemin pointé : `data.items.0.id`.
 * Retourne `undefined` si le chemin n'existe pas.
 */
export function readPath(source: unknown, path: string): unknown {
  let current: unknown = source;
  for (const key of path.split('.').filter(Boolean)) {
    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}
