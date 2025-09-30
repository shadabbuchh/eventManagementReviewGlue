import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Services } from '../services/index';

/**
 * OpenAPI operation handlers for fastify-openapi-glue
 *
 * Maps OpenAPI operationIds to service method calls.
 * Extend this class to add handlers for new entities.
 *
 * 🚨 CRITICAL: This is the ONLY place to implement business API handlers.
 * NEVER create manual route files (src/routes/*.route.ts) for business endpoints.
 * All business routes are auto-generated from OpenAPI spec.
 */
export class OpenAPIServiceHandlers {
  protected services: Services;

  constructor(services: Services) {
    this.services = services;
  }

  /**
   * List events with pagination, search and status filters
   * Maps to operationId: listEvents
   */
  async listEvents(request: FastifyRequest) {
    const query = request.query as {
      page?: string;
      pageSize?: string;
      q?: string;
      status?: string;
      tag?: string;
    };

    const page = parseInt(query.page || '1', 10);
    const pageSize = parseInt(query.pageSize || '25', 10);
    const searchQuery = query.q;
    const status = query.status;

    const result = await this.services.event.findWithFilters(
      page,
      pageSize,
      searchQuery,
      status
    );

    return {
      data: result.data,
      meta: {
        page: result.page,
        pageSize: result.pageSize,
        totalPages: Math.ceil(result.total / result.pageSize),
        totalItems: result.total,
      },
    };
  }

  /**
   * Get single event by ID
   * Maps to operationId: getEvent
   */
  async getEvent(request: FastifyRequest) {
    const params = request.params as { eventId: string };
    const event = await this.services.event.get(params.eventId);
    return event;
  }

  /**
   * Update an existing event
   * Maps to operationId: updateEvent
   */
  async updateEvent(request: FastifyRequest) {
    const params = request.params as { eventId: string };
    const body = request.body as any;

    const updated = await this.services.event.update(params.eventId, body);
    return updated;
  }

  /**
   * Delete or archive an event
   * Maps to operationId: deleteEvent
   */
  async deleteEvent(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { eventId: string };
    const query = request.query as { permanent?: string };

    if (query.permanent === 'true') {
      await this.services.event.remove(params.eventId);
    } else {
      await this.services.event.archive(params.eventId);
    }

    reply.code(204);
    return;
  }

  /**
   * Duplicate an existing event
   * Maps to operationId: duplicateEvent
   */
  async duplicateEvent(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { eventId: string };
    const body = request.body as { name?: string; tags?: string[] };

    let duplicated = await this.services.event.duplicate(params.eventId);

    // Apply any overrides from request body
    if (body?.name || body?.tags) {
      duplicated = await this.services.event.update(duplicated.id, body);
    }

    reply.code(201);
    return duplicated;
  }

  /**
   * Cancel an event or specific occurrence
   * Maps to operationId: cancelEvent
   */
  async cancelEvent(request: FastifyRequest) {
    const params = request.params as { eventId: string };
    const body = request.body as { occurrence?: string; reason?: string };

    // For now, just archive the entire event
    // In the future, this could handle specific occurrence cancellations
    const cancelled = await this.services.event.archive(params.eventId);

    // Create notification about cancellation
    if (body?.reason) {
      await this.services.notification.createEventNotification(
        params.eventId,
        'Event Cancelled',
        `Event was cancelled. Reason: ${body.reason}`,
        'warning'
      );
    }

    return cancelled;
  }

  /**
   * Perform quick actions on events
   * Maps to operationId: eventQuickAction
   */
  async eventQuickAction(request: FastifyRequest) {
    const params = request.params as { eventId: string };
    const body = request.body as {
      action: 'edit' | 'view' | 'duplicate' | 'cancel';
      payload?: any;
    };

    switch (body.action) {
      case 'view':
        return this.services.event.get(params.eventId);

      case 'edit':
        if (body.payload) {
          return this.services.event.update(params.eventId, body.payload);
        }
        return this.services.event.get(params.eventId);

      case 'duplicate':
        return this.services.event.duplicate(params.eventId);

      case 'cancel':
        return this.services.event.archive(params.eventId);

      default:
        throw new Error(`Invalid action: ${body.action}`);
    }
  }

  /**
   * Get notifications for a specific event
   */
  async getEventNotifications(request: FastifyRequest) {
    const params = request.params as { eventId: string };
    const notifications = await this.services.notification.findByEventId(
      params.eventId
    );
    return { data: notifications };
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(request: FastifyRequest) {
    const params = request.params as { notificationId: string };
    const notification = await this.services.notification.markAsRead(
      params.notificationId
    );
    return notification;
  }

  /**
   * Mark all notifications as read for an event
   */
  async markAllNotificationsRead(request: FastifyRequest) {
    const params = request.params as { eventId: string };
    const notifications = await this.services.notification.markAllReadForEvent(
      params.eventId
    );
    return { data: notifications };
  }
}
