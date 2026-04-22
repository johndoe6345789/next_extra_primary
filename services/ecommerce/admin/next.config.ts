import path from 'path'
import type { NextConfig } from 'next'

/**
 * Next config for the shop-admin operator tool.
 * basePath is '/shop-admin' because nginx mounts
 * this app under /shop-admin in the portal.
 */
const monorepoRoot = path.resolve(__dirname, '../..')

const nextConfig: NextConfig = {
  basePath:
    process.env.NEXT_BASE_PATH || '/shop-admin',
  output: 'standalone',
  reactStrictMode: true,
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
    const backend =
      process.env.BACKEND_URL ||
      'http://localhost:8080'
    return [
      {
        source: '/shop-admin/api/:path*',
        destination: `${backend}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
