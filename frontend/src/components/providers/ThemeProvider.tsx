'use client';

import { type ReactElement, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/theme/theme';

/** Props for the application theme provider. */
interface ThemeProviderProps {
  /** Child components to render within theme. */
  readonly children: ReactNode;
}

/**
 * Provides MUI theming and baseline CSS to the app.
 *
 * Color scheme handled via MUI CSS variables
 * and globals.scss transitions.
 *
 * @param props - Component props.
 * @returns Themed component tree.
 */
export function ThemeProvider({ children }: ThemeProviderProps): ReactElement {
  return (
    <MuiThemeProvider theme={theme} defaultMode="dark">
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  );
}
