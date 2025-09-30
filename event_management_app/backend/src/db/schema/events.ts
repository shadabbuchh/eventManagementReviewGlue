import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const eventStatusEnum = pgEnum('event_status', [
  'draft',
  'published',
  'archived',
]);

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: eventStatusEnum('status').notNull().default('draft'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  location: varchar('location', { length: 255 }),
  tags: text('tags').array(),
  notificationCount: integer('notification_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message'),
  isRead: integer('is_read').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
