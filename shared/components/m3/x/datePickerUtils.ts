/**
 * Utility functions for date/time formatting
 * used by DatePicker, TimePicker, and
 * DateTimePicker components.
 */

/** Format a date to YYYY-MM-DD. */
export const formatDate = (
  date: Date | null
): string => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');
  const day = String(
    date.getDate()
  ).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** Format a time to HH:MM. */
export const formatTime = (
  date: Date | null
): string => {
  if (!date) return '';
  const hours = String(
    date.getHours()
  ).padStart(2, '0');
  const minutes = String(
    date.getMinutes()
  ).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/** Format a datetime to YYYY-MM-DDTHH:MM. */
export const formatDateTime = (
  date: Date | null
): string => {
  if (!date) return '';
  return `${formatDate(date)}T${formatTime(date)}`;
};
