import type { NextConfig } from 'next';

const backend =
  process.env.BACKEND_URL || 'http://localhost:5060';

const nextConfig: NextConfig = {
  output: 'standalone',
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  async rewrites() {
    return [
      {
        source: '/api/pgadmin/:path*',
        destination: `${backend}/api/:path*`,
      },
      {
        source: '/api/health',
        destination: `${backend}/health`,
      },
    ];
  },
};

export default nextConfig;
