/**
 * Extended test ID generators
 * Covers settings, auth, modal, table, menu,
 * card, help, alert, section, and list patterns.
 */

import { generateTestId } from './accessibleUtils'
import { testIdNav } from './accessibleTestIdsNav'

/** Extended test ID generators */
export const testIdExt = {
  settingsPanel: () =>
    generateTestId('settings', 'panel'),
  settingsCanvasSection: () =>
    generateTestId('settings', 'section', undefined, 'canvas'),
  settingsSecuritySection: () =>
    generateTestId('settings', 'section', undefined, 'security'),
  settingsNotificationSection: () =>
    generateTestId('settings', 'section', undefined, 'notification'),
  settingsInput: (name: string) =>
    generateTestId('settings', 'input', undefined, name),
  settingsCheckbox: (name: string) =>
    generateTestId('settings', 'checkbox', undefined, name),
  settingsSelect: (name: string) =>
    generateTestId('settings', 'select', undefined, name),
  settingsButton: (action: string) =>
    generateTestId('settings', 'button', 'click', action),
  ...testIdNav,
  authForm: (type: 'login' | 'register') =>
    generateTestId('auth', 'form', undefined, type),
  authInput: (field: string) =>
    generateTestId('auth', 'input', undefined, field),
  authButton: (action: string) =>
    generateTestId('auth', 'button', 'click', action),
  modal: (name: string) =>
    generateTestId('modal', 'modal', undefined, name),
  modalClose: (name: string) =>
    generateTestId('modal', 'button', 'click', `${name}-close`),
  modalButton: (name: string, action: string) =>
    generateTestId('modal', 'button', 'click', `${name}-${action}`),
  table: (name: string) =>
    generateTestId('table', 'table', undefined, name),
  tableRow: (name: string, rowId: string) =>
    generateTestId('table', 'item', undefined, `${name}-${rowId}`),
  tableCell: (name: string, rowId: string, colId: string) =>
    generateTestId('table', 'item', undefined, `${name}-${rowId}-${colId}`),
  menu: (name: string) =>
    generateTestId('menu', 'menu', undefined, name),
  menuItem: (label: string) =>
    generateTestId('menu', 'button', 'click', label),
  card: (id: string) =>
    generateTestId('card', 'card', undefined, id),
  cardButton: (id: string, action: string) =>
    generateTestId('card', 'button', 'click', `${id}-${action}`),
  help: (name: string) =>
    generateTestId('help', 'section', undefined, name),
  helpButton: () =>
    generateTestId('help', 'button', 'click', 'open'),
  helpModal: (name: string) =>
    generateTestId('help', 'modal', undefined, name),
  helpSearch: () =>
    generateTestId('help', 'input', undefined, 'search'),
  helpNav: (name: string) =>
    generateTestId('help', 'nav', undefined, name),
  alert: (type: string) =>
    generateTestId('alert', 'alert', undefined, type),
  section: (id: string) =>
    generateTestId('section', 'region', undefined, id),
  listItem: (label: string) =>
    generateTestId('list', 'item', undefined, label),
}
