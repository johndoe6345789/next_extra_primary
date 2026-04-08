/**
 * Package action and detail hook types
 */

import type {
  PackageInfo,
  PackageError,
} from './packageCoreTypes'

/** usePackageActions state */
export interface PackageActionsState {
  isLoading: boolean
  operationInProgress: Set<string>
  error: PackageError | null
}

/** usePackageActions handlers */
export interface PackageActionHandlers {
  installPackage: (
    id: string
  ) => Promise<PackageInfo>
  uninstallPackage: (
    id: string
  ) => Promise<void>
  enablePackage: (
    id: string
  ) => Promise<PackageInfo>
  disablePackage: (
    id: string
  ) => Promise<PackageInfo>
}

/** Return type of usePackageActions */
export interface UsePackageActionsReturn {
  state: PackageActionsState
  handlers: PackageActionHandlers
  isOperationInProgress: (
    id: string
  ) => boolean
}

/** usePackageDetails state */
export interface PackageDetailsState {
  selectedPackage: PackageInfo | null
  isOpen: boolean
  isLoading: boolean
  error: PackageError | null
}

/** usePackageDetails handlers */
export interface PackageDetailsHandlers {
  openDetails: (
    id: string
  ) => Promise<void>
  closeDetails: () => void
  refreshDetails: () => Promise<void>
}

/** Return type of usePackageDetails */
export interface UsePackageDetailsReturn {
  state: PackageDetailsState
  handlers: PackageDetailsHandlers
}
