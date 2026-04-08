'use client';

import React from 'react';
import {
  DrawerProvider,
  useDrawer,
  DRAWER_WIDTH,
} from '@shared/components/ui/DrawerContext';

/** Content area that shifts with drawer. */
export const ShiftContent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { open } = useDrawer();
  return (
    <div
      style={{
        marginLeft: open
          ? `${DRAWER_WIDTH}px`
          : '0',
        transition:
          'margin-left 300ms '
          + 'cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column' as const,
        minHeight: 'calc(100vh - 57px)',
      }}
    >
      {children}
    </div>
  );
};

/**
 * App shell — provides DrawerProvider.
 * Navbar sits outside ShiftContent.
 */
export const AppShell: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <DrawerProvider>
    {children}
  </DrawerProvider>
);

export default AppShell;
