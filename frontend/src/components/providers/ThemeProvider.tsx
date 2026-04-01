'use client';

import { type ReactElement, ReactNode } from 'react';
import { CssBaseline } from '@shared/m3';
import '@shared/scss';

/** Props for the application theme provider. */
interface ThemeProviderProps {
  /** Child components to render within theme. */
  readonly children: ReactNode;
}

/**
 * Provides M3 baseline CSS and SCSS tokens to the app.
 *
 * Theming is handled via M3 CSS variables
 * (--mat-sys-primary, --mat-sys-surface, etc.)
 * imported from @shared/scss globals.
 *
 * @param props - Component props.
 * @returns Themed component tree.
 */
export function ThemeProvider(
  { children }: ThemeProviderProps,
): ReactElement {
  return (
    <>
      <CssBaseline />
      {children}
    </>
  );
}
