import path from "path";
import { fileURLToPath } from "url";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(
  "./src/i18n/request.ts",
);

const __filename = fileURLToPath(
  import.meta.url,
);
const __dirname = path.dirname(__filename);
const monorepoRoot = path.resolve(
  __dirname, "../../..",
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath:
    process.env.NEXT_BASE_PATH || "/alerts",
  output: "standalone",
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
    includePaths: [
      path.join(
        monorepoRoot, "shared/scss",
      ),
      path.join(
        monorepoRoot, "shared/scss/m3-scss",
      ),
    ],
    loadPaths: [
      path.join(
        monorepoRoot, "shared/scss/m3-scss",
      ),
      path.join(
        monorepoRoot, "shared/scss",
      ),
    ],
  },
  transpilePackages: [
    "@shared/m3",
    "@shared/components",
    "@shared/hooks",
    "@shared/hooks-canvas",
    "@shared/icons",
    "@shared/redux-core",
    "@shared/redux-slices",
    "@shared/scss",
    "@shared/service-adapters",
  ],
  turbopack: { root: monorepoRoot },
  async rewrites() {
    const emailApi =
      process.env.EMAIL_API_URL ||
      "http://localhost:8500";
    return [
      {
        source: "/api/email/:path*",
        destination:
          `${emailApi}/api/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
