/**
 * Accessibility type definitions
 * Used by useAccessible hooks and utilities.
 */

export type {
  AccessibilityAction,
  UseAccessibleOptions,
  AccessibleAttributes,
} from './accessibleActionTypes'

/** Feature areas for test ID generation */
export type AccessibilityFeature =
  | 'canvas'
  | 'settings'
  | 'navigation'
  | 'editor'
  | 'workflow'
  | 'project'
  | 'workspace'
  | 'auth'
  | 'modal'
  | 'toolbar'
  | 'header'
  | 'sidebar'
  | 'form'
  | 'dialog'
  | 'table'
  | 'menu'
  | 'card'
  | 'button'
  | 'input'
  | 'select'

/** Component types for test ID generation */
export type AccessibilityComponent =
  | 'item'
  | 'button'
  | 'input'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'label'
  | 'grid'
  | 'list'
  | 'panel'
  | 'container'
  | 'header'
  | 'footer'
  | 'menu'
  | 'tab'
  | 'icon'
  | 'progress'
  | 'tooltip'
  | 'modal'
  | 'card'
  | 'section'
  | 'link'
  | 'image'
  | 'text'
  | 'badge'
  | 'chip'
  | 'divider'
  | 'stepper'
  | 'slider'
  | 'switch'
