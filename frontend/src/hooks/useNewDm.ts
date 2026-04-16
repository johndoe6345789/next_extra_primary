'use client';

/**
 * Hook for searching users and creating a new DM thread.
 * @module hooks/useNewDm
 */

import { useState } from 'react';
import { useSearchUsersQuery } from '@/store/api/userApi';
import {
  useCreateDmThreadMutation,
} from '@/store/api/socialApi';
import type { UserProfile } from '@/types/user';

/** Return shape for useNewDm. */
export interface UseNewDmReturn {
  /** Current search query text. */
  query: string;
  /** Update the search query. */
  setQuery: (q: string) => void;
  /** Users matching the current query. */
  results: UserProfile[];
  /** True while fetching search results. */
  searching: boolean;
  /** True while creating the thread. */
  creating: boolean;
  /**
   * Create a DM thread with the given user ID.
   * @param participantId - Target user ID.
   * @returns New thread ID or null on error.
   */
  createThread: (
    participantId: string,
  ) => Promise<string | null>;
}

/**
 * Manages user search and DM thread creation.
 * @returns UseNewDmReturn state and actions.
 */
export function useNewDm(): UseNewDmReturn {
  const [query, setQuery] = useState('');

  const { data: results = [], isFetching: searching } =
    useSearchUsersQuery(query, { skip: query.length < 2 });

  const [createDmThread, { isLoading: creating }] =
    useCreateDmThreadMutation();

  const createThread = async (
    participantId: string,
  ): Promise<string | null> => {
    try {
      const thread = await createDmThread({
        participantId,
      }).unwrap();
      return thread.id;
    } catch {
      return null;
    }
  };

  return {
    query,
    setQuery,
    results,
    searching,
    creating,
    createThread,
  };
}
