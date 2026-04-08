/**
 * JSON Storybook Story Loader
 *
 * Directly loads and renders Storybook stories
 * from JSON definitions without code generation.
 */

export type {
  StorybookDefinition, Story,
  RenderMetadata, ContextVariant,
} from './storybookLoaderTypes'

export {
  discoverStoryPackages,
  loadStoryDefinition,
  loadAllStoryDefinitions,
} from './storybookDiscovery'

import type { StorybookDefinition, Story }
  from './storybookLoaderTypes'

/**
 * Get story metadata for display.
 * @param storyDef - The story definition.
 * @returns Formatted metadata object.
 */
export function getStoryMeta(
  storyDef: StorybookDefinition
) {
  return {
    title: storyDef.category
      ? `${storyDef.category}/${storyDef.title || storyDef.$schema}`
      : storyDef.title || storyDef.$schema,
    description: storyDef.description,
    parameters: storyDef.parameters,
    argTypes: storyDef.argTypes,
  }
}

/**
 * Find a story by name.
 * @param storyDef - The story definition.
 * @param storyName - Name to search for.
 * @returns The matching story or undefined.
 */
export function findStory(
  storyDef: StorybookDefinition,
  storyName: string
): Story | undefined {
  return storyDef.stories.find(
    (s) => s.name === storyName
  )
}

/**
 * Get all stories from a definition.
 * @param storyDef - The story definition.
 * @returns Array of all stories.
 */
export function getAllStories(
  storyDef: StorybookDefinition
): Story[] {
  return storyDef.stories
}
