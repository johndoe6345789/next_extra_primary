/**
 * @file useOpenApiSpec.ts
 * @brief Fetches and parses the OpenAPI spec.
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  OpenApiSpec,
  EndpointGroup,
  EndpointEntry,
  HttpMethod,
} from './types';

const SPEC_URL = '/api/docs/openapi.json';
const METHODS: HttpMethod[] = [
  'get', 'post', 'put', 'patch', 'delete',
];

/** @brief Group endpoints by their first tag. */
function groupByTag(
  spec: OpenApiSpec,
): EndpointGroup[] {
  const map = new Map<string, EndpointEntry[]>();

  for (const [path, item] of Object.entries(
    spec.paths,
  )) {
    for (const method of METHODS) {
      const op = item[method];
      if (!op) continue;
      const tag = op.tags?.[0] ?? 'Other';
      if (!map.has(tag)) map.set(tag, []);
      map.get(tag)!.push({
        path, method, operation: op,
      });
    }
  }

  return Array.from(map.entries())
    .map(([tag, endpoints]) => ({ tag, endpoints }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

/** @brief Hook return type. */
interface UseOpenApiResult {
  spec: OpenApiSpec | null;
  groups: EndpointGroup[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** @brief Fetch and parse OpenAPI spec. */
export function useOpenApiSpec(): UseOpenApiResult {
  const [spec, setSpec] =
    useState<OpenApiSpec | null>(null);
  const [groups, setGroups] =
    useState<EndpointGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const fetchSpec = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(SPEC_URL);
      if (!res.ok) throw new Error(res.statusText);
      const data: OpenApiSpec = await res.json();
      setSpec(data);
      setGroups(groupByTag(data));
    } catch (err: unknown) {
      const msg = err instanceof Error
        ? err.message : 'Failed to load spec';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSpec(); }, [fetchSpec]);

  return {
    spec, groups, loading, error,
    refetch: fetchSpec,
  };
}
