/**
 * Type definitions for useConfirmDialog
 */

/** Options for confirm dialog */
export interface ConfirmDialogOptions {
  /** Dialog title */
  title: string
  /** Dialog description/message */
  description: string
  /** Confirm button text (default: 'Confirm') */
  confirmText?: string
  /** Cancel button text (default: 'Cancel') */
  cancelText?: string
  /** Button variant style */
  variant?: 'default' | 'destructive'
}

/** Internal dialog state */
export interface ConfirmDialogState {
  isOpen: boolean
  options: ConfirmDialogOptions | null
  resolve: ((value: boolean) => void) | null
}

/** Return type of useConfirmDialog */
export interface UseConfirmDialogReturn {
  /** Whether dialog is open */
  isOpen: boolean
  /** Current dialog options */
  options: ConfirmDialogOptions | null
  /** Show dialog; resolves to boolean */
  confirm: (
    options: ConfirmDialogOptions
  ) => Promise<boolean>
  /** Handle confirm click */
  handleConfirm: () => void
  /** Handle cancel click */
  handleCancel: () => void
}
