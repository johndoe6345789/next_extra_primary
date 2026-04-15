import type { NextConfig } from 'next'

/**
 * Next config for the image-processor operator
 * tool. basePath matches nginx `/image-processor`.
 */
const nextConfig: NextConfig = {
  basePath: '/image-processor',
  output: 'standalone',
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
}

export default nextConfig
