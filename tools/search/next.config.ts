import type { NextConfig } from 'next'

/**
 * Next config for the search operator tool.
 * basePath is '/search' because nginx mounts
 * this app at /search in the portal.
 */
const nextConfig: NextConfig = {
  basePath: '/search',
  output: 'standalone',
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
}

export default nextConfig
