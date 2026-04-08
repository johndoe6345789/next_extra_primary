import type { PopperPlacement }
  from './popperTypes'

interface AnchorRect {
  top: number; left: number;
  right: number; bottom: number;
  width: number; height: number;
}

interface PopperSize {
  width: number; height: number;
}

/**
 * Calculate absolute position for a popper
 * element relative to its anchor.
 */
export function calculatePopperPosition(
  a: AnchorRect, p: PopperSize,
  placement: PopperPlacement
): { top: number; left: number } {
  let top = 0;
  let left = 0;
  const vCenter =
    a.top + (a.height - p.height) / 2;
  const hCenter =
    a.left + (a.width - p.width) / 2;
  switch (placement) {
    case 'top':
      top = a.top - p.height; left = hCenter;
      break;
    case 'top-start':
      top = a.top - p.height; left = a.left;
      break;
    case 'top-end':
      top = a.top - p.height;
      left = a.right - p.width; break;
    case 'bottom':
      top = a.bottom; left = hCenter; break;
    case 'bottom-start':
      top = a.bottom; left = a.left; break;
    case 'bottom-end':
      top = a.bottom;
      left = a.right - p.width; break;
    case 'left':
      top = vCenter;
      left = a.left - p.width; break;
    case 'left-start':
      top = a.top;
      left = a.left - p.width; break;
    case 'left-end':
      top = a.bottom - p.height;
      left = a.left - p.width; break;
    case 'right':
      top = vCenter; left = a.right; break;
    case 'right-start':
      top = a.top; left = a.right; break;
    case 'right-end':
      top = a.bottom - p.height;
      left = a.right; break;
    default:
      top = a.bottom; left = a.left;
  }
  top += window.scrollY;
  left += window.scrollX;
  return { top, left };
}
