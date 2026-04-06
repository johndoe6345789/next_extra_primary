/**
 * Package-aware Testcontainers setup.
 *
 * Reads e2e config from shared/packages/<name>/package.json and
 * starts only the declared Docker services for that package.
 *
 * Config shape (in package.json):
 *   "e2e": {
 *     "services": ["db", "backend", "frontend", "portal"],
 *     "baseURL": "http://localhost:8889"
 *   }
 */
import { DockerComposeEnvironment, Wait } from 'testcontainers';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Shape of the e2e key in a package.json. */
interface PackageE2eConfig {
  services: string[];
  baseURL?: string;
}

/** Shape of a package.json with optional e2e key. */
interface PackageJson {
  name?: string;
  e2e?: PackageE2eConfig;
}

/**
 * Read e2e config from a package directory.
 *
 * @param packageName - Name of the package under shared/packages.
 * @returns The e2e config, or undefined if not declared.
 */
export function readPackageE2eConfig(
  packageName: string,
): PackageE2eConfig | undefined {
  const pkgPath = resolve(
    __dirname,
    '../packages',
    packageName,
    'package.json',
  );
  try {
    const raw = readFileSync(pkgPath, 'utf-8');
    const pkg = JSON.parse(raw) as PackageJson;
    return pkg.e2e;
  } catch {
    return undefined;
  }
}

/**
 * Start Docker services declared in a package's e2e config.
 *
 * @param packageName - Name of the package under shared/packages.
 * @returns Teardown function to stop the environment.
 */
export async function startPackageServices(
  packageName: string,
): Promise<() => Promise<void>> {
  const config = readPackageE2eConfig(packageName);
  if (!config || config.services.length === 0) {
    console.log(`[setup] No services declared for ${packageName}`);
    return async () => {};
  }

  const composeDir = resolve(__dirname, '../..');
  const composeFile = 'docker-compose.yml';
  const { services } = config;

  console.log(
    `[setup] Starting services for ${packageName}: ${services.join(', ')}`,
  );

  let builder = new DockerComposeEnvironment(composeDir, composeFile)
    .withStartupTimeout(180_000);

  if (services.includes('portal')) {
    builder = builder.withWaitStrategy(
      'portal',
      Wait.forLogMessage(/start worker process/),
    );
  }

  const env = await builder.up(services);

  console.log(`[setup] Services healthy for ${packageName}`);

  return async () => {
    await env.down();
    console.log(`[teardown] Services stopped for ${packageName}`);
  };
}
