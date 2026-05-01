/**
 * Gallery RTK Query endpoints.
 * Fixes URL contract: backend is /gallery not
 * /gallery/albums. Uses picsum.photos for dev
 * placeholder images seeded by asset_id.
 * @module store/api/galleryApi
 */
import { baseApi } from './baseApi';
import type { Album, Photo } from '../../types/content';

const PICSUM = 'https://picsum.photos/seed';

interface BackendGallery {
  id: number; slug: string; title: string;
  description: string;
  cover_asset_id: number | null;
  item_count: number;
}
interface BackendItem {
  gallery_id: number; asset_id: number;
  position: number; caption: string;
}

/** Gallery RTK endpoints injected into baseApi. */
export const galleryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAlbums: build.query<Album[], void>({
      query: () => '/gallery',
      transformResponse: (
        r: { galleries: BackendGallery[] },
      ) => (r.galleries ?? []).map((g) => ({
        id: String(g.id),
        slug: g.slug,
        title: g.title,
        description: g.description,
        photoCount: g.item_count,
        coverUrl: `${PICSUM}/${
          g.cover_asset_id ?? g.id}/800/450`,
      })),
      providesTags: ['Gallery'],
    }),
    getAlbumPhotos: build.query<Photo[], string>({
      query: (id) => `/gallery/${id}/items`,
      transformResponse: (
        r: { items: BackendItem[] },
      ) => (r.items ?? []).map((it) => {
        // Vary height per photo so masonry grids look
        // natural — deterministic based on asset_id.
        const heights = [250, 340, 210, 390, 290, 230];
        const h = heights[it.asset_id % heights.length];
        return {
          id: String(it.asset_id),
          albumId: String(it.gallery_id),
          caption: it.caption,
          variants: {
            thumb:  `${PICSUM}/${it.asset_id}/400/${h}`,
            medium: `${PICSUM}/${it.asset_id}/800/${
              Math.round(h * 2)}`,
            large:
              `${PICSUM}/${it.asset_id}/1600/1200`,
          },
        };
      }),
      providesTags: (_r, _e, id) =>
        [{ type: 'Gallery', id }],
    }),
  }),
});

export const {
  useGetAlbumsQuery,
  useGetAlbumPhotosQuery,
} = galleryApi;
