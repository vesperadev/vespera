import { ButtonBuilder } from '../structure/ButtonBuilder';
import type { Callback } from '../utils';

/**
 * Type alias for a Button callback.
 *
 * @typeParam S - The state type that extends `unknown` by default.
 * @callback Button
 * @param {ButtonBuilder<S>} builder - The builder for creating a button.
 * @returns A button callback result.
 */
export type Button<S extends unknown = unknown> = Callback<[ButtonBuilder<S>]>;

/**
 * The function `createButton` creates a button using a button builder.
 * @param button - The `button` parameter is a function that takes a `ButtonBuilder` instance as an
 * argument and returns a `ButtonBuilder` instance with a specific state `S`.
 * @returns The `createButton` function is returning a `ButtonBuilder<S>` instance.
 */
export function createButton<S extends unknown = unknown>(button: Button<S>) {
  return button(new ButtonBuilder()) as ButtonBuilder<S>;
}
