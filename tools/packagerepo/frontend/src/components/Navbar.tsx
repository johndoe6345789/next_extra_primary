'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconButton, Menu } from '@metabuilder/m3';
import SiteDrawer from './SiteDrawer';
import NavLinks from './NavLinks';
import styles from './Navbar.module.scss';

/** Shape of the user object stored in localStorage. */
interface NavbarUser {
  username: string;
  scopes?: string[];
}

/** Top-level navigation bar with auth-aware links. */
export default function Navbar() {
  const [user, setUser] = useState<NavbarUser | null>(
    null,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (!raw) return;
    try {
      setUser(JSON.parse(raw) as NavbarUser);
    } catch { /* corrupt localStorage */ }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <nav
      className={styles.navbar}
      data-testid="navbar"
      aria-label="Main navigation"
    >
      <div className={styles.navbar__container}>
        <IconButton
          onClick={() => setDrawerOpen(true)}
          aria-label="Open site menu"
          style={{
            color: 'white',
            padding: 8,
            marginRight: 8,
          }}
        >
          <Menu />
        </IconButton>
        <SiteDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
        <Link
          href="/"
          className={styles.navbar__logo}
        >
          Package Repo
        </Link>
        <NavLinks
          user={user}
          onLogout={handleLogout}
        />
      </div>
    </nav>
  );
}
