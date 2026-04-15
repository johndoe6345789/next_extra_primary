import type { NextConfig } from 'next'

/**
 * Next config for the jobs operator tool.
 * basePath is '/jobs' because nginx mounts
 * this app under /jobs in the portal.
 */
const nextConfig: NextConfig = {
  basePath: '/jobs',
  output: 'standalone',
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
}

export default nextConfig
