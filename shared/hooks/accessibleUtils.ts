/**
 * Core accessibility utility functions
 * Provides test ID generation and keyboard
 * helpers.
 */

import type {
  AccessibilityFeature,
  AccessibilityComponent,
} from './accessibleTypes'
import type {
  AccessibilityAction,
} from './accessibleActionTypes'

export { validate } from './accessibleValidators'

/**
 * Generate standardized data-testid
 * Format: {feature}-{component}-{action}
 */
export function generateTestId(
  feature: AccessibilityFeature | string,
  component: AccessibilityComponent | string,
  action?: AccessibilityAction | string,
  identifier?: string
): string {
  const parts = [feature, component]
  if (action) parts.push(action)
  if (identifier) parts.push(identifier)
  return parts.join('-')
}

/**
 * Keyboard event handler patterns
 */
export const keyboard = {
  /** Check if key is activation key */
  isActivation: (key: string): boolean =>
    key === 'Enter' || key === ' ',

  /** Check if key is arrow key */
  isArrow: (key: string): boolean =>
    [
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
    ].includes(key),

  /** Check if key is Escape */
  isEscape: (key: string): boolean =>
    key === 'Escape',

  /** Check if key is Tab */
  isTab: (key: string): boolean =>
    key === 'Tab',

  /** Get arrow direction */
  getArrowDirection: (
    key: string,
    horizontal = true
  ): 0 | 1 | -1 => {
    if (horizontal) {
      if (key === 'ArrowRight') return 1
      if (key === 'ArrowLeft') return -1
    } else {
      if (key === 'ArrowDown') return 1
      if (key === 'ArrowUp') return -1
    }
    return 0
  },
}
