/**
 * Navigation, editor, and workflow test IDs
 */

import { generateTestId } from './accessibleUtils'

/** Navigation and editor test ID generators */
export const testIdNav = {
  navHeader: () =>
    generateTestId('navigation', 'header'),
  navSidebar: () =>
    generateTestId('navigation', 'sidebar'),
  navMenu: () =>
    generateTestId('navigation', 'menu'),
  navMenuButton: (label: string) =>
    generateTestId(
      'navigation', 'button', 'click', label
    ),
  navTab: (label: string) =>
    generateTestId(
      'navigation', 'tab', undefined, label
    ),
  navBreadcrumb: () =>
    generateTestId('navigation', 'list'),
  navLink: (label: string) =>
    generateTestId(
      'navigation', 'button', 'click', label
    ),
  editorContainer: () =>
    generateTestId('editor', 'container'),
  editorToolbar: () =>
    generateTestId('editor', 'toolbar'),
  editorButton: (action: string) =>
    generateTestId(
      'editor', 'button', 'click', action
    ),
  editorNode: (id: string) =>
    generateTestId(
      'editor', 'item', undefined, id
    ),
  workflowCard: (id: string) =>
    generateTestId(
      'workflow', 'card', undefined, id
    ),
  workflowCardButton: (
    id: string,
    action: string
  ) =>
    generateTestId(
      'workflow', 'button', 'click',
      `${id}-${action}`
    ),
  projectSidebar: () =>
    generateTestId('project', 'sidebar'),
  projectList: () =>
    generateTestId('project', 'list'),
  projectItem: (id: string) =>
    generateTestId(
      'project', 'item', 'click', id
    ),
}
