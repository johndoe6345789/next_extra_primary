'use client'

/**
 * useSpecs — loads the default variant spec list
 * from the backend config endpoint and lets the
 * operator tool save edits back.
 */

import {
  useCallback, useEffect, useState,
} from 'react'

const API = '/api/images/specs'

export interface SpecRow {
  name: string
  maxWidth: number
  maxHeight: number
  format: string
  quality: number
}

interface SpecResp {
  variants: SpecRow[]
}

export function useSpecs() {
  const [specs, setSpecs] = useState<SpecRow[]>([])

  const refresh = useCallback(async () => {
    try {
      const r = await fetch(API)
      if (!r.ok) return
      const j = (await r.json()) as SpecResp
      setSpecs(j.variants ?? [])
    } catch {
      /* noop */
    }
  }, [])

  const save = useCallback(
    async (next: SpecRow[]) => {
      await fetch(API, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ variants: next }),
      })
      setSpecs(next)
    },
    [],
  )

  useEffect(() => {
    refresh()
  }, [refresh])

  return { specs, save, refresh }
}
