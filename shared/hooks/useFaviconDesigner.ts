import { useEffect, useRef, useState } from 'react'
import { useKV } from '@/hooks/use-kv'
import { DEFAULT_DESIGN } from './_types/favicon/constants'
import { drawCanvas } from './_types/favicon/canvasUtils'
import type { BrushEffect, FaviconDesign } from './_types/favicon/types'
import { createElementHandlers, createDesignManagers } from './faviconDesignHandlers'
import { createExportHandlers } from './faviconExport'
import {
  getCanvasCoordinates, drawBrushStroke,
  eraseBrushStroke, buildFreehandElement,
  filterErasedElements,
} from './faviconDrawing'

export const useFaviconDesigner = () => {
  const [designs, setDesigns] = useKV<FaviconDesign[]>('favicon-designs', [DEFAULT_DESIGN])
  const [activeDesignId, setActiveDesignId] = useState(DEFAULT_DESIGN.id)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawMode, setDrawMode] = useState<'select' | 'draw' | 'erase'>('select')
  const [brushSize, setBrushSize] = useState(3)
  const [brushColor, setBrushColor] = useState('#ffffff')
  const [brushEffect, setBrushEffect] = useState<BrushEffect>('solid')
  const [gradientColor, setGradientColor] = useState('#ff00ff')
  const [glowIntensity, setGlowIntensity] = useState(10)
  const [currentPath, setCurrentPath] = useState<Array<{ x: number; y: number }>>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null)

  const safeDesigns = designs || [DEFAULT_DESIGN]
  const activeDesign = safeDesigns.find((d) => d.id === activeDesignId) || DEFAULT_DESIGN
  const selectedElement = activeDesign.elements.find((e) => e.id === selectedElementId)

  useEffect(() => { if (canvasRef.current) drawCanvas(canvasRef.current, activeDesign) }, [activeDesign])
  useEffect(() => {
    const c = drawingCanvasRef.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    c.width = activeDesign.size; c.height = activeDesign.size
    ctx.clearRect(0, 0, activeDesign.size, activeDesign.size)
  }, [activeDesign, drawMode])

  const elHandlers = createElementHandlers(activeDesignId, activeDesign, selectedElementId, setDesigns, setSelectedElementId)
  const designMgrs = createDesignManagers(activeDesign, safeDesigns, activeDesignId, setDesigns, setActiveDesignId, setSelectedElementId)
  const exportHandlers = createExportHandlers(activeDesign, canvasRef)

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (drawMode === 'select') return
    setIsDrawing(true)
    setCurrentPath([getCanvasCoordinates(e, drawingCanvasRef.current, activeDesign.size)])
  }
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || drawMode === 'select') return
    const coords = getCanvasCoordinates(e, drawingCanvasRef.current, activeDesign.size)
    setCurrentPath((p) => [...p, coords])
    const ctx = drawingCanvasRef.current?.getContext('2d'); if (!ctx) return
    if (drawMode === 'draw' && currentPath.length > 0) {
      drawBrushStroke(ctx, currentPath[currentPath.length - 1], coords, brushSize, brushColor, brushEffect, gradientColor, glowIntensity, currentPath)
    } else if (drawMode === 'erase' && currentPath.length > 0) {
      eraseBrushStroke(ctx, currentPath[currentPath.length - 1], coords, brushSize)
    }
  }
  const handleCanvasMouseUp = () => {
    if (!isDrawing || drawMode === 'select') return
    setIsDrawing(false)
    if (drawMode === 'draw' && currentPath.length > 1) {
      const el = buildFreehandElement(currentPath, brushColor, brushSize, brushEffect, gradientColor, glowIntensity)
      setDesigns((cur) => (cur || []).map((d) => d.id === activeDesignId ? { ...d, elements: [...d.elements, el], updatedAt: Date.now() } : d))
    } else if (drawMode === 'erase') {
      const filtered = filterErasedElements(activeDesign.elements, currentPath, brushSize)
      if (filtered.length !== activeDesign.elements.length) {
        setDesigns((cur) => (cur || []).map((d) => d.id === activeDesignId ? { ...d, elements: filtered, updatedAt: Date.now() } : d))
      }
    }
    setCurrentPath([])
    if (canvasRef.current) drawCanvas(canvasRef.current, activeDesign)
  }
  const handleCanvasMouseLeave = () => { if (isDrawing) handleCanvasMouseUp() }

  return {
    activeDesign, activeDesignId, brushColor, brushEffect, brushSize, canvasRef, drawMode, drawingCanvasRef,
    glowIntensity, gradientColor, safeDesigns, selectedElement, selectedElementId,
    setActiveDesignId, setBrushColor, setBrushEffect, setBrushSize, setDrawMode, setGlowIntensity, setGradientColor, setSelectedElementId,
    ...elHandlers, ...designMgrs, ...exportHandlers,
    handleCanvasMouseDown, handleCanvasMouseLeave, handleCanvasMouseMove, handleCanvasMouseUp,
  }
}
