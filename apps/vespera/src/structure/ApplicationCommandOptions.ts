import { Client, User } from '..';
import { Base, Channel } from '..';
import type {
  APIApplicationCommandInteractionDataAttachmentOption,
  APIApplicationCommandInteractionDataChannelOption,
  APIApplicationCommandInteractionDataOption,
  APIApplicationCommandInteractionDataRoleOption,
  APIApplicationCommandInteractionDataUserOption,
  APIChannel,
  APIInteractionDataResolved,
} from '../core';
import { ApplicationCommandOptionType } from '../core';

import { Attachment } from './Attachment';
import { Role } from './Role';

/**
 * Represents command options within the application.
 */
export class ApplicationCommandOptions extends Base {
  /**
   * The options (resolved)
   * @type {ReturnType<typeof this.resolveOption>[]}
   */
  public data: ReturnType<typeof this.resolveOption>[];

  /**
   * The resolved data
   * @type {APIInteractionDataResolved}
   */
  public resolved: APIInteractionDataResolved | undefined;

  /**
   * Constructs a new instance of the ApplicationCommandOptions class.
   *
   * @param client The client instance
   * @param data The raw data for the command options
   * @param resolved The resolved data for the command options
   */
  constructor(
    client: Client,
    data: APIApplicationCommandInteractionDataOption[],
    resolved: APIInteractionDataResolved | undefined,
  ) {
    super(client);

    this.data = data.map((option) => this.resolveOption(option));
    this.resolved = resolved;
  }

  /**
   * Resolves the given option based on its type and returns the updated option.
   *
   * @private
   * @param {APIApplicationCommandInteractionDataOption} option - The option to be resolved.
   */
  private resolveOption(option: APIApplicationCommandInteractionDataOption) {
    switch (option.type) {
      case ApplicationCommandOptionType.Boolean: {
        return {
          ...option,
          value: Boolean(option.value),
        };
      }

      case ApplicationCommandOptionType.String: {
        return {
          ...option,
          value: String(option.value),
        };
      }

      case ApplicationCommandOptionType.Integer: {
        return {
          ...option,
          value: Number(option.value),
        };
      }

      case ApplicationCommandOptionType.User:
        return this.resolveUserOption(option);

      case ApplicationCommandOptionType.Channel:
        return this.resolveChannelOption(option);

      case ApplicationCommandOptionType.Role:
        return this.resolveRoleOption(option);

      case ApplicationCommandOptionType.Number: {
        return {
          ...option,
          value: Number(option.value),
        };
      }

      case ApplicationCommandOptionType.Attachment:
        return this.resolveAttachmentOption(option);

      default:
        break;
    }
  }

  /**
   * Resolves the given attachment option based on its value and returns the updated option.
   *
   * @private
   * @param {APIApplicationCommandInteractionDataAttachmentOption} option - The option to be resolved.
   */
  private resolveAttachmentOption(option: APIApplicationCommandInteractionDataAttachmentOption) {
    const resolved = this.resolved?.attachments?.[option.value];

    if (resolved) {
      return {
        ...option,
        value: new Attachment(resolved),
      };
    }

    return option;
  }

  /**
   * Resolves the given user option based on its value and returns the updated option.
   *
   * @private
   * @param {APIApplicationCommandInteractionDataUserOption} option - The option to be resolved.
   */
  private resolveUserOption(option: APIApplicationCommandInteractionDataUserOption) {
    const resolved = this.resolved?.users?.[option.value];

    if (resolved) {
      return {
        ...option,
        value: new User(this.client, resolved),
      };
    }

    return option;
  }

  /**
   * Resolves the given channel option based on its value and returns the updated option.
   *
   * @private
   * @param {APIApplicationCommandInteractionDataChannelOption} option - The option to be resolved.
   */
  private resolveChannelOption(option: APIApplicationCommandInteractionDataChannelOption) {
    const resolved = this.resolved?.channels?.[option.value];

    if (resolved) {
      return {
        ...option,
        value: new Channel(this.client, resolved as APIChannel),
      };
    }

    return option;
  }

  /**
   * Resolves the given role option based on its value and returns the updated option.
   *
   * @private
   * @param {APIApplicationCommandInteractionDataRoleOption} option - The option to be resolved.
   */
  private resolveRoleOption(option: APIApplicationCommandInteractionDataRoleOption) {
    const resolved = this.resolved?.roles?.[option.value];

    if (resolved) {
      return {
        ...option,
        value: new Role(this.client, resolved),
      };
    }

    return option;
  }

  /**
   * Returns the resolved option with the given name.
   *
   * @param {string} name - The name of the option to return.
   * @param {boolean} required - Whether the option is required.
   * @returns {string | undefined} The resolved option with the given name.
   */
  public getStringOption<R extends boolean>(name: string, required: R): R extends true ? string : string | undefined {
    const option = this.data.find((o) => o?.name === name);
    return option?.value as R extends true ? string : string | undefined;
  }

  /**
   * Returns the resolved option with the given name.
   *
   * @param {string} name - The name of the option to return.
   * @param {boolean} required - Whether the option is required.
   * @returns {number | undefined} The resolved option with the given name.
   */
  public getNumberOption<R extends boolean>(name: string, required: R): R extends true ? number : number | undefined {
    const option = this.data.find((o) => o?.name === name);
    return option?.value as R extends true ? number : number | undefined;
  }

  /**
   * Returns the resolved option with the given name.
   *
   * @param {string} name - The name of the option to return.
   * @param {boolean} required - Whether the option is required.
   * @returns {number | undefined} The resolved option with the given name.
   */
  public getIntegerOption<R extends boolean>(name: string, required: R): R extends true ? number : number | undefined {
    const option = this.data.find((o) => o?.name === name);
    return option?.value as R extends true ? number : number | undefined;
  }

  /**
   * Returns the resolved option with the given name.
   *
   * @param {string} name - The name of the option to return.
   * @param {boolean} required - Whether the option is required.
   * @returns {boolean | undefined} The resolved option with the given name.
   */
  public getBooleanOption<R extends boolean>(
    name: string,
    required: R,
  ): R extends true ? boolean : boolean | undefined {
    const option = this.data.find((o) => o?.name === name);
    return option?.value as R extends true ? boolean : boolean | undefined;
  }

  /**
   * Returns the resolved option with the given name.
   *
   * @param {string} name - The name of the option to return.
   * @param {boolean} required - Whether the option is required.
   * @returns {User | undefined} The resolved option with the given name.
   */
  public getUserOption<R extends boolean>(name: string, required: R): R extends true ? User : User | undefined {
    const option = this.data.find((o) => o?.name === name);
    return option?.value as R extends true ? User : User | undefined;
  }

  /**
   * Returns the resolved option with the given name.
   *
   * @param {string} name - The name of the option to return.
   * @param {boolean} required - Whether the option is required.
   * @returns {Attachment | undefined} The resolved option with the given name.
   */
  public getAttachmentOption<R extends boolean>(
    name: string,
    required: R,
  ): R extends true ? Attachment : Attachment | undefined {
    const option = this.data.find((o) => o?.name === name);
    return option?.value as R extends true ? Attachment : Attachment | undefined;
  }

  /**
   * Returns the resolved option with the given name.
   *
   * @param {string} name - The name of the option to return.
   * @param {boolean} required - Whether the option is required.
   * @returns {Channel | undefined} The resolved option with the given name.
   */
  public getChannelOption<R extends boolean>(
    name: string,
    required: R,
  ): R extends true ? Channel : Channel | undefined {
    const option = this.data.find((o) => o?.name === name);
    return option?.value as R extends true ? Channel : Channel | undefined;
  }

  /**
   * Returns the resolved option with the given name.
   *
   * @param {string} name - The name of the option to return.
   * @param {boolean} required - Whether the option is required.
   * @returns {Role | undefined} The resolved option with the given name.
   */
  public getRoleOption<R extends boolean>(name: string, required: R): R extends true ? Role : Role | undefined {
    const option = this.data.find((o) => o?.name === name);
    return option?.value as R extends true ? Role : Role | undefined;
  }
}
