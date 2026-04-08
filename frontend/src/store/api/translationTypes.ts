/**
 * Types for translation API endpoints.
 * @module store/api/translationTypes
 */

/** Flat translation entry for admin editing. */
export interface TranslationEntry {
  locale: string;
  namespace: string;
  key: string;
  value: string;
}

/** Per-locale coverage stats. */
export interface LocaleCoverage {
  locale: string;
  present: number;
  total: number;
  isReference: boolean;
}

/** Coverage response. */
export interface CoverageResponse {
  reference: string;
  locales: LocaleCoverage[];
}

/** Upsert payload for a single translation. */
export interface UpsertPayload {
  locale: string;
  namespace: string;
  key: string;
  value: string;
}

/** Delete payload identifying a translation. */
export interface DeletePayload {
  locale: string;
  namespace: string;
  key: string;
}
