'use client'

/**
 * Package operation builders
 * (install, uninstall, enable, disable)
 */

import { useCallback } from 'react'
import type {
  PackageInfo,
} from '@/lib/types/package-admin-types'

type ExecuteOp = (
  op: string,
  packageId: string,
  fetchFn: (signal: AbortSignal) => Promise<Response>
) => Promise<PackageInfo>

/**
 * Build typed package operation callbacks
 * @param baseUrl - API base URL
 * @param executeOp - Generic operation executor
 */
export function usePackageOps(
  baseUrl: string,
  executeOp: ExecuteOp
) {
  const makeOp = (op: string) =>
    (packageId: string) =>
      executeOp(op, packageId, (signal) =>
        fetch(
          `${baseUrl}/api/admin/packages/` +
          `${packageId}/${op}`,
          {
            method: 'POST', signal,
            headers: {
              'Content-Type':
                'application/json',
            },
          }
        )
      )

  const installPackage = useCallback(
    async (pkgId: string): Promise<PackageInfo> =>
      makeOp('install')(pkgId),
    [executeOp]
  )

  const uninstallPackage = useCallback(
    async (pkgId: string): Promise<void> => {
      await makeOp('uninstall')(pkgId)
    },
    [executeOp]
  )

  const enablePackage = useCallback(
    async (pkgId: string): Promise<PackageInfo> =>
      makeOp('enable')(pkgId),
    [executeOp]
  )

  const disablePackage = useCallback(
    async (pkgId: string): Promise<PackageInfo> =>
      makeOp('disable')(pkgId),
    [executeOp]
  )

  return {
    installPackage,
    uninstallPackage,
    enablePackage,
    disablePackage,
  }
}
