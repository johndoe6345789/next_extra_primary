/**
 * Gallery RTK Query endpoints.
 * @module store/api/galleryApi
 */
import { baseApi } from './baseApi';
import type { Album, Photo } from '../../types/content';

/** Gallery endpoints injected into baseApi. */
export const galleryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAlbums: build.query<Album[], void>({
      query: () => '/gallery/albums',
    }),
    getAlbum: build.query<Album, string>({
      query: (id) => `/gallery/albums/${id}`,
    }),
    getAlbumPhotos: build.query<Photo[], string>({
      query: (id) =>
        `/gallery/albums/${id}/photos`,
    }),
  }),
});

export const {
  useGetAlbumsQuery,
  useGetAlbumQuery,
  useGetAlbumPhotosQuery,
} = galleryApi;
