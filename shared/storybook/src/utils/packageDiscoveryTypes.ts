/**
 * Type definitions for the package discovery
 * system.
 */

/** Package metadata from package.json. */
export interface PackageMetadata {
  packageId: string;
  name: string;
  description: string;
  version: string;
  author?: string;
  license?: string;
  category?: string;
  icon?: string;
  minLevel?: number;
  primary?: boolean;
  dependencies?: Record<string, string>;
  exports?: {
    components?: string[];
    scripts?: string[];
    types?: string[];
  };
  storybook?: {
    featured?: boolean;
    excludeFromDiscovery?: boolean;
    stories?: unknown[];
  };
}

/** Component definition from ui.json. */
export interface ComponentDefinition {
  id: string;
  name: string;
  description?: string;
  props?: unknown[];
  render?: unknown;
}

/** Permission definition from roles.json. */
export interface PermissionDefinition {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  scope?: string;
  minLevel?: number;
}

/** Discovered package with resource flags. */
export interface DiscoveredPackage {
  id: string;
  metadata: PackageMetadata;
  hasComponents: boolean;
  hasPermissions: boolean;
  hasStyles: boolean;
  hasStorybook: boolean;
  components?: ComponentDefinition[];
  permissions?: PermissionDefinition[];
}
