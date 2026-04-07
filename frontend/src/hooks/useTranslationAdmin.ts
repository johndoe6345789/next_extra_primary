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

/** Flat row for display. */
export interface TransRow {
  ns: string;
  key: string;
  value: string;
}

/** Flatten nested object to dot-notation rows. */
function flatten(
  obj: Record<string, unknown>,
  prefix: string,
  out: TransRow[],
  ns: string,
): void {
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null) {
      flatten(
        v as Record<string, unknown>,
        full, out, ns,
      );
    } else if (typeof v === 'string') {
      out.push({ ns, key: full, value: v });
    }
  }
}

/** Flatten locale translations to rows. */
export function flattenTranslations(
  data: Record<string, unknown>,
): TransRow[] {
  const rows: TransRow[] = [];
  for (const [ns, block] of Object.entries(data)) {
    if (typeof block === 'object' && block) {
      flatten(
        block as Record<string, unknown>,
        '', rows, ns,
      );
    }
  }
  return rows;
}

/**
 * Hook providing admin translation editing logic.
 *
 * @returns State and handlers for the editor.
 */
export function useTranslationAdmin() {
  const [locale, setLocale] = useState('en');
  const [filter, setFilter] = useState('');
  const { data: localeData } = useGetLocalesQuery();
  const locales = localeData?.locales ?? ['en'];
  const { data, isLoading, refetch } =
    useGetTranslationsQuery(locale);
  const [upsert] = useUpsertTranslationMutation();

  const rows = useMemo(
    () => data ? flattenTranslations(data) : [],
    [data],
  );

  const namespaces = useMemo(
    () => [...new Set(rows.map((r) => r.ns))],
    [rows],
  );

  const filtered = useMemo(
    () => filter
      ? rows.filter((r) => r.ns === filter)
      : rows,
    [rows, filter],
  );

  const save = useCallback(
    async (ns: string, key: string, value: string) => {
      await upsert({
        locale, namespace: ns, key, value,
      });
    },
    [locale, upsert],
  );

  return {
    locale, setLocale, locales,
    filter, setFilter, namespaces,
    rows: filtered, isLoading, refetch, save,
  };
}
