'use client'

/**
 * Empty State Components
 *
 * Displayed when lists, tables, or other
 * collections are empty. Provides helpful
 * context and suggests actionable next steps.
 */

export type { EmptyStateProps } from './types'
export { SIZE_MAP } from './types'

export { EmptyState } from './EmptyState'

export {
  NoDataFound,
  NoResultsFound,
  NoItemsYet,
  AccessDeniedState,
} from './variants'

export {
  ErrorState,
  NoConnectionState,
  LoadingCompleteState,
} from './variantsExtra'

export { emptyStateStyles } from './styles'
