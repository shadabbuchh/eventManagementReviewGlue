import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { BaseRepository } from './base.repository';
import type * as schema from '../db/schema';
import { notifications } from '../db/schema';
import { eq, count, sql } from 'drizzle-orm';

/**
 * Repository for Notification entities
 * Extends BaseRepository for common CRUD operations
 *
 * Uses the types from schema:
 * - schema.Notification for SELECT results ($inferSelect)
 * - schema.NewNotification for INSERT data ($inferInsert)
 */
export class NotificationRepository extends BaseRepository<
  typeof schema,
  typeof notifications,
  schema.Notification,
  schema.NewNotification
> {
  constructor(db: NodePgDatabase<typeof schema>) {
    super(db, notifications);
  }

  /**
   * Find notifications by event ID
   */
  async findByEventId(eventId: string) {
    return this.db
      .select()
      .from(notifications)
      .where(eq(notifications.eventId, eventId))
      .orderBy(notifications.createdAt);
  }

  /**
   * Find unread notifications by event ID
   */
  async findUnreadByEventId(eventId: string) {
    return this.db
      .select()
      .from(notifications)
      .where(
        sql`${notifications.eventId} = ${eventId} AND ${notifications.isRead} = 0`
      )
      .orderBy(notifications.createdAt);
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string) {
    return this.db
      .update(notifications)
      .set({ isRead: 1 })
      .where(eq(notifications.id, id))
      .returning();
  }

  /**
   * Count unread notifications by event ID
   */
  async countUnreadByEventId(eventId: string) {
    const [{ count: unreadCount }] = await this.db
      .select({ count: count() })
      .from(notifications)
      .where(
        sql`${notifications.eventId} = ${eventId} AND ${notifications.isRead} = 0`
      );

    return unreadCount;
  }

  /**
   * Mark all notifications as read for an event
   */
  async markAllAsReadForEvent(eventId: string) {
    return this.db
      .update(notifications)
      .set({ isRead: 1 })
      .where(eq(notifications.eventId, eventId))
      .returning();
  }
}

// Factory to create the repository with an injected db instance
export function notificationRepo(db: NodePgDatabase<typeof schema>) {
  return new NotificationRepository(db);
}
