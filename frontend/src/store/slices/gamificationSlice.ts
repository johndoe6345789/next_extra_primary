/**
 * Gamification slice — points, badges, streaks.
 * @module store/slices/gamificationSlice
 */
import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type {
  Badge,
  StreakInfo,
  LeaderboardEntry,
  GamificationState,
} from '../../types/gamification';

const initialState: GamificationState = {
  points: 0,
  level: 1,
  badges: [],
  streak: null,
  leaderboard: [],
};

const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    /** Set the user's total points. */
    setPoints(
      state,
      action: PayloadAction<number>,
    ) {
      state.points = action.payload;
    },
    /** Append a newly earned badge. */
    addBadge(
      state,
      action: PayloadAction<Badge>,
    ) {
      const exists = state.badges.some(
        (b) => b.id === action.payload.id,
      );
      if (!exists) {
        state.badges.push(action.payload);
      }
    },
    /** Replace streak info. */
    setStreak(
      state,
      action: PayloadAction<StreakInfo>,
    ) {
      state.streak = action.payload;
    },
    /** Replace the leaderboard entries. */
    setLeaderboard(
      state,
      action: PayloadAction<LeaderboardEntry[]>,
    ) {
      state.leaderboard = action.payload;
    },
  },
});

export const {
  setPoints,
  addBadge,
  setStreak,
  setLeaderboard,
} = gamificationSlice.actions;

export default gamificationSlice.reducer;
