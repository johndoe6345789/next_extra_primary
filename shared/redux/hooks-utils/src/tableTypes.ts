/**
 * Table state types and interfaces
 */

/** Filter comparison operator */
export type FilterOperator =
  | 'eq' | 'contains' | 'gt' | 'lt'
  | 'gte' | 'lte' | 'in' | 'nin'
  | 'startsWith' | 'endsWith';

/** Single filter definition */
export interface Filter<T> {
  field: keyof T;
  operator: FilterOperator;
  value: unknown;
  caseSensitive?: boolean;
}

/** Sort configuration */
export interface SortConfig<T> {
  field: keyof T;
  direction: 'asc' | 'desc';
}

/** Hook options */
export interface UseTableStateOptions<T> {
  /** Fields to search in */
  searchFields?: (keyof T)[];
  /** Items per page (default: 10) */
  pageSize?: number;
  /** Initial sort */
  defaultSort?: SortConfig<T>;
  /** Initial filters */
  defaultFilters?: Filter<T>[];
  /** Initial search query */
  defaultSearch?: string;
}

/** Hook return value */
export interface UseTableStateReturn<T> {
  items: T[];
  filteredItems: T[];
  paginatedItems: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  sortConfig: SortConfig<T> | null;
  sort: (
    field: keyof T,
    direction?: 'asc' | 'desc'
  ) => void;
  clearSort: () => void;
  filters: Filter<T>[];
  addFilter: (filter: Filter<T>) => void;
  removeFilter: (index: number) => void;
  updateFilter: (
    index: number, filter: Filter<T>
  ) => void;
  clearFilters: () => void;
  search: string;
  setSearch: (query: string) => void;
  clearSearch: () => void;
  reset: () => void;
  hasActiveFilters: boolean;
  hasSearch: boolean;
}
