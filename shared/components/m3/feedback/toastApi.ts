/**
 * Imperative toast API for creating toasts
 * outside React components.
 */

import type { ToastSeverity, ToastEntry }
  from './toastTypes'

let _toasts: ToastEntry[] = []
let _idCounter = 0
let _listeners: Array<() => void> = []
const _timers = new Map<
  string, ReturnType<typeof setTimeout>
>()

function notify(): void {
  _listeners.forEach((l) => l())
}

/** Remove a toast by ID */
export function remove(id: string): void {
  clearTimeout(_timers.get(id))
  _timers.delete(id)
  _toasts = _toasts.filter(
    (t) => t.id !== id)
  notify()
}

function add(
  message: string,
  severity: ToastSeverity,
  duration = 4000,
): string {
  const id = `toast-${++_idCounter}`
  _toasts = [
    ..._toasts,
    { id, message, severity, duration },
  ]
  notify()
  if (duration > 0) {
    _timers.set(id, setTimeout(
      () => remove(id), duration))
  }
  return id
}

/** Subscribe to toast state changes */
export function subscribe(
  cb: () => void
): () => void {
  _listeners = [..._listeners, cb]
  return () => {
    _listeners =
      _listeners.filter((l) => l !== cb)
  }
}

/** Get current snapshot of toasts */
export function getSnapshot(): ToastEntry[] {
  return _toasts
}

/** Imperative toast API */
function toast(msg: string): string {
  return add(msg, 'info')
}
toast.success = (msg: string): string =>
  add(msg, 'success')
toast.error = (msg: string): string =>
  add(msg, 'error')
toast.warning = (msg: string): string =>
  add(msg, 'warning')
toast.info = (msg: string): string =>
  add(msg, 'info')
toast.dismiss = (id?: string): void => {
  if (id) { remove(id); return }
  _toasts.forEach((t) => {
    clearTimeout(_timers.get(t.id))
    _timers.delete(t.id)
  })
  _toasts = []
  notify()
}

export { toast }
