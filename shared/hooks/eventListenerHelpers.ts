/**
 * Event listener helper utilities
 */

import type {
  EventListenerOptions,
  EventHandler,
  ListenerEntry,
} from './eventListenerTypes'

/** Normalize listener options with defaults */
export const normalizeOpts = (
  opts: EventListenerOptions = {}
): EventListenerOptions => ({
  passive: opts.passive ?? false,
  capture: opts.capture ?? false,
  once: opts.once ?? false,
  ...opts,
})

/**
 * Check if a listener entry matches
 * @param entry - Existing listener entry
 * @param target - Target element
 * @param event - Event name
 * @param handler - Event handler function
 * @param capture - Whether capture mode
 */
export function matchesEntry(
  entry: ListenerEntry,
  target: EventTarget,
  event: string,
  handler: EventHandler,
  capture: boolean | undefined
): boolean {
  return (
    entry.target === target &&
    entry.event === event &&
    entry.handler === handler &&
    entry.options.capture === capture
  )
}

/**
 * Remove matching entries from a list
 * @param list - Current listener list
 * @param target - Target element
 * @param event - Event name
 * @param handler - Event handler function
 * @param capture - Whether capture mode
 */
export function filterListeners(
  list: ListenerEntry[],
  target: EventTarget,
  event: string,
  handler: EventHandler,
  capture: boolean | undefined
): ListenerEntry[] {
  return list.filter(
    (l) =>
      !matchesEntry(
        l,
        target,
        event,
        handler,
        capture
      )
  )
}
