/**
 * Example 6: Custom Hook Composition
 *
 * Shows how to create a higher-level hook that
 * combines all 4 keyboard/event hooks for common
 * patterns.
 */

import { useEffect, useState } from 'react'
import { useClickOutside } from '../useClickOutside'
import { useKeyboardShortcuts } from '../useKeyboardShortcuts'

/** Hook combining dialog + keyboard shortcuts */
export function useDialogWithShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  const { ref } = useClickOutside<HTMLDivElement>({
    onClickOutside: () => setIsOpen(false),
  })

  const { registerShortcut, unregister } =
    useKeyboardShortcuts()

  useEffect(() => {
    if (!isOpen) return

    const id = registerShortcut({
      key: 'Escape',
      onPress: () => setIsOpen(false),
    })

    return () => unregister(id)
  }, [isOpen, registerShortcut, unregister])

  return { ref, isOpen, setIsOpen }
}

/** Usage example of useDialogWithShortcuts */
export function DialogWithShortcutsExample() {
  const dialog = useDialogWithShortcuts()

  return (
    <div>
      <button
        onClick={() => dialog.setIsOpen(true)}
      >
        Open Dialog
      </button>

      {dialog.isOpen && (
        <div ref={dialog.ref} className="dialog">
          <h2>
            Dialog (Click outside or Escape to close)
          </h2>
        </div>
      )}
    </div>
  )
}
