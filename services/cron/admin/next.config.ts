import type { NextConfig } from 'next'

/**
 * Next config for the cron operator tool.
 * basePath is '/cron' because nginx mounts
 * this app under /cron in the portal.
 */
const nextConfig: NextConfig = {
  basePath: '/cron',
  output: 'standalone',
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
}

export default nextConfig
