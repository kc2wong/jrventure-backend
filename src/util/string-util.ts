/** Replace parameter placeHolder {1}, {2}..{n} by actual parameter */
export const replaceParameters = (
  message: string,
  parameters: (string | number | undefined | null)[]
): string => {
  return message.replace(/\{(\d+)\}/g, (match, indexStr) => {
    const index = parseInt(indexStr, 10) - 1; // Convert 1-based index to 0-based
    const value = parameters[index];
    return value ? String(value) : 'null';
  });
};

export function safeParseInt(value: string): number | undefined;
export function safeParseInt(value: number): number;
export function safeParseInt(value: string | number): number | undefined {
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : undefined;
  }

  const rtn = parseInt(value);
  return isNaN(rtn) ? undefined : rtn;
}

export const removeNilValues = <T extends Record<string, any>>(
  obj: T
): Partial<T> =>
  Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value != null)
  ) as Partial<T>;
