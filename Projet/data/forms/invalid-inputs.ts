/** Jeux de valeurs réutilisables pour les tests négatifs de formulaires. */
export const INVALID_EMAILS = [
  '',
  'sans-arobase',
  'utilisateur@',
  '@domaine.fr',
  'espace dans@mail.fr',
] as const;

export const BOUNDARY_TEXTS = {
  empty: '',
  whitespaceOnly: '   ',
  veryLong: 'a'.repeat(5_000),
  specialCharacters: `<script>alert('x')</script> é à ü ñ 中文 😀`,
} as const;
