import { useCallback } from 'react'
import {
  formatStorageError,
} from './storageSettingsUtils'
import {
  storageSettingsCopy,
} from './storageSettingsConfig'
import type {
  SwitchHandlersParams,
} from './storageSwitchTypes'

/** Create Flask switch handler */
export function useFlaskSwitchHandler(
  params: Pick<
    SwitchHandlersParams,
    'backend' | 'flaskUrl' | 'switchToFlask'
  >,
  toast: { info: (m: string) => void; error: (m: string) => void; success: (m: string) => void },
  setIsSwitching: (v: boolean) => void
) {
  const { backend, flaskUrl, switchToFlask } =
    params
  const c = storageSettingsCopy.toasts

  return useCallback(
    async () => {
      if (backend === 'flask') {
        toast.info(c.alreadyUsing.flask)
        return
      }
      if (!flaskUrl) {
        toast.error(c.errors.missingFlaskUrl)
        return
      }
      setIsSwitching(true)
      try {
        await switchToFlask(flaskUrl)
        toast.success(c.success.switchFlask)
      } catch (err) {
        toast.error(
          `${c.failure.switchFlask}: ` +
            formatStorageError(err)
        )
      } finally {
        setIsSwitching(false)
      }
    },
    [backend, flaskUrl, switchToFlask, toast, c, setIsSwitching]
  )
}
