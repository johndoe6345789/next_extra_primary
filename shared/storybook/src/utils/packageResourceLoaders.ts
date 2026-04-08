/**
 * Resource loading helpers for package discovery.
 */

import type {
  ComponentDefinition,
  PermissionDefinition,
} from './packageDiscoveryTypes';

/** Result of loading components. */
interface ComponentsResult {
  components: ComponentDefinition[] | undefined;
  hasComponents: boolean;
}

/** Load components from a package. */
export async function loadComponents(
  packageId: string,
): Promise<ComponentsResult> {
  try {
    const resp = await fetch(
      `/packages/${packageId}/components/ui.json`,
    );
    if (resp.ok) {
      const data = await resp.json();
      const components =
        data.components || [];
      return {
        components,
        hasComponents: components.length > 0,
      };
    }
  } catch {
    // Components file doesn't exist
  }
  return {
    components: undefined,
    hasComponents: false,
  };
}

/** Result of loading permissions. */
interface PermissionsResult {
  permissions: PermissionDefinition[] | undefined;
  hasPermissions: boolean;
}

/** Load permissions from a package. */
export async function loadPermissions(
  packageId: string,
): Promise<PermissionsResult> {
  try {
    const resp = await fetch(
      `/packages/${packageId}`
      + `/permissions/roles.json`,
    );
    if (resp.ok) {
      const data = await resp.json();
      const permissions =
        data.permissions || [];
      return {
        permissions,
        hasPermissions: permissions.length > 0,
      };
    }
  } catch {
    // Permissions file doesn't exist
  }
  return {
    permissions: undefined,
    hasPermissions: false,
  };
}

/** Check if a package has styles. */
export async function checkStyles(
  packageId: string,
): Promise<boolean> {
  try {
    const resp = await fetch(
      `/packages/${packageId}/styles/index.json`,
    );
    return resp.ok;
  } catch {
    return false;
  }
}
