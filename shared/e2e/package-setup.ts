/**
 * Package-aware Testcontainers setup.
 *
 * Reads e2e config from shared/packages/<name>/
 * package.json and starts declared Docker services.
 */

export type { PackageE2eConfig }
  from './package-setup-types';
export { readPackageE2eConfig }
  from './package-setup-reader';
export { startPackageServices }
  from './package-setup-start';
