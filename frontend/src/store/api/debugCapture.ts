/**
 * Captures API debug telemetry from RTK Query
 * responses into the debug store.
 * @module store/api/debugCapture
 */
import type { FetchArgs } from '@reduxjs/toolkit/query';
import { addDebugEntry } from '../../utils/debugStore';

/** Extract and log debug info from a fetch result. */
export function captureDebugInfo(
  args: string | FetchArgs,
  result: { meta?: { response?: Response };
    error?: { data?: unknown } },
  startMs: number,
): void {
  const resp = result.meta?.response;
  const reqId =
    resp?.headers?.get('X-Request-Id') ?? '';
  const url = typeof args === 'string'
    ? args : args.url;
  const method = typeof args === 'string'
    ? 'GET' : (args.method ?? 'GET');
  const errBody = result.error?.data as
    Record<string, string> | undefined;

  addDebugEntry({
    timestamp: new Date().toISOString(),
    method,
    url,
    status: resp?.status ?? 0,
    requestId: reqId,
    duration: Date.now() - startMs,
    errorCode: errBody?.code,
  });
}
