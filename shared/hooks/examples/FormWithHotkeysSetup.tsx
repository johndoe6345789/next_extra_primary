/**
 * Hotkey and event setup for form example
 */

import { useEffect } from 'react'
import { useKeyboardShortcuts } from '../useKeyboardShortcuts'
import { useEventListener } from '../useEventListener'

interface FormData {
  name: string
  email: string
}

/**
 * Register form-specific shortcuts
 * @param formData - Current form values
 * @param setShowSuggestions - Toggle callback
 */
export function useFormShortcuts(
  formData: FormData,
  setShowSuggestions: (v: boolean) => void
) {
  const { registerShortcut, unregister } =
    useKeyboardShortcuts()
  const { add } = useEventListener()

  useEffect(() => {
    const saveId = registerShortcut({
      key: 's', ctrl: true,
      onPress: () => {
        console.log('Saving form:', formData)
      },
      preventDefault: true,
    })
    return () => unregister(saveId)
  }, [formData, registerShortcut, unregister])

  useEffect(() => {
    const el = document.getElementById(
      'email-input'
    ) as HTMLInputElement
    if (!el) return
    return add(el, 'focus', () => {
      setShowSuggestions(true)
    })
  }, [add])
}
