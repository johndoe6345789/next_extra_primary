/**
 * Keyboard shortcut setup for dashboard
 */

import { useEffect } from 'react'
import { useKeyboardShortcuts } from '../useKeyboardShortcuts'
import { useHotkeys } from '../useHotkeys'

/**
 * Register dashboard keyboard shortcuts
 * @param setCmdOpen - Command palette toggler
 */
export function useDashboardShortcuts(
  setCmdOpen: (open: boolean) => void
) {
  const { registerShortcut, unregister } =
    useKeyboardShortcuts()
  const hotkeys = useHotkeys()

  useEffect(() => {
    const cmdId = registerShortcut({
      key: 'k', ctrl: true,
      onPress: () => setCmdOpen(true),
      preventDefault: true,
    })
    const escId = registerShortcut({
      key: 'Escape',
      onPress: () => setCmdOpen(false),
    })
    return () => {
      unregister(cmdId)
      unregister(escId)
    }
  }, [registerShortcut, unregister])

  useEffect(() => {
    hotkeys.register('ctrl+s', () => {
      console.log('Saving dashboard...')
    }, { preventDefault: true })
    hotkeys.register('ctrl+f', () => {
      console.log('Opening search...')
    }, { preventDefault: true })
    return () => hotkeys.unregisterAll()
  }, [hotkeys])
}
