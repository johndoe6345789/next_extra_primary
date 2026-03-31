'use client';

import { useState } from 'react';
import { IconButton } from '@metabuilder/m3';
import { Menu as MenuIcon }
  from '@metabuilder/m3/icons';
import SiteDrawer
  from '@/components/molecules/SiteDrawer';
import navItems from '@/constants/nav-items.json';
import labels from '@/constants/ui-labels.json';
import shell
  from '@scss/atoms/pgadmin-shell.module.scss';
import sidebar
  from '@scss/atoms/pgadmin-sidebar.module.scss';

/** @brief Props for AppShell. */
interface AppShellProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const burgerStyle = { color: 'inherit', padding: 4 };

/** @brief Main layout with sidebar + content. */
export default function AppShell(
  { activeTab, onTabChange, onLogout, children }
    : AppShellProps,
) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const sidebarCls = collapsed
    ? sidebar.sidebarCollapsed : sidebar.sidebar;

  return (
    <div className={shell.appShell} data-testid="app-shell">
      <nav className={sidebarCls} aria-label="Main navigation">
        <div className={sidebar.sidebarHeader}>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            aria-label="Open site drawer"
            data-testid="site-drawer-toggle"
            style={burgerStyle}
          >
            <MenuIcon />
          </IconButton>
          <SiteDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          />
          <h2 className={sidebar.sidebarTitle}>
            {labels.app.title}
          </h2>
          <button
            className={sidebar.sidebarToggle}
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
            data-testid="sidebar-toggle"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
        <ul className={sidebar.navList}>
          {navItems.map((item) => (
            <li key={item.id} className={sidebar.navListItem}>
              <button
                className={
                  activeTab === item.id
                    ? sidebar.navActive : sidebar.navItem
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
          className={sidebar.logoutBtn}
          onClick={onLogout}
          aria-label={labels.nav.logout}
          data-testid="logout-button"
        >
          {!collapsed && labels.nav.logout}
        </button>
      </nav>
      <main className={shell.content}>
        {children}
      </main>
    </div>
  );
}
