/**
 * Example 1: Command Palette with Keyboard Shortcuts
 *
 * Features:
 * - Open with Ctrl+K
 * - Navigate with arrow keys
 * - Select with Enter
 * - Close with Escape
 */

import { useEffect, useState } from 'react'
import { useKeyboardShortcuts } from '../useKeyboardShortcuts'

/** Command palette with keyboard shortcuts */
export function CommandPaletteExample() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { registerShortcut, unregister } =
    useKeyboardShortcuts()

  useEffect(() => {
    const openId = registerShortcut({
      key: 'k', ctrl: true,
      onPress: () => setIsOpen(true),
      preventDefault: true,
    })
    const upId = registerShortcut({
      key: 'ArrowUp',
      onPress: () =>
        setSelectedIndex((p) => Math.max(0, p - 1)),
    })
    const downId = registerShortcut({
      key: 'ArrowDown',
      onPress: () => setSelectedIndex((p) => p + 1),
    })
    const selectId = registerShortcut({
      key: 'Enter',
      onPress: () => handleSelect(),
    })
    const closeId = registerShortcut({
      key: 'Escape',
      onPress: () => setIsOpen(false),
    })
    return () => {
      unregister(openId)
      unregister(upId)
      unregister(downId)
      unregister(selectId)
      unregister(closeId)
    }
  }, [registerShortcut])

  const handleSelect = () => {
    console.log('Selected index:', selectedIndex)
    setIsOpen(false)
  }

  return (
    <div>
      <h2>Command Palette (Ctrl+K)</h2>
      {isOpen && (
        <div><div>Item {selectedIndex}</div></div>
      )}
    </div>
  )
}
