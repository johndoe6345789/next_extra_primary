/**
 * Story creation helpers for JSON components.
 */

import type { ComponentDefinition }
  from './packageDiscoveryTypes';
import { renderJsonComponent }
  from './jsonComponentRenderer';

/** Storybook control type map. */
const CONTROL_MAP: Record<string, string> = {
  string: 'text',
  number: 'number',
  boolean: 'boolean',
  array: 'object',
  object: 'object',
};

/** Get Storybook control type from prop type. */
function getControlType(type: string): string {
  return CONTROL_MAP[type] || 'text';
}

/** Generate argTypes from component props. */
function generateArgTypes(
  component: ComponentDefinition,
): Record<string, unknown> {
  if (!component.props) return {};

  const argTypes: Record<string, unknown> = {};

  for (const prop of component.props as Array<{
    name: string;
    description?: string;
    type: string;
    default?: unknown;
    required?: boolean;
  }>) {
    const entry: Record<string, unknown> = {
      description: prop.description,
      control: getControlType(prop.type),
      defaultValue: prop.default,
    };

    if (prop.required === false) {
      entry.table = {
        type: { summary: prop.type },
        defaultValue: { summary: prop.default },
      };
    }

    argTypes[prop.name] = entry;
  }

  return argTypes;
}

/** Create a Storybook story for a component. */
export function createComponentStory(
  component: ComponentDefinition,
  defaultProps: Record<string, unknown> = {},
) {
  return {
    render: (args: Record<string, unknown>) => {
      const merged = { ...defaultProps, ...args };
      return renderJsonComponent(
        component, merged,
      );
    },
    args: defaultProps,
    argTypes: generateArgTypes(component),
  };
}
