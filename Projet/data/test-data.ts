import { ROUTES } from '../config/urls';

export interface PageUnderTest {
  readonly name: string;
  readonly path: string;
}

/**
 * Pages couvertes par les suites transverses (accessibilité, SEO, liens).
 * Ajouter une page ici suffit à l'inclure dans ces trois suites.
 */
export const PAGES_UNDER_TEST: readonly PageUnderTest[] = [{ name: 'Accueil', path: ROUTES.home }];

export const UNKNOWN_PATH = '/page-inexistante-e2e-404';
