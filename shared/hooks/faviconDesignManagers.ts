/**
 * Design management handlers for favicon designer
 */

import { toast } from '@shared/components/m3'
import copy from '@/data/favicon-designer.json'
import { formatCopy } from './_types/favicon/formatCopy'
import type { FaviconDesign } from './_types/favicon/types'

/** Create design management handlers */
export function createDesignManagers(
  activeDesign: FaviconDesign,
  safeDesigns: FaviconDesign[],
  activeDesignId: string,
  setDesigns: (
    fn: FaviconDesign[] | ((cur: FaviconDesign[]) => FaviconDesign[])
  ) => void,
  setActiveDesignId: (id: string) => void,
  setSelectedElementId: (id: string | null) => void
) {
  const handleNewDesign = () => {
    const nd: FaviconDesign = {
      id: `design-${Date.now()}`,
      name: formatCopy(
        copy.design.newDesignName,
        { count: safeDesigns.length + 1 }
      ),
      size: 128, backgroundColor: '#7c3aed',
      elements: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setDesigns((cur: FaviconDesign[]) => [...(cur || []), nd])
    setActiveDesignId(nd.id)
    setSelectedElementId(null)
  }

  const handleDuplicateDesign = () => {
    const nd: FaviconDesign = {
      ...activeDesign,
      id: `design-${Date.now()}`,
      name: `${activeDesign.name}${copy.design.duplicateSuffix}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setDesigns((cur: FaviconDesign[]) => [...(cur || []), nd])
    setActiveDesignId(nd.id)
    toast.success(copy.toasts.designDuplicated)
  }

  const handleDeleteDesign = () => {
    if (safeDesigns.length === 1) {
      toast.error(copy.toasts.cannotDeleteLast)
      return
    }
    const filtered = safeDesigns.filter((d) => d.id !== activeDesignId)
    setDesigns(filtered)
    setActiveDesignId(filtered[0].id)
    setSelectedElementId(null)
    toast.success(copy.toasts.designDeleted)
  }

  return {
    handleNewDesign,
    handleDuplicateDesign,
    handleDeleteDesign,
  }
}
