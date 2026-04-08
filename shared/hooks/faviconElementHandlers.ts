/**
 * Element CRUD handlers for favicon designer
 */

import copy from '@/data/favicon-designer.json'
import type {
  FaviconDesign,
  FaviconElement,
} from './_types/favicon/types'
import {
  createDesignUpdaters,
} from './faviconDesignUpdaters'

/** Create add/update/delete element handlers */
export function createElementHandlers(
  activeDesignId: string,
  activeDesign: FaviconDesign,
  selectedElementId: string | null,
  setDesigns: (
    fn: (
      current: FaviconDesign[]
    ) => FaviconDesign[]
  ) => void,
  setSelectedElementId: (
    id: string | null
  ) => void
) {
  const handleAddElement = (
    type: FaviconElement['type']
  ) => {
    const el: FaviconElement = {
      id: `element-${Date.now()}`, type,
      x: activeDesign.size / 2,
      y: activeDesign.size / 2,
      width: type === 'text' ||
        type === 'emoji' ? 100 : 40,
      height: type === 'text' ||
        type === 'emoji' ? 100 : 40,
      color: '#ffffff', rotation: 0,
      ...(type === 'text' && {
        text: copy.defaults.newText,
        fontSize: 32, fontWeight: 'bold',
      }),
      ...(type === 'emoji' && {
        emoji: copy.defaults.newEmoji,
        fontSize: 40,
      }),
    }
    setDesigns((cur) =>
      (cur || []).map((d) =>
        d.id === activeDesignId
          ? {
              ...d,
              elements: [...d.elements, el],
              updatedAt: Date.now(),
            }
          : d
      )
    )
    setSelectedElementId(el.id)
  }

  const updaters = createDesignUpdaters(
    activeDesignId,
    selectedElementId,
    setDesigns,
    setSelectedElementId
  )

  return {
    handleAddElement,
    ...updaters,
  }
}
