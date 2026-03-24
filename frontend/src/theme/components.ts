import type { Components, Theme } from '@mui/material/styles';

/**
 * MUI component style overrides following MD3 guidelines.
 *
 * - Button: pill shape (border-radius 20px)
 * - Card: subtle elevation with rounded corners
 * - TextField: outlined variant as default
 * - AppBar: flat with surface colour
 * - Chip: rounded with consistent sizing
 *
 * @returns A MUI Components override map.
 */
export function components(): Components<Theme> {
  return {
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

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
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

    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: 8,
        },
      },
    },
  };
}
