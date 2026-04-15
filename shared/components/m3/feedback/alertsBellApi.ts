/**
 * Fetch helpers for the shared alerts bell.
 *
 * Talks to the email service via the nginx portal
 * route /mail-api/ so any tool can use it from any
 * basePath without custom rewrites.
 */

export const MAIL_API = '/mail-api/api'
export const HEADERS = { 'X-Tenant-Id': 'default' }

/** Minimal shape of a message row. */
export interface RawMessage {
  id: number
  subject?: string
  from?: string
  isRead?: boolean
  dateReceived?: string
}

/** Account summary from the email service. */
export interface RawAccount {
  id: number
}

/** Safely parse a JSON response; null on error. */
export async function fetchJson(
  url: string,
  init?: RequestInit,
): Promise<unknown> {
  try {
    const r = await fetch(url, {
      ...init,
      headers: { ...HEADERS, ...(init?.headers) },
    })
    if (!r.ok) return null
    return await r.json()
  } catch {
    return null
  }
}

/** List the tenant's email accounts. */
export async function listAccounts(): Promise<
  RawAccount[]
> {
  // Trailing slash matters — Flask redirects
  // otherwise and that confuses CORS / fetch.
  const r = (await fetchJson(
    `${MAIL_API}/accounts/`,
  )) as RawAccount[] | null
  return r ?? []
}

/** List inbox messages for an account. */
export async function listInbox(
  accountId: number,
): Promise<RawMessage[]> {
  const r = (await fetchJson(
    `${MAIL_API}/messages/` +
    `?accountId=${accountId}&folder=INBOX`,
  )) as { messages?: RawMessage[] } | null
  return r?.messages ?? []
}
