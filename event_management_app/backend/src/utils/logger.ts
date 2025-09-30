/* ---------------------------------------------------------------------------
  utils/logger.ts
  ---------------------------------------------------------------------------
  • Single Pino instance shared across the backend
  • Pretty out‑put in development, JSON in production
  • Level controlled by LOG_LEVEL (env; defaults to "info")
  • Helper to create request‑scoped child loggers
  ------------------------------------------------------------------------- */

import pino from 'pino';
import type { Logger, LoggerOptions } from 'pino';

export const loggerOptions: LoggerOptions = createOptions();
// Build the root logger once.
// Fastify will respect level & bindings when you pass it in opts.logger,
// but you can also import `log` directly in any file.
export const log: Logger = pino(loggerOptions);

function createOptions(): LoggerOptions {
  const level = process.env.LOG_LEVEL ?? 'info';

  // Always use JSON format - no pretty printing
  return { level };
}

// Helper for per‑request logs.
// Example usage in hooks:
//
//   app.addHook('onRequest', (req) => {
//     req.log = createReqLogger(req.id)
//   })
export function createReqLogger(reqId: string): Logger {
  return log.child({ reqId });
}
