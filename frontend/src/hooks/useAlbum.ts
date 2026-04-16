'use client';

import {
  useGetAlbumQuery,
  useGetAlbumPhotosQuery,
} from '@/store/api/galleryApi';
import type { Album, Photo } from '@/types/content';

/** Result of useAlbum. */
export interface UseAlbumReturn {
  album: Album | null;
  photos: Photo[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetch a single album and its photos.
 *
 * @param albumId - Album ID.
 * @returns Album, photos, loading/error state.
 */
export function useAlbum(
  albumId: string,
): UseAlbumReturn {
  const album = useGetAlbumQuery(albumId, {
    skip: !albumId,
  });
  const photos = useGetAlbumPhotosQuery(albumId, {
    skip: !albumId,
  });
  return {
    album: album.data ?? null,
    photos: photos.data ?? [],
    isLoading: album.isLoading || photos.isLoading,
    error:
      album.error || photos.error
        ? 'Failed to load album'
        : null,
  };
}

export default useAlbum;
