/**
 * Type definitions for the CSS Schema V2 compiler.
 */

export type {
  TokensSection, ColorToken,
  Selector, Effect, Layer, Appearance,
} from './compilerTokenTypes';

import type { TokensSection }
  from './compilerTokenTypes';
import type { Selector, Effect, Appearance }
  from './compilerTokenTypes';

/** V2 schema root structure. */
export interface StylesSchemaV2 {
  schema_version: string;
  package: string;
  tokens?: TokensSection;
  selectors?: Selector[];
  effects?: Effect[];
  appearance?: Appearance[];
  layouts?: Layout[];
  transitions?: Transition[];
  rules?: Rule[];
  environments?: Environment[];
}

/** Layout constraints. */
export interface Layout {
  id: string;
  type: string;
  constraints: unknown;
}

/** CSS transition definition. */
export interface Transition {
  id: string;
  trigger: { state: string };
  properties: string[];
  duration: { value: number; unit: string };
  easing: string;
}

/** Style rule linking selector to effects. */
export interface Rule {
  id: string;
  selector: string;
  priority: {
    importance: string;
    origin?: string;
    specificity: {
      ids: number;
      classes: number;
      types: number;
    };
    sourceOrder: number;
  };
  effects?: { ref: string };
  appearance?: { ref: string };
  transition?: { ref: string };
  layout?: { ref: string };
  enabled: boolean;
}

/** Responsive environment condition. */
export interface Environment {
  id: string;
  conditions: {
    viewport?: {
      minWidth?: {
        value: number; unit: string;
      };
      maxWidth?: {
        value: number; unit: string;
      };
    };
    colorScheme?: string;
  };
}
