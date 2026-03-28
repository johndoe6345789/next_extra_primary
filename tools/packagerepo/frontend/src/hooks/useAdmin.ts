'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '../utils/api';
import type { UserData } from '../types/package';
import type { AdminConfig, AdminTab } from '../types/admin';

/** Return type for the useAdmin hook. */
export interface UseAdminResult {
  user: UserData | null;
  config: AdminConfig | null;
  activeTab: AdminTab;
  loading: boolean;
  expandedRoute: number | null;
  setActiveTab: (tab: AdminTab) => void;
  setExpandedRoute: (idx: number | null) => void;
}

/**
 * Hook encapsulating admin page state and data fetch.
 * @returns Admin state and handlers.
 */
export default function useAdmin(): UseAdminResult {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [config, setConfig] =
    useState<AdminConfig | null>(null);
  const [activeTab, setActiveTab] =
    useState<AdminTab>('overview');
  const [loading, setLoading] = useState(true);
  const [expandedRoute, setExpandedRoute] =
    useState<number | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${apiUrl}/admin/config`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = (await response.json()) as {
          config: AdminConfig;
        };
        setConfig(data.config);
      }
    } catch (err: unknown) {
      console.error('Failed to fetch config:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(userData) as UserData;
    if (!parsed.scopes?.includes('admin')) {
      router.push('/');
      return;
    }
    setUser(parsed);
    void fetchConfig();
  }, [router, fetchConfig]);

  return {
    user,
    config,
    activeTab,
    loading,
    expandedRoute,
    setActiveTab,
    setExpandedRoute,
  };
}
