import type { CommandContext } from '../structure/Context/CommandContext';
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
 * @param {SlashCommandBuilder<CommandContext<S>>} builder - The builder for creating a slash command.
 * @returns A command callback result.
 */
export type Command<S extends unknown = unknown> = Callback<[SlashCommandBuilder<CommandContext<S>>]>;

/**
 * Type alias for a SubCommandGroup callback.
 *
 * @typeParam S - The state type that extends `unknown` by default.
 * @callback SubCommandGroup
 * @param {SlashCommandSubcommandGroupBuilder<CommandContext<S>>} builder - The builder for creating a subcommand group.
 * @returns A subcommand group callback result.
 */
export type SubCommandGroup<S extends unknown = unknown> = Callback<
  [SlashCommandSubcommandGroupBuilder<CommandContext<S>>]
>;

/**
 * Type alias for a SubCommand callback.
 *
 * @typeParam S - The state type that extends `unknown` by default.
 * @callback SubCommand
 * @param {SlashCommandSubcommandBuilder<CommandContext<S>>} builder - The builder for creating a subcommand.
 * @returns A subcommand callback result.
 */
export type SubCommand<S extends unknown = unknown> = Callback<[SlashCommandSubcommandBuilder<CommandContext<S>>]>;

/**
 * Creates a command with the given callback function.
 *
 * @param {Command} command - The callback function for creating the command.
 * @return {SlashCommandBuilder<CommandContext<S>>} The result of calling the callback function with a new SlashCommandBuilder.
 */
export function createCommand<S extends unknown = unknown>(command: Command<S>) {
  return command(new SlashCommandBuilder()) as SlashCommandBuilder<CommandContext<S>>;
}

/**
 * Creates a subcommand group with the given callback function.
 *
 * @param {SubCommandGroup} subCommandGroup - The callback function for creating the subcommand group.
 * @return {SlashCommandSubcommandGroupBuilder<CommandContext<S>>} The result of calling the callback function with a new SlashCommandSubcommandGroupBuilder.
 */
export function createSubCommandGroup<S extends unknown = unknown>(subCommandGroup: SubCommandGroup<S>) {
  return subCommandGroup(new SlashCommandSubcommandGroupBuilder()) as SlashCommandSubcommandGroupBuilder<
    CommandContext<S>
  >;
}

/**
 * Creates a subcommand with the given callback function.
 *
 * @param {SubCommand} subCommand - The callback function for creating the subcommand.
 * @return {SlashCommandSubcommandBuilder<CommandContext<S>>} The result of calling the callback function with a new SlashCommandSubcommandBuilder.
 */
export function createSubCommand<S extends unknown = unknown>(subCommand: SubCommand<S>) {
  return subCommand(new SlashCommandSubcommandBuilder()) as SlashCommandSubcommandBuilder<CommandContext<S>>;
}
