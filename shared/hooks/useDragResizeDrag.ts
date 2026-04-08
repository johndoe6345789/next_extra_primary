/**
 * Drag movement logic for useDragResize
 */

import {
  useState,
  useCallback,
  useEffect,
} from 'react';

/** Drag movement handler + effect */
export function useDragMovement(
  item: { id: string; position: { x: number; y: number } },
  zoom: number,
  snapToGrid: (pos: { x: number; y: number }) => { x: number; y: number },
  onUpdatePosition?: (id: string, x: number, y: number) => void,
  onDragStart?: () => void,
  onDragEnd?: () => void
) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleDragMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = (e.clientX - dragStart.x) / zoom;
      const dy = (e.clientY - dragStart.y) / zoom;
      const pos = snapToGrid({
        x: item.position.x + dx,
        y: item.position.y + dy,
      });
      onUpdatePosition?.(item.id, pos.x, pos.y);
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [isDragging, dragStart, item, zoom, snapToGrid, onUpdatePosition]
  );

  const handleDragEndInt = useCallback(() => {
    setIsDragging(false);
    onDragEnd?.();
  }, [onDragEnd]);

  useEffect(() => {
    if (!isDragging) return;
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEndInt);
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEndInt);
    };
  }, [isDragging, handleDragMove, handleDragEndInt]);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      const t = e.target as HTMLElement;
      if (t.closest('[data-no-drag]')) return;
      e.stopPropagation();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      onDragStart?.();
    },
    [onDragStart]
  );

  return { isDragging, dragStart, setDragStart, handleDragStart };
}
