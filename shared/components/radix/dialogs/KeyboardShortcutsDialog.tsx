/**
 * Keyboard Shortcuts Dialog
 *
 * Generic dialog for displaying keyboard shortcuts.
 * Accepts shortcuts as props.
 */

export type {
  ShortcutItem,
  ShortcutCategory,
  KeyboardShortcutsDialogProps,
} from './shortcutTypes'

export { ShortcutRow } from './ShortcutRow'
export {
  KeyboardShortcutsContent,
} from './KeyboardShortcutsContent'
export {
  getPlatformModifier,
  createShortcut,
} from './shortcutHelpers'

export { default } from './KeyboardShortcutsContent'
