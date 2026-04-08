/**
 * Package Discovery System
 *
 * Discovers all packages and loads their metadata,
 * components, permissions, and other resources.
 */

export type {
  PackageMetadata,
  ComponentDefinition,
  PermissionDefinition,
  DiscoveredPackage,
} from './packageDiscoveryTypes';

export {
  discoverPackagesWithStyles,
  discoverPackagesWithComponents,
  discoverPackagesWithPermissions,
  discoverPackagesWithStorybook,
  getPackagesByCategory,
  getPackagesByLevel,
} from './packageDiscoveryFilters';

export { loadPackage } from './loadSinglePackage';

import type { DiscoveredPackage }
  from './packageDiscoveryTypes';
import {
  getKnownPackageIds,
} from './knownPackageIds';
import { loadPackage } from './loadSinglePackage';

/** Discover all packages by loading metadata. */
export async function discoverAllPackages(
): Promise<DiscoveredPackage[]> {
  try {
    const indexResponse = await fetch(
      '/packages-index.json',
    );

    let packageIds: string[] = [];

    if (indexResponse.ok) {
      const data = await indexResponse.json();
      packageIds = data.packages || [];
    } else {
      packageIds = getKnownPackageIds();
    }

    const packages = await Promise.all(
      packageIds.map(async (id) => {
        try {
          return await loadPackage(id);
        } catch (error) {
          console.warn(
            `Failed to load package ${id}:`,
            error,
          );
          return null;
        }
      }),
    );

    return packages.filter(
      (pkg): pkg is DiscoveredPackage =>
        pkg !== null,
    );
  } catch (error) {
    console.error(
      'Package discovery failed:', error,
    );
    return [];
  }
}
