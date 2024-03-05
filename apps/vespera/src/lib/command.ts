import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from '../structure/SlashCommand';
import type { Callback } from '../utils';

/**
 * Type alias for a Command callback.
 *
 * @typeParam S - The state type that extends `unknown` by default.
 * @callback Command
 * @param {SlashCommandBuilder<S>} builder - The builder for creating a slash command.
 * @returns A command callback result.
 */
export type Command<S extends unknown = unknown> = Callback<[SlashCommandBuilder<S>]>;

/**
 * Type alias for a SubCommandGroup callback.
 *
 * @typeParam S - The state type that extends `unknown` by default.
 * @callback SubCommandGroup
 * @param {SlashCommandSubcommandGroupBuilder<S>} builder - The builder for creating a subcommand group.
 * @returns A subcommand group callback result.
 */
export type SubCommandGroup<S extends unknown = unknown> = Callback<[SlashCommandSubcommandGroupBuilder<S>]>;

/**
 * Type alias for a SubCommand callback.
 *
 * @typeParam S - The state type that extends `unknown` by default.
 * @callback SubCommand
 * @param {SlashCommandSubcommandBuilder<S>} builder - The builder for creating a subcommand.
 * @returns A subcommand callback result.
 */
export type SubCommand<S extends unknown = unknown> = Callback<[SlashCommandSubcommandBuilder<S>]>;

/**
 * The function createCommand takes a command and returns a SlashCommandBuilder.
 * @param command - The `createCommand` function takes a `command` parameter, which is a function that
 * accepts a `SlashCommandBuilder` as an argument and returns a `SlashCommandBuilder`. The `command`
 * function is a generic function that can accept any type `S` as its argument.
 * @returns The `createCommand` function is returning the result of calling the `command` function with
 * a new `SlashCommandBuilder()` instance, and then casting the result as `SlashCommandBuilder<S>`.
 */
export function createCommand<S extends unknown = unknown>(command: Command<S>) {
  return command(new SlashCommandBuilder()) as SlashCommandBuilder<S>;
}

/**
 * The function `createSubCommandGroup` creates a subcommand group for a slash command.
 * @param subCommandGroup - The `subCommandGroup` parameter is a function that takes a
 * `SlashCommandSubcommandGroupBuilder` as an argument and returns a
 * `SlashCommandSubcommandGroupBuilder` with a generic type `S`.
 * @returns The `createSubCommandGroup` function is returning the result of calling the
 * `subCommandGroup` function with a `SlashCommandSubcommandGroupBuilder` instance as an argument, and
 * then casting the result as a `SlashCommandSubcommandGroupBuilder<S>`.
 */
export function createSubCommandGroup<S extends unknown = unknown>(subCommandGroup: SubCommandGroup<S>) {
  return subCommandGroup(new SlashCommandSubcommandGroupBuilder()) as SlashCommandSubcommandGroupBuilder<S>;
}

/**
 * The function `createSubCommand` creates a subcommand for a slash command.
 * @param subCommand - The `subCommand` parameter is a function that takes a
 * `SlashCommandSubcommandBuilder` as an argument and returns a `SlashCommandSubcommandBuilder` with a
 * generic type `S`.
 * @returns The `createSubCommand` function is returning the result of calling the `subCommand`
 * function with a `SlashCommandSubcommandBuilder` instance as an argument, and then casting the result
 * as a `SlashCommandSubcommandBuilder<S>`.
 */
export function createSubCommand<S extends unknown = unknown>(subCommand: SubCommand<S>) {
  return subCommand(new SlashCommandSubcommandBuilder()) as SlashCommandSubcommandBuilder<S>;
}
