/**
 * Registry lookup helper functions.
 */

import type { AnyComponent } from './registryTypes'
import { componentRegistry } from './registryMap'

/** Get a component by its type name. */
export function getComponent(
  typeName: string,
): AnyComponent | undefined {
  return componentRegistry[typeName]
}

/** Register a custom component. */
export function registerComponent(
  typeName: string, component: AnyComponent,
): void {
  componentRegistry[typeName] = component
}

/** Check if a component type is registered. */
export function hasComponent(
  typeName: string,
): boolean {
  return typeName in componentRegistry
}
