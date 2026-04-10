/**
 * Maps raw API errors to i18n translation keys.
 * @module hooks/matchChatError
 */
import errors from '@/constants/chat-errors.json';

type ErrMap = Record<string, string>;

/**
 * Match a raw API error string to a translated
 * user-friendly message.
 *
 * @param raw - Raw error text from the API.
 * @param t - next-intl translation function.
 * @returns Translated error message.
 */
const matchError = (
  raw: string, t: (k: string) => string,
): string => {
  const lower = raw.toLowerCase();
  for (const [pattern, key] of
    Object.entries(errors as ErrMap)) {
    if (lower.includes(pattern)) return t(key);
  }
  return t('chat.errors.generic');
};

export default matchError;
