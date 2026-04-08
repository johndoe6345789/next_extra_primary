/**
 * Type definitions for DatePicker, TimePicker,
 * and DateTimePicker components.
 */

import React from 'react';

/** Props for the DatePicker component. */
export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  format?: string;
  inputFormat?: string;
  views?: ('year' | 'month' | 'day')[];
  openTo?: 'year' | 'month' | 'day';
  className?: string;
  sx?: React.CSSProperties;
  renderInput?: (
    props: Record<string, unknown>
  ) => React.ReactNode;
  disableFuture?: boolean;
  disablePast?: boolean;
  testId?: string;
}

/** Props for the TimePicker component. */
export interface TimePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  disabled?: boolean;
  ampm?: boolean;
  views?: (
    | 'hours'
    | 'minutes'
    | 'seconds'
  )[];
  className?: string;
  sx?: React.CSSProperties;
  renderInput?: (
    props: Record<string, unknown>
  ) => React.ReactNode;
}

/** Props for the DateTimePicker component. */
export interface DateTimePickerProps
  extends Omit<DatePickerProps, 'views'>,
    Omit<TimePickerProps, 'views'> {
  dateFormat?: string;
  timeFormat?: string;
  views?: (
    | 'year'
    | 'month'
    | 'day'
    | 'hours'
    | 'minutes'
    | 'seconds'
  )[];
}
