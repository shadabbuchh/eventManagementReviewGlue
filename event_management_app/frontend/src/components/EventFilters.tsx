import * as React from 'react';
import { X, Filter, Search } from 'lucide-react';

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Button,
  Card,
  CardContent,
  Typography,
  Separator,
} from '@/components';
import { useEventsStore } from '@/store';

// Available event statuses
const EVENT_STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

// Mock available tags - in real app, this would come from API
const AVAILABLE_TAGS = [
  'conference',
  'workshop',
  'webinar',
  'networking',
  'training',
  'seminar',
  'meetup',
  'virtual',
  'hybrid',
  'in-person',
];

export const EventFilters: React.FC = () => {
  // Get filter state from Zustand store
  const searchQuery = useEventsStore(state => state.searchQuery);
  const selectedStatus = useEventsStore(state => state.selectedStatus);
  const selectedTags = useEventsStore(state => state.selectedTags);

  // Get filter actions
  const setSearchQuery = useEventsStore(state => state.setSearchQuery);
  const setSelectedStatus = useEventsStore(state => state.setSelectedStatus);
  const setSelectedTags = useEventsStore(state => state.setSelectedTags);
  const resetFilters = useEventsStore(state => state.resetFilters);
  
  // Import hasActiveFilters from store
  const hasActiveFiltersFromStore = useEventsStore(state => !!(
    state.searchQuery ||
    (state.selectedStatus && state.selectedStatus !== 'all') ||
    state.selectedTags.length > 0
  ));

  // Debounced search input
  const [searchInput, setSearchInput] = React.useState(searchQuery);
  const searchTimeoutRef = React.useRef<number | undefined>();

  // Debounce search input changes
  React.useEffect(() => {
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput, setSearchQuery]);

  // Use the computed hasActiveFilters from store
  const hasActiveFilters = hasActiveFiltersFromStore;

  // Handle status change
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value === 'all' ? null : value);
  };

  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Handle tag removal
  const handleTagRemove = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    setSearchInput('');
    resetFilters();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Typography.H4>Filters</Typography.H4>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="ml-auto text-muted-foreground"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Typography.Small className="font-medium">
              Search Events
            </Typography.Small>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by event name or description..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Separator />

          {/* Status Filter */}
          <div className="space-y-2">
            <Typography.Small className="font-medium">Status</Typography.Small>
            <Select
              value={selectedStatus || 'all'}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_STATUSES.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Tags Filter */}
          <div className="space-y-2">
            <Typography.Small className="font-medium">Tags</Typography.Small>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedTags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => handleTagRemove(tag)}
                  >
                    {tag}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}

            {/* Available Tags */}
            <div className="space-y-2">
              <Typography.Small className="text-muted-foreground">
                Available tags:
              </Typography.Small>
              <div className="flex flex-wrap gap-1">
                {AVAILABLE_TAGS.filter(tag => !selectedTags.includes(tag)).map(
                  tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <>
              <Separator />
              <div className="space-y-2">
                <Typography.Small className="font-medium">
                  Active Filters
                </Typography.Small>
                <div className="space-y-1">
                  {searchQuery && (
                    <Typography.Small className="text-muted-foreground">
                      • Search: "{searchQuery}"
                    </Typography.Small>
                  )}
                  {selectedStatus && selectedStatus !== 'all' && (
                    <Typography.Small className="text-muted-foreground">
                      • Status:{' '}
                      {
                        EVENT_STATUSES.find(s => s.value === selectedStatus)
                          ?.label
                      }
                    </Typography.Small>
                  )}
                  {selectedTags.length > 0 && (
                    <Typography.Small className="text-muted-foreground">
                      • Tags: {selectedTags.length} selected
                    </Typography.Small>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
