import type { RenderContext }
  from './jsonLoaderTypes'

/**
 * Create a default render context.
 * @returns Default context with guest user.
 */
export function createDefaultContext():
  RenderContext {
  return {
    user: {
      id: 'guest',
      username: 'guest',
      email: 'guest@example.com',
      level: 1,
    },
    tenant: {
      id: 'default',
      name: 'Default Tenant',
    },
    nerdMode: false,
    theme: 'light',
  }
}
