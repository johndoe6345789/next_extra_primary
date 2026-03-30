/**
 * Hook for feature toggle checks.
 * @module hooks/useFeatureToggle
 */
import { useGetFeaturesQuery } from '@/store/api';

/**
 * @brief Check if a feature is enabled.
 * @param key Feature toggle key.
 * @returns Whether the feature is enabled.
 */
export function useFeatureToggle(key: string) {
  const { data: features } = useGetFeaturesQuery();
  const feature = features?.find(
    (f) => f.key === key,
  );
  return feature?.enabled ?? false;
}
