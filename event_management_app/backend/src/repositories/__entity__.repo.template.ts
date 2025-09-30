// ⚠️  TEMPLATE FILE - DO NOT MODIFY OR DELETE ⚠️
// Copy this file to create new repositories (e.g., user.repo.ts)
//
// IMPORTANT: When copying this template:
// 1. Replace all __entity__ tokens with your entity name
// 2. Import from '../db' not '../db/connection'
// 3. Use class-based pattern with this.db

import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { BaseRepository } from './base.repository';
import type * as schema from '../db/schema';
import { __entityPlural__ } from '../db/schema';

/**
 * Repository for __Entity__ entities
 * Extends BaseRepository for common CRUD operations
 *
 * Uses the types from schema:
 * - schema.__Entity__ for SELECT results ($inferSelect)
 * - schema.New__Entity__ for INSERT data ($inferInsert)
 */
export class __Entity__Repository extends BaseRepository<
  typeof schema,
  typeof __entityPlural__,
  schema.__Entity__,
  schema.New__Entity__
> {
  constructor(db: NodePgDatabase<typeof schema>) {
    super(db, __entityPlural__);
  }

  // Add custom methods specific to this entity here
  // The base class provides: findAll, findById, create, update, delete, count
}

// Factory to create the repository with an injected db instance
export function __entity__Repo(db: NodePgDatabase<typeof schema>) {
  return new __Entity__Repository(db);
}
