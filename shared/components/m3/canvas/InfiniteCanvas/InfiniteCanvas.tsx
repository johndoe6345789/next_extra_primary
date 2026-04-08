'use client';
/**
 * InfiniteCanvas - Main canvas component
 * composing grid, zoom, pan, and navigation.
 */

import React, { useRef, useEffect } from 'react';
import { useProjectCanvas, useCanvasKeyboard } from '@shared/hooks-canvas';
import { useCanvasTransform } from './useCanvasTransform';
import { useCanvasGrid } from './useCanvasGrid';
import { useCanvasActions } from './useCanvasActions';
import { CanvasGrid } from './CanvasGrid';
import { CanvasContent } from './CanvasContent';
import { ZoomControls } from './ZoomControls';
import { PanHint } from './PanHint';
import { NavigationArrows } from './NavigationArrows';
import { CanvasShortcutsHelp } from './CanvasShortcutsHelp';
import { testId } from '@shared/utils/accessibility';

interface InfiniteCanvasProps {
  children: React.ReactNode;
  onCanvasPan?: (pan: { x: number; y: number }) => void;
  onCanvasZoom?: (zoom: number) => void;
}

/** Infinite canvas with zoom, pan, grid, and keyboard shortcuts. */
export const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({
  children, onCanvasPan, onCanvasZoom,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { zoom, pan, zoom_in, zoom_out, reset_view, snapSize } =
    useProjectCanvas();
  const { isPanning, handleMouseDown, handleArrowPan, bindWheelListener } =
    useCanvasTransform(onCanvasPan, onCanvasZoom);
  const { gridOffset } = useCanvasGrid();
  const actions = useCanvasActions();

  useCanvasKeyboard({
    onSelectAll: actions.handleSelectAll,
    onDeleteSelected: actions.handleDeleteSelected,
    onDuplicateSelected: actions.handleDuplicateSelected,
    onSearch: actions.handleSearch,
  });

  useEffect(() => {
    return bindWheelListener(canvasRef.current);
  }, [bindWheelListener]);

  return (
    <div
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      data-testid={testId.canvasContainer()}
      role="region"
      aria-label="Infinite canvas for workflow arrangement"
      aria-describedby="canvas-shortcuts-help"
      tabIndex={0}
    >
      <CanvasGrid snapSize={snapSize} gridOffset={gridOffset} />
      <CanvasContent zoom={zoom} panX={pan.x} panY={pan.y}>
        {children}
      </CanvasContent>
      <ZoomControls
        zoom={zoom} onZoomIn={zoom_in}
        onZoomOut={zoom_out} onResetView={reset_view}
      />
      <PanHint />
      <NavigationArrows onPan={handleArrowPan} />
      <CanvasShortcutsHelp id="canvas-shortcuts-help" />
    </div>
  );
};

export default InfiniteCanvas;
