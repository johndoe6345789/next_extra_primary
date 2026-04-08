import type { JsonMockPackage } from './schema'

/** Context for rendering mock packages. */
export interface RenderContext {
  user?: {
    id?: string
    username?: string
    email?: string
    level?: number
  }
  tenant?: {
    id?: string
    name?: string
  }
  nerdMode?: boolean
  theme?: string
}

/** Result of executing a mock render. */
export interface MockResult {
  success: boolean
  result?: Record<string, unknown>
  error?: string
  logs: string[]
}

/** Internal mock package definition. */
export interface MockPackageDefinition {
  metadata: JsonMockPackage['metadata']
  renders: Record<string, JsonMockRender>
}

/** Render entry within a mock package. */
export interface JsonMockRender {
  component: JsonMockPackage[
    'renders'
  ][string]['component']
  description?: string
}
