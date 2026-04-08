/**
 * ARIA attribute generators for widgets
 * (tabs, status, progress, slider, etc.)
 */

/** ARIA generators for widget patterns */
export const ariaWidgets = {
  tablist: () => ({ role: 'tablist' as const }),
  tab: (
    isSelected: boolean,
    controls?: string
  ) => ({
    role: 'tab' as const,
    'aria-selected': isSelected,
    ...(controls && {
      'aria-controls': controls,
    }),
  }),
  tabpanel: (
    label: string,
    isVisible: boolean
  ) => ({
    role: 'tabpanel' as const,
    'aria-label': label,
    ...(isVisible === false && { hidden: true }),
  }),
  status: (
    message: string,
    level:
      | 'info'
      | 'warning'
      | 'error'
      | 'success' = 'info'
  ) => ({
    role: 'status' as const,
    'aria-label': `${level}: ${message}`,
    'aria-live': (level === 'error'
      ? 'assertive'
      : 'polite') as 'assertive' | 'polite',
  }),
  alert: (message: string) => ({
    role: 'alert' as const,
    'aria-label': message,
    'aria-live': 'assertive' as const,
  }),
  collapsible: (
    isExpanded: boolean,
    controls?: string
  ) => ({
    'aria-expanded': isExpanded,
    ...(controls && {
      'aria-controls': controls,
    }),
  }),
  progressbar: (
    value: number,
    max = 100,
    label?: string
  ) => ({
    role: 'progressbar' as const,
    'aria-valuenow': value,
    'aria-valuemin': 0,
    'aria-valuemax': max,
    ...(label && { 'aria-label': label }),
  }),
  slider: (
    value: number,
    min: number,
    max: number,
    label?: string
  ) => ({
    role: 'slider' as const,
    'aria-valuenow': value,
    'aria-valuemin': min,
    'aria-valuemax': max,
    ...(label && { 'aria-label': label }),
  }),
}
