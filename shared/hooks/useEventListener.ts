/**
 * useEventListener Hook
 * Generic event listener with proper cleanup
 */

import { useRef, useCallback } from 'react'
import type {
  EventListenerOptions,
  EventHandler,
  UseEventListenerReturn,
  ListenerEntry,
} from './eventListenerTypes'
import {
  normalizeOpts,
  filterListeners,
} from './eventListenerHelpers'
import {
  useEventListenerRemove,
} from './eventListenerRemove'

export type {
  EventListenerOptions,
  EventHandler,
  UseEventListenerReturn,
} from './eventListenerTypes'

/** Hook for managing event listeners */
export function useEventListener():
  UseEventListenerReturn {
  const listenersRef =
    useRef<ListenerEntry[]>([])

  const add = useCallback(
    <T extends Event = Event>(
      target: EventTarget | null | undefined,
      event: string,
      handler: EventHandler<T>,
      options: EventListenerOptions = {}
    ): (() => void) => {
      if (!target) return () => {}
      const opts = normalizeOpts(options)
      target.addEventListener(
        event,
        handler as EventListener, opts
      )
      const entry: ListenerEntry = {
        target, event,
        handler: handler as EventHandler,
        options: opts,
      }
      listenersRef.current.push(entry)
      return () => {
        target.removeEventListener(
          event,
          handler as EventListener, opts
        )
        listenersRef.current = filterListeners(
          listenersRef.current,
          target, event,
          handler as EventHandler,
          opts.capture
        )
      }
    },
    []
  )

  const { remove, removeAll } =
    useEventListenerRemove(listenersRef)

  return { add, remove, removeAll }
}
