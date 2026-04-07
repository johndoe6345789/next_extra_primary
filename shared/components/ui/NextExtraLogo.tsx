'use client';

import React from 'react';

/** Props for the NextExtra SVG logo. */
export interface NextExtraLogoProps {
  /** Logo height in pixels. */
  height?: number;
  /** Accessible label. */
  ariaLabel?: string;
}

/**
 * NextExtra SVG wordmark with star accent.
 * Split "Next" + italic "Extra" with glow.
 *
 * @param props - Component props.
 */
export const NextExtraLogo: React.FC<
  NextExtraLogoProps
> = ({ height = 40, ariaLabel = 'NextExtra' }) => {
  const w = height * 5.6;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 56"
      width={w}
      height={height}
      role="img"
      aria-label={ariaLabel}
      fill="none"
    >
      <title>{ariaLabel}</title>
      <text
        x="36"
        y="41"
        fontFamily="'Segoe UI', system-ui, sans-serif"
        fontWeight="600"
        fontSize="38"
        letterSpacing="-0.5"
        fill="#7C3AED"
      >
        Next
      </text>
      <text
        x="124"
        y="41"
        fontFamily="'Segoe UI', system-ui, sans-serif"
        fontWeight="600"
        fontStyle="italic"
        fontSize="38"
        letterSpacing="-0.5"
        fill="#7C3AED"
      >
        Extra
      </text>
      <path
        d="M16,6 C17.5,18 25,24 25,28
           C25,32 17.5,38 16,50
           C14.5,38 7,32 7,28
           C7,24 14.5,18 16,6Z"
        fill="#7C3AED"
        opacity="0.75"
      />
    </svg>
  );
};

export default NextExtraLogo;
