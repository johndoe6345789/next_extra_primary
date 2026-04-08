import type { ComponentType, ReactNode } from 'react'

/** Base props for registry components. */
export interface ComponentProps {
  className?: string
  children?: ReactNode
  [key: string]: unknown
}

/** Generic component type for the registry. */
export type AnyComponent = ComponentType<ComponentProps>
