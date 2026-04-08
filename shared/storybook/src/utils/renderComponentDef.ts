/**
 * Renders a component definition to a
 * React element.
 */

import React from 'react';
import type { ComponentDefinition }
  from './loadPackageComponentTypes';
import { ELEMENT_MAP }
  from './loadPackageComponentTypes';

/**
 * Convert a component definition to a
 * React element tree.
 */
export function renderComponentDefinition(
  def: ComponentDefinition,
): React.ReactElement {
  const {
    type, props = {}, children,
    className, style, text,
  } = def;

  const element = ELEMENT_MAP[type] || 'div';

  const finalProps = {
    ...props,
    className: className
      ? `${type.toLowerCase()} ${className}`
      : type.toLowerCase(),
    style: style || {},
  };

  const childElements = children?.map(
    (child, idx) =>
      renderComponentDefinition({
        ...child,
        props: { ...child.props, key: idx },
      }),
  ) || [];

  return React.createElement(
    element,
    finalProps,
    text || childElements,
  );
}
