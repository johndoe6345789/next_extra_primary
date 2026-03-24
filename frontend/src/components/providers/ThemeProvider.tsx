'use client';

import { type ReactElement, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { theme } from '@/theme/theme';

/** Props for the application theme provider. */
interface ThemeProviderProps {
  /** Child components to render within theme. */
  readonly children: ReactNode;
}

/**
 * Provides MUI theming and baseline CSS to the app.
 *
 * Includes `InitColorSchemeScript` to prevent
 * color-scheme flash on SSR hydration.
 *
 * @param props - Component props.
 * @returns Themed component tree.
 */
export function ThemeProvider({ children }: ThemeProviderProps): ReactElement {
  return (
    <MuiThemeProvider theme={theme}>
      <InitColorSchemeScript attribute="class" />
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  );
}
