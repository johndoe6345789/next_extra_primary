/**
 * Extended ARIA attribute generators
 * Loading, disabled, hidden, live region, and error patterns.
 */

/** Extended ARIA attribute generators */
export const ariaExt = {
  /** Loading/Busy patterns */
  busy: () => ({
    'aria-busy': true,
    'aria-live': 'polite' as const,
  }),

  /** Disabled patterns */
  disabled: () => ({
    'aria-disabled': true,
  }),

  /** Hidden patterns */
  hidden: () => ({
    'aria-hidden': true,
  }),

  /** Live region patterns */
  liveRegion: (polite = true) => ({
    'aria-live': (polite
      ? 'polite'
      : 'assertive') as 'polite' | 'assertive',
    'aria-atomic': true,
  }),

  /** Description patterns */
  describedBy: (id: string) => ({
    'aria-describedby': id,
  }),

  /** Label by pattern */
  labelledBy: (id: string) => ({
    'aria-labelledby': id,
  }),

  /** Error patterns */
  invalid: (errorId?: string) => ({
    'aria-invalid': true,
    ...(errorId && { 'aria-describedby': errorId }),
  }),

  /** Required patterns */
  required: () => ({
    'aria-required': true,
  }),
}
