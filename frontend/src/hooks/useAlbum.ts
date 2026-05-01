'use client';

/**
 * Hook for a single album + its photos.
 * Resolves album from the cached list — no
 * single-album endpoint exists on the backend.
 * @module hooks/useAlbum
 */
import {
  useGetAlbumsQuery,
  useGetAlbumPhotosQuery,
} from '@/store/api/galleryApi';
import type { Album, Photo } from '@/types/content';

/** Return type of useAlbum. */
export interface UseAlbumReturn {
  album: Album | null;
  photos: Photo[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetch an album by ID and its photos.
 *
 * @param albumId - Numeric album ID as string.
 * @returns Album, photos, loading state, error.
 */
export function useAlbum(
  albumId: string,
): UseAlbumReturn {
  const {
    data: albums,
    isLoading: albumsLoading, error: ae,
  } = useGetAlbumsQuery();
  const {
    data: photos,
    isLoading: photosLoading, error: pe,
  } = useGetAlbumPhotosQuery(albumId, {
    skip: !albumId,
  });
  return {
    album:
      albums?.find((a) => a.id === albumId) ?? null,
    photos: photos ?? [],
    isLoading: albumsLoading || photosLoading,
    error: ae || pe ? 'Failed to load album' : null,
  };
}

export default useAlbum;
