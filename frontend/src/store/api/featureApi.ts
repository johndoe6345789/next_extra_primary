/**
 * Feature toggle API endpoints injected into baseApi.
 * @module store/api/featureApi
 */
import { baseApi } from './baseApi';

/** Shape of a single feature toggle. */
export interface FeatureToggle {
  key: string;
  enabled: boolean;
  description: string;
  scope: string;
}

/** Feature toggle endpoints. */
export const featureApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** List all feature toggles. */
    getFeatures: build.query<
      FeatureToggle[], void
    >({
      query: () => '/features',
      transformResponse: (
        res: { features: FeatureToggle[] },
      ) => res.features,
      providesTags: ['Features'],
    }),

    /** Toggle a feature on/off (admin). */
    toggleFeature: build.mutation<
      { key: string; enabled: boolean },
      string
    >({
      query: (key) => ({
        url: `/features/${key}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Features'],
    }),
  }),
});

export const {
  useGetFeaturesQuery,
  useToggleFeatureMutation,
} = featureApi;
