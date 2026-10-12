import path from 'node:path';
import type { ReportingLabsOptions } from 'reporting-labs';
import { config } from '../Projet/config/config';

const reportingLabs: ReportingLabsOptions = {
  title: 'Rapport de tests E2E',
  outputFolder: path.resolve(__dirname, '../reports/reporting-labs'),
  // Ouvre le rapport dans le navigateur si un test échoue en local ; jamais en CI.
  open: 'on-failure',
  bdd: true,
  dimensions: ['priority', 'severity', 'feature', 'owner'],
  dimensionOrder: { severity: ['blocker', 'critical', 'major', 'minor', 'trivial'] },
  metadata: { env: config.name },
  env: {
    'Base URL': config.baseUrl,
    'API URL': config.apiUrl || 'n/a',
  },
  // Le mot de passe du profil de test est masqué partout où il apparaîtrait dans le rapport.
  maskValues: [config.credentials.password].filter(Boolean),
  // L'historique vit hors de reports/ pour survivre à `npm run clean` et alimenter les tendances.
  history: { enabled: true, file: path.join(__dirname, '.reporting-labs-history.json'), keep: 30 },
};

export default reportingLabs;
