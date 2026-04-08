/**
 * Navigation components for JSON registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

export {
  AppBar, Toolbar, Link, Breadcrumbs,
} from './navExtras'

interface TabsProps extends ComponentProps {
  value?: string
  items?: Array<{
    value: string; label: string
    content?: React.ReactNode
  }>
}

/** Tabbed navigation. */
export const Tabs: React.FC<TabsProps> = ({
  items = [], className = '',
}) => {
  const [active, setActive] =
    React.useState(items[0]?.value || '')
  return (
    <div className={className}>
      <div className="flex border-b gap-4">
        {items.map((item) => (
          <button
            key={item.value}
            className={
              'py-2 px-1 border-b-2 '
              + 'transition-colors '
              + (active === item.value
                ? 'border-accent text-accent'
                : 'border-transparent'
                  + ' text-muted-foreground'
                  + ' hover:text-foreground')
            }
            onClick={() => setActive(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="py-4">
        {items.find(
          (i) => i.value === active,
        )?.content}
      </div>
    </div>
  )
}

/** Tab label. */
export const Tab: React.FC<
  ComponentProps & { label?: string; value?: string }
> = ({ label, children, className = 'py-2 px-4' }) => (
  <div className={className}>{label || children}</div>
)

/** Tab panel visibility wrapper. */
export const TabPanel: React.FC<
  ComponentProps & {
    value?: unknown; index?: unknown
    hidden?: boolean
  }
> = ({
  children, value, index, hidden,
  className = 'py-4',
}) => {
  const h = hidden ?? (
    value !== undefined
    && index !== undefined
    && value !== index
  )
  if (h) return null
  return (
    <div className={className} role="tabpanel">
      {children}
    </div>
  )
}
