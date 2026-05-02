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
 * NextExtra SVG wordmark — purple diamond mark + bold
 * "Next" with italic "Extra" in lighter purple. Matches
 * the Keycloak login theme's logo so the brand is
 * consistent across the app and auth surfaces.
 *
 * @param props - Component props.
 */
export const NextExtraLogo: React.FC<
  NextExtraLogoProps
> = ({ height = 40, ariaLabel = 'NextExtra' }) => {
  const w = height * 5;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 56"
      width={w}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      <title>{ariaLabel}</title>
      <defs>
        <linearGradient
          id="nx-d-grad" x1="0" y1="0" x2="1" y2="1"
        >
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <filter
          id="nx-d-glow"
          x="-30%" y="-30%" width="160%" height="160%"
        >
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#nx-d-glow)">
        <polygon
          points="28,8 44,28 28,48 12,28"
          fill="url(#nx-d-grad)"
        />
        <polygon
          points="28,16 38,28 28,40 18,28"
          fill="#0c0a14"
          opacity="0.4"
        />
      </g>
      <text
        x="60" y="36"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif"
        fontSize="26" fontWeight="800"
        fill="currentColor"
        letterSpacing="-0.02em"
      >
        Next
      </text>
      <text
        x="135" y="36"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif"
        fontSize="26" fontWeight="600"
        fontStyle="italic"
        fill="#c4b5fd"
        letterSpacing="-0.02em"
      >
        Extra
      </text>
    </svg>
  );
};

export default NextExtraLogo;
