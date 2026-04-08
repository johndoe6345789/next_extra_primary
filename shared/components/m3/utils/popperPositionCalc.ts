interface AnchorRect {
  top: number; left: number;
  right: number; bottom: number;
  width: number; height: number;
}

interface PopperSize {
  width: number; height: number;
}

/** Calculate top position for a placement. */
export function calcTop(
  a: AnchorRect, p: PopperSize,
  placement: string
): number {
  if (placement.startsWith('top'))
    return a.top - p.height
  if (placement.startsWith('bottom'))
    return a.bottom
  if (placement === 'left' ||
    placement === 'right')
    return a.top +
      (a.height - p.height) / 2
  if (placement.endsWith('-start'))
    return a.top
  if (placement.endsWith('-end'))
    return a.bottom - p.height
  return a.bottom
}

/** Calculate left position for a placement. */
export function calcLeft(
  a: AnchorRect, p: PopperSize,
  placement: string
): number {
  if (placement === 'top' ||
    placement === 'bottom')
    return a.left +
      (a.width - p.width) / 2
  if (placement.startsWith('left'))
    return a.left - p.width
  if (placement.startsWith('right'))
    return a.right
  if (placement === 'top-start' ||
    placement === 'bottom-start')
    return a.left
  if (placement === 'top-end' ||
    placement === 'bottom-end')
    return a.right - p.width
  return a.left
}
