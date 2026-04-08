/**
 * Timing utility functions: debounce, throttle,
 * sleep
 */

/**
 * Debounce - delays execution until after wait
 * ms have elapsed since last invocation
 */
export function debounce<
  T extends (...args: unknown[]) => unknown
>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<
    typeof setTimeout
  > | null = null;

  return function executedFunction(
    ...args: Parameters<T>
  ) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle - limits function execution to once
 * per wait period
 */
export function throttle<
  T extends (...args: unknown[]) => unknown
>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeout: ReturnType<
    typeof setTimeout
  > | null = null;

  return function executedFunction(
    ...args: Parameters<T>
  ) {
    const now = Date.now();
    const remaining = wait - (now - lastCall);
    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCall = now;
      func(...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastCall = Date.now();
        timeout = null;
        func(...args);
      }, remaining);
    }
  };
}

/**
 * Sleep - returns a promise that resolves
 * after ms milliseconds
 */
export function sleep(
  ms: number
): Promise<void> {
  return new Promise(
    (resolve) => setTimeout(resolve, ms)
  );
}
