'use client'

/**
 * Access Denied Component
 *
 * Displayed when a user attempts to access a resource
 * they do not have permission for.
 */

export type { AccessDeniedProps } from './types'
export { AccessDenied } from './AccessDenied'

/** CSS styles for AccessDenied hover effects. */
export const accessDeniedStyles = `
.access-denied a:hover {
  background-color: #1565c0;
}
`
