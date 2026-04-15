import type { NextConfig } from 'next'

/**
 * Next config for the webhooks operator tool.
 * basePath is '/webhooks' because nginx mounts
 * this app under /webhooks in the portal.
 */
const nextConfig: NextConfig = {
  basePath: '/webhooks',
  output: 'standalone',
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
}

export default nextConfig
