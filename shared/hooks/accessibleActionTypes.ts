/**
 * Action types and option interfaces
 * for accessibility hooks
 */

import type {
  AccessibilityFeature,
  AccessibilityComponent,
} from './accessibleTypes'

/** Action types for test ID generation */
export type AccessibilityAction =
  | 'drag'
  | 'resize'
  | 'click'
  | 'open'
  | 'close'
  | 'edit'
  | 'delete'
  | 'submit'
  | 'cancel'
  | 'focus'
  | 'blur'
  | 'select'
  | 'deselect'
  | 'expand'
  | 'collapse'
  | 'previous'
  | 'next'
  | 'first'
  | 'last'
  | 'toggle'
  | 'loading'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'favorite'
  | 'share'
  | 'more'

/** Options for useAccessible hook */
export interface UseAccessibleOptions {
  feature: AccessibilityFeature | string
  component: AccessibilityComponent | string
  action?: AccessibilityAction | string
  identifier?: string
  ariaLabel?: string
  ariaDescribedBy?: string
}

/** Return type for useAccessible hook */
export interface AccessibleAttributes {
  'data-testid': string
  'aria-label'?: string
  'aria-describedby'?: string
  role?: string
}
