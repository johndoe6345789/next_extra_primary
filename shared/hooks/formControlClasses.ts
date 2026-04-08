/**
 * FormControl CSS class builder
 */

/** Build class string for FormControl */
export function buildFormControlClasses(opts: {
  variant: string
  size: string
  margin: string
  fullWidth: boolean
  required: boolean
  disabled: boolean
  error: boolean
  focused: boolean
  className: string
}): string {
  return [
    'form-control',
    `form-control--${opts.variant}`,
    `form-control--${opts.size}`,
    `form-control--margin-${opts.margin}`,
    opts.fullWidth
      ? 'form-control--full-width'
      : '',
    opts.required
      ? 'form-control--required'
      : '',
    opts.disabled
      ? 'form-control--disabled'
      : '',
    opts.error
      ? 'form-control--error'
      : '',
    opts.focused
      ? 'form-control--focused'
      : '',
    opts.className,
  ]
    .filter(Boolean)
    .join(' ')
}
