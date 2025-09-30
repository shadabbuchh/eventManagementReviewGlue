import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  Edit,
  Eye,
  Copy,
  Trash,
  MoreHorizontal,
  Calendar,
  Bell,
} from 'lucide-react';

import {
  DataTable,
  createSelectColumn,
  Button,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Typography,
} from '@/components';
import type { paths } from '@app/openapi/generated-types';

// Event type from API
type Event =
  paths['/events']['get']['responses']['200']['content']['application/json']['data'][0];

interface EventsTableProps {
  data: Event[];
  loading?: boolean;
  onEventClick?: (event: Event) => void;
  onEditEvent?: (event: Event) => void;
  onViewEvent?: (event: Event) => void;
  onDuplicateEvent?: (event: Event) => void;
  onDeleteEvent?: (event: Event) => void;
}

// Status badge configuration
const getStatusBadge = (status: string) => {
  const config = {
    draft: { variant: 'secondary', label: 'Draft' },
    published: { variant: 'default', label: 'Published' },
    archived: { variant: 'destructive', label: 'Archived' },
  } as const;

  const statusConfig = config[status as keyof typeof config] || config.draft;

  return (
    <Badge variant={statusConfig.variant as any}>{statusConfig.label}</Badge>
  );
};

// Format date helper
const formatEventDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'No date set';

  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
};

// Notification badge component
const NotificationBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count <= 0) return null;

  return (
    <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
      <Bell className="w-3 h-3 mr-1" />
      {count > 99 ? '99+' : count}
    </Badge>
  );
};

export const EventsTable: React.FC<EventsTableProps> = ({
  data,
  loading = false,
  onEventClick,
  onEditEvent,
  onViewEvent,
  onDuplicateEvent,
  onDeleteEvent,
}) => {
  // Define table columns
  const columns: ColumnDef<Event>[] = React.useMemo(
    () => [
      // Selection column
      createSelectColumn<Event>(),

      // Event name and date
      {
        accessorKey: 'name',
        header: 'Event',
        cell: ({ row }) => {
          const event = row.original;
          const notificationCount = event.unreadNotifications ? 1 : 0;

          return (
            <div
              className="cursor-pointer hover:text-primary"
              onClick={() => onEventClick?.(event)}
            >
              <div className="flex items-center">
                <Typography.P className="font-medium">
                  {event.name || 'Untitled Event'}
                </Typography.P>
                <NotificationBadge count={notificationCount} />
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <Typography.Small className="text-muted-foreground">
                  {formatEventDate(event.nextOccurrence)}
                </Typography.Small>
              </div>
            </div>
          );
        },
      },

      // Status
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => getStatusBadge(row.original.status || 'draft'),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },

      // Location
      {
        accessorKey: 'location',
        header: 'Location',
        cell: () => {
          // Location is not available in current Event type
          return (
            <Typography.Small className="text-muted-foreground">
              No location set
            </Typography.Small>
          );
        },
      },

      // Registrations (if available)
      {
        accessorKey: 'registrationCount',
        header: 'Registrations',
        cell: () => {
          // Registration data not available in current Event type
          return (
            <Typography.Small className="text-muted-foreground">
              -
            </Typography.Small>
          );
        },
      },

      // Revenue (if available)
      {
        accessorKey: 'revenue',
        header: 'Revenue',
        cell: () => {
          // Revenue data not available in current Event type
          return (
            <Typography.Small className="text-muted-foreground">
              -
            </Typography.Small>
          );
        },
      },

      // Actions
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const event = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={e => e.stopPropagation()}
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    onViewEvent?.(event);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Event
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    onEditEvent?.(event);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Event
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    onDuplicateEvent?.(event);
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation();
                    onDeleteEvent?.(event);
                  }}
                  className="text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [onEventClick, onEditEvent, onViewEvent, onDuplicateEvent, onDeleteEvent]
  );

  // Handle loading state
  if (loading) {
    return (
      <div className="w-full">
        <div className="rounded-md border">
          <div className="p-8 text-center">
            <Typography.P className="text-muted-foreground">
              Loading events...
            </Typography.P>
          </div>
        </div>
      </div>
    );
  }

  // Handle empty state
  if (!data || data.length === 0) {
    return (
      <div className="w-full">
        <div className="rounded-md border">
          <div className="p-8 text-center">
            <Typography.H3 className="mb-2">No events found</Typography.H3>
            <Typography.P className="text-muted-foreground mb-4">
              Get started by creating your first event.
            </Typography.P>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search events by name..."
      searchKey="name"
    />
  );
};
