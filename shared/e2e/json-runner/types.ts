/**
 * Type definitions for JSON Playwright test runner.
 */

export interface PlaywrightTestDefinition {
  $schema: string
  package: string
  version?: string
  description?: string
  baseURL?: string
  setup?: {
    beforeAll?: SetupStep[]
    beforeEach?: SetupStep[]
    afterEach?: SetupStep[]
    afterAll?: SetupStep[]
  }
  fixtures?: Record<string, unknown>
  tests: TestCase[]
}

export interface SetupStep {
  action: string
  description?: string
  [key: string]: unknown
}

export interface TestCase {
  name: string
  description?: string
  skip?: boolean
  only?: boolean
  timeout?: number
  retries?: number
  tags?: string[]
  fixtures?: Record<string, unknown>
  steps: TestStep[]
}

export interface TestStep {
  description?: string
  action: string
  url?: string
  selector?: string
  role?: string
  text?: string
  label?: string
  placeholder?: string
  testId?: string
  value?: unknown
  key?: string
  timeout?: number
  assertion?: Assertion
  state?: string
  path?: string
  fullPage?: boolean
  script?: string
  condition?: string
}

export interface Assertion {
  matcher: string
  expected?: unknown
  not?: boolean
  timeout?: number
}
