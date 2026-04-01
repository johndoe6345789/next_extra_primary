"use client";

export { useMediaQuery } from "../../../hooks/useMediaQuery";

import { useMediaQuery } from "../../../hooks/useMediaQuery";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

const breakpoints: Record<Breakpoint, number> = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

/** Hook for min-width media query. */
export function useMediaQueryUp(breakpoint: Breakpoint | number): boolean {
  const width =
    typeof breakpoint === "string" ? breakpoints[breakpoint] : breakpoint;
  return useMediaQuery(`(min-width: ${width}px)`);
}

/** Hook for max-width media query. */
export function useMediaQueryDown(breakpoint: Breakpoint | number): boolean {
  const width =
    typeof breakpoint === "string" ? breakpoints[breakpoint] : breakpoint;
  return useMediaQuery(`(max-width: ${width - 0.05}px)`);
}

/** Hook for between min/max media query. */
export function useMediaQueryBetween(
  start: Breakpoint | number,
  end: Breakpoint | number,
): boolean {
  const startW = typeof start === "string" ? breakpoints[start] : start;
  const endW = typeof end === "string" ? breakpoints[end] : end;
  return useMediaQuery(
    `(min-width: ${startW}px)` + ` and (max-width: ${endW - 0.05}px)`,
  );
}

export default useMediaQuery;
