/**
 * DBAL fetch utility for workspace/workflow hooks
 */

/** Get DBAL API URL */
export const dbalUrl = () =>
  (typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_DBAL_API_URL) ||
  'http://localhost:8080'

/**
 * DBAL fetch helper
 */
export async function dbalFetch<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${dbalUrl()}/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body !== undefined
      ? JSON.stringify(body)
      : undefined,
  })
  if (!res.ok) {
    throw new Error(`DBAL ${res.status}`)
  }
  const json = (await res.json()) as Record<
    string, unknown
  >
  return ('data' in json ? json.data : json) as T
}

/** Get tenant ID from localStorage */
export function getTenantId(): string {
  if (typeof window !== 'undefined') {
    return (
      localStorage.getItem('tenantId') || 'default'
    )
  }
  return 'default'
}
