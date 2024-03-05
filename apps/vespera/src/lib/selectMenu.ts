import { StringSelectMenuBuilder } from '../structure/StringSelectMenuBuilder';
import type { Callback } from '../utils';

/**
 * The code `export type StringSelectMenu<S extends unknown = unknown> = Callback<[StringSelectMenuBuilder<S>]>;` is
 * defining a type alias named `StringSelectMenu`. This type alias takes a generic type `S` as a parameter, which extends
 * `unknown` by default. The type `StringSelectMenu` is then defined as a callback function that takes an array containing
 * a `StringSelectMenuBuilder<S>` as its argument.
 *
 * @typedef
 * @name StringSelectMenu
 * @kind variable
 * @param {unknown} S
 * @exports
 */
export type StringSelectMenu<S extends unknown = unknown> = Callback<[StringSelectMenuBuilder<S>]>;

/**
 * The function `createStringSelectMenu` creates a string select menu using a callback function.
 * @param callback - The `callback` parameter in the `createStringSelectMenu` function is a function
 * that takes a `StringSelectMenuBuilder` as an argument and returns a `StringSelectMenuBuilder`.
 * @returns The `createStringSelectMenu` function is returning the result of calling the `callback`
 * function with a new instance of `StringSelectMenuBuilder<S>` as an argument. The return value is
 * then cast as `StringSelectMenuBuilder<S>` before being returned from the `createStringSelectMenu`
 * function.
 */
export function createStringSelectMenu<S extends unknown = unknown>(callback: StringSelectMenu<S>) {
  return callback(new StringSelectMenuBuilder<S>()) as StringSelectMenuBuilder<S>;
}
