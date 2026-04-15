import type { NextConfig } from 'next'

/**
 * Next config for the streams operator tool.
 * basePath is '/streams' because nginx mounts
 * this app under /streams in the portal.
 */
const nextConfig: NextConfig = {
  basePath: '/streams',
  output: 'standalone',
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
}

export default nextConfig
