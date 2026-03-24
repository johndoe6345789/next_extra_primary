import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Locale-aware navigation primitives created from the
 * shared routing configuration.
 *
 * Use these instead of Next.js built-in navigation
 * exports so that locale prefixes are handled
 * automatically.
 */
const nav = createNavigation(routing);

/** Locale-aware `<Link>` component. */
export const Link = nav.Link;

/** Locale-aware programmatic redirect (server). */
export const redirect = nav.redirect;

/** Locale-aware `usePathname` hook. */
export const usePathname = nav.usePathname;

/** Locale-aware `useRouter` hook. */
export const useRouter = nav.useRouter;

/**
 * Locale-aware permanent redirect (server).
 */
export const permanentRedirect = nav.permanentRedirect;

/** Resolve a locale-aware pathname string. */
export const getPathname = nav.getPathname;
