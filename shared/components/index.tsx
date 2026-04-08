/**
 * @shared/components
 *
 * Shared React components for MetaBuilder projects.
 * Organized by UI library dependency:
 *
 * - vanilla/  - Pure React (no external UI library)
 * - radix/    - Radix UI based components
 * - m3/       - M3 components (Material Design 3)
 */

// Vanilla components
export * from './vanillaExports'

// Radix components
export {
  KeyboardShortcutsContent,
  ShortcutRow,
  getPlatformModifier,
  createShortcut,
  type ShortcutItem,
  type ShortcutCategory,
  type KeyboardShortcutsDialogProps,
} from './radix/dialogs/KeyboardShortcutsDialog'

// M3 components
export * from './m3'

// Feedback components
export {
  PasswordStrengthIndicator,
  type PasswordStrengthIndicatorProps,
} from './feedback'
export {
  NotFoundState,
  type NotFoundStateProps,
} from './feedback'

// Layout components
export {
  AuthFormLayout,
  type AuthFormLayoutProps,
} from './layout'

// Navigation components
export {
  HeaderActions,
  type HeaderActionsProps,
} from './navigation'

// Combined styles
export { allStyles } from './allStyles'
