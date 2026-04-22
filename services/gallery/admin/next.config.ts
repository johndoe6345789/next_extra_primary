/**
 * Next.js config for the Gallery operator tool.
 * Runs behind the portal at /gallery.
 */

import path from 'path'
import type { NextConfig } from 'next'

const monorepoRoot = path.resolve(__dirname, '../..')

const nextConfig: NextConfig = {
  basePath:
    process.env.NEXT_BASE_PATH || '/gallery',
  output: 'standalone',
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
    includePaths: [
      path.join(monorepoRoot, 'shared/scss'),
      path.join(
        monorepoRoot, 'shared/scss/m3-scss',
      ),
    ],
    loadPaths: [
      path.join(
        monorepoRoot, 'shared/scss/m3-scss',
      ),
      path.join(monorepoRoot, 'shared/scss'),
    ],
  },
  transpilePackages: [
    '@shared/m3',
    '@shared/components',
    '@shared/hooks',
    '@shared/icons',
    '@shared/scss',
  ],
  turbopack: { root: monorepoRoot },
  async rewrites() {
    const api =
      process.env.BACKEND_API_URL ||
      'http://backend:8080'
    return [
      {
        source: '/api/gallery/:path*',
        destination:
          `${api}/api/gallery/:path*`,
      },
    ]
  },
}

export default nextConfig
