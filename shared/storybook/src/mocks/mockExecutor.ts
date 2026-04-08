import type { TemplateVariables }
  from './schema'
import { processTemplates } from './schema'
import type {
  RenderContext, MockResult,
} from './jsonLoaderTypes'
import { getMockPackage } from './mockRegistry'

/**
 * Execute a JSON mock render.
 * @param packageId - Package identifier.
 * @param scriptName - Render script name.
 * @param context - Render context.
 * @returns The mock render result.
 */
export function executeJsonMock(
  packageId: string,
  scriptName: string,
  context: RenderContext
): MockResult {
  const pkg = getMockPackage(packageId)
  if (!pkg) {
    return {
      success: false,
      error: `Package not found: ${packageId}`,
      logs: [],
    }
  }
  const render = pkg.renders[scriptName]
  if (!render) {
    return {
      success: false,
      error: `Render not found: ${scriptName}`,
      logs: [
        `Available: ${Object.keys(pkg.renders).join(', ')}`,
      ],
    }
  }
  const variables: TemplateVariables = {
    'user.username':
      context.user?.username ?? 'Guest',
    'user.email':
      context.user?.email ?? 'guest@example.com',
    'user.level': context.user?.level ?? 1,
    'user.id': context.user?.id ?? 'guest',
    'tenant.name':
      context.tenant?.name ?? 'Default',
    'tenant.id':
      context.tenant?.id ?? 'default',
    'nerdMode': context.nerdMode ?? false,
    'theme': context.theme ?? 'light',
  }
  return {
    success: true,
    result: processTemplates(
      render.component, variables
    ),
    logs: [],
  }
}

/**
 * Alias for executeJsonMock.
 * @param packageId - Package identifier.
 * @param scriptName - Render script name.
 * @param context - Render context.
 * @returns The mock render result.
 */
export function executeMockRender(
  packageId: string,
  scriptName: string,
  context: RenderContext
): MockResult {
  return executeJsonMock(
    packageId, scriptName, context
  )
}

export {
  createDefaultContext,
} from './mockContext'
