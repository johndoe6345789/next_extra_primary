'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { theme } from '@/theme/theme';
import SiteDrawer from './SiteDrawer';
import NavLinks, { type NavbarUser } from './NavLinks';
import styles from './Navbar.module.scss';

/** Top-level navigation bar with auth-aware links. */
export default function Navbar() {
  const [user, setUser] = useState<NavbarUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const syncUser = () => {
      const raw = localStorage.getItem('user');
      if (!raw) { setUser(null); return; }
      try {
        setUser(JSON.parse(raw) as NavbarUser);
      } catch { /* corrupt localStorage — ignore */ }
    };
    syncUser();
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
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
        <ThemeProvider theme={theme}>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            aria-label="Open site menu"
            style={{ color: 'white', padding: 8, marginRight: 8 }}
          >
            <MenuIcon />
          </IconButton>
          <SiteDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          />
        </ThemeProvider>
        <Link href="/" className={styles.navbar__logo}>
          Package Repo
        </Link>
        <NavLinks user={user} onLogout={handleLogout} />
      </div>
    </nav>
  );
}
