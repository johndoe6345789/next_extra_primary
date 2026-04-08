/**
 * Package e2e config reader.
 */

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import type {
  PackageE2eConfig, PackageJson,
} from './package-setup-types';

const __dirname = dirname(fileURLToPath(
  import.meta.url,
));

/**
 * Read e2e config from a package directory.
 *
 * @param packageName - Package name.
 * @returns The e2e config, or undefined.
 */
export function readPackageE2eConfig(
  packageName: string,
): PackageE2eConfig | undefined {
  const pkgPath = resolve(
    __dirname, '../packages',
    packageName, 'package.json',
  );
  try {
    const raw = readFileSync(pkgPath, 'utf-8');
    const pkg = JSON.parse(raw) as PackageJson;
    return pkg.e2e;
  } catch {
    return undefined;
  }
}
