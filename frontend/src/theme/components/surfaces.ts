/**
 * @file surfaces.ts
 * @brief MUI surface component overrides (Card, AppBar,
 *        Dialog, Fab).
 */
import type { Components, Theme } from '@mui/material/styles';

/**
 * Style overrides for surface-type MUI components.
 *
 * - MuiCard: rounded corners, hidden overflow.
 * - MuiAppBar: flat (elevation 0), no background image.
 * - MuiDialog: extra-rounded paper (MD3 dialog shape).
 * - MuiFab: rounded rectangle, no text transform.
 */
export const surfaceOverrides: Pick<
  Components<Theme>,
  'MuiCard' | 'MuiAppBar' | 'MuiDialog' | 'MuiFab'
> = {
  MuiCard: {
    defaultProps: {
      elevation: 1,
    },
    styleOverrides: {
      root: {
        borderRadius: 12,
        overflow: 'hidden',
      },
    },
  },

  MuiAppBar: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 28,
      },
    },
  },

  MuiFab: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        textTransform: 'none' as const,
      },
    },
  },
};
