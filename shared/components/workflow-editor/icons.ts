/**
 * Workflow Editor Icons
 * Re-exports and additional icon components
 */

import React from 'react';

export { getNodeIcon } from './iconPaths';

export {
  BackIcon,
  ZoomOutIcon,
  ZoomInIcon,
  ResetIcon,
  PlayIcon,
} from './toolbarIcons';

/** Chevron down icon for collapsible sections. */
export const ChevronDownIcon =
  (): React.ReactElement =>
    React.createElement('svg', {
      width: 16, height: 16,
      viewBox: '0 0 24 24', fill: 'currentColor',
    },
      React.createElement('path', {
        d: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
      }),
    );

/** Notification bell icon. */
export const NotificationIcon =
  (): React.ReactElement =>
    React.createElement('svg', {
      width: 20, height: 20,
      viewBox: '0 0 24 24', fill: 'currentColor',
    },
      React.createElement('path', {
        d: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
      }),
    );

/** Warning/error icon. */
export const WarningIcon = (): React.ReactElement =>
  React.createElement('svg', {
    width: 16, height: 16,
    viewBox: '0 0 24 24', fill: 'currentColor',
  },
    React.createElement('path', {
      d: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    }),
  );
