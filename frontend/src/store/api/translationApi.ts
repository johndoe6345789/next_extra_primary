/**
 * Translation API endpoints injected into baseApi.
 * @module store/api/translationApi
 */
import { baseApi } from './baseApi';

/** Flat translation entry for admin editing. */
export interface TranslationEntry {
  locale: string;
  namespace: string;
  key: string;
  value: string;
}

/** Per-locale coverage stats. */
export interface LocaleCoverage {
  locale: string;
  present: number;
  total: number;
  isReference: boolean;
}

/** Coverage response. */
export interface CoverageResponse {
  reference: string;
  locales: LocaleCoverage[];
}

/** Upsert payload for a single translation. */
interface UpsertPayload {
  locale: string;
  namespace: string;
  key: string;
  value: string;
}

/** Delete payload identifying a translation. */
interface DeletePayload {
  locale: string;
  namespace: string;
  key: string;
}

/** Translation endpoints. */
export const translationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Fetch available locales from DB. */
    getLocales: build.query<
      { locales: string[] }, void
    >({
      query: () => '/locales',
      providesTags: ['Translation'],
    }),

    /** Fetch nested translations for a locale. */
    getTranslations: build.query<
      Record<string, unknown>, string
    >({
      query: (locale) =>
        `/translations/${locale}`,
      providesTags: ['Translation'],
    }),

    /** Coverage stats per locale. */
    getCoverage: build.query<
      CoverageResponse, void
    >({
      query: () => '/translations/coverage',
      providesTags: ['Translation'],
    }),

    /** Upsert a translation (admin). */
    upsertTranslation: build.mutation<
      { ok: boolean; id: string }, UpsertPayload
    >({
      query: (body) => ({
        url: '/admin/translations',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Translation'],
    }),

    /** Delete a translation (admin). */
    deleteTranslation: build.mutation<
      { ok: boolean }, DeletePayload
    >({
      query: ({ locale, namespace, key }) => ({
        url: `/admin/translations`
          + `/${locale}/${namespace}/${key}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Translation'],
    }),
  }),
});

export const {
  useGetLocalesQuery,
  useGetTranslationsQuery,
  useGetCoverageQuery,
  useUpsertTranslationMutation,
  useDeleteTranslationMutation,
} = translationApi;
