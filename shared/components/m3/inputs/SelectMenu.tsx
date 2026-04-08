'use client'

import React from 'react'
import styles from '../../../scss/atoms/mat-select.module.scss'

/**
 * Props for SelectMenu sub-component
 */
interface SelectMenuProps {
  id: string
  multiple: boolean
  value: unknown
  children: React.ReactNode
  onSelect: (val: unknown) => void
}

/**
 * Dropdown menu panel for the Select component
 */
export function SelectMenu({
  id,
  multiple,
  value,
  children,
  onSelect,
}: SelectMenuProps) {
  return (
    <div className={styles.menuWrapper}>
      <div
        id={`${id}-menu`}
        role="listbox"
        aria-multiselectable={multiple}
        className={styles.panel}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child))
            return child
          const cp = child.props as Record<
            string,
            unknown
          >
          const isSel =
            multiple && Array.isArray(value)
              ? (value as unknown[]).includes(
                  cp.value
                )
              : value === cp.value
          return React.cloneElement(child, {
            ...cp,
            selected: isSel,
            onClick: (e: React.MouseEvent) => {
              ;(
                cp.onClick as
                  | ((
                      e: React.MouseEvent
                    ) => void)
                  | undefined
              )?.(e)
              onSelect(cp.value)
            },
          } as Partial<typeof child.props>)
        })}
      </div>
    </div>
  )
}
