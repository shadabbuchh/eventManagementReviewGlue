import { get, post, put, del, handleError } from './index';
import type { paths } from '@app/openapi/generated-types';

// Type definitions for API endpoints
type GetEventsParams = {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: string;
  tags?: string[];
};

type EventsResponse =
  paths['/events']['get']['responses']['200']['content']['application/json'];
type EventResponse =
  paths['/events/{eventId}']['get']['responses']['200']['content']['application/json'];

type UpdateEventRequest =
  paths['/events/{eventId}']['put']['requestBody']['content']['application/json'];

/**
 * Fetch paginated list of events with optional filtering
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with events list or error
 */
export const getEvents = async (params: GetEventsParams = {}) => {
  const { data, error } = await get('/events', {
    params: {
      query: {
        page: params.page,
        pageSize: params.pageSize,
        q: params.q,
        status: params.status as "draft" | "published" | "archived" | undefined,
        tags: params.tags?.join(','),
      },
    },
  });

  if (error) {
    handleError(error);
    return { data: null, error };
  }

  return { data: data as EventResponse, error: null };
};

/**
 * Fetch single event by ID
 * @param id - Event ID
 * @returns Promise with event data or error
 */
export const getEvent = async (id: string) => {
  const { data, error } = await get('/events/{eventId}', {
    params: {
      path: { eventId: id },
    },
  });

  if (error) {
    handleError(error);
    return { data: null, error };
  }

  return { data: data as EventResponse, error: null };
};

/**
 * Create a new event
 * @param eventData - Event creation data
 * @returns Promise with created event or error
 */
export const createEvent = async (eventData: any) => {
  const { data, error } = await get('/events', {
    params: {
      query: {
        ...(eventData.page && { page: eventData.page }),
        ...(eventData.pageSize && { pageSize: eventData.pageSize }),
        ...(eventData.q && { q: eventData.q }),
        ...(eventData.status && { status: eventData.status as "draft" | "published" | "archived" | undefined }),
        ...(eventData.tag && { tag: eventData.tag })
      }
    }
  });

  if (error) {
    handleError(error);
    return { data: null, error };
  }

  return { data: data as EventResponse, error: null };
};

/**
 * Update an existing event
 * @param id - Event ID
 * @param eventData - Event update data
 * @returns Promise with updated event or error
 */
export const updateEvent = async (
  id: string,
  eventData: UpdateEventRequest
) => {
  const { data, error } = await put('/events/{eventId}', {
    params: {
      path: { eventId: id },
    },
    body: eventData,
  });

  if (error) {
    handleError(error);
    return { data: null, error };
  }

  return { data: data as EventResponse, error: null };
};

/**
 * Delete an event
 * @param id - Event ID
 * @returns Promise with success status or error
 */
export const deleteEvent = async (id: string) => {
  const { data, error } = await del('/events/{eventId}', {
    params: {
      path: { eventId: id },
    },
  });

  if (error) {
    handleError(error);
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Duplicate an existing event
 * @param id - Event ID to duplicate
 * @returns Promise with duplicated event or error
 */
export const duplicateEvent = async (id: string) => {
  const { data, error } = await post('/events/{eventId}/duplicate', {
    params: {
      path: { eventId: id },
    },
  });

  if (error) {
    handleError(error);
    return { data: null, error };
  }

  return { data: data as EventResponse, error: null };
};

/**
 * Get notifications for a specific event
 * @param id - Event ID
 * @returns Promise with notifications data or error
 */
// Remove this function as notifications endpoint doesn't exist in current API
// export const getEventNotifications = async (id: string) => {
//   const { data, error } = await get('/events/{eventId}/notifications', {
//     params: {
//       path: { eventId: id },
//     },
//   });
//   if (error) {
//     handleError(error);
//     return { data: null, error };
//   }
//   return { data: data as NotificationsResponse, error: null };
// };
