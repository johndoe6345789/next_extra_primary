/**
 * Shared alert types used by the alerts
 * hook and its polling helpers.
 */

/** Single alert entry. */
export interface AlertEntry {
  id: string
  type: 'email' | 'system'
  title: string
  detail: string
  source: string
  timestamp: number
  isRead: boolean
  link?: string
}
