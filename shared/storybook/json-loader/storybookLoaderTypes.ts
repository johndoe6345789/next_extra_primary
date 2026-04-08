/** Full Storybook story definition. */
export interface StorybookDefinition {
  $schema: string
  featured?: boolean
  excludeFromDiscovery?: boolean
  category?: string
  title?: string
  description?: string
  stories: Story[]
  renders?: Record<string, RenderMetadata>
  defaultContext?: Record<string, unknown>
  contextVariants?: ContextVariant[]
  scripts?: {
    renderFunctions?: string[]
    ignoredScripts?: string[]
  }
  argTypes?: Record<string, unknown>
  parameters?: Record<string, unknown>
}

/** Individual story definition. */
export interface Story {
  name: string
  render: string
  description?: string
  type?: string
  args?: Record<string, unknown>
  argTypes?: Record<string, unknown>
  parameters?: Record<string, unknown>
}

/** Render metadata for display. */
export interface RenderMetadata {
  description?: string
  featured?: boolean
}

/** Context variant for rendering. */
export interface ContextVariant {
  name: string
  description?: string
  context: Record<string, unknown>
}
