/**
 * ARIA attribute generators
 * Provides standardized ARIA attributes
 * for common UI patterns.
 */

import { ariaWidgets } from './accessibleAriaWidgets'

/** Generate ARIA attributes for patterns */
export const aria = {
  button: (label: string) => ({
    'aria-label': label,
    role: 'button' as const,
  }),
  toggle: (
    label: string,
    isActive: boolean
  ) => ({
    'aria-label': label,
    'aria-pressed': isActive,
    role: 'switch' as const,
  }),
  menu: () => ({ role: 'menu' as const }),
  menuItem: (label: string) => ({
    'aria-label': label,
    role: 'menuitem' as const,
  }),
  list: (label?: string) => ({
    ...(label && { 'aria-label': label }),
    role: 'list' as const,
  }),
  listItem: () => ({
    role: 'listitem' as const,
  }),
  label: (htmlFor: string) => ({ htmlFor }),
  input: (
    ariaLabel: string,
    ariaDescribedBy?: string
  ) => ({
    'aria-label': ariaLabel,
    ...(ariaDescribedBy && {
      'aria-describedby': ariaDescribedBy,
    }),
  }),
  checkbox: (
    label: string,
    isChecked: boolean
  ) => ({
    'aria-label': label,
    'aria-checked': isChecked,
    role: 'checkbox' as const,
  }),
  radio: (
    label: string,
    isSelected: boolean
  ) => ({
    'aria-label': label,
    'aria-checked': isSelected,
    role: 'radio' as const,
  }),
  combobox: (
    isExpanded: boolean,
    hasPopup = true
  ) => ({
    'aria-expanded': isExpanded,
    'aria-haspopup': hasPopup,
    role: 'combobox' as const,
  }),
  dialog: (label: string) => ({
    'aria-label': label,
    'aria-modal': true,
    role: 'dialog' as const,
  }),
  ...ariaWidgets,
}
