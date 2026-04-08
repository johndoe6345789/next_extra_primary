/**
 * Single package loader.
 */

import type {
  PackageMetadata,
  DiscoveredPackage,
} from './packageDiscoveryTypes';
import {
  loadComponents,
  loadPermissions,
  checkStyles,
} from './packageResourceLoaders';

/** Load a single package by its ID. */
export async function loadPackage(
  packageId: string,
): Promise<DiscoveredPackage> {
  const metaResp = await fetch(
    `/packages/${packageId}/package.json`,
  );
  if (!metaResp.ok) {
    throw new Error(
      `Failed to load package.json for `
      + `${packageId}`,
    );
  }
  const metadata: PackageMetadata =
    await metaResp.json();

  const { components, hasComponents } =
    await loadComponents(packageId);
  const { permissions, hasPermissions } =
    await loadPermissions(packageId);
  const hasStyles =
    await checkStyles(packageId);
  const hasStorybook = !!(
    metadata.storybook
    && !metadata.storybook.excludeFromDiscovery
  );

  return {
    id: packageId, metadata,
    hasComponents, hasPermissions,
    hasStyles, hasStorybook,
    components, permissions,
  };
}
