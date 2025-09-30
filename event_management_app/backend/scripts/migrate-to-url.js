#!/usr/bin/env node

/**
 * Migrate to specific database URL script
 *
 * Allows running migrations against any database URL, useful for:
 * - Testing migrations on temporary databases
 * - Migrating staging/production databases
 * - Running migrations in CI/CD pipelines
 *
 * Usage:
 *   pnpm db:migrate-to postgresql://user:pass@host:port/dbname
 *   node --import tsx scripts/migrate-to-url.js postgresql://user:pass@host:port/dbname
 */

import { join } from 'path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import process, { stdout, stderr } from 'node:process';
import { URL } from 'node:url';

async function migrateToUrl() {
  const dbUrl = process.argv[2];

  const log = msg => {
    stdout.write(String(msg) + '\n');
  };
  const err = msg => {
    stderr.write(String(msg) + '\n');
  };

  if (!dbUrl) {
    err('❌ Database URL is required');
    log('\nUsage:');
    log('  pnpm db:migrate-to postgresql://user:pass@host:port/dbname');
    log(
      '  node --import tsx scripts/migrate-to-url.js postgresql://user:pass@host:port/dbname'
    );
    process.exit(1);
  }

  // Validate URL format
  try {
    new URL(dbUrl);
  } catch {
    err('❌ Invalid database URL format');
    err('   Expected: postgresql://user:pass@host:port/dbname');
    process.exit(1);
  }

  log('🗄️  Running migrations...');
  log(`📍 Target: ${dbUrl.replace(/:\/\/[^@]+@/, '://***@')}`); // Hide credentials in log

  const pool = new pg.Pool({ connectionString: dbUrl });
  const db = drizzle(pool);

  try {
    // Use the same migrations folder as the main app
    const migrationsFolder = join(process.cwd(), 'src', 'db', 'migrations');

    const startTime = Date.now();
    await migrate(db, { migrationsFolder });
    const duration = Date.now() - startTime;

    log(`✅ Migrations completed successfully in ${duration}ms`);

    // Show final table count
    const result = await pool.query(`
      SELECT count(*) as table_count
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    log(`📊 Database now has ${result.rows[0].table_count} table(s)`);
  } catch (e) {
    err('❌ Migration failed:');
    err(e && e.message ? e.message : String(e));

    if (e && e.stack) {
      err('\nStack trace:');
      err(e.stack);
    }

    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await migrateToUrl();
}

export { migrateToUrl };
