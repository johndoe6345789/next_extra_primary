/**
 * Package filtering and grouping utilities.
 */

import type { DiscoveredPackage }
  from './packageDiscoveryTypes';
import { discoverAllPackages } from './packageDiscovery';

/** Discover packages that have styles. */
export async function discoverPackagesWithStyles(
): Promise<string[]> {
  const packages = await discoverAllPackages();
  return packages
    .filter((pkg) => pkg.hasStyles)
    .map((pkg) => pkg.id);
}

/** Discover packages that have components. */
export async function discoverPackagesWithComponents(
): Promise<string[]> {
  const packages = await discoverAllPackages();
  return packages
    .filter((pkg) => pkg.hasComponents)
    .map((pkg) => pkg.id);
}

/** Discover packages that have permissions. */
export async function discoverPackagesWithPermissions(
): Promise<string[]> {
  const packages = await discoverAllPackages();
  return packages
    .filter((pkg) => pkg.hasPermissions)
    .map((pkg) => pkg.id);
}

/** Discover packages with Storybook config. */
export async function discoverPackagesWithStorybook(
): Promise<DiscoveredPackage[]> {
  const packages = await discoverAllPackages();
  return packages.filter(
    (pkg) => pkg.hasStorybook,
  );
}

/** Group packages by category. */
export async function getPackagesByCategory(
): Promise<Record<string, DiscoveredPackage[]>> {
  const packages = await discoverAllPackages();

  return packages.reduce((acc, pkg) => {
    const cat =
      pkg.metadata.category || 'uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(pkg);
    return acc;
  }, {} as Record<string, DiscoveredPackage[]>);
}

/** Group packages by minimum level. */
export async function getPackagesByLevel(
): Promise<Record<number, DiscoveredPackage[]>> {
  const packages = await discoverAllPackages();

  return packages.reduce((acc, pkg) => {
    const level = pkg.metadata.minLevel || 0;
    if (!acc[level]) acc[level] = [];
    acc[level].push(pkg);
    return acc;
  }, {} as Record<number, DiscoveredPackage[]>);
}
