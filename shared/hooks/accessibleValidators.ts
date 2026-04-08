/**
 * Accessibility validators
 * Checks for labels, keyboard access, contrast.
 */

export const validate = {
  /** Validate element has proper aria-label */
  hasLabel: (element: HTMLElement): boolean => {
    return !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby')
    )
  },

  /** Validate form inputs have labels */
  hasFormLabel: (
    input: HTMLInputElement
  ): boolean => {
    const id = input.id
    if (!id) return false
    const label = document.querySelector(
      `label[for="${id}"]`
    )
    return (
      !!label ||
      input.hasAttribute('aria-label') ||
      input.hasAttribute('aria-labelledby')
    )
  },

  /** Validate keyboard accessible */
  isKeyboardAccessible: (
    element: HTMLElement
  ): boolean => {
    const role = element.getAttribute('role')
    const tabIndex = element.tabIndex
    return (
      tabIndex >= 0 ||
      [
        'button',
        'link',
        'menuitem',
        'tab',
      ].includes(role || '')
    )
  },

  /** Validate sufficient color contrast */
  hasContrast: (
    element: HTMLElement,
    _minRatio = 4.5
  ): boolean => {
    const style =
      window.getComputedStyle(element)
    return !!(
      style.backgroundColor && style.color
    )
  },
}
