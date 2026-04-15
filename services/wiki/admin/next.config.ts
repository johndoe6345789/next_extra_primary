import type { NextConfig } from 'next'

/**
 * Next config for the collaborative wiki tool.
 * basePath is '/wiki' because nginx mounts this
 * app under /wiki in the portal.
 */
const nextConfig: NextConfig = {
  basePath: '/wiki',
  output: 'standalone',
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
}

export default nextConfig
