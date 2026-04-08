/**
 * Toolbar Icons for the Workflow Editor
 */

import React from 'react';

/** Back navigation icon. */
export const BackIcon = (): React.ReactElement =>
  React.createElement('svg', {
    width: 20, height: 20,
    viewBox: '0 0 24 24', fill: 'currentColor',
  },
    React.createElement('path', {
      d: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
    }),
  );

/** Zoom out icon. */
export const ZoomOutIcon = (): React.ReactElement =>
  React.createElement('svg', {
    width: 18, height: 18,
    viewBox: '0 0 24 24', fill: 'currentColor',
  },
    React.createElement('path', {
      d: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z',
    }),
  );

/** Zoom in icon. */
export const ZoomInIcon = (): React.ReactElement =>
  React.createElement('svg', {
    width: 18, height: 18,
    viewBox: '0 0 24 24', fill: 'currentColor',
  },
    React.createElement('path', {
      d: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2z',
    }),
  );

/** Reset/refresh icon. */
export const ResetIcon = (): React.ReactElement =>
  React.createElement('svg', {
    width: 18, height: 18,
    viewBox: '0 0 24 24', fill: 'currentColor',
  },
    React.createElement('path', {
      d: 'M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z',
    }),
  );

/** Play/execute icon. */
export const PlayIcon = (): React.ReactElement =>
  React.createElement('svg', {
    width: 16, height: 16,
    viewBox: '0 0 24 24', fill: 'currentColor',
  },
    React.createElement('path', {
      d: 'M8 5v14l11-7z',
    }),
  );
