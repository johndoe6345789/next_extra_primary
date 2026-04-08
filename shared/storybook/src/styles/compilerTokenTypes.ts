/**
 * Token and selector type definitions for the
 * CSS Schema V2 compiler.
 */

/** Token definitions section. */
export interface TokensSection {
  colors?: Record<string, ColorToken>;
  spacing?: {
    unit?: {
      type: string;
      value: { number: number; unit: string };
    };
    scale?: number[];
  };
  typography?: {
    fontFamily?: Record<string, string>;
  };
}

/** Single color token. */
export interface ColorToken {
  type: string;
  value: string;
  metadata?: {
    name?: string;
    category?: string;
  };
}

/** CSS selector predicate. */
export interface Selector {
  id: string;
  predicate: {
    targetType: string;
    classes: string[];
    states: string[];
    relationship?: {
      type: string;
      ancestor: {
        targetType: string;
        classes: string[];
      };
    };
  };
}

/** Effect with CSS properties. */
export interface Effect {
  id: string;
  properties: Record<string, unknown>;
}

/** Appearance layer definition. */
export interface Layer {
  type: string;
  order?: number;
  properties: Record<string, unknown>;
}

/** Appearance with visual layers. */
export interface Appearance {
  id: string;
  layers: Layer[];
  clip?: string;
}
