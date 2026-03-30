import type { NextConfig } from 'next';

/** Rewrite rule for proxying to the backend. */
interface RewriteRule {
  readonly source: string;
  readonly destination: string;
}

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_BASE_PATH || '',
  output: 'standalone',
  async rewrites(): Promise<RewriteRule[]> {
    const backendUrl =
      process.env.BACKEND_URL ?? 'http://localhost:5050';

    return [
      {
        source: '/auth/:path*',
        destination: `${backendUrl}/auth/:path*`,
      },
      {
        source: '/v1/:path*',
        destination: `${backendUrl}/v1/:path*`,
      },
      {
        source: '/admin/:path*',
        destination: `${backendUrl}/admin/:path*`,
      },
      {
        source: '/health',
        destination: `${backendUrl}/health`,
      },
      {
        source: '/schema',
        destination: `${backendUrl}/schema`,
      },
    ];
  },
};

export default nextConfig;
