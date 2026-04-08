import { readFile, readdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import type { StorybookDefinition }
  from './storybookLoaderTypes'

/**
 * Discover all packages with Storybook story
 * definitions.
 * @param packagesDir - Root packages directory.
 * @returns List of package names.
 */
export async function discoverStoryPackages(
  packagesDir: string
): Promise<string[]> {
  const packages: string[] = []
  if (!existsSync(packagesDir)) return packages
  const packageDirs = await readdir(
    packagesDir, { withFileTypes: true }
  )
  for (const dir of packageDirs) {
    if (dir.isDirectory()) {
      const storyPath = join(
        packagesDir, dir.name,
        'storybook', 'stories.json'
      )
      if (existsSync(storyPath)) {
        packages.push(dir.name)
      }
    }
  }
  return packages
}

/**
 * Load story definition from package.
 * @param packageName - Package directory name.
 * @param packagesDir - Root packages directory.
 * @returns Parsed story definition.
 */
export async function loadStoryDefinition(
  packageName: string,
  packagesDir: string
): Promise<StorybookDefinition> {
  const storyPath = join(
    packagesDir, packageName,
    'storybook', 'stories.json'
  )
  const content = await readFile(
    storyPath, 'utf-8'
  )
  return JSON.parse(content)
}

/**
 * Load all story definitions.
 * @param packagesDir - Root packages directory.
 * @returns Map of package name to definition.
 */
export async function loadAllStoryDefinitions(
  packagesDir: string
): Promise<Map<string, StorybookDefinition>> {
  const packages = await discoverStoryPackages(
    packagesDir
  )
  const defs = new Map<
    string, StorybookDefinition
  >()
  for (const name of packages) {
    const storyDef = await loadStoryDefinition(
      name, packagesDir
    )
    defs.set(name, storyDef)
  }
  return defs
}
