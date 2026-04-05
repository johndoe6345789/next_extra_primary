'use client';

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
} from 'react';

interface DrawerState {
  open: boolean;
  toggle: () => void;
  close: () => void;
  setOpen: (v: boolean) => void;
}

const Ctx = createContext<DrawerState>({
  open: false,
  toggle: () => {},
  close: () => {},
  setOpen: () => {},
});

/** Provider for drawer open/close state. */
export const DrawerProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const value = useMemo(
    () => ({
      open,
      setOpen,
      toggle: () => setOpen((v) => !v),
      close: () => setOpen(false),
    }),
    [open],
  );
  return (
    <Ctx.Provider value={value}>
      {children}
    </Ctx.Provider>
  );
};

/** Hook to access drawer state. */
export const useDrawer = () =>
  useContext(Ctx);

/** Drawer width in pixels. */
export const DRAWER_WIDTH = 256;
