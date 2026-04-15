import type { NextConfig } from 'next'

/**
 * Next config for the polls operator tool.
 * basePath is '/polls' because nginx mounts
 * this app under /polls in the portal.
 */
const nextConfig: NextConfig = {
  basePath: '/polls',
  output: 'standalone',
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
}

export default nextConfig
