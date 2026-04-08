import React from 'react'
import type {
  KeyboardShortcutsDialogProps,
} from './shortcutTypes'
import { ShortcutRow } from './ShortcutRow'

/**
 * Keyboard shortcuts content panel.
 * Wrap in your project's Dialog for full usage.
 */
export function KeyboardShortcutsContent({
  shortcuts,
  title = 'Keyboard Shortcuts',
  description =
    'Speed up your workflow with these shortcuts',
  icon,
}: Omit<
  KeyboardShortcutsDialogProps, 'open' | 'onOpenChange'
>) {
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '18px',
            fontWeight: 600,
            margin: 0,
          }}
        >
          {icon}
          {title}
        </h2>
        {description && (
          <p style={{
            fontSize: '14px',
            color:
              'var(--color-muted-foreground, #666)',
            marginTop: '4px',
          }}>
            {description}
          </p>
        )}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>
        {shortcuts.map((cat, ci) => (
          <div key={cat.category}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '12px',
            }}>
              {cat.category}
            </h3>
            <div>
              {cat.items.map((item, ii) => (
                <ShortcutRow key={ii} {...item} />
              ))}
            </div>
            {ci < shortcuts.length - 1 && (
              <hr style={{
                border: 'none',
                borderTop:
                  '1px solid var(--color-border, #e0e0e0)',
                marginTop: '16px',
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default KeyboardShortcutsContent
