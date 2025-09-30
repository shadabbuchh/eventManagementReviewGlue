// tests/helpers/db-reset.ts
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { FastifyInstance } from 'fastify';
import type * as schema from '../../src/db/schema';

// Hard‑reset the `public` schema and re‑apply all migrations.
// Call once per test file (e.g. in `beforeAll`).
export async function resetDb(app: FastifyInstance) {
  const db = app.db as NodePgDatabase<typeof schema>;

  // 1️⃣ Drop *everything* in public and recreate it
  await db.execute(
    sql.raw(`
    DROP SCHEMA IF EXISTS public CASCADE;
    CREATE SCHEMA public;
  `)
  );

  // 2️⃣ Re‑run Drizzle migrations programmatically
  //    Looks for `.sql` files in the default `drizzle/` folder
  await migrate(db, { migrationsFolder: 'drizzle' });
}
