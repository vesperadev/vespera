import type { Client } from '..';
import { BaseContext, CommandContext } from '..';
import type {
  APIApplicationCommandInteraction,
  APIBaseInteraction,
  APIChatInputApplicationCommandInteraction,
  APIPingInteraction,
} from '../core';
import { ApplicationCommandType, InteractionResponseType, InteractionType } from '../core';

import { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from './SlashCommand';

export class ClientHandler {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Handle an interaction.
   *
   * @param {APIBaseInteraction<InteractionType, unknown>} data - the input data for the interaction
   * @return {Promise<void>} a promise that resolves when the function has completed handling the interaction
   */
  public async handleInteraction(data: APIBaseInteraction<InteractionType, unknown>) {
    const context = new BaseContext(this.client, data);
    this.client.emit('interaction', context);

    switch (context.type) {
      case InteractionType.ApplicationCommand:
        return this.handleApplicationCommandInteraction(context.raw as APIApplicationCommandInteraction);

      case InteractionType.Ping:
        return this.handlePingInteraction(context.raw as APIPingInteraction);

      case InteractionType.MessageComponent:
        break;

      case InteractionType.ApplicationCommandAutocomplete:
        break;

      case InteractionType.ModalSubmit:
        break;

      default:
        break;
    }
  }

  /**
   * Handle a ping interaction.
   *
   * @private
   * @param {APIPingInteraction} data - the data for the ping interaction
   * @return {object} an object with the type InteractionResponseType.Pong
   */
  private async handlePingInteraction(data: APIPingInteraction) {
    return { type: InteractionResponseType.Pong };
  }

  /**
   * Handle application command interaction.
   *
   * @private
   * @param {APIApplicationCommandInteraction} data - the application command interaction data
   * @return {Object} an object with the type of InteractionResponseType
   */
  private async handleApplicationCommandInteraction(data: APIApplicationCommandInteraction) {
    switch (data.data.type) {
      case ApplicationCommandType.ChatInput:
        {
          const context = new CommandContext(this.client, data as APIChatInputApplicationCommandInteraction);
          this.client.emit('command', context);

          const command = this.client.commands.get(context.raw.data.name);

          if (command) {
            if (command.middlewares && Array.isArray(command.middlewares) && command.middlewares.length) {
              for await (const middleware of command.middlewares) {
                await middleware(context);
              }
            }

            if (context.subcommandGroup) {
              const subcommandGroup = command.options.find(
                (opt) =>
                  opt instanceof SlashCommandSubcommandGroupBuilder && opt.name === context.subcommandGroup?.name,
              ) as SlashCommandSubcommandGroupBuilder<unknown> | undefined;

              if (subcommandGroup) {
                if (
                  subcommandGroup.middlewares &&
                  Array.isArray(subcommandGroup.middlewares) &&
                  subcommandGroup.middlewares.length
                ) {
                  for await (const middleware of subcommandGroup.middlewares) {
                    await middleware(context);
                  }
                }

                if (context.subcommand) {
                  const subcommand = subcommandGroup.options.find(
                    (opt) => opt instanceof SlashCommandSubcommandBuilder && opt.name === context.subcommand?.name,
                  ) as SlashCommandSubcommandBuilder<unknown> | undefined;

                  if (subcommand) {
                    if (
                      subcommand.middlewares &&
                      Array.isArray(subcommand.middlewares) &&
                      subcommand.middlewares.length
                    ) {
                      for await (const middleware of subcommand.middlewares) {
                        await middleware(context);
                      }
                    }

                    await subcommand.run(context);
                    return {
                      type: InteractionResponseType.DeferredChannelMessageWithSource,
                    };
                  }
                }

                await subcommandGroup.run(context);
                return {
                  type: InteractionResponseType.DeferredChannelMessageWithSource,
                };
              }
            }

            if (context.subcommand) {
              const subcommand = command.options.find(
                (opt) => opt instanceof SlashCommandSubcommandBuilder && opt.name === context.subcommand?.name,
              ) as SlashCommandSubcommandBuilder<unknown> | undefined;

              if (subcommand) {
                if (subcommand.middlewares && Array.isArray(subcommand.middlewares) && subcommand.middlewares.length) {
                  for await (const middleware of subcommand.middlewares) {
                    await middleware(context);
                  }
                }

                await subcommand.run(context);
                return {
                  type: InteractionResponseType.DeferredChannelMessageWithSource,
                };
              }
            }

            await command.run(context);
            this.client.emit('postCommand', context);
          }
        }
        break;

      default:
        break;
    }

    return {
      type: InteractionResponseType.DeferredChannelMessageWithSource,
    };
  }
}
