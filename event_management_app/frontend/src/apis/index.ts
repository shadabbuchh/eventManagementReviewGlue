// Client exports
export { del, get, head, options, patch, post, put, trace } from './client';

// Error exports
export { ResponseError } from './error';
export { handleError } from './error-handler';

// Adapter exports
export { toUiSqlResult } from './adapters';
export type { UiSqlResult } from './adapters';

// Events API exports
export * from './events.apis';
