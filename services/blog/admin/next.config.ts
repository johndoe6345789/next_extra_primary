import type { NextConfig } from 'next'

/**
 * Next config for the article/blog operator tool.
 * basePath is '/blog' because nginx mounts this
 * app under /blog in the portal.
 */
const nextConfig: NextConfig = {
  basePath: '/blog',
  output: 'standalone',
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
}

export default nextConfig
