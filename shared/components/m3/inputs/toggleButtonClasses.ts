import s
  from '../../../scss/components/ToggleButton.module.scss'

/**
 * Build toggle button CSS class string.
 * @param selected - Whether button is active.
 * @param size - Button size variant.
 * @param fullWidth - Full width flag.
 * @param className - Extra class name.
 * @returns Joined class string.
 */
export function buildToggleClasses(
  selected: boolean | undefined,
  size: string,
  fullWidth: boolean | undefined,
  className: string,
): string {
  return [
    s['toggle-btn'],
    selected
      ? s['toggle-btn--selected'] : '',
    s[`toggle-btn--${size}`],
    fullWidth
      ? s['toggle-btn--full-width'] : '',
    className,
  ].filter(Boolean).join(' ')
}
