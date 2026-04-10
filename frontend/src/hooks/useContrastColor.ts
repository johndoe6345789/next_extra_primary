'use client';

import {
  useLayoutEffect, useRef, useState,
} from 'react';
import cfg from '@/constants/contrast.json';
import {
  lum, parseRgb, ratio, hue, hslToRgb,
} from './colorUtils';

const {
  threshold, minContrast,
  lightL, lightS, darkL, darkS,
} = cfg;

/**
 * Compute a monochromatic contrasting color.
 * Keeps the background's hue, sets lightness
 * for contrast, then verifies WCAG compliance.
 */
const graceful = (
  r: number, g: number, b: number,
): string => {
  const bgL = lum(r, g, b);
  const h = hue(r, g, b);
  const light = bgL <= threshold;
  const s = light ? lightS : darkS;
  const l = light ? lightL : darkL;
  const [tr, tg, tb] = hslToRgb(h, s, l);
  const textL = lum(tr, tg, tb);
  if (ratio(bgL, textL) >= minContrast) {
    return `rgb(${tr}, ${tg}, ${tb})`;
  }
  return light ? '#fff' : '#000';
};

/**
 * Contrasting text color computed from an
 * element's background luminance. Produces
 * monochromatic harmony by preserving the
 * background's hue. Recomputes on theme change.
 *
 * @returns ref to attach to the bg element,
 *          and the computed CSS color string.
 */
export function useContrastColor() {
  const ref = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState('#fff');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const compute = () => {
      const bg = getComputedStyle(el)
        .backgroundColor;
      const rgb = parseRgb(bg);
      if (!rgb) return;
      setColor(graceful(...rgb));
    };
    compute();
    const obs = new MutationObserver(compute);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [
        'data-theme', 'class', 'style',
        'data-mui-color-scheme',
      ],
    });
    return () => obs.disconnect();
  }, []);

  return { ref, color };
}
