import type { FastifyInstance } from 'fastify';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { BaseService } from './base.service';
import { EventRepository } from '../repositories/events.repo';
import { NotificationRepository } from '../repositories/notifications.repo';
import type * as schema from '../db/schema';

export class EventService extends BaseService<
  schema.Event,
  schema.NewEvent,
  Partial<schema.Event>
> {
  protected entityName = 'Event';

  constructor(
    private readonly repository: EventRepository,
    private readonly notificationRepository: NotificationRepository
  ) {
    super();
  }

  /**
   * List events with filters and pagination
   */
  async findWithFilters(
    page: number = 1,
    pageSize: number = 10,
    searchQuery?: string,
    status?: string
  ) {
    const events = await this.repository.findAll(
      page,
      pageSize,
      searchQuery,
      status
    );
    const total = await this.repository.countWithFilters(searchQuery, status);

    return {
      data: events.map(event => this.formatForResponse(event)),
      total,
      page,
      pageSize,
    };
  }

  list() {
    return this.repository.findAll();
  }

  async get(id: string) {
    const found = await this.repository.findById(id);
    this.assertExists(found);
    return this.formatForResponse(found);
  }

  async create(data: schema.NewEvent) {
    await this.validateCreate(data);

    // Validate event dates
    this.validateEventDates(data.startDate, data.endDate);

    // Set default status if not provided
    const eventData = {
      ...data,
      status: data.status || 'draft',
      updatedAt: new Date(),
    };

    const created = await this.repository.create(eventData);

    // Create notification for event creation
    await this.notificationRepository.create({
      eventId: created.id,
      title: 'Event Created',
      message: `Event "${created.name}" has been created`,
    });

    return this.formatForResponse(created);
  }

  async update(id: string, changes: Partial<schema.Event>) {
    await this.validateUpdate(id, changes);

    // Validate event dates if they are being updated
    if (changes.startDate || changes.endDate) {
      const existing = await this.repository.findById(id);
      this.assertExists(existing);

      const startDate = changes.startDate || existing.startDate;
      const endDate = changes.endDate || existing.endDate;
      this.validateEventDates(startDate, endDate);
    }

    const updateData = {
      ...changes,
      updatedAt: new Date(),
    };

    const updated = await this.repository.update(id, updateData);
    this.assertExists(updated);

    // Create notification for significant updates
    if (changes.status || changes.name || changes.startDate) {
      await this.notificationRepository.create({
        eventId: id,
        title: 'Event Updated',
        message: `Event has been updated`,
      });
    }

    return this.formatForResponse(updated);
  }

  async remove(id: string) {
    await this.validateDelete(id);

    // Notifications will be cascade deleted due to foreign key constraint
    return this.repository.delete(id);
  }

  /**
   * Publish an event (change status from draft to published)
   */
  async publish(id: string) {
    const event = await this.repository.findById(id);
    this.assertExists(event);

    // Validate status transition
    if (event.status !== 'draft') {
      throw new Error('Only draft events can be published');
    }

    const updated = await this.repository.update(id, {
      status: 'published',
      updatedAt: new Date(),
    });

    // Create notification
    await this.notificationRepository.create({
      eventId: id,
      title: 'Event Published',
      message: `Event "${event.name}" has been published`,
    });

    return this.formatForResponse(updated!);
  }

  /**
   * Archive an event
   */
  async archive(id: string) {
    const event = await this.repository.findById(id);
    this.assertExists(event);

    // Validate status transition
    if (event.status === 'archived') {
      throw new Error('Event is already archived');
    }

    const updated = await this.repository.update(id, {
      status: 'archived',
      updatedAt: new Date(),
    });

    // Create notification
    await this.notificationRepository.create({
      eventId: id,
      title: 'Event Archived',
      message: `Event "${event.name}" has been archived`,
    });

    return this.formatForResponse(updated!);
  }

  /**
   * Duplicate an event
   */
  async duplicate(id: string) {
    const event = await this.repository.findById(id);
    this.assertExists(event);

    const duplicateData: schema.NewEvent = {
      name: `${event.name} (Copy)`,
      description: event.description,
      status: 'draft',
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      tags: event.tags,
    };

    const duplicated = await this.repository.create(duplicateData);

    // Create notification
    await this.notificationRepository.create({
      eventId: duplicated.id,
      title: 'Event Duplicated',
      message: `Event "${duplicated.name}" has been created as a copy`,
    });

    return this.formatForResponse(duplicated);
  }

  /**
   * Get upcoming events (future start date)
   */
  async getUpcomingEvents() {
    const now = new Date();
    return this.repository.findByDateRange(now, new Date('2099-12-31'));
  }

  /**
   * Get events by status
   */
  async getEventsByStatus(status: string) {
    const events = await this.repository.findByStatus(status);
    return events.map(event => this.formatForResponse(event));
  }

  /**
   * Validate event dates
   */
  private validateEventDates(startDate: Date, endDate?: Date | null) {
    if (endDate && endDate <= startDate) {
      throw new Error('End date must be after start date');
    }
  }

  protected override formatForResponse(
    entity: schema.Event
  ): Partial<schema.Event> {
    return entity;
  }
}

// Optional factory for Fastify wiring; prefer using the class directly
export function makeEventService(app: FastifyInstance) {
  const repo =
    app.repositories.event ??
    new EventRepository(app.db as NodePgDatabase<typeof schema>);
  const notificationRepo =
    app.repositories.notification ??
    new NotificationRepository(app.db as NodePgDatabase<typeof schema>);
  return new EventService(repo, notificationRepo);
}

export type EventServiceType = InstanceType<typeof EventService>;
