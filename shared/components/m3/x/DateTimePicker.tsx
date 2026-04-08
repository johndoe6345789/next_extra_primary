'use client';

import React, {
  useState, useRef, useEffect,
} from 'react';
import { classNames }
  from '../utils/classNames';
import { DateTimePickerProps }
  from './datePickerTypes';
import { formatDateTime }
  from './datePickerUtils';
import { getDateTimeMinMax }
  from './dateTimeMinMax';

/** DateTimePicker - combined date and time. */
export function DateTimePicker({
  value, onChange, label,
  disabled = false, minDate, maxDate,
  className, sx, renderInput,
  disableFuture = false,
  disablePast = false,
}: DateTimePickerProps) {
  const [internal, setInternal] =
    useState(value);
  const inputRef =
    useRef<HTMLInputElement>(null);
  const current =
    value !== undefined ? value : internal;

  useEffect(() => {
    if (value !== undefined)
      setInternal(value);
  }, [value]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const str = e.target.value;
    const d = str ? new Date(str) : null;
    setInternal(d);
    onChange?.(d);
  };
  const { min, max } = getDateTimeMinMax({
    minDate, maxDate,
    disablePast, disableFuture,
  });
  const inputProps = {
    type: 'datetime-local' as const,
    value: formatDateTime(current ?? null),
    onChange: handleChange,
    disabled, min, max, ref: inputRef,
    className: 'm3-datetimepicker-input',
  };
  if (renderInput) {
    return renderInput(
      inputProps as unknown as Record<
        string, unknown
      >);
  }
  return (
    <div className={classNames(
      'm3-datetimepicker', className
    )} style={sx}>
      {label && (
        <label className={
          'm3-datetimepicker-label'
        }>
          {label}
        </label>
      )}
      <input {...inputProps} />
    </div>
  );
}

export default DateTimePicker;
