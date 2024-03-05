import type {
  APIApplicationCommandInteractionData,
  APIBaseInteraction,
  APIChannel,
  APIMessageComponentInteractionData,
} from '../../core';
import { ApplicationCommandType, ComponentType, InteractionType } from '../../core';
import { Base } from '../Base';
import { Channel } from '../Channel';
import type { Client } from '../Client';
import { VesperaError } from '../Error';

/* This TypeScript class `BaseContext` extends `Base` and has generic types `T` and `S`. */
export class BaseContext<T extends APIBaseInteraction<InteractionType, unknown>, S extends unknown> extends Base {
  /**
   * @property
   * @name type
   * @kind property
   * @memberof BaseContext
   * @public
   * @type {T["type"]}
   */
  public type: T['type'];

  /**
   * @property
   * @name token
   * @kind property
   * @memberof BaseContext
   * @public
   * @type {T["token"]}
   */
  public token: T['token'];

  /**
   * @property
   * @name id
   * @kind property
   * @memberof BaseContext
   * @public
   * @type {T["id"]}
   */
  public id: T['id'];

  /**
   * @property
   * @name applicationId
   * @kind property
   * @memberof BaseContext
   * @public
   * @type {T["application_id"]}
   */
  public applicationId: T['application_id'];

  /**
   * @property
   * @name channelId
   * @kind property
   * @memberof BaseContext
   * @public
   * @type {T["channel_id"]}
   */
  public channelId: string | undefined;

  /**
   * @property
   * @name channel
   * @kind property
   * @memberof BaseContext
   * @public
   * @type {Channel}
   */
  public channel: Channel | undefined;

  /**
   * @property
   * @name guildId
   * @kind property
   * @memberof BaseContext
   * @public
   * @type {T["guild_id"]}
   */
  public guildId: T['guild_id'];

  /**
   * @property
   * @name guildLocale
   * @kind property
   * @memberof BaseContext
   * @public
   * @type {T["guild_locale"]}
   */
  public guildLocale: T['guild_locale'];

  /**
   * @property
   * @name version
   * @kind property
   * @memberof BaseContext
   * @public
   * @type {T["version"]}
   */
  public version: T['version'];

  /**
   * app permissions of the user who triggered the interaction
   * will only be present if the interaction was triggered in a guild
   *
   * @property
   * @name appPermissions
   * @kind property
   * @memberof BaseContext
   * @public
   * @type {T["app_permissions"]}
   */
  public appPermissions: string | undefined;

  /**
   * member permissions of the user who triggered the interaction
   * will only be present if the interaction was triggered in a guild
   *
   * @property
   * @name memberPermissions
   * @kind property
   * @memberof BaseContext
   * @public
   * @type {T["member"]["permissions"]}
   */
  public memberPermissions: string | undefined;

  /**
   * locale of the user who triggered the interaction
   *
   * @property
   * @name locale
   * @kind property
   * @memberof BaseContext
   * @public
   * @type {T["locale"]}
   */
  public locale: T['locale'];

  /**
   * @property
   * @name entitlement
   * @kind property
   * @memberof BaseContext
   * @public
   * @type {T["entitlements"]}
   */
  public entitlement: T['entitlements'];

  public raw: T;

  public state: S = {} as S;

  public deferred = false;
  public replied = false;

  constructor(client: Client, data: T) {
    super(client);

    this.type = data.type;
    this.token = data.token;
    this.id = data.id;
    this.applicationId = data.application_id;
    this.channelId = data.channel ? data.channel.id : undefined;
    this.channel = data.channel ? new Channel(this.client, data.channel as APIChannel) : undefined;
    this.guildId = data.guild_id;
    this.guildLocale = data.guild_locale;
    this.version = data.version;
    this.appPermissions = data.app_permissions;
    this.memberPermissions = data.member?.permissions;
    this.locale = data.locale;
    this.entitlement = data.entitlements;

    this.raw = data;
  }

  /**
   * A method to decorate the state object with a new key and data.
   *
   * @param {string} key - the key to decorate the state object with
   * @param {unknown} data - the data to associate with the key in the state object
   * @return {Object} the current instance of the class for method chaining
   */
  public decorate(key: string, data: unknown) {
    Object.defineProperty(this.state, key, {
      value: data,
      writable: false,
    });
    return this;
  }

  /**
   * Get the timestamp when this interaction was created.
   *
   * @return {number} the timestamp of the interaction
   */
  public createdTimestamp(): number {
    try {
      const milliseconds = BigInt(parseInt(this.id)) >> 22n;
      return new Date(Number(milliseconds) + 1420070400000).valueOf();
    } catch (error) {
      throw new VesperaError('Invalid snowflake');
    }
  }

  /**
   * Returns the creation date of the interaction.
   *
   * @return {Date} the creation date
   */
  public createdAt(): Date {
    return new Date(this.createdTimestamp());
  }

  /**
   * Indicates whether this interaction is received from a guild.
   * @returns {boolean}
   */
  inGuild() {
    return Boolean(this.guildId);
  }

  /**
   * Indicates whether this interaction is received from a DM.
   * @returns {boolean}
   */
  inDM() {
    return !this.inGuild();
  }

  /**
   * Indicates whether this interaction is an {@link AutocompleteInteraction}
   * @returns {boolean}
   */
  isAutocomplete() {
    return this.type === InteractionType.ApplicationCommandAutocomplete;
  }

  /**
   * The function `isCommand()` checks if the type of interaction is an Application Command in
   * TypeScript.
   * @returns The `isCommand()` function is returning a boolean value based on whether the `type`
   * property of the object is equal to `InteractionType.ApplicationCommand`.
   */
  isCommand() {
    return this.type === InteractionType.ApplicationCommand;
  }

  /**
   * Indicates whether this interaction is a {@link ChatInputCommandInteraction}.
   * @returns {boolean}
   */
  isChatInputCommand() {
    return (
      this.type === InteractionType.ApplicationCommand &&
      (this.raw.data as APIApplicationCommandInteractionData).type === ApplicationCommandType.ChatInput
    );
  }

  /**
   * Indicates whether this interaction is a {@link ContextMenuCommandInteraction}
   * @returns {boolean}
   */
  isContextMenuCommand() {
    return (
      this.type === InteractionType.ApplicationCommand &&
      [ApplicationCommandType.User, ApplicationCommandType.Message].includes(
        (this.raw.data as APIApplicationCommandInteractionData).type,
      )
    );
  }

  /**
   * Indicates whether this interaction is a {@link MessageComponentInteraction}
   * @returns {boolean}
   */
  isMessageComponent() {
    return this.type === InteractionType.MessageComponent;
  }

  /**
   * Indicates whether this interaction is a {@link ModalSubmitInteraction}
   * @returns {boolean}
   */
  isModalSubmit() {
    return this.type === InteractionType.ModalSubmit;
  }

  /**
   * Indicates whether this interaction is a {@link UserContextMenuCommandInteraction}
   * @returns {boolean}
   */
  isUserContextMenuCommand() {
    return (
      this.isContextMenuCommand() &&
      (this.raw.data as APIApplicationCommandInteractionData).type === ApplicationCommandType.User
    );
  }

  /**
   * Indicates whether this interaction is a {@link MessageContextMenuCommandInteraction}
   * @returns {boolean}
   */
  isMessageContextMenuCommand() {
    return (
      this.isContextMenuCommand() &&
      (this.raw.data as APIApplicationCommandInteractionData).type === ApplicationCommandType.Message
    );
  }

  /**
   * Indicates whether this interaction is a {@link ButtonInteraction}.
   * @returns {boolean}
   */
  isButton() {
    return (
      this.type === InteractionType.MessageComponent &&
      (this.raw.data as APIMessageComponentInteractionData).component_type === ComponentType.Button
    );
  }

  /**
   * Indicates whether this interaction is a {@link StringSelectMenuInteraction}.
   * @returns {boolean}
   * @deprecated Use {@link BaseInteraction#isStringSelectMenu} instead.
   */
  isSelectMenu() {
    return this.isStringSelectMenu();
  }

  /**
   * Indicates whether this interaction is a select menu of any known type.
   * @returns {boolean}
   */
  isAnySelectMenu() {
    return (
      this.type === InteractionType.MessageComponent &&
      [
        ComponentType.ChannelSelect,
        ComponentType.RoleSelect,
        ComponentType.StringSelect,
        ComponentType.UserSelect,
        ComponentType.MentionableSelect,
      ].includes((this.raw.data as APIMessageComponentInteractionData).component_type)
    );
  }

  /**
   * Indicates whether this interaction is a {@link StringSelectMenuInteraction}.
   * @returns {boolean}
   */
  isStringSelectMenu() {
    return (
      this.type === InteractionType.MessageComponent &&
      (this.raw.data as APIMessageComponentInteractionData).component_type === ComponentType.StringSelect
    );
  }

  /**
   * Indicates whether this interaction is a {@link UserSelectMenuInteraction}
   * @returns {boolean}
   */
  isUserSelectMenu() {
    return (
      this.type === InteractionType.MessageComponent &&
      (this.raw.data as APIMessageComponentInteractionData).component_type === ComponentType.UserSelect
    );
  }

  /**
   * Indicates whether this interaction is a {@link RoleSelectMenuInteraction}
   * @returns {boolean}
   */
  isRoleSelectMenu() {
    return (
      this.type === InteractionType.MessageComponent &&
      (this.raw.data as APIMessageComponentInteractionData).component_type === ComponentType.RoleSelect
    );
  }

  /**
   * Indicates whether this interaction is a {@link ChannelSelectMenuInteraction}
   * @returns {boolean}
   */
  isChannelSelectMenu() {
    return (
      this.type === InteractionType.MessageComponent &&
      (this.raw.data as APIMessageComponentInteractionData).component_type === ComponentType.ChannelSelect
    );
  }

  /**
   * Indicates whether this interaction is a {@link MentionableSelectMenuInteraction}
   * @returns {boolean}
   */
  isMentionableSelectMenu() {
    return (
      this.type === InteractionType.MessageComponent &&
      (this.raw.data as APIMessageComponentInteractionData).component_type === ComponentType.MentionableSelect
    );
  }

  /**
   * Indicates whether this interaction can be replied to.
   * @returns {boolean}
   */
  isRepliable() {
    return ![InteractionType.Ping, InteractionType.ApplicationCommandAutocomplete].includes(this.type);
  }
}
