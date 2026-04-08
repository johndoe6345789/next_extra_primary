import React from 'react'
import type { ShortcutItem } from './shortcutTypes'

/**
 * Single shortcut row showing keys and description.
 */
export function ShortcutRow({
  keys, description,
}: ShortcutItem) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 0',
      }}
    >
      <span
        style={{
          fontSize: '14px',
          color:
            'var(--color-muted-foreground, #666)',
        }}
      >
        {description}
      </span>
      <div style={{ display: 'flex', gap: '4px' }}>
        {keys.map((key, index) => (
          <kbd
            key={index}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor:
                'var(--color-muted, #f1f1f1)',
              border:
                '1px solid var(--color-border, #e0e0e0)',
              borderRadius: '4px',
              fontFamily: 'inherit',
            }}
          >
            {key}
          </kbd>
        ))}
      </div>
    </div>
  )
}
