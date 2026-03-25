/**
 * @file inputs.ts
 * @brief MUI input and selection component overrides
 *        (TextField, Switch, Chip).
 */
import type { Components, Theme } from '@mui/material/styles';

/**
 * Style overrides for input and selection MUI components.
 *
 * - MuiTextField: outlined variant by default, rounded
 *   input border (8px).
 * - MuiSwitch: extra padding for MD3 track shape.
 * - MuiChip: rounded rectangle with medium weight label.
 */
export const inputOverrides: Pick<
  Components<Theme>,
  'MuiTextField' | 'MuiSwitch' | 'MuiChip'
> = {
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'medium',
    },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        },
      },
    },
  },

  MuiSwitch: {
    styleOverrides: {
      root: {
        padding: 8,
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
      },
    },
  },
};
