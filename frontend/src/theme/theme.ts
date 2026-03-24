import { createTheme } from '@mui/material/styles';
import { lightPalette, darkPalette } from './palette';
import { typography } from './typography';
import { components } from './components';

/**
 * Application theme built with MUI's colorSchemes API.
 *
 * Uses MD3-inspired design tokens for both light and dark
 * modes. CSS variables are enabled so colour scheme
 * switching works without a full re-render.
 *
 * @example
 * ```tsx
 * import { ThemeProvider } from '@mui/material/styles';
 * import { theme } from '@/theme/theme';
 *
 * <ThemeProvider theme={theme}>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: {
      palette: lightPalette(),
    },
    dark: {
      palette: darkPalette(),
    },
  },
  typography: typography(),
  components: components(),
  shape: {
    borderRadius: 8,
  },
});
