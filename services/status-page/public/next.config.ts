import type { NextConfig } from 'next'

/**
 * Next config for the public status tool.
 * basePath is '/status' because nginx mounts
 * this app under /status in the portal. This
 * is the only tool that is NOT SSO-gated —
 * status pages must stay publicly reachable.
 */
const nextConfig: NextConfig = {
  basePath: process.env.NEXT_BASE_PATH || '/status',
  output: 'standalone',
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
}

export default nextConfig
