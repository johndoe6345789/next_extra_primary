import type { NextConfig } from 'next'

/**
 * Next config for the backups operator tool.
 * basePath is '/backups' because nginx mounts
 * this app under /backups in the portal.
 */
const nextConfig: NextConfig = {
  basePath: '/backups',
  output: 'standalone',
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
}

export default nextConfig
