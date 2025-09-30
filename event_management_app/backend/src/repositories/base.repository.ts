/**
 * Base Repository Class
 *
 * Provides a typed foundation for all repositories with common CRUD operations.
 * This ensures consistent patterns and prevents common mistakes like:
 * - Using free 'db' instead of this.db
 * - Forgetting to execute queries
 * - Mixing different Drizzle patterns
 *
 * ## Type Safety Approach
 *
 * This base repository uses explicit type parameters (TSelect, TInsert) instead of
 * relying on Drizzle's InferSelectModel/InferInsertModel at the base level because:
 *
 * 1. **Drizzle's limitation with generics**: Drizzle's type system doesn't work well
 *    with generic table types due to its complex conditional type system
 * 2. **Type safety is preserved**: Concrete implementations pass the correct types
 *    (e.g., schema.User, schema.NewUser) ensuring full type safety
 * 3. **Clear contract**: The repository clearly shows what types it works with
 *
 * The type assertions (via `unknown`) are necessary workarounds for TypeScript's
 * strict type checking with Drizzle's complex types, but are safe because:
 * - All tables follow the same structure (id column, timestamps, etc.)
 * - Concrete implementations provide the actual type safety
 * - The assertions only bypass Drizzle's internal type checking, not our API
 */

import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';
import type { PgTable, PgColumn, TableConfig } from 'drizzle-orm/pg-core';

/**
 * Type-safe base repository
 *
 * @template TSchema - The database schema type
 * @template TTable - The specific table type (must extend PgTable)
 * @template TSelect - The type returned by SELECT queries (inferred from table)
 * @template TInsert - The type accepted by INSERT queries (inferred from table)
 *
 * Usage:
 * ```typescript
 * class UserRepository extends BaseRepository<
 *   typeof schema,
 *   typeof users,
 *   User,        // schema.User (from $inferSelect)
 *   NewUser      // schema.NewUser (from $inferInsert)
 * > {
 *   constructor(db: NodePgDatabase<typeof schema>) {
 *     super(db, users);
 *   }
 * }
 * ```
 */
export abstract class BaseRepository<
  TSchema extends Record<string, unknown>,
  TTable extends PgTable<TableConfig>,
  TSelect extends Record<string, unknown>,
  TInsert extends Record<string, unknown>,
> {
  constructor(
    protected readonly db: NodePgDatabase<TSchema>,
    protected readonly table: TTable
  ) {}

  /**
   * Find all records
   */
  async findAll(): Promise<TSelect[]> {
    // Type assertion needed due to Drizzle's generic limitations
    // Safe because concrete implementations provide correct types
    const results = await (this.db
      .select()
      .from(this.table as PgTable) as Promise<TSelect[]>);

    return results;
  }

  /**
   * Find a record by ID
   */
  async findById(id: string | number): Promise<TSelect | undefined> {
    // Access the id column - all our tables have an id column by convention
    const idColumn = (this.table as unknown as Record<string, PgColumn>).id;

    if (!idColumn) {
      throw new Error(`Table does not have an 'id' column`);
    }

    // Type assertion needed due to Drizzle's generic limitations
    const results = await (this.db
      .select()
      .from(this.table as PgTable)
      .where(eq(idColumn, id))
      .limit(1) as Promise<TSelect[]>);

    return results[0];
  }

  /**
   * Create a new record
   */
  async create(data: TInsert): Promise<TSelect> {
    // Type assertion needed due to Drizzle's generic limitations
    const results = await (this.db
      .insert(this.table as PgTable)
      .values(data)
      .returning() as unknown as Promise<TSelect[]>);

    if (!results[0]) {
      throw new Error('Failed to create record');
    }

    return results[0];
  }

  /**
   * Update a record by ID
   */
  async update(
    id: string | number,
    data: Partial<TInsert>
  ): Promise<TSelect | undefined> {
    // Access the id column - all our tables have an id column by convention
    const idColumn = (this.table as unknown as Record<string, PgColumn>).id;

    if (!idColumn) {
      throw new Error(`Table does not have an 'id' column`);
    }

    // Type assertion needed due to Drizzle's generic limitations
    const results = await (this.db
      .update(this.table as PgTable)
      .set(data)
      .where(eq(idColumn, id))
      .returning() as unknown as Promise<TSelect[]>);

    return results[0];
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string | number): Promise<boolean> {
    // Access the id column - all our tables have an id column by convention
    const idColumn = (this.table as unknown as Record<string, PgColumn>).id;

    if (!idColumn) {
      throw new Error(`Table does not have an 'id' column`);
    }

    // Type assertion needed due to Drizzle's generic limitations
    const result = await (this.db
      .delete(this.table as PgTable)
      .where(eq(idColumn, id))
      .returning() as unknown as Promise<TSelect[]>);

    return result.length > 0;
  }

  /**
   * Count all records
   */
  async count(): Promise<number> {
    // Type assertion needed due to Drizzle's generic limitations
    const result = await (this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(this.table as PgTable) as Promise<{ count: number }[]>);

    return result[0]?.count ?? 0;
  }
}
