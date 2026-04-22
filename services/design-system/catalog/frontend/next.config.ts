import type { NextConfig } from 'next';
import path from 'path';

const monorepoRoot = path.resolve(__dirname, '../../..');

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
  transpilePackages: [
    '@shared/m3',
    '@shared/icons',
  ],
  turbopack: { root: monorepoRoot },
};

export default nextConfig;
