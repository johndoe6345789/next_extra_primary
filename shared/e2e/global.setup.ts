/**
 * Playwright global setup
 *
 * 1. Starts the full Docker stack (docker-compose.yml at project
 *    root) via Testcontainers — waits for the nginx portal to
 *    respond on port 80.
 * 2. Waits for the backend API healthz endpoint to be reachable.
 */
import { DockerComposeEnvironment, Wait } from 'testcontainers'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

let environment:
  | Awaited<ReturnType<DockerComposeEnvironment['up']>>
  | undefined

async function waitForServer(
  url: string,
  timeoutMs = 120_000,
): Promise<void> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: 'GET' })
      if (res.ok || res.status === 401 || res.status === 405) {
        return
      }
    } catch {
      // not ready yet
    }
    await new Promise(r => setTimeout(r, 2000))
  }
  throw new Error(
    `Server at ${url} did not become ready within ${timeoutMs}ms`,
  )
}

async function globalSetup() {
  // ── 1. Start Docker stack via Testcontainers ──────────────────
  console.log('[setup] Starting stack via Testcontainers...')
  const composeDir = resolve(__dirname, '../..')

  environment = await new DockerComposeEnvironment(
    composeDir,
    'docker-compose.yml',
  )
    .withWaitStrategy('portal', Wait.forHttp('/', 80))
    .withStartupTimeout(300_000)
    .up()

  console.log('[setup] Stack healthy')

  ;(globalThis as Record<string, unknown>).__TESTCONTAINERS_ENV__ =
    environment

  // ── 2. Wait for backend API ────────────────────────────────────
  const base =
    process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:8889'
  const healthUrl = new URL('/api/healthz', base).href

  console.log(`[setup] Waiting for API at ${healthUrl}...`)
  await waitForServer(healthUrl)
  console.log('[setup] Backend API ready')
}

export default globalSetup
