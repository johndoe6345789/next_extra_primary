import type {
  MockPackageDefinition,
} from './jsonLoaderTypes'

const mockPackages = new Map<
  string, MockPackageDefinition
>()

/**
 * Register a mock package by its ID.
 * @param pkg - The package definition.
 */
export function registerMockPackage(
  pkg: MockPackageDefinition
): void {
  if (!pkg.metadata?.packageId) return
  mockPackages.set(
    pkg.metadata.packageId, pkg
  )
}

/**
 * Get a mock package by ID.
 * @param packageId - The package identifier.
 * @returns The package or undefined.
 */
export function getMockPackage(
  packageId: string
): MockPackageDefinition | undefined {
  return mockPackages.get(packageId)
}

/**
 * List all registered mock packages.
 * @returns Array of all packages.
 */
export function listMockPackages():
  MockPackageDefinition[] {
  return Array.from(mockPackages.values())
}

/**
 * Get render descriptions for a package.
 * @param packageId - The package identifier.
 * @returns Map of render name to description.
 */
export function getRenderDescriptions(
  packageId: string
): Record<string, string> {
  const pkg = getMockPackage(packageId)
  if (!pkg) return {}
  const descriptions: Record<string, string> = {}
  for (const [name, render] of Object.entries(
    pkg.renders
  )) {
    descriptions[name] =
      render.description || ''
  }
  return descriptions
}
