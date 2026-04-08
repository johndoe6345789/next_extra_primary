import type React from 'react'

/** A single keyboard shortcut. */
export interface ShortcutItem {
  /** Key combination (e.g., ['Ctrl', 'S']) */
  keys: string[]
  /** Description of the shortcut action */
  description: string
}

/** A group of shortcuts by category. */
export interface ShortcutCategory {
  /** Category name (e.g., 'Navigation') */
  category: string
  /** Shortcuts in this category */
  items: ShortcutItem[]
}

/** Props for the KeyboardShortcutsDialog. */
export interface KeyboardShortcutsDialogProps {
  /** Whether dialog is open */
  open: boolean
  /** Called when open state changes */
  onOpenChange: (open: boolean) => void
  /** Grouped shortcuts to display */
  shortcuts: ShortcutCategory[]
  /** Dialog title */
  title?: string
  /** Dialog description */
  description?: string
  /** Icon component to show in header */
  icon?: React.ReactNode
  /** Custom className for dialog content */
  className?: string
}
