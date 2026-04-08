/**
 * Freehand element and eraser filtering
 */

import type {
  BrushEffect,
  FaviconElement,
} from './_types/favicon/types'

/** Build freehand element from drawn path */
export function buildFreehandElement(
  path: Array<{ x: number; y: number }>,
  brushColor: string,
  brushSize: number,
  brushEffect: BrushEffect,
  gradientColor: string,
  glowIntensity: number
): FaviconElement {
  return {
    id: `element-${Date.now()}`,
    type: 'freehand',
    x: 0, y: 0, width: 0, height: 0,
    color: brushColor, rotation: 0,
    paths: path, strokeWidth: brushSize,
    brushEffect,
    gradientColor: brushEffect === 'gradient'
      ? gradientColor : undefined,
    glowIntensity: brushEffect === 'glow'
      ? glowIntensity : undefined,
  }
}

/** Filter out erased elements */
export function filterErasedElements(
  elements: FaviconElement[],
  erasePath: Array<{ x: number; y: number }>,
  brushSize: number
): FaviconElement[] {
  return elements.filter((el) => {
    if (el.type !== 'freehand' || !el.paths) return true
    return !el.paths.some((point) =>
      erasePath.some((ep) => {
        const dist = Math.sqrt(
          (point.x - ep.x) ** 2 +
          (point.y - ep.y) ** 2
        )
        return dist < brushSize * 2
      })
    )
  })
}
