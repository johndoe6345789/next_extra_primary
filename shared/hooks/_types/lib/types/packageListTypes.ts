/**
 * Package list hook types
 */

import type {
  PackageInfo,
  PackageError,
  PackageStatus,
} from './packageCoreTypes'

/** usePackages state */
export interface PackageListState {
  packages: PackageInfo[]
  total: number
  page: number
  limit: number
  search: string
  statusFilter: PackageStatus
  isLoading: boolean
  isRefetching: boolean
  error: PackageError | null
}

/** usePackages handlers */
export interface PackageListHandlers {
  fetchPackages: (
    page?: number,
    limit?: number,
    search?: string,
    status?: PackageStatus
  ) => Promise<void>
  refetchPackages: () => Promise<void>
  searchPackages: (term: string) => void
  filterByStatus: (
    status: PackageStatus
  ) => Promise<void>
  changePage: (p: number) => Promise<void>
  changeLimit: (l: number) => Promise<void>
}

/** Return type of usePackages */
export interface UsePackagesReturn {
  state: PackageListState
  handlers: PackageListHandlers
  pagination: {
    page: number
    limit: number
    total: number
    pageCount: number
  }
}
