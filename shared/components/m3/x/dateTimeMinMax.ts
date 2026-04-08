import { formatDateTime }
  from './datePickerUtils';

/**
 * Compute min/max datetime strings.
 * @param opts - Min/max config options.
 * @returns Object with min and max strings.
 */
export function getDateTimeMinMax(opts: {
  minDate?: Date | null;
  maxDate?: Date | null;
  disablePast?: boolean;
  disableFuture?: boolean;
}): { min?: string; max?: string } {
  let min: string | undefined;
  let max: string | undefined;
  if (opts.minDate)
    min = formatDateTime(opts.minDate);
  if (opts.maxDate)
    max = formatDateTime(opts.maxDate);
  if (opts.disablePast)
    min = formatDateTime(new Date());
  if (opts.disableFuture)
    max = formatDateTime(new Date());
  return { min, max };
}
