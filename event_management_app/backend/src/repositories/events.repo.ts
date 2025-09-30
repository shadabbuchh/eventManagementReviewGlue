import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { BaseRepository } from './base.repository';
import type * as schema from '../db/schema';
import { events, notifications } from '../db/schema';
import { eq, ilike, or, count, sql } from 'drizzle-orm';

/**
 * Repository for Event entities
 * Extends BaseRepository for common CRUD operations
 *
 * Uses the types from schema:
 * - schema.Event for SELECT results ($inferSelect)
 * - schema.NewEvent for INSERT data ($inferInsert)
 */
export class EventRepository extends BaseRepository<
  typeof schema,
  typeof events,
  schema.Event,
  schema.NewEvent
> {
  constructor(db: NodePgDatabase<typeof schema>) {
    super(db, events);
  }

  /**
   * Find events by status
   */
  async findByStatus(status: string) {
    return this.db.select().from(events).where(eq(events.status, status));
  }

  /**
   * Find events with unread notifications count
   */
  async findWithUnreadNotifications() {
    return this.db
      .select({
        ...events,
        unreadCount: count(notifications.id),
      })
      .from(events)
      .leftJoin(notifications, eq(events.id, notifications.eventId))
      .where(eq(notifications.isRead, 0))
      .groupBy(events.id);
  }

  /**
   * Find events within date range
   */
  async findByDateRange(startDate: Date, endDate: Date) {
    return this.db
      .select()
      .from(events)
      .where(
        sql`${events.startDate} >= ${startDate} AND ${events.startDate} <= ${endDate}`
      );
  }

  /**
   * Search events by name or tags
   */
  async searchByNameOrTags(query: string) {
    const searchPattern = `%${query}%`;
    return this.db
      .select()
      .from(events)
      .where(
        or(
          ilike(events.name, searchPattern),
          sql`EXISTS (SELECT 1 FROM unnest(${events.tags}) tag WHERE tag ILIKE ${searchPattern})`
        )
      );
  }

  /**
   * Find all events with notification counts and pagination
   */
  async findAll(
    page: number = 1,
    pageSize: number = 10,
    searchQuery?: string,
    status?: string
  ) {
    let query = this.db
      .select({
        ...events,
        notificationCount: count(notifications.id),
      })
      .from(events)
      .leftJoin(notifications, eq(events.id, notifications.eventId))
      .groupBy(events.id);

    // Apply filters
    const conditions = [];
    if (searchQuery) {
      const searchPattern = `%${searchQuery}%`;
      conditions.push(
        or(
          ilike(events.name, searchPattern),
          sql`EXISTS (SELECT 1 FROM unnest(${events.tags}) tag WHERE tag ILIKE ${searchPattern})`
        )
      );
    }
    if (status) {
      conditions.push(eq(events.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(
        sql`${conditions.reduce((acc, condition) => sql`${acc} AND ${condition}`)}`
      );
    }

    // Apply pagination
    const offset = (page - 1) * pageSize;
    return query.limit(pageSize).offset(offset);
  }

  /**
   * Count total events matching filters
   */
  async countWithFilters(searchQuery?: string, status?: string) {
    let query = this.db.select({ count: count() }).from(events);

    const conditions = [];
    if (searchQuery) {
      const searchPattern = `%${searchQuery}%`;
      conditions.push(
        or(
          ilike(events.name, searchPattern),
          sql`EXISTS (SELECT 1 FROM unnest(${events.tags}) tag WHERE tag ILIKE ${searchPattern})`
        )
      );
    }
    if (status) {
      conditions.push(eq(events.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(
        sql`${conditions.reduce((acc, condition) => sql`${acc} AND ${condition}`)}`
      );
    }

    const [{ count: total }] = await query;
    return total;
  }
}

// Factory to create the repository with an injected db instance
export function eventRepo(db: NodePgDatabase<typeof schema>) {
  return new EventRepository(db);
}
