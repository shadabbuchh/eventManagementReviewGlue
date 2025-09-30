// ⚠️ TEMPLATE TOKEN SCHEMA — DO NOT DELETE ⚠️
// This placeholder keeps the template compiling before real entities are scaffolded.
// Replace __entity__/__entityPlural__ tokens when creating actual schema files.

import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const __entityPlural__ = pgTable('__entityPlural__', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 64 }).notNull(),
});

export type __Entity__ = typeof __entityPlural__.$inferSelect;
export type New__Entity__ = typeof __entityPlural__.$inferInsert;
