/** Toast severity levels */
export type ToastSeverity =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'

/** A single toast entry */
export interface ToastEntry {
  id: string
  message: string
  severity: ToastSeverity
  duration: number
}
