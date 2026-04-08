/**
 * Export handlers for favicon designer
 */

import { toast } from '@shared/components/m3'
import copy from '@/data/favicon-designer.json'
import { formatCopy } from './_types/favicon/formatCopy'
import { PRESET_SIZES } from './_types/favicon/constants'
import type { FaviconDesign } from './_types/favicon/types'
import { generateSVG, downloadBlob } from './faviconSvg'

export { generateSVG } from './faviconSvg'

/** Export handler factory */
export function createExportHandlers(
  activeDesign: FaviconDesign,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const handleExport = (
    format: 'png' | 'ico' | 'svg',
    size?: number
  ) => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (format === 'svg') {
      const svg = generateSVG(activeDesign)
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      downloadBlob(blob, `${activeDesign.name}.svg`)
      toast.success(copy.toasts.exportedSvg)
      return
    }
    if (format === 'ico') {
      canvas.toBlob((blob) => {
        if (!blob) return
        downloadBlob(blob, `${activeDesign.name}.ico`)
        toast.success(copy.toasts.exportedIco)
      })
      return
    }
    const expSize = size || activeDesign.size
    const tmp = document.createElement('canvas')
    tmp.width = expSize
    tmp.height = expSize
    const ctx = tmp.getContext('2d')
    if (!ctx) return
    ctx.drawImage(
      canvas, 0, 0, canvas.width, canvas.height,
      0, 0, expSize, expSize
    )
    tmp.toBlob((blob) => {
      if (!blob) return
      downloadBlob(
        blob, `${activeDesign.name}-${expSize}x${expSize}.png`
      )
      toast.success(
        formatCopy(copy.toasts.exportedPng, { size: expSize })
      )
    })
  }

  const handleExportAll = () => {
    PRESET_SIZES.forEach((s) => {
      setTimeout(() => handleExport('png', s), s * 10)
    })
    toast.success(copy.toasts.exportAll)
  }

  return { handleExport, handleExportAll }
}
