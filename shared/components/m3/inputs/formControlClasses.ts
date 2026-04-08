/**
 * Build form-control CSS class string.
 * @param variant - Form variant.
 * @param size - Size variant.
 * @param margin - Margin variant.
 * @param fullWidth - Full width flag.
 * @param required - Required flag.
 * @param disabled - Disabled flag.
 * @param error - Error flag.
 * @param focused - Focused flag.
 * @param className - Extra class name.
 * @returns Joined class string.
 */
export function buildFormControlClass(
  variant: string,
  size: string,
  margin: string,
  fullWidth: boolean,
  required: boolean,
  disabled: boolean,
  error: boolean,
  focused: boolean,
  className: string,
): string {
  return [
    'form-control',
    `form-control--${variant}`,
    `form-control--${size}`,
    `form-control--margin-${margin}`,
    fullWidth ? 'form-control--full-width' : '',
    required ? 'form-control--required' : '',
    disabled ? 'form-control--disabled' : '',
    error ? 'form-control--error' : '',
    focused ? 'form-control--focused' : '',
    className,
  ].filter(Boolean).join(' ')
}
