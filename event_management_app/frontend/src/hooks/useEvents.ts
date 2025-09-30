import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  duplicateEvent,
} from '@/apis';
import type { paths } from '@app/openapi/generated-types';

// Type definitions
type CreateEventRequest = any; // API doesn't have POST endpoint
type UpdateEventRequest =
  paths['/events/{eventId}']['put']['requestBody']['content']['application/json'];

export interface UseEventsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  status?: string;
  tags?: string[];
  enabled?: boolean;
}

/**
 * Hook for fetching paginated events list with filtering
 */
export const useEvents = (params: UseEventsParams = {}) => {
  const {
    page = 1,
    pageSize = 20,
    searchQuery,
    status,
    tags,
    enabled = true,
  } = params;

  return useQuery({
    queryKey: ['events', { page, pageSize, q: searchQuery, status, tags }],
    queryFn: async () => {
      const result = await getEvents({
        page,
        pageSize,
        q: searchQuery,
        status,
        tags,
      });

      if (result.error) {
        throw new Error('Failed to fetch events');
      }

      return result.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching a single event by ID
 */
export const useEvent = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      if (!id) throw new Error('Event ID is required');

      const result = await getEvent(id);

      if (result.error) {
        throw new Error('Failed to fetch event');
      }

      return result.data;
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for creating a new event
 */
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData: CreateEventRequest) => {
      const result = await createEvent(eventData);

      if (result.error) {
        throw new Error('Failed to create event');
      }

      return result.data;
    },
    onSuccess: newEvent => {
      // Invalidate events list to refetch with new event
      queryClient.invalidateQueries({ queryKey: ['events'] });

      // Add new event to cache
      if (newEvent?.id) {
        queryClient.setQueryData(['events', newEvent.id], newEvent);
      }
    },
    onError: error => {
      console.error('Failed to create event:', error);
    },
  });
};

/**
 * Hook for updating an existing event
 */
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      eventData,
    }: {
      id: string;
      eventData: UpdateEventRequest;
    }) => {
      const result = await updateEvent(id, eventData);

      if (result.error) {
        throw new Error('Failed to update event');
      }

      return result.data;
    },
    onSuccess: (updatedEvent, { id }) => {
      // Update single event cache
      queryClient.setQueryData(['events', id], updatedEvent);

      // Invalidate events list to reflect changes
      queryClient.invalidateQueries({ queryKey: ['events'], exact: false });
    },
    onError: error => {
      console.error('Failed to update event:', error);
    },
  });
};

/**
 * Hook for deleting an event
 */
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteEvent(id);

      if (result.error) {
        throw new Error('Failed to delete event');
      }

      return result.data;
    },
    onSuccess: (_, deletedId) => {
      // Remove from single event cache
      queryClient.removeQueries({ queryKey: ['events', deletedId] });

      // Invalidate events list
      queryClient.invalidateQueries({ queryKey: ['events'], exact: false });
    },
    onError: error => {
      console.error('Failed to delete event:', error);
    },
  });
};

/**
 * Hook for duplicating an event
 */
export const useDuplicateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await duplicateEvent(id);

      if (result.error) {
        throw new Error('Failed to duplicate event');
      }

      return result.data;
    },
    onSuccess: duplicatedEvent => {
      // Invalidate events list to show new duplicated event
      queryClient.invalidateQueries({ queryKey: ['events'], exact: false });

      // Add duplicated event to cache
      if (duplicatedEvent?.id) {
        queryClient.setQueryData(
          ['events', duplicatedEvent.id],
          duplicatedEvent
        );
      }
    },
    onError: error => {
      console.error('Failed to duplicate event:', error);
    },
  });
};

// Notifications endpoint not available in current API
// export const useEventNotifications = (eventId: string, enabled = true) => {
//   return useQuery({
//     queryKey: ['events', eventId, 'notifications'],
//     queryFn: async () => {
//       if (!eventId) throw new Error('Event ID is required');
//       const result = await getEventNotifications(eventId);
//       if (result.error) {
//         throw new Error('Failed to fetch event notifications');
//       }
//       return result.data;
//     },
//     enabled: enabled && !!eventId,
//     staleTime: 2 * 60 * 1000,
//     gcTime: 5 * 60 * 1000,
//     refetchInterval: 30 * 1000,
//   });
// };

/**
 * Hook for bulk operations on multiple events
 */
export const useBulkDeleteEvents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventIds: string[]) => {
      const results = await Promise.allSettled(
        eventIds.map(id => deleteEvent(id))
      );

      const failed = results.filter(result => result.status === 'rejected');

      if (failed.length > 0) {
        throw new Error(`Failed to delete ${failed.length} events`);
      }

      return results;
    },
    onSuccess: (_, deletedIds) => {
      // Remove all deleted events from cache
      deletedIds.forEach(id => {
        queryClient.removeQueries({ queryKey: ['events', id] });
      });

      // Invalidate events list
      queryClient.invalidateQueries({ queryKey: ['events'], exact: false });
    },
    onError: error => {
      console.error('Failed to bulk delete events:', error);
    },
  });
};
