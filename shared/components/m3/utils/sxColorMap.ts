/** MUI color shortcut map to CSS variables. */
export const colorMap: Record<string, string> = {
  'primary.main': 'var(--mat-sys-primary)',
  'primary.light':
    'var(--mat-sys-primary-container)',
  'primary.dark': 'var(--mat-sys-primary)',
  'secondary.main':
    'var(--mat-sys-secondary)',
  'error.main': 'var(--mat-sys-error)',
  'warning.main': 'var(--mat-sys-tertiary)',
  'info.main': 'var(--mat-sys-primary)',
  'success.main': 'var(--mat-sys-tertiary)',
  'text.primary':
    'var(--mat-sys-on-surface)',
  'text.secondary':
    'var(--mat-sys-on-surface-variant)',
  'text.disabled': 'var(--mat-sys-outline)',
  'background.paper':
    'var(--mat-sys-surface)',
  'background.default':
    'var(--mat-sys-surface-container)',
  divider:
    'var(--mat-sys-outline-variant)',
}
