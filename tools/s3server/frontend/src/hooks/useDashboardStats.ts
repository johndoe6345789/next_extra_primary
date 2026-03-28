'use client';

import { useState, useEffect } from 'react';
import {
  s3FetchXml,
  parseBucketList,
  parseObjectList,
} from '@/utils';
import api from '@/constants/api-routes.json';

/** @brief Dashboard statistics. */
export interface DashboardStats {
  bucketCount: number;
  objectCount: number;
  totalSize: number;
  isLoading: boolean;
}

/**
 * @brief Aggregate S3 storage statistics.
 * @returns Bucket count, object count, total size.
 */
export function useDashboardStats():
  DashboardStats {
  const [stats, setStats] =
    useState<DashboardStats>({
      bucketCount: 0,
      objectCount: 0,
      totalSize: 0,
      isLoading: true,
    });

  useEffect(() => {
    const load = async () => {
      try {
        const xml = await s3FetchXml(api.buckets);
        const buckets = parseBucketList(xml);
        let objectCount = 0;
        let totalSize = 0;

        for (const b of buckets) {
          const url = api.listObjects.replace(
            '{bucket}',
            b.name,
          );
          const oXml = await s3FetchXml(url);
          const result = parseObjectList(oXml);
          objectCount += result.contents.length;
          for (const o of result.contents) {
            totalSize += o.size;
          }
        }

        setStats({
          bucketCount: buckets.length,
          objectCount,
          totalSize,
          isLoading: false,
        });
      } catch {
        setStats((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };
    load();
  }, []);

  return stats;
}
