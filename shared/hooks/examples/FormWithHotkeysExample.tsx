/**
 * Example 7: Form with Save Hotkey
 *
 * Features:
 * - Auto-save on Ctrl+S
 * - Debounced keyboard input
 * - Click outside closes suggestions
 */

import { useState } from 'react'
import { useClickOutside } from '../useClickOutside'
import { useFormShortcuts } from './FormWithHotkeysSetup'

/** Form with hotkey-driven save */
export function FormWithHotkeysExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })
  const [showSuggestions, setShowSuggestions] =
    useState(false)

  const suggestionsRef =
    useClickOutside<HTMLDivElement>({
      onClickOutside: () =>
        setShowSuggestions(false),
    })

  useFormShortcuts(formData, setShowSuggestions)

  return (
    <div>
      <form>
        <input
          placeholder="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />
        <div>
          <input
            id="email-input"
            placeholder="Email (Ctrl+S to save)"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />
          {showSuggestions && (
            <div ref={suggestionsRef.ref}>
              <div>suggestion@example.com</div>
              <div>user@example.com</div>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
