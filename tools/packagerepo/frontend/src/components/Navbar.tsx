'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { theme } from '@/theme/theme';
import SiteDrawer from './SiteDrawer';
import styles from './Navbar.module.scss';

/** Shape of the user object stored in localStorage. */
interface NavbarUser {
  username: string;
  scopes?: string[];
}

/** Top-level navigation bar with auth-aware links. */
export default function Navbar() {
  const [user, setUser] = useState<NavbarUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (!raw) return;
    try {
      setUser(JSON.parse(raw) as NavbarUser);
    } catch { /* corrupt localStorage — ignore */ }
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
            style={{
              color: 'white',
              padding: 8,
              marginRight: 8,
            }}
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
        <NavLinks
          user={user}
          onLogout={handleLogout}
        />
      </div>
    </nav>
  );
}

/** Renders the navigation link list. */
function NavLinks({ user, onLogout }: {
  user: NavbarUser | null;
  onLogout: () => void;
}) {
  return (
    <ul className={styles.navbar__nav}>
      <li><Link href="/" className={styles.navbar__link}>Home</Link></li>
      <li><Link href="/browse" className={styles.navbar__link}>Browse</Link></li>
      {user && <li><Link href="/publish" className={styles.navbar__link}>Publish</Link></li>}
      <li><Link href="/docs" className={styles.navbar__link}>Docs</Link></li>
      {user ? (
        <>
          {user.scopes?.includes('admin') && (
            <li><Link href="/admin" className={styles.navbar__link}>Admin</Link></li>
          )}
          <li><Link href="/account" className={styles.navbar__link}>Account ({user.username})</Link></li>
          <li><button onClick={onLogout} className={styles.navbar__button} aria-label="Logout">Logout</button></li>
        </>
      ) : (
        <li><Link href="/login" className={styles.navbar__link}>Login</Link></li>
      )}
    </ul>
  );
}
