'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      setUser(JSON.parse(raw) as NavbarUser);
    }
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

/** Props for the NavLinks helper component. */
interface NavLinksProps {
  user: NavbarUser | null;
  onLogout: () => void;
}

/** Renders the navigation link list. */
function NavLinks({ user, onLogout }: NavLinksProps) {
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
