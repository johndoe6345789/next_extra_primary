import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/**
 * Next.js configuration with next-intl integration,
 * standalone output for Docker deployments, and
 * remote image pattern support.
 */
/** Backend URL for API proxy rewrites. */
const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8080';

const nextConfig: NextConfig = {
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
