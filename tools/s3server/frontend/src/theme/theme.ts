'use client';

import { createTheme } from '@mui/material/styles';
import { palette } from './palette';

/** @brief MUI theme for S3 Browser. */
export const theme = createTheme({
  palette,
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'sans-serif',
    ].join(','),
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid #E0E3E7',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { padding: '10px 16px' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none' },
      },
    },
  },
});
