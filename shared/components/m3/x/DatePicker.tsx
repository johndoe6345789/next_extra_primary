'use client';

import React, { useState, useRef, useEffect } from 'react';
import { classNames } from '../utils/classNames';
import { DatePickerProps } from './datePickerTypes';
import { formatDate } from './datePickerUtils';

/**
 * DatePicker - Date selection component
 * using a native date input.
 */
export function DatePicker({
  value, onChange, label, disabled = false,
  minDate, maxDate, className, sx,
  renderInput, disableFuture = false,
  disablePast = false, testId,
}: DatePickerProps) {
  const [internal, setInternal] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const current = value !== undefined ? value : internal;

  useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const str = e.target.value;
    const d = str ? new Date(str + 'T00:00:00') : null;
    setInternal(d);
    onChange?.(d);
  };

  const getMinMax = () => {
    let min: string | undefined;
    let max: string | undefined;
    if (minDate) min = formatDate(minDate);
    if (maxDate) max = formatDate(maxDate);
    if (disablePast) min = formatDate(new Date());
    if (disableFuture) max = formatDate(new Date());
    return { min, max };
  };

  const { min, max } = getMinMax();
  const inputProps = {
    type: 'date' as const,
    value: formatDate(current ?? null),
    onChange: handleChange,
    disabled, min, max,
    ref: inputRef,
    className: 'm3-datepicker-input',
  };

  if (renderInput) {
    return renderInput(
      inputProps as unknown as Record<string, unknown>
    );
  }

  return (
    <div
      className={classNames('m3-datepicker', className)}
      style={sx}
      data-testid={testId}
      aria-label={label}
    >
      {label && (
        <label className="m3-datepicker-label">
          {label}
        </label>
      )}
      <input {...inputProps} />
    </div>
  );
}

/** Alias for API compatibility. */
export const DesktopDatePicker = DatePicker;
/** Alias for API compatibility. */
export const MobileDatePicker = DatePicker;
/** Alias for API compatibility. */
export const StaticDatePicker = DatePicker;
/** Alias for API compatibility. */
export const CalendarPicker = DatePicker;

export default DatePicker;
