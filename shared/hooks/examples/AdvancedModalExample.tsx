/**
 * Example 2: Advanced Modal with Click Outside
 *
 * Features:
 * - Click outside closes modal
 * - Trigger button excluded from close
 * - Touch and mouse support
 */

import { useRef } from 'react'
import { useClickOutside } from '../useClickOutside'

/** Modal with click-outside detection */
export function AdvancedModalExample() {
  const triggerButtonRef =
    useRef<HTMLButtonElement>(null)

  const modal = useClickOutside<HTMLDivElement>({
    excludeRefs: [triggerButtonRef],
    onClickOutside: () => {
      console.log('Modal closed by outside click')
    },
    includeTouch: true,
    delayMs: 0,
  })

  return (
    <div>
      <button
        ref={triggerButtonRef}
        onClick={() => modal.toggle()}
      >
        Open Modal
      </button>

      {modal.isOpen && (
        <div className="modal-backdrop">
          <div ref={modal.ref} className="modal">
            <h2>Modal Content</h2>
            <button
              onClick={() => modal.setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
