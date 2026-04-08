/**
 * ToggleButtonGroup change handler logic
 */

/** Compute new value after toggle click */
export function computeToggleValue(
  currentValue: string | string[] | null,
  buttonValue: string,
  exclusive: boolean
): string | string[] | null {
  if (exclusive) {
    return currentValue === buttonValue
      ? null
      : buttonValue
  }
  const arr = Array.isArray(currentValue)
    ? currentValue
    : []
  return arr.includes(buttonValue)
    ? arr.filter((v) => v !== buttonValue)
    : [...arr, buttonValue]
}

/** Build CSS class string for group */
export function buildGroupClasses(
  orientation: string,
  fullWidth: boolean,
  color: string,
  className: string
): string {
  return [
    'toggle-btn-group',
    orientation === 'vertical'
      ? 'toggle-btn-group--vertical'
      : '',
    fullWidth
      ? 'toggle-btn-group--full-width'
      : '',
    `toggle-btn-group--${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')
}
