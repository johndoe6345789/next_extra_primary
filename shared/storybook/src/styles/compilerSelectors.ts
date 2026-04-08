/**
 * Selector compilation for the V2 schema compiler.
 */

import type { Selector } from './compilerTypes';

/** Map component types to CSS class selectors. */
const TYPE_MAP: Record<string, string> = {
  Text: '.text',
  Button: '.button',
  Card: '.card',
  Box: '.box',
  Input: '.input',
  Table: '.table',
  TableRow: '.table-row',
  Nav: '.nav',
  Section: '.section',
};

/** Add package prefix to a class name. */
function prefixClass(
  cls: string,
  pkg: string,
): string {
  if (cls.startsWith(pkg + '_')) {
    return `.${cls}`;
  }
  return `.${pkg}_${cls}`;
}

/**
 * Build a CSS selector string from a
 * selector predicate definition.
 */
export function buildSelector(
  selectors: Selector[] | undefined,
  selectorId: string,
  packageName: string,
): string {
  const selector = selectors?.find(
    (s) => s.id === selectorId,
  );
  if (!selector) return '';

  const { predicate } = selector;

  const classSelectors = predicate.classes
    .map((c) => prefixClass(c, packageName))
    .join('');

  const stateSelectors = predicate.states
    .map((s) => `:${s}`)
    .join('');

  let css = `${classSelectors}${stateSelectors}`;

  if (predicate.relationship) {
    const rel = predicate.relationship;
    const ancestorType =
      TYPE_MAP[rel.ancestor.targetType]
      || `.${rel.ancestor.targetType.toLowerCase()}`;
    const ancestorClasses = rel.ancestor.classes
      .map((c) => prefixClass(c, packageName))
      .join('');

    const sep =
      rel.type === 'child' ? ' > ' : ' ';
    css = `${ancestorType}${ancestorClasses}`
      + `${sep}${css}`;
  }

  return css;
}
