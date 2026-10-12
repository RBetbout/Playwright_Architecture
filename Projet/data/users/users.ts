import { config, type Credentials } from '../../config/config';

export type UserRole = 'standard';

/**
 * Les identifiants viennent exclusivement des variables d'environnement
 * (fichier .env.<env> en local, credentials Jenkins en CI) : rien n'est écrit ici.
 */
export function getUser(role: UserRole = 'standard'): Credentials {
  const users: Record<UserRole, Credentials> = {
    standard: config.credentials,
  };
  const user = users[role];
  if (!user.email || !user.password) {
    throw new Error(
      `Identifiants du profil "${role}" absents pour l'environnement "${config.name}" ` +
        '(USER_EMAIL / USER_PASSWORD).',
    );
  }
  return user;
}
