/**
 * Array mutation helpers for useArray hook
 */

import { useCallback } from 'react'

/** Create insert/remove/swap array callbacks */
export function useArrayMutations<T>(
  setItems: React.Dispatch<
    React.SetStateAction<T[]>
  >
) {
  /** Insert item at given index */
  const insert = useCallback(
    (index: number, item: T) => {
      setItems((p) => {
        const c = [...p]
        const i = Math.max(
          0,
          Math.min(index, c.length)
        )
        c.splice(i, 0, item)
        return c
      })
    },
    [setItems]
  )

  /** Remove item at given index */
  const remove = useCallback(
    (index: number) => {
      setItems((p) => {
        if (index < 0 || index >= p.length) {
          return p
        }
        const c = [...p]
        c.splice(index, 1)
        return c
      })
    },
    [setItems]
  )

  /** Swap items at two indices */
  const swap = useCallback(
    (a: number, b: number) => {
      setItems((p) => {
        if (
          a < 0 ||
          a >= p.length ||
          b < 0 ||
          b >= p.length
        ) {
          return p
        }
        const c = [...p]
        ;[c[a], c[b]] = [c[b], c[a]]
        return c
      })
    },
    [setItems]
  )

  /** Clear all items */
  const clear = useCallback(() => {
    setItems([])
  }, [setItems])

  /** Filter items in place */
  const filter = useCallback(
    (pred: (item: T) => boolean) => {
      setItems((p) => p.filter(pred))
    },
    [setItems]
  )

  return { insert, remove, swap, clear, filter }
}
