import { exec } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const report = path.resolve(import.meta.dirname, '../../../reports/reporting-labs/index.html');

if (!existsSync(report)) {
  process.stderr.write(`Aucun rapport trouvé (${report}). Lancez d'abord "npm test".\n`);
  process.exit(1);
}

const opener = { darwin: 'open', win32: 'start ""' }[process.platform] ?? 'xdg-open';
exec(`${opener} "${report}"`);
