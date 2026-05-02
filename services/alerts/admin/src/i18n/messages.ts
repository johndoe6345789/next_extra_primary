/**
 * @file messages.ts
 * @brief Static message bundle for the alerts admin
 *        UI. Loaded at module init so server and
 *        client renders share the same source.
 *
 * Keys are mirrored in the canonical
 * `services/i18n/seeds/translations/*.json` and
 * seeded into Postgres for the main frontend.
 */

import enMessages from '../messages/en.json'

/** Default locale for the standalone alerts admin. */
export const DEFAULT_LOCALE = 'en' as const

/** Tag for any AbstractIntlMessages-compatible map. */
export type Messages = typeof enMessages

/** Bundled messages keyed by locale code. */
export const MESSAGES: Record<string, Messages> = {
  en: enMessages,
}
