import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import type { FastifyInstance } from 'fastify';
import * as schema from '../db/schema';
import { initializeDb } from '../db';

export const dbPlugin = (app: FastifyInstance) => {
  let pool: pg.Pool;
  let db: NodePgDatabase<typeof schema>;

  try {
    pool = new pg.Pool({ connectionString: app.config.APP_DATABASE_URL });
    db = drizzle(pool, { schema });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to initialize database connection: ${message}`);
  }

  // Initialize the global db export for repositories
  initializeDb(db);

  // Initialize immediately during construction (like repositories/services)
  app.decorate('db', db);
  app.addHook('onClose', async () => {
    try {
      await pool.end();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      app.log.error({ err }, 'Error closing database pool');
    }
  });

  return {
    name: 'db',
    db,
    pool,
    // Note: Cleanup handled automatically by onClose hook above
  };
};
