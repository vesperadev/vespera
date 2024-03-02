import EventEmitter from 'node:events';

import { Collection } from '@discordjs/collection';
import { verifyKey } from 'discord-interactions';
import type TypedEmitter from 'typed-emitter';

import type { ButtonContext } from '..';
import { BaseContext } from '..';
import type {
  APIApplicationCommandInteraction,
  APIBaseInteraction,
  APIChatInputApplicationCommandInteraction,
  APIPingInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPutAPIApplicationCommandsResult,
} from '../core';
import { API, ApplicationCommandType, InteractionResponseType, InteractionType } from '../core';
import type { createCommand } from '../lib/command';
import type { RESTOptions } from '../rest';
import { REST } from '../rest';
import { type Callback } from '../utils';

import { ClientUser } from './ClientUser';
import { CommandContext } from './Context/CommandContext';
import { VesperaError } from './Error';
import { ChannelManager } from './Manager/Channel';
import { GuildManager } from './Manager/Guild';
import {
  type SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from './SlashCommand';

/**
 * Interface representing the events that a Client can emit.
 *
 * @property {Callback<[Request]>} request - Emitted when the client makes a request.
 * @property {Callback<[VesperaError]>} error - Emitted when an error occurs in the client.
 * @property {Callback<[RESTPostAPIChatInputApplicationCommandsJSONBody]>} commandRegistered - Emitted after a command has been successfully registered.
 * @property {Callback<[string]>} commandUnregistered - Emitted after a command has been successfully unregistered.
 * @property {Callback<[APIBaseInteraction]>} interaction - Emitted when an interaction is received.
 * @property {Callback<[CommandContext<unknown>]>} command - Emitted when a command interaction is received.
 * @property {Callback<[ButtonContext<unknown>]>} button - Emitted when a button interaction is received.
 */
export interface ClientEvents {
  /**
   * Emitted when the client makes a request.
   *
   * @param {Request} request - The request object.
   */
  request: Callback<[Request]>;

  /**
   * Emitted when an error occurs in the client.
   *
   * @param {VesperaError} error - The error object.
   */
  error: Callback<[VesperaError]>;

  /**
   * Emitted after a command has been successfully registered.
   *
   * @param {RESTPostAPIChatInputApplicationCommandsJSONBody} commandInfo - The data of the registered command.
   */
  commandRegistered: Callback<[RESTPostAPIChatInputApplicationCommandsJSONBody]>;

  /**
   * Emitted after a command has been successfully unregistered.
   *
   * @param {string} commandName - The name of the unregistered command.
   */
  commandUnregistered: Callback<[string]>;

  /**
   * Emitted when an interaction is received.
   *
   * @param {BaseContext<APIBaseInteraction<InteractionType, unknown>, unknown>} interaction - The interaction object.
   */
  interaction: Callback<[BaseContext<APIBaseInteraction<InteractionType, unknown>, unknown>]>;

  /**
   * Emitted when a command interaction is received.
   *
   * @param {CommandContext<unknown>} command - The command object.
   */
  command: Callback<[CommandContext<unknown>]>;

  /**
   * Emitted when a button interaction is received.
   *
   * @param {ButtonContext<unknown>} button - The button object.
   */
  button: Callback<[ButtonContext<unknown>]>;
}

export interface ClientOptions {
  token: string;
  application: {
    id: string;
    publicKey: string;
  };
  rest?: RESTOptions;
  state?: {
    set: Callback<[string, string, number]>;
    get: Callback<[string]>;
  };
}

// @ts-expect-error - ignore for now
export class Client extends (EventEmitter as new () => TypedEmitter<ClientEvents>) {
  public options: ClientOptions;

  public rest: REST;
  public api: API;
  public commands: Collection<string, SlashCommandBuilder<CommandContext<unknown>>>;

  public user: ClientUser;

  public channels: ChannelManager;
  public guilds: GuildManager;

  /**
   * Constructor for initializing the client with the given options.
   *
   * @param {ClientOptions} options - The options for configuring the client.
   * @example
   * ```ts title="example.ts"
   * const client = new Client({
   *   token: 'token',
   *   application: {
   *     id: 'id',
   *     publicKey: 'key',
   *   },
   *   rest: {
   *     version: '10',
   *   },
   *   state: {
   *     set: (key, value, ttl) => {},
   *     get: (key) => {},
   *   },
   * })
   * ```
   */
  constructor(options: ClientOptions) {
    super();

    this.options = options;

    this.rest = new REST(options.rest ?? { version: '10' });
    this.api = new API(this.rest);
    this.commands = new Collection();

    this.user = new ClientUser(this);

    this.channels = new ChannelManager(this);
    this.guilds = new GuildManager(this);

    this.rest.setToken(options.token);
  }

  /**
   * Register commands.
   *
   * @param {ReturnType<typeof createCommand>[]} commands - array of commands
   * @return {void}
   */
  public registerCommands(commands: ReturnType<typeof createCommand>[]) {
    for (const command of commands) {
      this.commands.set(command.name, command);

      const data = command.toJSON();
      this.emit('commandRegistered', data);
    }
  }

  /**
   * Register a command.
   *
   * @param {ReturnType<typeof createCommand>} command - the command to register
   * @return {void}
   */
  public registerCommand(command: ReturnType<typeof createCommand>) {
    this.commands.set(command.name, command);

    const data = command.toJSON();
    this.emit('commandRegistered', data);
  }

  /**
   * Unregisters the given commands from the list of registered commands.
   *
   * @param {ReturnType<typeof createCommand>[]} commands - The array of commands to unregister.
   */
  public unRegisterCommands(commands: ReturnType<typeof createCommand>[]) {
    for (const command of commands) {
      this.commands.has(command.name) ? this.commands.delete(command.name) : null;

      this.emit('commandUnregistered', command.name);
    }
  }

  /**
   * unregisters a command.
   *
   * @param {ReturnType<typeof createCommand>} command - the command to unregister
   * @return {void}
   */
  public unRegisterCommand(command: ReturnType<typeof createCommand>) {
    this.commands.has(command.name) ? this.commands.delete(command.name) : null;
    this.emit('commandUnregistered', command.name);
  }

  /**
   * sweepCommands - A description of the entire function.
   *
   * @return {void}
   */
  public sweepCommands() {
    for (const command of this.commands.values()) {
      this.emit('commandUnregistered', command.name);
    }

    this.commands.sweep(() => true);
  }

  /**
   * deployCommands - deploy the registered commands to the Discord API
   *
   * @return {Promise<RESTPutAPIApplicationCommandsResult>}
   */
  public deployCommands() {
    const body = this.commands.map((command) => command.toJSON());
    return this.api.applicationCommands.bulkOverwriteGlobalCommands(this.options.application.id, body);
  }

  /**
   * Handle the incoming request and validate the signature.
   *
   * @param {Request} request - the request object
   * @return {Promise<{ type: InteractionResponseType }>} a promise that resolves when the request is handled
   */
  public async handleRequest(request: Request) {
    if (request.method !== 'POST') {
      throw new VesperaError('Invalid request method');
    }

    const body = await request.clone().text();

    const signature = request.headers.get('X-Signature-Ed25519');
    const timestamp = request.headers.get('X-Signature-Timestamp');

    if (!signature || !timestamp) {
      throw new VesperaError('Missing signature or timestamp');
    }

    const isValid = verifyKey(body, signature, timestamp, this.options.application.publicKey);

    if (!isValid) {
      throw new VesperaError('Invalid signature');
    }

    const data = JSON.parse(body) as APIBaseInteraction<InteractionType, unknown>;

    return this.handleInteraction(data);
  }

  /**
   * Handle an interaction.
   *
   * @param {APIBaseInteraction<InteractionType, unknown>} data - the input data for the interaction
   * @return {Promise<void>} a promise that resolves when the function has completed handling the interaction
   */
  private async handleInteraction(data: APIBaseInteraction<InteractionType, unknown>) {
    const context = new BaseContext(this, data);
    this.emit('interaction', context);

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
          const context = new CommandContext(this, data as APIChatInputApplicationCommandInteraction);
          this.emit('command', context);

          const command = this.commands.get(context.raw.data.name);

          if (command) {
            if (command.middlewares.length) {
              for await (const middleware of command.middlewares) {
                await middleware(context);
              }
            }

            if (context.subcommandGroup) {
              const subcommandGroup = command.options.find(
                (opt) =>
                  opt instanceof SlashCommandSubcommandGroupBuilder && opt.name === context.subcommandGroup?.name,
              ) as SlashCommandSubcommandGroupBuilder<CommandContext<unknown>> | undefined;

              if (subcommandGroup) {
                if (subcommandGroup.middlewares.length) {
                  for await (const middleware of subcommandGroup.middlewares) {
                    await middleware(context);
                  }
                }

                if (context.subcommand) {
                  const subcommand = subcommandGroup.options.find(
                    (opt) => opt instanceof SlashCommandSubcommandBuilder && opt.name === context.subcommand?.name,
                  ) as SlashCommandSubcommandBuilder<CommandContext<unknown>> | undefined;

                  if (subcommand) {
                    if (subcommand.middlewares.length) {
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
              ) as SlashCommandSubcommandBuilder<CommandContext<unknown>> | undefined;

              if (subcommand) {
                if (subcommand.middlewares.length) {
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
