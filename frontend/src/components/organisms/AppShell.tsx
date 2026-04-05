'use client';

import React from 'react';
import {
  DrawerProvider,
  useDrawer,
} from '@shared/components/ui/DrawerContext';
import s from
  '@shared/scss/modules/AppShell.module.scss';

/** Wrapper that shifts when drawer opens. */
export const ShiftContent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { open } = useDrawer();
  return (
    <div
      className={[
        s.content,
        open ? s.contentShifted : '',
      ].join(' ')}
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
