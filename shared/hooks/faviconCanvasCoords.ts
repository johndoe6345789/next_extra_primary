/**
 * Canvas coordinate helpers for favicon designer
 */

/** Get canvas coordinates from mouse event */
export function getCanvasCoordinates(
  e: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement | null,
  designSize: number
): { x: number; y: number } {
  if (!canvas) return { x: 0, y: 0 }
  const rect = canvas.getBoundingClientRect()
  const scaleX = designSize / rect.width
  const scaleY = designSize / rect.height
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  }
}
