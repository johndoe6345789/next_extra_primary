import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/**
 * Next.js configuration with next-intl integration,
 * standalone output for Docker deployments, and
 * remote image pattern support.
 */
/** Backend URL for API proxy rewrites. */
const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8080';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '..'),
  sassOptions: {
    includePaths: [
      path.join(__dirname, '..', 'shared', 'scss', 'm3-scss'),
      path.join(__dirname, '..', 'shared', 'scss'),
    ],
    loadPaths: [
      path.join(__dirname, '..', 'shared', 'scss', 'm3-scss'),
      path.join(__dirname, '..', 'shared', 'scss'),
    ],
  },
  transpilePackages: [
    '@metabuilder/m3',
    '@metabuilder/icons',
    '@metabuilder/components',
    '@metabuilder/hooks',
    '@metabuilder/redux-core',
    '@metabuilder/redux-slices',
    '@metabuilder/service-adapters',
    '@metabuilder/scss',
  ],
  experimental: {
    optimizePackageImports: [
      '@metabuilder/m3',
      '@metabuilder/icons',
      '@metabuilder/components',
      '@metabuilder/hooks',
    ],
  },
  basePath: process.env.NEXT_BASE_PATH || '',
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND}/api/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
