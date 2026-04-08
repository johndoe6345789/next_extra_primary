/**
 * Brush drawing/erasing for favicon canvas
 */

import type { BrushEffect } from './_types/favicon/types'

/** Draw brush stroke on canvas context */
export function drawBrushStroke(
  ctx: CanvasRenderingContext2D,
  prev: { x: number; y: number },
  coords: { x: number; y: number },
  brushSize: number,
  brushColor: string,
  brushEffect: BrushEffect,
  gradientColor: string,
  glowIntensity: number,
  path: Array<{ x: number; y: number }>
) {
  if (brushEffect === 'glow') {
    ctx.shadowColor = brushColor
    ctx.shadowBlur = glowIntensity
  }
  if (brushEffect === 'gradient' && path.length > 0) {
    const g = ctx.createLinearGradient(
      path[0].x, path[0].y, coords.x, coords.y
    )
    g.addColorStop(0, brushColor)
    g.addColorStop(1, gradientColor)
    ctx.strokeStyle = g
  } else {
    ctx.strokeStyle = brushColor
  }
  ctx.lineWidth = brushSize
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  if (brushEffect === 'spray') {
    for (let i = 0; i < 5; i++) {
      const ox = (Math.random() - 0.5) * brushSize * 2
      const oy = (Math.random() - 0.5) * brushSize * 2
      ctx.fillStyle = brushColor
      ctx.beginPath()
      ctx.arc(
        coords.x + ox, coords.y + oy,
        brushSize / 3, 0, Math.PI * 2
      )
      ctx.fill()
    }
  } else {
    ctx.beginPath()
    ctx.moveTo(prev.x, prev.y)
    ctx.lineTo(coords.x, coords.y)
    ctx.stroke()
  }
  ctx.shadowBlur = 0
}

/** Erase brush stroke on canvas context */
export function eraseBrushStroke(
  ctx: CanvasRenderingContext2D,
  prev: { x: number; y: number },
  coords: { x: number; y: number },
  brushSize: number
) {
  ctx.globalCompositeOperation = 'destination-out'
  ctx.lineWidth = brushSize * 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(prev.x, prev.y)
  ctx.lineTo(coords.x, coords.y)
  ctx.stroke()
  ctx.globalCompositeOperation = 'source-over'
}
