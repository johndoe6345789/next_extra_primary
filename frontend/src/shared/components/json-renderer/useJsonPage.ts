'use client';

/**
 * Hook that loads a JSON page definition and
 * manages aggregated hook state for the page.
 * @module shared/components/json-renderer/useJsonPage
 */
import { useMemo } from 'react';
import type { PageDefinition, HookBinding } from './types';
import { getHook } from './registry';

/**
 * Execute a single hook binding and return its
 * state keyed by the hook name.
 * @param binding - The hook binding to execute.
 * @returns Key-value pair of hook name and state.
 */
function useBinding(
  binding: HookBinding,
): Record<string, unknown> {
  const fn = getHook(binding.name);
  if (!fn) return {};
  const result = fn(...(binding.args ?? []));
  return { [binding.name]: result };
}

/**
 * Executes all page-level hooks from a definition
 * and returns merged state for the renderer.
 *
 * Each hook's return value is stored under its
 * name key, e.g. `{ useAuth: { user, ... } }`.
 *
 * @param definition - The page definition.
 * @returns Merged state from all page hooks.
 */
export function useJsonPage(
  definition: PageDefinition,
): Record<string, unknown> {
  const bindings = definition.hooks ?? [];

  const b0 = useBinding(bindings[0] ?? { name: '' });
  const b1 = useBinding(bindings[1] ?? { name: '' });
  const b2 = useBinding(bindings[2] ?? { name: '' });
  const b3 = useBinding(bindings[3] ?? { name: '' });

  return useMemo(() => {
    const state: Record<string, unknown> = {};
    const results = [b0, b1, b2, b3];
    for (let i = 0; i < bindings.length; i++) {
      if (i < results.length) {
        Object.assign(state, results[i]);
      }
    }
    return state;
  }, [bindings, b0, b1, b2, b3]);
}
