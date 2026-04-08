/**
 * JSON Component Renderer
 *
 * Renders JSON-defined components from packages.
 */

import React from 'react';
import type { ComponentDefinition }
  from './packageDiscoveryTypes';
import type { RenderContext }
  from './jsonRendererTypes';
import { renderTemplate }
  from './jsonTemplateRenderer';

export type { RenderContext }
  from './jsonRendererTypes';
export { createComponentStory }
  from './jsonStoryFactory';

/**
 * Render a JSON component definition to React.
 */
export function renderJsonComponent(
  component: ComponentDefinition,
  props: Record<string, unknown> = {},
): React.ReactElement {
  if (!component.render) {
    return (
      <div className="error">
        <strong>Error:</strong>{' '}
        Component {component.name}{' '}
        has no render definition
      </div>
    );
  }

  const context: RenderContext = {
    props,
    state: {},
  };

  try {
    return renderTemplate(
      (component.render as { template: unknown })
        .template,
      context,
    );
  } catch (error) {
    return (
      <div className="error">
        <strong>
          Error rendering {component.name}:
        </strong>{' '}
        {error instanceof Error
          ? error.message
          : String(error)}
      </div>
    );
  }
}
