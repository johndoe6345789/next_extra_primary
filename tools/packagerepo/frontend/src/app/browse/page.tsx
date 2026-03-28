'use client';

import styles from './page.module.scss';
import Modal from '../../components/Modal';
import VersionTable from '../../components/VersionTable';
import useBrowse from '../../hooks/useBrowse';
import PackageCard from '../../components/PackageCard';

/** Browse page listing available packages. */
export default function BrowsePage() {
  const {
    searchTerm, loading, error, detail, versions,
    filtered, setSearchTerm, clearDetail,
    handleDownload, handleDetails,
  } = useBrowse();

  if (loading) {
    return (
      <div className={styles.container}><p>Loading packages...</p></div>
    );
  }

  return (
    <div className={styles.container} data-testid="browse-page">
      <div className={styles.header}>
        <h1>Browse Packages</h1>
        <p>Explore available packages</p>
      </div>
      <div className={styles.search}>
        <input
          type="text" className={styles.search__input}
          placeholder="Search packages..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search packages" data-testid="search-input"
        />
      </div>
      {error && <p style={{ color: '#e74c3c' }}>{error}</p>}
      <div className={styles.packages}>
        {filtered.length > 0 ? filtered.map((pkg) => (
          <PackageCard
            key={`${pkg.namespace}/${pkg.name}/${pkg.version}`}
            pkg={pkg} styles={styles}
            onDownload={() => void handleDownload(pkg)}
            onDetails={() => void handleDetails(pkg)}
          />
        )) : (
          <div className={styles.empty}><p>No packages found</p></div>
        )}
      </div>
      <Modal
        isOpen={!!detail} onClose={clearDetail}
        title={detail ? `${detail.namespace}/${detail.name}` : ''}
      >
        {detail && (
          <VersionTable
            versions={versions} detail={detail} styles={styles}
            onDownload={(pkg) => void handleDownload(pkg)}
          />
        )}
      </Modal>
    </div>
  );
}
