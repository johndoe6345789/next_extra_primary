'use client';

import Link from 'next/link';
import styles from './Navbar.module.scss';

/** Shape of the user object for nav display. */
interface NavbarUser {
  username: string;
  scopes?: string[];
}

/** Props for the NavLinks component. */
interface NavLinksProps {
  user: NavbarUser | null;
  onLogout: () => void;
}

/** Renders the navigation link list. */
export default function NavLinks(
  { user, onLogout }: NavLinksProps,
) {
  return (
    <ul className={styles.navbar__nav}>
      <li>
        <Link
          href="/"
          className={styles.navbar__link}
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          href="/browse"
          className={styles.navbar__link}
        >
          Browse
        </Link>
      </li>
      {user && (
        <li>
          <Link
            href="/publish"
            className={styles.navbar__link}
          >
            Publish
          </Link>
        </li>
      )}
      <li>
        <Link
          href="/docs"
          className={styles.navbar__link}
        >
          Docs
        </Link>
      </li>
      {user ? (
        <>
          {user.scopes?.includes('admin') && (
            <li>
              <Link
                href="/admin"
                className={styles.navbar__link}
              >
                Admin
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/account"
              className={styles.navbar__link}
            >
              Account ({user.username})
            </Link>
          </li>
          <li>
            <button
              onClick={onLogout}
              className={styles.navbar__button}
              aria-label="Logout"
            >
              Logout
            </button>
          </li>
        </>
      ) : (
        <li>
          <Link
            href="/login"
            className={styles.navbar__link}
          >
            Login
          </Link>
        </li>
      )}
    </ul>
  );
}
