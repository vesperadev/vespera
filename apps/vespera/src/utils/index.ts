import type { SnakeCasedPropertiesDeep } from 'type-fest';

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

/**
 * Converts the keys of an object to snake case recursively.
 *
 * @param {object} object - The input object to convert to snake case
 * @return {object} The object with keys converted to snake case
 */
export function toSnakeCase<Input extends object>(object: Input): SnakeCasedPropertiesDeep<Input> {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      key.replace(/([A-Z])/g, '_$1').toLowerCase(),
      value instanceof Object ? toSnakeCase(value) : value,
    ]),
  ) as SnakeCasedPropertiesDeep<Input>;
}
