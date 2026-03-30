/**
 * Component and hook registries that map string
 * names to actual React components and hooks.
 * @module shared/components/json-renderer/registry
 */
import type { ComponentType } from 'react';
import {
  Box, Typography, Card, CardContent,
  Container, Divider, Button, TextField,
  Stack, Paper, Alert, CircularProgress,
} from '@metabuilder/m3';
import {
  useAuth, useLoginForm, useContactForm,
  useDashboard, useGamification,
} from '@/hooks';
import type {
  ComponentMap, HookMap, HookFn,
} from './types';

const components: ComponentMap = {
  Box, Typography, Card, CardContent,
  Container, Divider, Button, TextField,
  Stack, Paper, Alert, CircularProgress,
};

const hooks: HookMap = {
  useAuth: useAuth as unknown as HookFn,
  useLoginForm: useLoginForm as unknown as HookFn,
  useContactForm: useContactForm as unknown as HookFn,
  useDashboard: useDashboard as unknown as HookFn,
  useGamification: useGamification as unknown as HookFn,
};

/**
 * Register an additional component by name.
 * @param name - The string key for the component.
 * @param comp - The React component to register.
 */
export function registerComponent(
  name: string,
  comp: ComponentType<Record<string, unknown>>,
): void {
  components[name] = comp;
}

/**
 * Register an additional hook by name.
 * @param name - The string key for the hook.
 * @param hook - The hook function to register.
 */
export function registerHook(
  name: string,
  hook: HookFn,
): void {
  hooks[name] = hook;
}

/**
 * Look up a component by name.
 * @param name - The component registry key.
 * @returns The matched component or undefined.
 */
export function getComponent(
  name: string,
): ComponentType<Record<string, unknown>> | undefined {
  return components[name];
}

/**
 * Look up a hook by name.
 * @param name - The hook registry key.
 * @returns The matched hook or undefined.
 */
export function getHook(
  name: string,
): HookFn | undefined {
  return hooks[name];
}
