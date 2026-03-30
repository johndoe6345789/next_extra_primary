/**
 * Barrel export for all component definitions.
 * @module definitions
 */
import type { ComponentDef } from '../types';

import buttonDef from './button.json';
import textFieldDef from './text-field.json';
import cardDef from './card.json';
import typographyDef from './typography.json';
import alertDef from './alert.json';
import chipDef from './chip.json';
import dialogDef from './dialog.json';
import tableDef from './table.json';
import tabsDef from './tabs.json';
import accordionDef from './accordion.json';

/** All component definitions in registry order. */
export const ALL_DEFINITIONS: readonly ComponentDef[] = [
  buttonDef,
  textFieldDef,
  cardDef,
  typographyDef,
  alertDef,
  chipDef,
  dialogDef,
  tableDef,
  tabsDef,
  accordionDef,
] as readonly ComponentDef[];

export {
  buttonDef,
  textFieldDef,
  cardDef,
  typographyDef,
  alertDef,
  chipDef,
  dialogDef,
  tableDef,
  tabsDef,
  accordionDef,
};
