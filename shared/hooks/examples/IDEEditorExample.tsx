/**
 * Example 3: IDE-like Editor with Multiple Hotkeys
 *
 * Features:
 * - Save: Ctrl+S / Cmd+S
 * - Find: Ctrl+F / Cmd+F
 * - Replace: Ctrl+H / Cmd+H
 * - Close: Escape
 * - Format: Ctrl+Shift+I / Cmd+Shift+I
 */

import { useEffect } from 'react'
import { useHotkeys } from '../useHotkeys'

/** IDE editor with multiple hotkeys */
export function IDEEditorExample() {
  const hotkeys = useHotkeys()

  useEffect(() => {
    hotkeys.register('ctrl+s', () => {
      console.log('Saving file...')
    }, { preventDefault: true })

    hotkeys.register('ctrl+f', () => {
      console.log('Opening find...')
    }, { preventDefault: true })

    hotkeys.register('ctrl+h', () => {
      console.log('Opening find & replace...')
    }, { preventDefault: true })

    hotkeys.register('ctrl+shift+i', () => {
      console.log('Formatting code...')
    }, { preventDefault: true })

    hotkeys.register('Escape', () => {
      console.log('Closing dialogs...')
    })

    return () => hotkeys.unregisterAll()
  }, [hotkeys])

  return (
    <div>
      <h2>IDE Editor</h2>
      <p>
        Try: Ctrl+S, Ctrl+F, Ctrl+H, Ctrl+Shift+I
      </p>
    </div>
  )
}
