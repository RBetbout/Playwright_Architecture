import { ROUTES } from '../config/urls';

export interface PageUnderTest {
  readonly name: string;
  readonly path: string;
}

/**
 * Pages que les features peuvent ouvrir par leur nom : `le visiteur ouvre la page "Accueil"`.
 * Une page déclarée ici n'est testée que si elle figure dans les `Exemples` des features concernées.
 */
export const PAGES_UNDER_TEST: readonly PageUnderTest[] = [{ name: 'Accueil', path: ROUTES.home }];

export const UNKNOWN_PATH = '/page-inexistante-e2e-404';
