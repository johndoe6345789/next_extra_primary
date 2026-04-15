/**
 * Hook that loads and indexes all JSON
 * component definitions.
 * @module hooks/useComponentDefs
 */
import { useMemo } from 'react';
import type { ComponentDef, Category } from '../types';

import buttonDef from '../definitions/button.json';
import textFieldDef from '../definitions/text-field.json';
import cardDef from '../definitions/card.json';
import typographyDef from '../definitions/typography.json';
import alertDef from '../definitions/alert.json';
import chipDef from '../definitions/chip.json';
import dialogDef from '../definitions/dialog.json';
import tableDef from '../definitions/table.json';
import tabsDef from '../definitions/tabs.json';
import accordionDef from '../definitions/accordion.json';

const ALL_DEFS: readonly ComponentDef[] = [
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

/** Grouped map of category to definitions. */
export type GroupedDefs = ReadonlyMap<
  Category,
  readonly ComponentDef[]
>;

/** @brief Loads and groups component defs. */
export function useComponentDefs() {
  const grouped = useMemo<GroupedDefs>(() => {
    const map = new Map<Category, ComponentDef[]>();
    for (const def of ALL_DEFS) {
      const list = map.get(def.category) ?? [];
      list.push(def);
      map.set(def.category, list);
    }
    return map;
  }, []);

  return { defs: ALL_DEFS, grouped } as const;
}
