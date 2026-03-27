'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.scss';
import { getApiUrl } from '../../utils/api';
import Modal from '../../components/Modal';

export default function BrowsePage() {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState(null);
  const [versions, setVersions] = useState([]);

  useEffect(() => { fetchPackages(); }, []);

  const fetchPackages = async () => {
    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');
      const headers = token
        ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(
        `${apiUrl}/v1/packages`, { headers });
      if (res.ok) {
        const data = await res.json();
        setPackages(data.packages || []);
      } else {
        setError('Failed to load packages');
      }
    } catch {
      setError('Network error loading packages');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (pkg) => {
    const apiUrl = getApiUrl();
    const token = localStorage.getItem('token');
    const url = `${apiUrl}/v1/${pkg.namespace}`
      + `/${pkg.name}/${pkg.version}`
      + `/${pkg.variant}/blob`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { alert('Download failed'); return; }
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${pkg.name}-${pkg.version}.bin`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleDetails = async (pkg) => {
    setDetail(pkg);
    const apiUrl = getApiUrl();
    const token = localStorage.getItem('token');
    const res = await fetch(
      `${apiUrl}/v1/${pkg.namespace}/${pkg.name}/versions`,
      { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      setVersions(data.versions || []);
    }
  };

  const filtered = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(
      searchTerm.toLowerCase())
    || pkg.namespace.toLowerCase().includes(
      searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className={styles.container}>
      <p>Loading packages...</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Browse Packages</h1>
        <p>Explore available packages in the repository</p>
      </div>

      <div className={styles.search}>
        <input
          type="text"
          className={styles.search__input}
          placeholder="Search packages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <p style={{ color: '#e74c3c' }}>{error}</p>}

      <div className={styles.packages}>
        {filtered.length > 0 ? filtered.map((pkg, idx) => (
          <div key={idx} className={styles.package}>
            <div className={styles.package__info}>
              <div className={styles.package__namespace}>
                {pkg.namespace}
              </div>
              <div className={styles.package__name}>
                {pkg.name}
              </div>
              <span className={styles.package__version}>
                v{pkg.version}
              </span>
            </div>
            <div className={styles.package__actions}>
              <button
                className={`${styles.button} ${styles['button--primary']} ${styles['button--small']}`}
                onClick={() => handleDownload(pkg)}
              >
                Download
              </button>
              <button
                className={`${styles.button} ${styles['button--secondary']} ${styles['button--small']}`}
                onClick={() => handleDetails(pkg)}
              >
                Details
              </button>
            </div>
          </div>
        )) : (
          <div className={styles.empty}>
            <p>No packages found</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!detail}
        onClose={() => setDetail(null)}
        title={detail
          ? `${detail.namespace}/${detail.name}`
          : ''}
      >
        {detail && (
          <div>
            <h3>Versions</h3>
            {versions.length > 0 ? (
              <table style={{ width: '100%',
                borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left',
                      padding: '8px',
                      borderBottom: '1px solid #ddd' }}>
                      Version</th>
                    <th style={{ textAlign: 'left',
                      padding: '8px',
                      borderBottom: '1px solid #ddd' }}>
                      Variant</th>
                    <th style={{ textAlign: 'right',
                      padding: '8px',
                      borderBottom: '1px solid #ddd' }}>
                      Size</th>
                    <th style={{ textAlign: 'right',
                      padding: '8px',
                      borderBottom: '1px solid #ddd' }}>
                      Action</th>
                  </tr>
                </thead>
                <tbody>
                  {versions.map((v, i) => (
                    <tr key={i}>
                      <td style={{ padding: '8px' }}>
                        {v.version}</td>
                      <td style={{ padding: '8px' }}>
                        {v.variant}</td>
                      <td style={{ padding: '8px',
                        textAlign: 'right' }}>
                        {(v.blob_size / 1024).toFixed(1)} KB
                      </td>
                      <td style={{ padding: '8px',
                        textAlign: 'right' }}>
                        <button
                          className={`${styles.button} ${styles['button--primary']} ${styles['button--small']}`}
                          onClick={() => handleDownload({
                            ...detail,
                            version: v.version,
                            variant: v.variant,
                          })}
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No versions found</p>}
            <div style={{ marginTop: '16px',
              fontSize: '13px', color: '#888' }}>
              Digest: {versions[0]?.blob_digest || 'N/A'}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
