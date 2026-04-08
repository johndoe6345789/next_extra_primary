/**
 * Example 5: Complete Dashboard with All Hooks
 *
 * Features:
 * - Command palette (Ctrl+K)
 * - Dropdown menus (click outside)
 * - Global hotkeys (save, search)
 * - Event listeners (resize, scroll)
 */

import { useEffect, useState } from 'react'
import { useClickOutside } from '../useClickOutside'
import { useEventListener } from '../useEventListener'
import {
  useDashboardShortcuts,
} from './CompleteDashboardShortcuts'

/** Complete dashboard with all hooks */
export function CompleteDashboardExample() {
  const [cmdOpen, setCmdOpen] = useState(false)
  const [scrollPos, setScrollPos] = useState(0)

  const userMenu =
    useClickOutside<HTMLDivElement>({
      onClickOutside: () => {},
    })

  useDashboardShortcuts(setCmdOpen)

  const { add } = useEventListener()

  useEffect(() => {
    return add(window, 'scroll', () => {
      setScrollPos(window.scrollY)
    }, { passive: true })
  }, [add])

  return (
    <div>
      <header>
        <h1>Dashboard</h1>
        <button
          onClick={() => setCmdOpen(true)}
        >
          Command Palette (Ctrl+K)
        </button>
        <div>
          <button
            onClick={() => userMenu.toggle()}
          >
            User Menu
          </button>
          {userMenu.isOpen && (
            <div ref={userMenu.ref}>
              <div>Profile</div>
              <div>Settings</div>
              <div>Logout</div>
            </div>
          )}
        </div>
      </header>
      <main>
        <p>Scroll position: {scrollPos}</p>
      </main>
      {cmdOpen && (
        <div className="command-palette">
          <input
            placeholder="Type a command..."
          />
        </div>
      )}
    </div>
  )
}
