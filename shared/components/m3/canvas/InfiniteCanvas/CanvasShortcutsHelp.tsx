'use client';

import React from 'react';

/**
 * Screen-reader-only help text describing
 * available keyboard shortcuts for the canvas.
 */
export const CanvasShortcutsHelp: React.FC<{
  id: string;
}> = ({ id }) => (
  <div
    id={id}
    style={{
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: 0,
    }}
  >
    Keyboard shortcuts: Ctrl+A to select all,
    Delete to remove selected, Ctrl+D to
    duplicate, Ctrl+F to search, Escape to
    clear selection, Arrow keys to pan canvas.
    Space+drag to pan, mouse wheel to zoom.
  </div>
);

export default CanvasShortcutsHelp;
