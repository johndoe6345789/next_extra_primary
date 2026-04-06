/**
 * Barrel export for all custom hooks.
 * @module hooks
 */

export { useDebounce } from './useDebounce';
export { useThemeMode } from './useThemeMode';
export { useNotifications } from './useNotifications';
export { useLocale } from './useLocale';
export { useFormValidation } from './useFormValidation';
export type { ValidationRule, ValidationRules } from './useFormValidation';
export { useKeyboardShortcuts } from './useKeyboardShortcuts';
export type { ShortcutMap } from './useKeyboardShortcuts';
export { useGlobalShortcuts } from './useGlobalShortcuts';
export type { GlobalShortcutOptions } from './useGlobalShortcuts';
export { useAuth } from './useAuth';
export { useGamification } from './useGamification';
export { useAiChat } from './useAiChat';
export { useApi } from './useApi';
export { useLoginForm } from './useLoginForm';
export type { UseLoginFormReturn } from './useLoginForm';
export { useRegisterForm } from './useRegisterForm';
export type { UseRegisterFormReturn } from './useRegisterForm';
export { useContactForm } from './useContactForm';
export type { UseContactFormReturn } from './useContactForm';
export { useForgotPassword } from './useForgotPassword';
export type { UseForgotPasswordReturn } from './useForgotPassword';
export { useDashboard } from './useDashboard';
export { useDashboardLayout } from './useDashboardLayout';
export type { UseDashboardLayoutReturn } from './useDashboardLayout';
export { useFeatureToggle } from './useFeatureToggle';
