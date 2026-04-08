/**
 * CSS Schema V2 to CSS Compiler
 *
 * Compiles the abstract V2 schema to actual CSS.
 */

import type { StylesSchemaV2 } from './compilerTypes';
import {
  emitRule, emitResponsive,
} from './compilerRuleEmit';

export type { StylesSchemaV2 } from './compilerTypes';

/** Compiles a V2 style schema to CSS. */
export class StylesCompiler {
  private schema: StylesSchemaV2;
  private cssVars = new Map<string, string>();

  constructor(schema: StylesSchemaV2) {
    this.schema = schema;
    this.extractTokens();
  }

  /** Extract tokens as CSS custom properties. */
  private extractTokens() {
    if (!this.schema.tokens) return;

    if (this.schema.tokens.colors) {
      Object.entries(this.schema.tokens.colors)
        .forEach(([key, token]) => {
          this.cssVars.set(
            `--color-${key}`, token.value,
          );
        });
    }

    if (this.schema.tokens.spacing?.unit) {
      const { number, unit } =
        this.schema.tokens.spacing.unit.value;
      this.cssVars.set(
        '--spacing-unit', `${number}${unit}`,
      );
    }
  }

  /** Compile all rules to a CSS string. */
  public compile(): string {
    const css: string[] = [];

    if (this.cssVars.size > 0) {
      css.push(':root {');
      this.cssVars.forEach((value, key) => {
        css.push(`  ${key}: ${value};`);
      });
      css.push('}');
      css.push('');
    }

    const sorted = [
      ...(this.schema.rules || []),
    ].sort(
      (a, b) =>
        a.priority.sourceOrder
        - b.priority.sourceOrder,
    );

    sorted.forEach((rule) => {
      if (!rule.enabled) return;
      emitRule(rule, this.schema, css);
    });

    emitResponsive(this.schema, css);
    return css.join('\n');
  }
}

/** Compile V2 schema to CSS. */
export function compileToCSS(
  schema: StylesSchemaV2,
): string {
  const compiler = new StylesCompiler(schema);
  return compiler.compile();
}
