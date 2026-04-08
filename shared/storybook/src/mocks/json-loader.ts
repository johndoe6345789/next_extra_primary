/**
 * JSON Mock Loader
 *
 * Loads mock package definitions from JSON
 * files. No manual TypeScript registration
 * needed - just add a JSON file!
 */

import type { JsonMockPackage }
  from './schema'
import { registerMockPackage }
  from './mockRegistry'

export type {
  RenderContext, MockResult,
  MockPackageDefinition, JsonMockRender,
} from './jsonLoaderTypes'
export {
  registerMockPackage, getMockPackage,
  listMockPackages, getRenderDescriptions,
} from './mockRegistry'
export {
  executeJsonMock, executeMockRender,
  createDefaultContext,
} from './mockExecutor'

import dashboardMock from '../../../../packages/storybook-mock-dashboard/dashboard.json'
import dataTableMock from '../../../../packages/storybook-mock-data-table/data_table.json'
import navMenuMock from '../../../../packages/storybook-mock-nav-menu/nav_menu.json'
import uiLevel4Mock from '../../../../packages/storybook-mock-ui-level4/ui_level4.json'
import uiLoginMock from '../../../../packages/storybook-mock-ui-login/ui_login.json'
import userManagerMock from '../../../../packages/storybook-mock-user-manager/user_manager.json'

/** Register all JSON mock packages. */
export function registerJsonMocks(): void {
  const jsonMocks: JsonMockPackage[] = [
    dashboardMock as unknown as JsonMockPackage,
    dataTableMock as unknown as JsonMockPackage,
    navMenuMock as unknown as JsonMockPackage,
    uiLevel4Mock as unknown as JsonMockPackage,
    uiLoginMock as unknown as JsonMockPackage,
    userManagerMock as unknown as JsonMockPackage,
  ]
  for (const json of jsonMocks) {
    registerMockPackage({
      metadata: json.metadata,
      renders: Object.fromEntries(
        Object.entries(json.renders).map(
          ([name, render]) => [name, {
            component: render.component,
            description: render.description,
          }]
        )
      ),
    })
  }
}
