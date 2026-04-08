/**
 * Accessibility React hooks
 * Provides useAccessible, useKeyboardNavigation,
 * and useFocusManagement.
 */

import { generateTestId } from './accessibleUtils'
import type {
  UseAccessibleOptions,
  AccessibleAttributes,
} from './accessibleTypes'

export {
  useKeyboardNavigation,
  useFocusManagement,
} from './accessibleKeyboardNav'

/**
 * Hook for generating consistent
 * accessibility attributes
 *
 * @example
 * const attrs = useAccessible({
 *   feature: 'form',
 *   component: 'button',
 *   action: 'submit'
 * })
 * <button {...attrs}>Submit</button>
 */
export function useAccessible(
  options: UseAccessibleOptions
): AccessibleAttributes {
  const {
    feature,
    component,
    action,
    identifier,
    ariaLabel,
    ariaDescribedBy,
  } = options

  const testIdValue = generateTestId(
    feature,
    component,
    action,
    identifier
  )

  const attributes: AccessibleAttributes = {
    'data-testid': testIdValue,
  }

  if (ariaLabel) {
    attributes['aria-label'] = ariaLabel
  }
  if (ariaDescribedBy) {
    attributes['aria-describedby'] =
      ariaDescribedBy
  }

  return attributes
}
