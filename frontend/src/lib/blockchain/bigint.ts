/**
 * Helper function to stringify bigints in JSON.stringify
 * 
 * @example
 * ```typescript
 * JSON.stringify(obj, JSONStringifyBigIntHelper)
 * ```
 */
export function JSONStringifyBigIntHelper(key: string, value: unknown) {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}