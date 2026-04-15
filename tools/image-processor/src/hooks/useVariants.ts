'use client'

/**
 * useVariants — fetches the produced variants
 * for a given job id.
 */

import {
  useCallback, useEffect, useState,
} from 'react'

export interface VariantRow {
  name: string
  width: number
  height: number
  format: string
  object_key: string
  bytes: number
}

interface ListResp {
  items: VariantRow[]
}

export function useVariants(
  jobId: number | null,
) {
  const [items, setItems] = useState<VariantRow[]>(
    [],
  )

  const refresh = useCallback(async () => {
    if (jobId === null) {
      setItems([])
      return
    }
    try {
      const r = await fetch(
        `/api/images/jobs/${jobId}/variants`,
      )
      if (!r.ok) return
      const j = (await r.json()) as ListResp
      setItems(j.items ?? [])
    } catch {
      /* noop */
    }
  }, [jobId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { items, refresh }
}
