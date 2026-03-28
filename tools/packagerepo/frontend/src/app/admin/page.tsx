'use client';

import styles from './page.module.scss';
import useAdmin from '../../hooks/useAdmin';
import AdminTabs from '../../components/admin/AdminTabs';
import OverviewTab from '../../components/admin/OverviewTab';
import EntitiesTab from '../../components/admin/EntitiesTab';
import StorageTab from '../../components/admin/StorageTab';
import RoutesTab from '../../components/admin/RoutesTab';
import AuthTab from '../../components/admin/AuthTab';
import FeaturesTab from '../../components/admin/FeaturesTab';
import RawTab from '../../components/admin/RawTab';

/** Admin panel page for repository management. */
export default function AdminPage() {
  const {
    config, activeTab, loading, user,
    expandedRoute, setActiveTab, setExpandedRoute,
  } = useAdmin();

  if (loading || !user || !config) {
    return <div className={styles.loading}>Loading admin panel...</div>;
  }

  const handleExport = () => {
    const blob = new Blob(
      [JSON.stringify(config, null, 2)], { type: 'application/json' },
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'repo-config.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const btnCls = `${styles.button} ${styles['button--secondary']}`;

  return (
    <div className={styles.container} data-testid="admin-page">
      <div className={styles.header}>
        <div>
          <h1>Admin Panel</h1>
          <p>Repository configuration and management</p>
        </div>
        <div className={styles.header__actions}>
          <button className={btnCls} onClick={handleExport}
            aria-label="Export configuration">
            Export Config
          </button>
        </div>
      </div>
      <div className={styles.alert} style={{
        background: 'rgba(33, 150, 243, 0.1)',
        borderLeft: '4px solid #2196f3',
      }}>
        <strong>Info:</strong> Configuration loaded from PostgreSQL.
      </div>
      <AdminTabs
        activeTab={activeTab} setActiveTab={setActiveTab} styles={styles}
      />
      {activeTab === 'overview' && (
        <OverviewTab config={config} styles={styles} />
      )}
      {activeTab === 'entities' && (
        <EntitiesTab entities={config.entities ?? []} styles={styles} />
      )}
      {activeTab === 'storage' && (
        <StorageTab
          blobStores={config.blob_stores ?? []}
          kvStores={config.kv_stores ?? []} styles={styles}
        />
      )}
      {activeTab === 'routes' && (
        <RoutesTab
          routes={config.api_routes ?? []}
          expandedRoute={expandedRoute}
          setExpandedRoute={setExpandedRoute} styles={styles}
        />
      )}
      {activeTab === 'auth' && (
        <AuthTab
          scopes={config.auth_scopes ?? []}
          policies={config.auth_policies ?? []} styles={styles}
        />
      )}
      {activeTab === 'features' && (
        <FeaturesTab
          features={config.features} caching={config.caching} styles={styles}
        />
      )}
      {activeTab === 'raw' && <RawTab config={config} styles={styles} />}
    </div>
  );
}
