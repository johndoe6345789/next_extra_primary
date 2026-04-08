'use client';
/**
 * Hook for admin translation editing state.
 * @module hooks/useTranslationAdmin
 */
import { useState, useCallback, useMemo } from 'react';
import {
  useGetLocalesQuery,
  useGetTranslationsQuery,
  useUpsertTranslationMutation,
} from '@/store/api/translationApi';
import { flattenTranslations } from
  './flattenTranslations';

export type { TransRow } from
  './flattenTranslations';
export { flattenTranslations } from
  './flattenTranslations';

/**
 * Hook providing admin translation
 * editing logic.
 *
 * @returns State and handlers for editor.
 */
export function useTranslationAdmin() {
  const [locale, setLocale] = useState('en');
  const [filter, setFilter] = useState('');
  const { data: localeData } =
    useGetLocalesQuery();
  const locales =
    localeData?.locales ?? ['en'];
  const { data, isLoading, refetch } =
    useGetTranslationsQuery(locale);
  const [upsert] =
    useUpsertTranslationMutation();

  const rows = useMemo(
    () => data
      ? flattenTranslations(data) : [],
    [data],
  );

  const namespaces = useMemo(
    () => [
      ...new Set(rows.map((r) => r.ns)),
    ],
    [rows],
  );

  const filtered = useMemo(
    () => filter
      ? rows.filter((r) => r.ns === filter)
      : rows,
    [rows, filter],
  );

  const save = useCallback(
    async (
      ns: string,
      key: string,
      value: string,
    ) => {
      await upsert({
        locale, namespace: ns, key, value,
      });
    },
    [locale, upsert],
  );

  return {
    locale, setLocale, locales,
    filter, setFilter, namespaces,
    rows: filtered, isLoading,
    refetch, save,
  };
}
