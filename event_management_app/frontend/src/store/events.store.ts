import { create } from 'zustand';

// Type for event from API response


export interface EventsState {
  // Filter state
  searchQuery: string;
  selectedStatus: string | null;
  selectedTags: string[];

  // Pagination state
  currentPage: number;
  pageSize: number;

  // Sorting state
  sortField: string;
  sortOrder: 'asc' | 'desc';

  // Selection state
  selectedEventIds: string[];

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedStatus: (status: string | null) => void;
  setSelectedTags: (tags: string[]) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSorting: (field: string, order: 'asc' | 'desc') => void;
  selectEvent: (eventId: string) => void;
  selectAllEvents: (eventIds: string[]) => void;
  clearSelection: () => void;
  resetFilters: () => void;
}



export const useEventsStore = create<EventsState>((set, get) => ({
  // Initial state
  searchQuery: '',
  selectedStatus: null,
  selectedTags: [],
  currentPage: 1,
  pageSize: 20,
  sortField: 'name',
  sortOrder: 'asc',
  selectedEventIds: [],

  // Filter actions
  setSearchQuery: (query: string) =>
    set({ searchQuery: query, currentPage: 1 }),

  setSelectedStatus: (status: string | null) =>
    set({ selectedStatus: status, currentPage: 1 }),

  setSelectedTags: (tags: string[]) =>
    set({ selectedTags: tags, currentPage: 1 }),

  // Pagination actions
  setCurrentPage: (page: number) => set({ currentPage: page }),

  setPageSize: (size: number) => set({ pageSize: size, currentPage: 1 }),

  // Sorting actions
  setSorting: (field: string, order: 'asc' | 'desc') =>
    set({ sortField: field, sortOrder: order, currentPage: 1 }),

  // Selection actions
  selectEvent: (eventId: string) => {
    const { selectedEventIds } = get();
    const isSelected = selectedEventIds.includes(eventId);

    if (isSelected) {
      set({
        selectedEventIds: selectedEventIds.filter(id => id !== eventId),
      });
    } else {
      set({
        selectedEventIds: [...selectedEventIds, eventId],
      });
    }
  },

  selectAllEvents: (eventIds: string[]) => set({ selectedEventIds: eventIds }),

  clearSelection: () => set({ selectedEventIds: [] }),

  // Reset filters
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedStatus: null,
      selectedTags: [],
      currentPage: 1,
      sortField: 'name',
      sortOrder: 'asc',
    }),
}));

// Selector hooks for computed values
export const useHasFilters = () => {
  return useEventsStore(state => !!(
    state.searchQuery ||
    state.selectedStatus ||
    state.selectedTags.length > 0
  ));
};

export const useSelectedCount = () => {
  return useEventsStore(state => state.selectedEventIds.length);
};
