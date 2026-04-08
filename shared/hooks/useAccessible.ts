/**
 * useAccessible Hooks
 * Re-exports all accessibility utilities, types, and hooks.
 *
 * @example
 * const { testId, ariaLabel } = useAccessible({
 *   feature: 'form',
 *   component: 'button',
 *   action: 'submit'
 * })
 */

export type {
  AccessibilityFeature,
  AccessibilityComponent,
  AccessibilityAction,
  UseAccessibleOptions,
  AccessibleAttributes,
} from './accessibleTypes'

export {
  generateTestId,
  keyboard,
  validate,
} from './accessibleUtils'

import { testId as baseTestId } from './accessibleTestIds'
import { testIdExt } from './accessibleTestIdsExt'

/** Combined test ID generators */
export const testId = { ...baseTestId, ...testIdExt }

export { aria } from './accessibleAria'
export { ariaExt as ariaExtended } from './accessibleAriaExt'
import { aria } from './accessibleAria'
import { ariaExt } from './accessibleAriaExt'

/** Combined aria helpers (for backward compat) */
const combinedAria = { ...aria, ...ariaExt }

export {
  useAccessible,
  useKeyboardNavigation,
  useFocusManagement,
} from './accessibleHooks'

export {
  useLiveRegion,
  useFocusTrap,
} from './accessibleLiveRegion'

import {
  useAccessible,
  useKeyboardNavigation,
  useFocusManagement,
} from './accessibleHooks'
import { useLiveRegion, useFocusTrap } from './accessibleLiveRegion'
import { generateTestId } from './accessibleUtils'

export default {
  generateTestId,
  testId: { ...baseTestId, ...testIdExt },
  aria: combinedAria,
  keyboard: undefined,
  validate: undefined,
  useAccessible,
  useKeyboardNavigation,
  useFocusManagement,
  useLiveRegion,
  useFocusTrap,
}
