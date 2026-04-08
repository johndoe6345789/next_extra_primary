import { useCallback, useState } from 'react'
import {
  formatStorageError,
} from './storageSettingsUtils'
import {
  storageSettingsCopy,
} from './storageSettingsConfig'
import type {
  SwitchHandlersParams,
} from './storageSwitchTypes'
import { noopToast } from './storageSwitchTypes'
import { useFlaskSwitchHandler } from './storageSwitchFlask'

export type {
  ToastNotifierWithInfo,
} from './storageSwitchTypes'

export const useStorageSwitchHandlers = ({
  backend,
  flaskUrl,
  switchToFlask,
  switchToSQLite,
  switchToIndexedDB,
  toast = noopToast,
}: SwitchHandlersParams) => {
  const [isSwitching, setIsSwitching] =
    useState(false)
  const c = storageSettingsCopy.toasts

  const handleSwitchToFlask =
    useFlaskSwitchHandler(
      { backend, flaskUrl, switchToFlask },
      toast,
      setIsSwitching
    )

  const handleSwitchToSQLite = useCallback(
    async () => {
      if (backend === 'sqlite') {
        toast.info(c.alreadyUsing.sqlite)
        return
      }
      setIsSwitching(true)
      try {
        await switchToSQLite()
        toast.success(c.success.switchSQLite)
      } catch (err) {
        toast.error(
          `${c.failure.switchSQLite}: ` +
            formatStorageError(err)
        )
      } finally {
        setIsSwitching(false)
      }
    },
    [backend, switchToSQLite, toast, c]
  )

  const handleSwitchToIndexedDB = useCallback(
    async () => {
      if (backend === 'indexeddb') {
        toast.info(c.alreadyUsing.indexeddb)
        return
      }
      setIsSwitching(true)
      try {
        await switchToIndexedDB()
        toast.success(c.success.switchIndexedDB)
      } catch (err) {
        toast.error(
          `${c.failure.switchIndexedDB}: ` +
            formatStorageError(err)
        )
      } finally {
        setIsSwitching(false)
      }
    },
    [backend, switchToIndexedDB, toast, c]
  )

  return {
    isSwitching,
    handleSwitchToFlask,
    handleSwitchToSQLite,
    handleSwitchToIndexedDB,
  }
}
