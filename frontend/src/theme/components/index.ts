/**
 * @file index.ts
 * @brief Assembles all MUI component overrides into a single
 *        Components<Theme> map.
 *
 * Sub-modules:
 * - `buttons`  — MuiButton
 * - `surfaces` — MuiCard, MuiAppBar, MuiDialog, MuiFab
 * - `inputs`   — MuiTextField, MuiSwitch, MuiChip
 */
import type { Components, Theme } from '@mui/material/styles';

import { buttonOverrides } from './buttons';
import { surfaceOverrides } from './surfaces';
import { inputOverrides } from './inputs';

/**
 * MUI component style overrides following MD3 guidelines.
 *
 * @returns A complete MUI Components override map.
 */
export function components(): Components<Theme> {
  return {
    ...buttonOverrides,
    ...surfaceOverrides,
    ...inputOverrides,
  };
}
