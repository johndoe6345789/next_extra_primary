/**
 * Docker service startup for package e2e tests.
 */

import { DockerComposeEnvironment, Wait }
  from 'testcontainers';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readPackageE2eConfig }
  from './package-setup-reader';

const __dirname = dirname(fileURLToPath(
  import.meta.url,
));

/** Check if a URL is already reachable. */
async function isReachable(
  url: string,
): Promise<boolean> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(3000),
    });
    return res.status < 500;
  } catch {
    return false;
  }
}

/**
 * Start Docker services for a package.
 *
 * @param packageName - Package name.
 * @returns Teardown function to stop services.
 */
export async function startPackageServices(
  packageName: string,
): Promise<() => Promise<void>> {
  const config =
    readPackageE2eConfig(packageName);
  if (!config || config.services.length === 0) {
    console.log(
      `[setup] No services for ${packageName}`,
    );
    return async () => {};
  }

  const baseURL =
    config.baseURL ?? 'http://localhost:8889';
  if (await isReachable(baseURL)) {
    console.log(
      `[setup] ${baseURL} reachable - skipping`,
    );
    return async () => {};
  }

  const composeDir = resolve(__dirname, '../..');
  const { services } = config;
  console.log(
    `[setup] Starting: ${services.join(', ')}`,
  );

  let builder = new DockerComposeEnvironment(
    composeDir, 'docker-compose.yml',
  ).withStartupTimeout(180_000);

  if (services.includes('portal')) {
    builder = builder.withWaitStrategy(
      'portal',
      Wait.forLogMessage(/start worker process/),
    );
  }

  const env = await builder.up(services);
  console.log(`[setup] Services healthy`);

  return async () => {
    await env.down();
    console.log(`[teardown] Services stopped`);
  };
}
