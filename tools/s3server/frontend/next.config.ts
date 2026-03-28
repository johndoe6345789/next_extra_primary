import type { NextConfig } from 'next';

const backend =
  process.env.BACKEND_URL || 'http://localhost:9000';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/s3/health',
        destination: `${backend}/health`,
      },
      {
        source: '/api/s3/buckets',
        destination: `${backend}/`,
      },
      {
        source: '/api/s3/buckets/:bucket',
        destination: `${backend}/:bucket`,
      },
      {
        source: '/api/s3/list/:bucket',
        destination: `${backend}/list/:bucket`,
      },
      {
        source: '/api/s3/objects/:bucket/:key*',
        destination: `${backend}/:bucket/:key*`,
      },
    ];
  },
};

export default nextConfig;
