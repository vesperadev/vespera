import { ButtonBuilder } from '../structure/ButtonBuilder';
import type { ButtonContext } from '../structure/Context/ButtonContext';
import type { Callback } from '../utils';

/**
 * Type alias for a Button callback.
 *
 * @typeParam S - The state type that extends `unknown` by default.
 * @callback Button
 * @param {ButtonBuilder<ButtonContext<S>>} builder - The builder for creating a button.
 * @returns A button callback result.
 */
export type Button<S extends unknown = unknown> = Callback<[ButtonBuilder<ButtonContext<S>>]>;

/**
 * Creates a button with the given callback function.
 *
 * @param {Button<S>} command - The callback function for creating the button.
 * @return {ButtonBuilder<ButtonContext<S>>} The result of calling the callback function with a new ButtonBuilder.
 */
export function createButton<S extends unknown = unknown>(button: Button<S>) {
  return button(new ButtonBuilder()) as ButtonBuilder<ButtonContext<S>>;
}
