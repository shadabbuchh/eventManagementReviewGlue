/**
 * Database Connection Export Module
 *
 * This module provides a standardized way to access the database connection.
 * It exports a named 'db' that can be imported by repositories without needing
 * the Fastify app instance.
 *
 * IMPORTANT: This requires the database to be initialized first through the
 * Fastify app startup process.
 */

import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from './schema';

// This will be set by the db plugin during app initialization
let dbInstance: NodePgDatabase<typeof schema> | null = null;

/**
 * Get the database instance
 * @throws Error if database not initialized
 */
export function getDb(): NodePgDatabase<typeof schema> {
  if (!dbInstance) {
    throw new Error(
      'Database not initialized. Ensure the Fastify app has started and the db plugin is registered.'
    );
  }
  return dbInstance;
}

/**
 * Initialize the database instance (called by db plugin)
 * @internal
 */
export function initializeDb(db: NodePgDatabase<typeof schema>): void {
  dbInstance = db;
}

/**
 * Usage: const db = dbFactory(); db.select(...)
 */
export function dbFactory(): NodePgDatabase<typeof schema> {
  return getDb();
}
