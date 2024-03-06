import EventEmitter from 'node:events';

import { Collection } from '@discordjs/collection';
import { verifyKey } from 'discord-interactions';
import type TypedEmitter from 'typed-emitter';

import { EntitlementManager, type BaseContext, type ButtonContext } from '..';
import type { APIBaseInteraction, InteractionType } from '../core';
import { API } from '../core';
import type { createCommand } from '../lib/command';
import type { createButton } from '../lib/button';
import type { RESTOptions } from '../rest';
import { REST } from '../rest';
import { type Callback } from '../utils';

import type { ButtonBuilder } from './ButtonBuilder';
import { ClientHandler } from './ClientHandler';
import { ClientUser } from './ClientUser';
import type { CommandContext } from './Context/CommandContext';
import { VesperaError } from './Error';
import { ChannelManager } from './Manager/Channel';
import { GuildManager } from './Manager/Guild';
import { type SlashCommandBuilder } from './SlashCommand';
import { UserManager } from './Manager/User';

/**
 * Interface representing the events that a Client can emit.
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

  /**
   * Emitted after the command execution is completed.
   *
   * @param {CommandContext<unknown>} command - The command object.
   */
  postCommand: Callback<[CommandContext<unknown>]>;
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
  /**
   * The client options through which the client was initialized.
   *
   * @property
   * @name options
   * @kind property
   * @memberof Client
   * @public
   * @readonly
   * @type {ClientOptions}
   */
  public readonly options: ClientOptions;

  /**
   * This property is used to store an instance of the `REST` class, which is responsible for handling REST API requests and
   * responses within the Discord client implementation. By declaring it as a public property, it can be accessed from outside the class as needed.
   *
   * @property
   * @name rest
   * @kind property
   * @memberof Client
   * @public
   * @type {REST}
   */
  public rest: REST;

  /**
   * This property is used to store an instance of the `API` class within the `Client` class. By declaring it as a public
   * property, it can be accessed and used from outside the `Client` class as needed. This allows other parts of the codebase
   * to interact with the `API` functionality through the `api` property of an instance of the `Client` class.
   *
   * @property
   * @name api
   * @kind property
   * @memberof Client
   * @public
   * @type {API}
   */
  public api: API;

  /**
   * This property is used to store commands within the `Client` class.
   *
   * @property
   * @name commands
   * @kind property
   * @memberof Client
   * @public
   * @type {Collection<string, SlashCommandBuilder<unknown>>}
   */
  public commands: Collection<string, SlashCommandBuilder<unknown>>;

  /**
   * This property is used to store components within the `Client` class.
   *
   * @property
   * @name components
   * @kind property
   * @memberof Client
   * @public
   * @type {Collection<string, ButtonBuilder<unknown>>}
   */
  public components: Collection<string, ButtonBuilder<unknown>>;

  /**
   * This property is used to store an instance of the `ClientUser` class within the `Client` class. By declaring it as a public
   * property, it can be accessed and used from outside the `Client` class as needed. This allows other parts of the codebase
   * to interact with the `ClientUser` functionality through the `user` property of an instance of the `Client` class.
   *
   * @property
   * @name user
   * @kind property
   * @memberof Client
   * @public
   * @type {ClientUser}
   */
  public user: ClientUser;

  /**
   * This property is used to store an instance of the `ClientHandler` class within the `Client` class. By declaring it as a public
   * property, it can be accessed and used from outside the `Client` class as needed. This allows other parts of the codebase
   * to interact with the `ClientHandler` functionality through the `handler` property of an instance of the `Client` class.
   *
   * @property
   * @name handler
   * @kind property
   * @memberof Client
   * @private
   * @type {ClientHandler}
   */
  private handler: ClientHandler;

  /**
   * This property stored the ChannelManager class, providing methods to fetch and use channels
   *
   * @property
   * @name channels
   * @kind property
   * @memberof Client
   * @public
   * @type {ChannelManager}
   */
  public channels: ChannelManager;

  /**
   * This property stored the GuildManager class, providing methods to fetch and use guilds
   *
   * @property
   * @name guilds
   * @kind property
   * @memberof Client
   * @public
   * @type {GuildManager}
   */
  public guilds: GuildManager;

  /**
   * This property stored the UserManager class, providing methods to fetch and use users
   *
   * @property
   * @name users
   * @kind property
   * @memberof Client
   * @public
   * @type {UserManager}
   */
  public users: UserManager;

  /**
   * This property stored the EntitlementManager class, providing methods to fetch and use entitlements
   *
   * @property
   * @name webhooks
   * @kind property
   * @memberof Client
   * @public
   * @type {EntitlementManager}
   */
  public entitlements: EntitlementManager;

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
    this.components = new Collection();

    this.user = new ClientUser(this);
    this.handler = new ClientHandler(this);

    this.channels = new ChannelManager(this);
    this.guilds = new GuildManager(this);
    this.users = new UserManager(this);
    this.entitlements = new EntitlementManager(this);

    this.rest.setToken(options.token);
  }

  /**
   * Register commands.
   *
   * @param {ReturnType<typeof createCommand<S>>[]} commands - array of commands
   * @return {void}
   */
  public registerCommands<S extends unknown>(commands: ReturnType<typeof createCommand<S>>[]) {
    for (const command of commands) {
      // @ts-expect-error
      this.commands.set(command.name, command);
    }
  }

  /**
   * Register a command.
   *
   * @param {ReturnType<typeof createCommand<S>>} command - the command to register
   * @return {void}
   */
  public registerCommand<S extends unknown>(command: ReturnType<typeof createCommand<S>>) {
    // @ts-expect-error
    this.commands.set(command.name, command);
  }

  /**
   * Unregisters the given commands from the list of registered commands.
   *
   * @param {ReturnType<typeof createCommand<S>>[]} commands - The array of commands to unregister.
   */
  public unRegisterCommands<S extends unknown>(commands: ReturnType<typeof createCommand<S>>[]) {
    for (const command of commands) {
      this.commands.has(command.name) ? this.commands.delete(command.name) : null;
    }
  }

  /**
   * unregisters a command.
   *
   * @param {ReturnType<typeof createCommand<S>>} command - the command to unregister
   * @return {void}
   */
  public unRegisterCommand<S extends unknown>(command: ReturnType<typeof createCommand<S>>) {
    this.commands.has(command.name) ? this.commands.delete(command.name) : null;
  }

  /**
   * sweepCommands - A description of the entire function.
   *
   * @return {void}
   */
  public sweepCommands() {
    this.commands.sweep(() => true);
  }

  /**
   * The function `registerComponents` iterates through an array of ButtonBuilder objects and adds them
   * to a map if they have a custom_id property of type string.
   * @param {ReturnType<typeof createButton<unknown>>[]} components - The `components` parameter is an array of
   * `ButtonBuilder` objects with an unknown type. Each `ButtonBuilder` object may have a `data`
   * property that contains information about the button, and the `custom_id` property within the
   * `data` object is checked to ensure it is a string
   */
  public registerComponents(components: ReturnType<typeof createButton<unknown>>[]) {
    for (const component of components) {
      if ('custom_id' in component.data && typeof component.data.custom_id === 'string') {
        this.components.set(component.data.custom_id, component);
      }
    }
  }

  /**
   * The function `registerComponent` registers a ButtonBuilder component with a custom_id property in
   * a TypeScript class.
   * @param {ReturnType<typeof createButton<unknown>>} component - The `component` parameter in the `registerComponent` function is of type
   * `ReturnType<typeof createButton<unknown>>`. This means it is a builder object for creating a button component with
   * some unknown data type.
   */
  public registerComponent(component: ReturnType<typeof createButton<unknown>>) {
    if ('custom_id' in component.data && typeof component.data.custom_id === 'string') {
      this.components.set(component.data.custom_id, component);
    }
  }

  /**
   * The function `unregisterComponents` removes components with a `custom_id` property from a
   * collection.
   * @param {ReturnType<typeof createButton<unknown>>[]} components - The `unregisterComponents` function takes an array
   * of `ButtonBuilder` objects as its parameter. Each `ButtonBuilder` object represents a button
   * component with some data, including a `custom_id` property. The function iterates over the array
   * of components and removes the components from a collection (`this
   */
  public unregisterComponents(components: ReturnType<typeof createButton<unknown>>[]) {
    for (const component of components) {
      if ('custom_id' in component.data && typeof component.data.custom_id === 'string') {
        this.components.delete(component.data.custom_id);
      }
    }
  }

  /**
   * The function `unregisterComponent` removes a ButtonBuilder component from a collection based on
   * its custom_id property.
   * @param {ReturnType<typeof createButton<unknown>>} component - The `component` parameter in the `unregisterComponent` function is of type
   * `ReturnType<typeof createButton<unknown>>`. This means it is a builder object for creating a button component, but
   * the specific type of data it holds is unknown.
   */
  public unregisterComponent(component: ReturnType<typeof createButton<unknown>>) {
    if ('custom_id' in component.data && typeof component.data.custom_id === 'string') {
      this.components.delete(component.data.custom_id);
    }
  }

  /**
   * The function `sweepComponents` iterates over components and removes all of them.
   */
  public sweepComponents() {
    this.components.sweep(() => true);
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
    return this.handler.handleInteraction(data);
  }
}
