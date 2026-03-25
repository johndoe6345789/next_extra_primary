/**
 * @file buttons.ts
 * @brief MUI button component overrides (MD3 pill style).
 */
import type { Components, Theme } from '@mui/material/styles';

/**
 * Style overrides for MuiButton.
 *
 * Applies MD3-style pill shape (border-radius 20px),
 * removes default elevation, and disables text transform.
 */
export const buttonOverrides: Pick<
  Components<Theme>,
  'MuiButton'
> = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: 20,
        padding: '10px 24px',
        textTransform: 'none' as const,
        fontWeight: 500,
      },
      containedPrimary: {
        '&:hover': {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        },
      },
    },
  },
};
