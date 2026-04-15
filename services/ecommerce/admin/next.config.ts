import type { NextConfig } from 'next'

/**
 * Next config for the shop-admin operator tool.
 * basePath is '/shop-admin' because nginx mounts
 * this app under /shop-admin in the portal.
 */
const nextConfig: NextConfig = {
  basePath: '/shop-admin',
  output: 'standalone',
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
}

export default nextConfig
