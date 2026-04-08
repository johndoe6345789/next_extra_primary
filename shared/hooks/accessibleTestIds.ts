/**
 * Standardized test ID generators
 * Provides preset test ID generation for common UI patterns.
 */

import { generateTestId } from './accessibleUtils'

/**
 * Common test ID generators with presets
 */
export const testId = {
  button: (label: string) =>
    generateTestId('form', 'button', 'click', label),
  input: (name: string) =>
    generateTestId('form', 'input', undefined, name),
  select: (name: string) =>
    generateTestId('form', 'select', undefined, name),
  checkbox: (name: string) =>
    generateTestId('form', 'checkbox', undefined, name),
  radio: (name: string) =>
    generateTestId('form', 'radio', undefined, name),
  label: (name: string) =>
    generateTestId('form', 'label', undefined, name),
  link: (label: string) =>
    generateTestId('navigation', 'link', 'click', label),
  icon: (name: string) =>
    generateTestId('form', 'icon', undefined, name),
  image: (name: string) =>
    generateTestId('form', 'image', undefined, name),
  text: (content: string) =>
    generateTestId('form', 'text', undefined, content),
  badge: (label: string) =>
    generateTestId('form', 'badge', undefined, label),
  chip: (label: string) =>
    generateTestId('form', 'chip', undefined, label),
  divider: () => generateTestId('form', 'divider'),
  stepper: () => generateTestId('form', 'stepper'),
  slider: (name: string) =>
    generateTestId('form', 'slider', undefined, name),
  switch: (name: string) =>
    generateTestId('form', 'switch', undefined, name),
  canvasContainer: () => generateTestId('canvas', 'container'),
  canvasGrid: () => generateTestId('canvas', 'grid'),
  canvasItem: (id?: string) =>
    generateTestId('canvas', 'item', 'drag', id),
  canvasItemResize: (id?: string) =>
    generateTestId('canvas', 'item', 'resize', id),
  canvasItemDelete: (id?: string) =>
    generateTestId('canvas', 'item', 'delete', id),
  canvasZoomIn: () =>
    generateTestId('canvas', 'button', 'click', 'zoom-in'),
  canvasZoomOut: () =>
    generateTestId('canvas', 'button', 'click', 'zoom-out'),
  canvasZoomReset: () =>
    generateTestId('canvas', 'button', 'click', 'zoom-reset'),
  canvasPan: () =>
    generateTestId('canvas', 'button', 'click', 'pan'),
  canvasGridToggle: () =>
    generateTestId('canvas', 'button', 'toggle', 'grid'),
  canvasSnapToggle: () =>
    generateTestId('canvas', 'button', 'toggle', 'snap'),
}
