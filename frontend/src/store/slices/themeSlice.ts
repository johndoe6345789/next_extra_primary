/**
 * Theme slice — manages light/dark/system mode.
 * @module store/slices/themeSlice
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** Possible theme modes. */
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = {
  mode: 'system',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    /** Explicitly set the theme mode. */
    setMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
    },
    /** Cycle light -> dark -> system -> light. */
    toggleMode(state) {
      const cycle: ThemeMode[] = ['light', 'dark', 'system'];
      const idx = cycle.indexOf(state.mode);
      state.mode = cycle[(idx + 1) % cycle.length];
    },
  },
});

export const { setMode, toggleMode } = themeSlice.actions;

export default themeSlice.reducer;
