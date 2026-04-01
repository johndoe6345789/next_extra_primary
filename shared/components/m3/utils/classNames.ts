type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | Record<string, unknown>;

/**
 * Combine class names conditionally.
 *
 * @param args - Class values to merge.
 * @returns Space-separated class string.
 */
export function classNames(...args: ClassValue[]): string {
  const classes: string[] = [];

  for (const arg of args) {
    if (!arg) continue;

    const argType = typeof arg;

    if (argType === "string" || argType === "number") {
      classes.push(String(arg));
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = classNames(...arg);
        if (inner) {
          classes.push(inner);
        }
      }
    } else if (argType === "object") {
      const obj = arg as Record<string, unknown>;
      if (obj.toString !== Object.prototype.toString) {
        classes.push(obj.toString());
      } else {
        for (const [key, value] of Object.entries(obj)) {
          if (value) {
            classes.push(key);
          }
        }
      }
    }
  }

  return classes.join(" ");
}

export default classNames;
