/**
 * Configuration and styles for SettingsApiKeys.
 * @module components/organisms/settingsApiKeysConfig
 */
import type { CSSProperties } from 'react';
import { t } from '@shared/theme/tokens';
import models from '@/constants/ai-models.json';

/** A selectable model option. */
export interface ModelOption {
  value: string;
  label: string;
}

/** Available AI provider entries. */
export const PROVIDERS = [
  { id: 'claude', label: 'Anthropic' },
  { id: 'openai', label: 'OpenAI' },
] as const;

/** Model options keyed by provider id. */
export const MODEL_OPTIONS: Record<
  string, ModelOption[]
> = models;

/** Container box style. */
export const containerStyle: CSSProperties = {
  padding: 20,
  borderRadius: t.large,
  background: t.surfaceContainer,
  marginBottom: 16,
};
