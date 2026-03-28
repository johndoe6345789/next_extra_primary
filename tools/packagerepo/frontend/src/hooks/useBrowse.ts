'use client';

import { useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '../utils/api';
import type { PackageInfo, PackageVersion } from '../types/package';

/** Return type for the useBrowse hook. */
export interface UseBrowseResult {
  searchTerm: string;
  loading: boolean;
  error: string;
  detail: PackageInfo | null;
  versions: PackageVersion[];
  filtered: PackageInfo[];
  setSearchTerm: (term: string) => void;
  clearDetail: () => void;
  handleDownload: (pkg: PackageInfo) => Promise<void>;
  handleDetails: (pkg: PackageInfo) => Promise<void>;
}

/** Hook encapsulating browse page state and actions. */
export default function useBrowse(): UseBrowseResult {
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState<PackageInfo | null>(null);
  const [versions, setVersions] = useState<PackageVersion[]>([]);

  const fetchPackages = useCallback(async () => {
    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${apiUrl}/v1/packages`, { headers });
      if (res.ok) {
        const data = (await res.json()) as { packages?: PackageInfo[] };
        setPackages(data.packages ?? []);
      } else { setError('Failed to load packages'); }
    } catch { setError('Network error loading packages'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void fetchPackages(); }, [fetchPackages]);

  const handleDownload = async (pkg: PackageInfo) => {
    const apiUrl = getApiUrl();
    const token = localStorage.getItem('token');
    const url = `${apiUrl}/v1/${pkg.namespace}/${pkg.name}/${pkg.version}/${pkg.variant}/blob`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${pkg.name}-${pkg.version}.bin`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleDetails = async (pkg: PackageInfo) => {
    setDetail(pkg);
    const apiUrl = getApiUrl();
    const token = localStorage.getItem('token');
    const res = await fetch(
      `${apiUrl}/v1/${pkg.namespace}/${pkg.name}/versions`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (res.ok) {
      const data = (await res.json()) as { versions?: PackageVersion[] };
      setVersions(data.versions ?? []);
    }
  };

  const filtered = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
    || pkg.namespace.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return {
    searchTerm, loading, error, detail, versions, filtered,
    setSearchTerm, clearDetail: () => setDetail(null),
    handleDownload, handleDetails,
  };
}
