'use client';

import React, {
  useState, useRef, useEffect,
} from 'react';
import { classNames }
  from '../utils/classNames';
import { TimePickerProps }
  from './datePickerTypes';
import { formatTime }
  from './datePickerUtils';
import { handleTimeChange }
  from './timePickerHandler';

/** TimePicker - time selection component. */
export function TimePicker({
  value, onChange, label,
  disabled = false, className,
  sx, renderInput,
}: TimePickerProps) {
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

  const onInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => handleTimeChange(
    e.target.value, setInternal, onChange);

  const inputProps = {
    type: 'time' as const,
    value: formatTime(current ?? null),
    onChange: onInput,
    disabled,
    ref: inputRef,
    className: 'm3-timepicker-input',
  };
  if (renderInput) {
    return renderInput(
      inputProps as unknown as Record<
        string, unknown
      >);
  }
  return (
    <div className={classNames(
      'm3-timepicker', className
    )} style={sx}>
      {label && (
        <label className={
          'm3-timepicker-label'
        }>
          {label}
        </label>
      )}
      <input {...inputProps} />
    </div>
  );
}

export default TimePicker;
