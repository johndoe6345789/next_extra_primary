/**
 * Favicon element update and design update
 */

import type {
  FaviconDesign, FaviconElement,
} from './_types/favicon/types'

type SetDesigns = (
  fn: (c: FaviconDesign[]) => FaviconDesign[]
) => void

/** Map a design array, updating one by ID */
function mapDesign(
  cur: FaviconDesign[],
  id: string,
  upd: Partial<FaviconDesign>
) {
  return (cur || []).map((d) =>
    d.id === id
      ? { ...d, ...upd, updatedAt: Date.now() }
      : d
  )
}

/** Create update/delete/design handlers */
export function createDesignUpdaters(
  activeDesignId: string,
  selectedElementId: string | null,
  setDesigns: SetDesigns,
  setSelectedElementId: (
    id: string | null
  ) => void
) {
  const handleUpdateElement = (
    updates: Partial<FaviconElement>
  ) => {
    if (!selectedElementId) return
    setDesigns((cur) =>
      mapDesign(cur, activeDesignId, {
        elements: (
          cur.find((d) => d.id === activeDesignId)
            ?.elements ?? []
        ).map((e) =>
          e.id === selectedElementId
            ? { ...e, ...updates } : e
        ),
      })
    )
  }

  const handleDeleteElement = (
    elementId: string
  ) => {
    setDesigns((cur) =>
      mapDesign(cur, activeDesignId, {
        elements: (
          cur.find((d) => d.id === activeDesignId)
            ?.elements ?? []
        ).filter((e) => e.id !== elementId),
      })
    )
    setSelectedElementId(null)
  }

  const handleUpdateDesign = (
    updates: Partial<FaviconDesign>
  ) => setDesigns((cur) =>
    mapDesign(cur, activeDesignId, updates)
  )

  return {
    handleUpdateElement,
    handleDeleteElement,
    handleUpdateDesign,
  }
}
