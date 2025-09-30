import type { FastifyInstance } from 'fastify';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { BaseService } from './base.service';
import { NotificationRepository } from '../repositories/notifications.repo';
import type * as schema from '../db/schema';

const VALID_NOTIFICATION_TYPES = [
  'info',
  'warning',
  'error',
  'success',
] as const;
type NotificationType = (typeof VALID_NOTIFICATION_TYPES)[number];

export class NotificationService extends BaseService<
  schema.Notification,
  schema.NewNotification,
  Partial<schema.Notification>
> {
  protected entityName = 'Notification';

  constructor(private readonly repository: NotificationRepository) {
    super();
  }

  list() {
    return this.repository.findAll();
  }

  async get(id: string) {
    const found = await this.repository.findById(id);
    this.assertExists(found);
    return this.formatForResponse(found);
  }

  async create(data: schema.NewNotification) {
    await this.validateCreate(data);
    const created = await this.repository.create(data);
    return this.formatForResponse(created);
  }

  async update(id: string, changes: Partial<schema.Notification>) {
    await this.validateUpdate(id, changes);
    const updated = await this.repository.update(id, changes);
    this.assertExists(updated);
    return this.formatForResponse(updated);
  }

  async remove(id: string) {
    await this.validateDelete(id);
    return this.repository.delete(id);
  }

  /**
   * Create event-specific notification
   */
  async createEventNotification(
    eventId: string,
    title: string,
    message: string,
    type: string = 'info'
  ) {
    // Validate notification type
    if (!VALID_NOTIFICATION_TYPES.includes(type as NotificationType)) {
      throw new Error(
        `Invalid notification type. Must be one of: ${VALID_NOTIFICATION_TYPES.join(', ')}`
      );
    }

    const notificationData: schema.NewNotification = {
      eventId,
      title,
      message,
      isRead: 0,
    };

    const created = await this.repository.create(notificationData);
    return this.formatForResponse(created);
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string) {
    const notification = await this.repository.findById(id);
    this.assertExists(notification);

    if (notification.isRead === 1) {
      return this.formatForResponse(notification);
    }

    const updated = await this.repository.markAsRead(id);
    return this.formatForResponse(updated[0]);
  }

  /**
   * Get unread count for specific event
   */
  async getUnreadCountForEvent(eventId: string): Promise<number> {
    return this.repository.countUnreadByEventId(eventId);
  }

  /**
   * Mark all notifications as read for an event
   */
  async markAllReadForEvent(eventId: string) {
    const updated = await this.repository.markAllAsReadForEvent(eventId);
    return updated.map(notification => this.formatForResponse(notification));
  }

  /**
   * Get notifications by event ID
   */
  async findByEventId(eventId: string) {
    const notifications = await this.repository.findByEventId(eventId);
    return notifications.map(notification =>
      this.formatForResponse(notification)
    );
  }

  /**
   * Get unread notifications by event ID
   */
  async findUnreadByEventId(eventId: string) {
    const notifications = await this.repository.findUnreadByEventId(eventId);
    return notifications.map(notification =>
      this.formatForResponse(notification)
    );
  }

  /**
   * Create notifications for event lifecycle events
   */
  async createLifecycleNotification(
    eventId: string,
    eventName: string,
    action: 'created' | 'updated' | 'published' | 'archived'
  ) {
    const titles = {
      created: 'Event Created',
      updated: 'Event Updated',
      published: 'Event Published',
      archived: 'Event Archived',
    };

    const messages = {
      created: `Event "${eventName}" has been created`,
      updated: `Event "${eventName}" has been updated`,
      published: `Event "${eventName}" has been published`,
      archived: `Event "${eventName}" has been archived`,
    };

    const notificationTypes = {
      created: 'info',
      updated: 'info',
      published: 'success',
      archived: 'warning',
    };

    return this.createEventNotification(
      eventId,
      titles[action],
      messages[action],
      notificationTypes[action]
    );
  }

  protected override formatForResponse(
    entity: schema.Notification
  ): Partial<schema.Notification> {
    return entity;
  }
}

// Optional factory for Fastify wiring; prefer using the class directly
export function makeNotificationService(app: FastifyInstance) {
  const repo =
    app.repositories.notification ??
    new NotificationRepository(app.db as NodePgDatabase<typeof schema>);
  return new NotificationService(repo);
}

export type NotificationServiceType = InstanceType<typeof NotificationService>;
