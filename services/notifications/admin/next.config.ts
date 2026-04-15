import type { NextConfig } from 'next'

/**
 * Next config for the notifications operator
 * tool.  basePath is '/notifications' because
 * nginx mounts this app under /notifications
 * in the portal.
 */
const nextConfig: NextConfig = {
  basePath: '/notifications',
  output: 'standalone',
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
}

export default nextConfig
