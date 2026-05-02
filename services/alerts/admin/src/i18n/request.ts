/**
 * @file request.ts
 * @brief next-intl request-side config. The
 *        alerts admin is single-locale; we
 *        always serve the default bundle.
 */

import { getRequestConfig } from 'next-intl/server'
import { DEFAULT_LOCALE, MESSAGES } from './messages'

export default getRequestConfig(async () => ({
  locale: DEFAULT_LOCALE,
  messages: MESSAGES[DEFAULT_LOCALE],
}))
