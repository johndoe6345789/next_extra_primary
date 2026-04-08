/**
 * Package discovery for Playwright JSON tests.
 */

import { readFile, readdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import type { PlaywrightTestDefinition } from './types'

/**
 * Discover all packages with test definitions.
 *
 * @param packagesDir - Base packages directory.
 * @returns Array of package names with tests.
 */
export async function discoverTestPackages(
  packagesDir: string,
): Promise<string[]> {
  const packages: string[] = []

  if (!existsSync(packagesDir)) {
    return packages
  }

  const dirs = await readdir(
    packagesDir, { withFileTypes: true },
  )

  for (const dir of dirs) {
    if (dir.isDirectory()) {
      const testPath = join(
        packagesDir,
        dir.name,
        'playwright',
        'tests.json',
      )
      if (existsSync(testPath)) {
        packages.push(dir.name)
      }
    }
  }

  return packages
}

/**
 * Load test definition from a package.
 *
 * @param packageName - Package directory name.
 * @param packagesDir - Base packages directory.
 */
export async function loadTestDefinition(
  packageName: string,
  packagesDir: string,
): Promise<PlaywrightTestDefinition> {
  const testPath = join(
    packagesDir,
    packageName,
    'playwright',
    'tests.json',
  )
  const content = await readFile(testPath, 'utf-8')
  return JSON.parse(content)
}
