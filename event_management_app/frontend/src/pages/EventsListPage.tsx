import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';

import {
  Container,
  Typography,
  Button,
  EventsTable,
  EventFilters,
  Alert,
  AlertDescription,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components';
import { toast } from 'sonner';
import {
  useEvents,
  useDeleteEvent,
  useDuplicateEvent,
  useBulkDeleteEvents,
} from '@/hooks';
import { useEventsStore, useSelectedCount } from '@/store';
import type { paths } from '@app/openapi/generated-types';

// Event type from API
type Event =
  paths['/events']['get']['responses']['200']['content']['application/json']['data'][0];

export const EventsListPage: React.FC = () => {
  const navigate = useNavigate();

  // Get filter state from store
  const searchQuery = useEventsStore(state => state.searchQuery);
  const selectedStatus = useEventsStore(state => state.selectedStatus);
  const selectedTags = useEventsStore(state => state.selectedTags);
  const currentPage = useEventsStore(state => state.currentPage);
  const pageSize = useEventsStore(state => state.pageSize);
  const selectedEventIds = useEventsStore(state => state.selectedEventIds);
  const clearSelection = useEventsStore(state => state.clearSelection);

  // Get computed values
  const selectedCount = useSelectedCount();

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = React.useState(false);
  const [eventToDelete, setEventToDelete] = React.useState<Event | null>(null);

  // Fetch events with current filters
  const {
    data: eventsData,
    isLoading,
    error,
    refetch,
  } = useEvents({
    page: currentPage,
    pageSize,
    searchQuery: searchQuery || undefined,
    status: selectedStatus || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  });

  // Mutations
  const deleteEventMutation = useDeleteEvent();
  const duplicateEventMutation = useDuplicateEvent();
  const bulkDeleteMutation = useBulkDeleteEvents();

  // Navigation handlers
  const handleEventClick = (event: Event) => {
    if (event.id) {
      navigate(`/events/${event.id}`);
    }
  };

  const handleEditEvent = (event: Event) => {
    if (event.id) {
      navigate(`/events/${event.id}/edit`);
    }
  };

  const handleViewEvent = (event: Event) => {
    if (event.id) {
      navigate(`/events/${event.id}`);
    }
  };

  const handleCreateEvent = () => {
    navigate('/events/new');
  };

  // Action handlers
  const handleDuplicateEvent = async (event: Event) => {
    if (!event.id) return;

    try {
      await duplicateEventMutation.mutateAsync(event.id);
      toast.success(`"${event.name}" has been successfully duplicated.`);
    } catch (error) {
      toast.error(
        'An error occurred while duplicating the event. Please try again.'
      );
    }
  };

  const handleDeleteEvent = (event: Event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete?.id) return;

    try {
      await deleteEventMutation.mutateAsync(eventToDelete.id);
      toast.success(`"${eventToDelete.name}" has been successfully deleted.`);
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    } catch (error) {
      toast.error(
        'An error occurred while deleting the event. Please try again.'
      );
    }
  };

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await bulkDeleteMutation.mutateAsync(selectedEventIds);
      toast.success(`${selectedCount} events have been successfully deleted.`);
      setBulkDeleteDialogOpen(false);
      clearSelection();
    } catch (error) {
      toast.error(
        'An error occurred while deleting the events. Please try again.'
      );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Container>
        <Helmet>
          <title>Events | App Name</title>
        </Helmet>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Typography.H1>Events</Typography.H1>
              <Typography.P className="text-muted-foreground">
                Manage your events and track their performance.
              </Typography.P>
            </div>
          </div>
          <div className="text-center py-12">
            <Typography.P className="text-muted-foreground">
              Loading events...
            </Typography.P>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet>
        <title>Events | App Name</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Typography.H1>Events</Typography.H1>
            <Typography.P className="text-muted-foreground">
              Manage your events and track their performance.
            </Typography.P>
          </div>
          <div className="flex items-center gap-2">
            {selectedCount > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={bulkDeleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selectedCount})
              </Button>
            )}
            <Button onClick={handleCreateEvent}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load events. Please try again.
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="ml-2"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <EventFilters />
          </div>

          {/* Events Table */}
          <div className="lg:col-span-3">
            <EventsTable
              data={eventsData?.data || []}
              loading={isLoading}
              onEventClick={handleEventClick}
              onEditEvent={handleEditEvent}
              onViewEvent={handleViewEvent}
              onDuplicateEvent={handleDuplicateEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          </div>
        </div>
      </div>

      {/* Delete Event Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{eventToDelete?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteEventMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteEvent}
              disabled={deleteEventMutation.isPending}
            >
              {deleteEventMutation.isPending ? 'Deleting...' : 'Delete Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Multiple Events</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} selected events?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBulkDeleteDialogOpen(false)}
              disabled={bulkDeleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmBulkDelete}
              disabled={bulkDeleteMutation.isPending}
            >
              {bulkDeleteMutation.isPending
                ? 'Deleting...'
                : `Delete ${selectedCount} Events`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
};
