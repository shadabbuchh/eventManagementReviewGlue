import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { FastifyInstance } from 'fastify';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

// Run Drizzle migrations using the same folder as configured in drizzle.config.ts
export async function runMigrations(fastifyApp: FastifyInstance) {
  if (!fastifyApp?.config?.APP_DATABASE_URL) {
    throw new Error(
      'APP_DATABASE_URL not found in Fastify app.config. Ensure @fastify/env plugin is properly registered.'
    );
  }

  // Create a temporary connection for migrations (separate from app's main DB connection)
  const pool = new pg.Pool({
    connectionString: fastifyApp.config.APP_DATABASE_URL,
  });
  const db = drizzle(pool);

  try {
    // Get the directory where this file is located and point to migrations folder
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const migrationsFolder = join(__dirname, 'migrations');
    await migrate(db, { migrationsFolder });
  } finally {
    await pool.end();
  }
}
