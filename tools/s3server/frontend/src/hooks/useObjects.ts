'use client';

import {
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { S3Object } from '@/types';
import {
  s3FetchXml,
  s3Fetch,
  parseObjectList,
} from '@/utils';
import api from '@/constants/api-routes.json';

/** @brief Hook return type for object ops. */
export interface UseObjectsReturn {
  objects: S3Object[];
  isLoading: boolean;
  error: string;
  refresh: () => Promise<void>;
  uploadObject: (
    k: string,
    f: File,
  ) => Promise<boolean>;
  downloadObject: (k: string) => Promise<void>;
  deleteObject: (k: string) => Promise<boolean>;
}

/** @brief Build object URL for a bucket+key. */
function objectUrl(
  bucket: string,
  key: string,
): string {
  return api.object
    .replace('{bucket}', bucket)
    .replace('{key}', key);
}

/**
 * @brief Manage objects in an S3 bucket.
 * @param bucket - Bucket name.
 * @param prefix - Optional key prefix filter.
 */
export function useObjects(
  bucket: string,
  prefix = '',
): UseObjectsReturn {
  const [objects, setObjects] = useState<
    S3Object[]
  >([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      let url = api.listObjects.replace(
        '{bucket}',
        bucket,
      );
      if (prefix) url += `?prefix=${prefix}`;
      const xml = await s3FetchXml(url);
      const result = parseObjectList(xml);
      setObjects(result.contents);
    } catch {
      setError('Failed to load objects');
    } finally {
      setIsLoading(false);
    }
  }, [bucket, prefix]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const uploadObject = useCallback(
    async (
      key: string,
      file: File,
    ): Promise<boolean> => {
      const url = objectUrl(bucket, key);
      const res = await s3Fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type':
            file.type || 'application/octet-stream',
        },
      });
      if (res.ok) await refresh();
      return res.ok;
    },
    [bucket, refresh],
  );

  const downloadObject = useCallback(
    async (key: string) => {
      const url = objectUrl(bucket, key);
      const res = await s3Fetch(url);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = key.split('/').pop() ?? key;
      a.click();
      URL.revokeObjectURL(a.href);
    },
    [bucket],
  );

  const deleteObject = useCallback(
    async (key: string): Promise<boolean> => {
      const url = objectUrl(bucket, key);
      const res = await s3Fetch(url, {
        method: 'DELETE',
      });
      if (res.ok) await refresh();
      return res.ok;
    },
    [bucket, refresh],
  );

  return {
    objects,
    isLoading,
    error,
    refresh,
    uploadObject,
    downloadObject,
    deleteObject,
  };
}
