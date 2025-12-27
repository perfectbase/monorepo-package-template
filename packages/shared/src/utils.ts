/**
 * Utility functions shared across packages.
 */

/**
 * Creates a class name string from multiple class name parts.
 * Filters out falsy values.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Type-safe no-op function.
 */
export function noop(): void {
  // intentionally empty
}

/**
 * Identity function - returns the value passed in.
 */
export function identity<T>(value: T): T {
  return value;
}

