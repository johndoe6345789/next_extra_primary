import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const monorepoRoot = path.resolve(__dirname, "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/emailclient",
  output: "standalone",
  reactStrictMode: true,
  productionBrowserSourceMaps: false,

  // Resolve SCSS @use 'cdk' from m3 components
  sassOptions: {
    includePaths: [
      path.join(monorepoRoot, "shared", "scss"),
      path.join(monorepoRoot, "shared", "scss", "m3-scss"),
    ],
    loadPaths: [
      path.join(monorepoRoot, "shared", "scss", "m3-scss"),
      path.join(monorepoRoot, "shared", "scss"),
    ],
  },

  transpilePackages: [
    "@shared/m3",
    "@shared/hooks",
    "@shared/hooks-canvas",
    "@shared/redux-core",
    "@shared/redux-slices",
    "@shared/service-adapters",
  ],

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // API proxy for development
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: "/api/v1/:path*",
          destination: "http://localhost:3001/api/v1/:path*",
          has: [
            {
              type: "query",
              key: "bypass",
              value: "false",
            },
          ],
        },
      ],
    };
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_BASE_URL || "http://localhost:3000",
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
        ],
      },
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Content Security Policy
  async redirects() {
    return [
      {
        source: "/email",
        destination: "/",
        permanent: false,
      },
    ];
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,

  // Custom server logs
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  // Experimental features (optional)
  experimental: {
    optimizePackageImports: ["@shared/m3"],
  },

  turbopack: {
    root: monorepoRoot,
  },
};

export default nextConfig;
