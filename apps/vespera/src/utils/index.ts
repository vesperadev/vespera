export * from '@discordjs/util';
export * from '@discordjs/formatters';
export * from '@discordjs/collection';

/**
 * Type definition for a generic callback function.
 *
 * @param callback - The input parameter of type T.
 * @returns A promise that resolves to either type T or unknown, or a direct value of type T or unknown.
 */
export type Callback<T extends unknown[]> = (...callback: T) => Promise<T | unknown> | T | unknown;

/**
 * Retrieves the timestamp from a given snowflake string.
 *
 * @param {string} snowflake - The snowflake string to extract the timestamp from
 * @return {number} The timestamp value in milliseconds
 */
export function getTimestamp(snowflake: string) {
  const milliseconds = BigInt(parseInt(snowflake)) >> 22n;
  return new Date(Number(milliseconds) + 1420070400000).valueOf();
}
