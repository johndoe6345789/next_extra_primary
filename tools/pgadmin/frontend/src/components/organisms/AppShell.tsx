'use client';

import { useState } from 'react';
import navItems from '@/constants/nav-items.json';
import labels from '@/constants/ui-labels.json';
import styles
  from '@scss/atoms/pgadmin-shell.module.scss';

/** @brief Props for AppShell. */
interface AppShellProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

/** @brief Main layout with sidebar + content. */
export default function AppShell(
  {
    activeTab, onTabChange, onLogout, children,
  }: AppShellProps,
) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={styles.appShell}
      data-testid="app-shell"
    >
      <nav
        className={
          collapsed
            ? styles.sidebarCollapsed
            : styles.sidebar
        }
        aria-label="Main navigation"
      >
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>
            {labels.app.title}
          </h2>
          <button
            className={styles.sidebarToggle}
            onClick={
              () => setCollapsed(!collapsed)
            }
            aria-label="Toggle sidebar"
            data-testid="sidebar-toggle"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li
              key={item.id}
              className={styles.navListItem}
            >
              <button
                className={
                  activeTab === item.id
                    ? styles.navActive
                    : styles.navItem
                }
                onClick={() => onTabChange(item.id)}
                aria-label={item.label}
                data-testid={`nav-${item.id}`}
              >
                {!collapsed && item.label}
              </button>
            </li>
          ))}
        </ul>
        <button
          className={styles.logoutBtn}
          onClick={onLogout}
          aria-label={labels.nav.logout}
          data-testid="logout-button"
        >
          {!collapsed && labels.nav.logout}
        </button>
      </nav>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
