/**
 * Type definitions for useEventListener hook
 */

/** Options for event listeners */
export interface EventListenerOptions
  extends AddEventListenerOptions {
  /** Enable passive listener (scroll perf) */
  passive?: boolean
  /** Use capture phase instead of bubble */
  capture?: boolean
  /** Auto-remove after first trigger */
  once?: boolean
}

/** Generic event handler type */
export type EventHandler<
  T extends Event = Event
> = (event: T) => void

/** Return type of useEventListener */
export interface UseEventListenerReturn {
  /**
   * Add an event listener
   * @param target - Element, window, or document
   * @param event - Event name
   * @param handler - Event handler function
   * @param options - Listener options
   * @returns Function to remove this listener
   */
  add: <T extends Event = Event>(
    target: EventTarget | null | undefined,
    event: string,
    handler: EventHandler<T>,
    options?: EventListenerOptions
  ) => () => void

  /**
   * Remove a specific event listener
   * @param target - Element to remove from
   * @param event - Event name
   * @param handler - Event handler
   * @param options - Must match add call
   */
  remove: (
    target: EventTarget | null | undefined,
    event: string,
    handler: EventHandler,
    options?: EventListenerOptions
  ) => void

  /** Remove all registered listeners */
  removeAll: () => void
}

/** Internal listener tracking entry */
export interface ListenerEntry {
  target: EventTarget
  event: string
  handler: EventHandler
  options: EventListenerOptions
}
