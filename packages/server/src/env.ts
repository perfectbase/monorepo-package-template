/**
 * Environment utilities for server-side code.
 */

/**
 * Gets an environment variable, throwing if not defined.
 */
export function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}

/**
 * Gets an environment variable with a fallback default.
 */
export function getEnv(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue;
}

/**
 * Checks if running in production mode.
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Checks if running in development mode.
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}
