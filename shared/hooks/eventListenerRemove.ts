/**
 * Event listener remove operations
 */

import { useCallback, useEffect } from 'react'
import type {
  EventListenerOptions,
  EventHandler,
  ListenerEntry,
} from './eventListenerTypes'
import {
  normalizeOpts,
  filterListeners,
} from './eventListenerHelpers'

/** Create remove and removeAll callbacks */
export function useEventListenerRemove(
  listenersRef: React.RefObject<
    ListenerEntry[]
  >
) {
  const remove = useCallback(
    (
      target: EventTarget | null | undefined,
      event: string,
      handler: EventHandler,
      options: EventListenerOptions = {}
    ) => {
      if (!target) return
      const opts = normalizeOpts(options)
      target.removeEventListener(
        event,
        handler as EventListener,
        opts
      )
      listenersRef.current = filterListeners(
        listenersRef.current,
        target, event, handler, opts.capture
      )
    },
    [listenersRef]
  )

  const removeAll = useCallback(() => {
    listenersRef.current.forEach((entry) => {
      entry.target.removeEventListener(
        entry.event,
        entry.handler as EventListener,
        { capture: entry.options.capture }
      )
    })
    listenersRef.current = []
  }, [listenersRef])

  useEffect(
    () => () => removeAll(),
    [removeAll]
  )

  return { remove, removeAll }
}
