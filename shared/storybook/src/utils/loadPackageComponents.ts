/**
 * Dynamic Package Component Loader
 *
 * Loads component definitions from packages and
 * generates React components from metadata.
 */

export type {
  ComponentDefinition,
  PackageComponents,
} from './loadPackageComponentTypes';

export { renderComponentDefinition }
  from './renderComponentDef';

import type { PackageComponents }
  from './loadPackageComponentTypes';

/** Load components.json from a package. */
export async function loadPackageComponents(
  packageId: string,
): Promise<PackageComponents | null> {
  try {
    const response = await fetch(
      `/packages/${packageId}/seed/components.json`,
    );
    if (!response.ok) {
      console.warn(
        `No components.json found for `
        + `package: ${packageId}`,
      );
      return null;
    }

    const data = await response.json();
    return {
      packageId,
      components: data.components || data,
    };
  } catch (error) {
    console.error(
      `Failed to load components for `
      + `${packageId}:`,
      error,
    );
    return null;
  }
}

/** Load components from multiple packages. */
export async function loadMultiplePackageComponents(
  packageIds: string[],
): Promise<Record<string, PackageComponents>> {
  const results = await Promise.all(
    packageIds.map(
      (id) => loadPackageComponents(id),
    ),
  );

  return results.reduce((acc, result) => {
    if (result) {
      acc[result.packageId] = result;
    }
    return acc;
  }, {} as Record<string, PackageComponents>);
}
