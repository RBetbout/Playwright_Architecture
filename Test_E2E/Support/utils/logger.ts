const LEVELS = ['debug', 'info', 'warn', 'error'] as const;
type Level = (typeof LEVELS)[number];

function threshold(): number {
  const index = LEVELS.indexOf((process.env.LOG_LEVEL ?? 'info').toLowerCase() as Level);
  return index === -1 ? LEVELS.indexOf('info') : index;
}

function log(level: Level, scope: string, message: string, details?: unknown): void {
  if (LEVELS.indexOf(level) < threshold()) return;
  const line = `${new Date().toISOString()} [${level.toUpperCase()}] [${scope}] ${message}`;
  const sink = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  if (details === undefined) sink(line);
  else sink(line, details);
}

export interface Logger {
  debug(message: string, details?: unknown): void;
  info(message: string, details?: unknown): void;
  warn(message: string, details?: unknown): void;
  error(message: string, details?: unknown): void;
}

export function createLogger(scope: string): Logger {
  return {
    debug: (message, details) => log('debug', scope, message, details),
    info: (message, details) => log('info', scope, message, details),
    warn: (message, details) => log('warn', scope, message, details),
    error: (message, details) => log('error', scope, message, details),
  };
}
