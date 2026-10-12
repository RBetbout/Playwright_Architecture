/**
 * Chemins relatifs à BASE_URL. Chaque Page Object référence sa route ici,
 * jamais une URL absolue : c'est ce qui rend les tests indépendants de l'environnement.
 */
export const ROUTES = {
  home: '/',
  robots: '/robots.txt',
  sitemap: '/sitemap.xml',
} as const;

export type RouteName = keyof typeof ROUTES;
