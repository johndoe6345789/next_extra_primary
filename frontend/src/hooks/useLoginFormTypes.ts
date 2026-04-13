/**
 * Types for useLoginForm hook.
 * @module hooks/useLoginFormTypes
 */

/** Options for useLoginForm. */
export interface UseLoginFormOptions {
  /**
   * URL to redirect after login (SSO next-param).
   * Falls back to /dashboard when absent.
   */
  next?: string;
}

/** Return type for the useLoginForm hook. */
export interface UseLoginFormReturn {
  /** Current email value. */
  email: string;
  /** Email setter. */
  setEmail: (v: string) => void;
  /** Current password value. */
  pw: string;
  /** Password setter. */
  setPw: (v: string) => void;
  /** Whether "remember me" is checked. */
  rememberMe: boolean;
  /** Remember-me setter. */
  setRememberMe: (v: boolean) => void;
  /** Whether an auth request is in flight. */
  isLoading: boolean;
  /** Validation errors keyed by field name. */
  errors: Record<string, string | undefined>;
  /** Server-side error message. */
  apiError: string | null;
  /** Backend error code (e.g. AUTH_001). */
  errorCode: string | null;
  /** Form submit handler. */
  submit: (e: React.FormEvent) => Promise<void>;
}
