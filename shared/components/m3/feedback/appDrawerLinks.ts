/**
 * Default cross-app link list for the shared
 * AppDrawer. Each tool can override by passing
 * its own `links` prop.
 *
 * Paths are absolute through the nginx portal.
 */

/** A single link in the AppDrawer. */
export interface AppLink {
  /** Stable identifier. */
  key: string
  /** Display label. */
  label: string
  /** Optional secondary text. */
  description?: string
  /** Absolute portal path. */
  path: string
}

/** Standard app list shown in every tool. */
export const APP_LINKS: AppLink[] = [
  {
    key: 'app',
    label: 'Nextra',
    description: 'Main application',
    path: '/app/en',
  },
  {
    key: 'emailclient',
    label: 'Email',
    description: 'Webmail client',
    path: '/emailclient',
  },
  {
    key: 'alerts',
    label: 'Alerts',
    description: 'Unified alerts centre',
    path: '/alerts',
  },
  {
    key: 'repo',
    label: 'Package Repo',
    description: 'NPM package registry',
    path: '/repo',
  },
  {
    key: 's3',
    label: 'S3 Browser',
    description: 'Object storage',
    path: '/s3',
  },
  {
    key: 'db',
    label: 'pgAdmin',
    description: 'PostgreSQL admin',
    path: '/db',
  },
  {
    key: 'sso',
    label: 'SSO',
    description: 'Sign-in portal',
    path: '/sso',
  },
]
