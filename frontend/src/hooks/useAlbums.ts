'use client';

import {
  useGetAlbumsQuery,
} from '@/store/api/galleryApi';
import type { Album } from '@/types/content';

/** Result of useAlbums. */
export interface UseAlbumsReturn {
  albums: Album[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetch the album list.
 *
 * @returns Albums + loading/error state.
 */
export function useAlbums(): UseAlbumsReturn {
  const { data, isLoading, error } =
    useGetAlbumsQuery();
  return {
    albums: data ?? [],
    isLoading,
    error: error ? 'Failed to load albums' : null,
  };
}

export default useAlbums;
