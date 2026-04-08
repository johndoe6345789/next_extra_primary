/**
 * Resize logic for useDragResize
 */

import {
  useState,
  useCallback,
  useEffect,
} from 'react';
import { calculateResize } from './dragResizeHandlers';
import type { DragResizeItem }
  from './dragResizeTypes';

/** Resize handler + effect */
export function useResizeMovement(
  item: DragResizeItem,
  zoom: number,
  dragStart: { x: number; y: number },
  setDragStart: (p: { x: number; y: number }) => void,
  minWidth: number,
  minHeight: number,
  onUpdateSize?: (id: string, w: number, h: number) => void,
  onUpdatePosition?: (id: string, x: number, y: number) => void,
  onResizeStart?: () => void,
  onResizeEnd?: () => void
) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<string | null>(null);

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !resizeDir) return;
      const sd = {
        x: (e.clientX - dragStart.x) / zoom,
        y: (e.clientY - dragStart.y) / zoom,
      };
      const r = calculateResize({
        item, scaledDelta: sd,
        resizeDirection: resizeDir,
        minWidth, minHeight,
      });
      onUpdateSize?.(item.id, r.newWidth, r.newHeight);
      if (r.newX !== item.position.x || r.newY !== item.position.y) {
        onUpdatePosition?.(item.id, r.newX, r.newY);
      }
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [isResizing, resizeDir, dragStart, item, zoom, minWidth, minHeight, onUpdateSize, onUpdatePosition, setDragStart]
  );

  const handleResizeEndInt = useCallback(() => {
    setIsResizing(false);
    setResizeDir(null);
    onResizeEnd?.();
  }, [onResizeEnd]);

  useEffect(() => {
    if (!isResizing) return;
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEndInt);
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEndInt);
    };
  }, [isResizing, handleResizeMove, handleResizeEndInt]);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, dir: string) => {
      e.stopPropagation();
      setIsResizing(true);
      setResizeDir(dir);
      setDragStart({ x: e.clientX, y: e.clientY });
      onResizeStart?.();
    },
    [onResizeStart, setDragStart]
  );

  return { isResizing, handleResizeStart };
}
