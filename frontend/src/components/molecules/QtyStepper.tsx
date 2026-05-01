'use client';

/**
 * Quantity stepper — minus / number / plus, used on
 * the product detail page and any other "buy N units"
 * surface. Standardises button padding/sizing so the
 * three controls stay visually balanced.
 *
 * @module components/molecules/QtyStepper
 */
import React from 'react';
import { Box } from '@shared/m3/Box';
import { Button } from '@shared/m3/Button';
import { Typography } from '@shared/m3/Typography';

/** Props for QtyStepper. */
export interface QtyStepperProps {
  /** Current quantity. */
  value: number;
  /** Highest value the + button will allow. */
  max: number;
  /** Called with the new quantity on every change. */
  onChange: (next: number) => void;
  /** A11y label for the decrement button. */
  decreaseLabel?: string;
  /** A11y label for the increment button. */
  increaseLabel?: string;
  /** data-testid prefix. */
  testId?: string;
}

/**
 * Minus-N-plus quantity stepper.
 *
 * @param props - Component props.
 */
export const QtyStepper: React.FC<QtyStepperProps> = ({
  value, max, onChange,
  decreaseLabel = 'Decrease quantity',
  increaseLabel = 'Increase quantity',
  testId = 'qty-stepper',
}) => (
  <Box sx={{
    display: 'flex', gap: 1.5,
    alignItems: 'center',
  }}>
    <Button variant="outlined"
      onClick={() => onChange(Math.max(1, value - 1))}
      disabled={value <= 1}
      aria-label={decreaseLabel}
      data-testid={`${testId}-dec`}
      sx={{ minWidth: '40px',
        padding: '6px 12px' }}>−</Button>
    <Typography sx={{ minWidth: '32px',
      textAlign: 'center',
      fontSize: '1rem',
      fontWeight: 500 }}>{value}</Typography>
    <Button variant="outlined"
      onClick={() => onChange(value + 1)}
      disabled={value >= max}
      aria-label={increaseLabel}
      data-testid={`${testId}-inc`}
      sx={{ minWidth: '40px',
        padding: '6px 12px' }}>+</Button>
  </Box>
);

export default QtyStepper;
