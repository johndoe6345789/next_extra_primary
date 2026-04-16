'use client';

import React from 'react';
import { IconButton } from '@shared/m3';
import {
  PREV_BTN, NEXT_BTN,
} from './photoLightboxStyles';

/** Props for LightboxNav buttons. */
export interface LightboxNavProps {
  /** Label for previous button. */
  prevLabel: string;
  /** Label for next button. */
  nextLabel: string;
  /** Whether previous is disabled. */
  disablePrev: boolean;
  /** Whether next is disabled. */
  disableNext: boolean;
  /** Called to go to previous. */
  onPrev: () => void;
  /** Called to go to next. */
  onNext: () => void;
}

/**
 * Prev/next navigation buttons for photo lightbox.
 *
 * @param props - LightboxNav props.
 * @returns Two IconButton elements.
 */
export function LightboxNav({
  prevLabel, nextLabel,
  disablePrev, disableNext,
  onPrev, onNext,
}: LightboxNavProps): React.ReactElement {
  return (
    <>
      <IconButton
        aria-label={prevLabel}
        onClick={onPrev}
        disabled={disablePrev}
        data-testid="lightbox-prev"
        style={PREV_BTN}
      >
        ‹
      </IconButton>
      <IconButton
        aria-label={nextLabel}
        onClick={onNext}
        disabled={disableNext}
        data-testid="lightbox-next"
        style={NEXT_BTN}
      >
        ›
      </IconButton>
    </>
  );
}

export default LightboxNav;
