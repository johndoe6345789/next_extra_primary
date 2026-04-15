import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const monorepoRoot = path.resolve(__dirname, '../../..');

const backend =
  process.env.BACKEND_URL || 'http://localhost:8080';

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_BASE_PATH || '',
  output: 'standalone',
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
    includePaths: [
      path.join(monorepoRoot, 'shared/scss'),
      path.join(
        monorepoRoot, 'shared/scss/m3-scss',
      ),
    ],
  },
  transpilePackages: ['@shared/m3'],
  turbopack: { root: monorepoRoot },
  async rewrites() {
    return [
      {
        source: '/api/docs/:path*',
        destination: `${backend}/api/docs/:path*`,
      },
    ];
  },
};

export default nextConfig;
