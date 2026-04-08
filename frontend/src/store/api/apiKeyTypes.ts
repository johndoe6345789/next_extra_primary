/**
 * Type definitions for API key management.
 * @module store/api/apiKeyTypes
 */

/** Masked key entry from the server. */
export interface ApiKeyEntry {
  provider: string;
  model: string;
  maskedKey: string;
}

/** Save key request body. */
export interface SaveKeyRequest {
  provider: string;
  apiKey: string;
  model?: string;
}

/** System key entry (admin). */
export interface SystemKeyEntry {
  provider: string;
  configured: boolean;
  maskedKey: string;
}

/** Save system key request. */
export interface SaveSystemKeyRequest {
  provider: string;
  apiKey: string;
}
