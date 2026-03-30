'use client';

import { type ReactElement, ReactNode } from 'react';
import { CssBaseline } from '@metabuilder/m3';
import '@metabuilder/scss';

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
 * imported from @metabuilder/scss globals.
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
