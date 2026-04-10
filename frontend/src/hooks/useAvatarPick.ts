'use client';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  useUpdateUserMutation,
} from '@/store/api/userApi';
import { setUser } from
  '@/store/slices/authSlice';
import type { User } from '@/types/auth';

/**
 * Handles avatar selection: calls the API to
 * persist the new URL and patches the auth
 * slice so the navbar avatar updates instantly.
 *
 * @param user - Current authenticated user.
 * @returns Pick handler function.
 */
export function useAvatarPick(
  user: User | null,
) {
  const dispatch = useDispatch();
  const [updateUser] = useUpdateUserMutation();

  return useCallback(
    async (src: string | null) => {
      if (!user) return;
      try {
        await updateUser({
          id: user.id,
          avatarUrl: src ?? '',
        }).unwrap();
        dispatch(setUser({
          ...user,
          avatarUrl: src ?? undefined,
        }));
      } catch {
        /* error handled by RTK cache */
      }
    },
    [user, updateUser, dispatch],
  );
}

export default useAvatarPick;
