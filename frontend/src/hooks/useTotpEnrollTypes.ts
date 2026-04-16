/**
 * Type definitions for useTotpEnroll.
 * @module hooks/useTotpEnrollTypes
 */

/** Possible states for the TOTP enrolment flow. */
export type TotpStatus =
  | 'idle'
  | 'enrolling'
  | 'verifying'
  | 'success'
  | 'error';

/** Enrolment data returned by the backend. */
export interface TotpEnrollData {
  otpauth_url: string;
  recovery_codes: string[];
}

/** Public surface of the useTotpEnroll hook. */
export interface UseTotpEnrollReturn {
  status: TotpStatus;
  enrollData: TotpEnrollData | null;
  recoveryCodes: string[];
  error: string | null;
  enroll: () => Promise<void>;
  verify: (code: string) => Promise<void>;
  disable: (code: string) => Promise<void>;
}
