import type { CamelCasedPropertiesDeep } from 'type-fest';

import { ApplicationCommandOptionType, MessageFlags } from '../../core';
import type {
  APIApplicationCommandInteractionDataSubcommandGroupOption,
  APIApplicationCommandInteractionDataSubcommandOption,
  APIChatInputApplicationCommandInteraction,
  APIMessage,
  APIModalInteractionResponseCallbackData,
  RESTPostAPIWebhookWithTokenJSONBody,
} from '../../core';
import type { RawFile } from '../../rest';
import { toSnakeCase } from '../../utils';
import { ApplicationCommandOptions } from '../ApplicationCommandOptions';
import type { Client } from '../Client';
import { VesperaError } from '../Error';

import { BaseContext } from './Base';

export class CommandContext<S extends unknown> extends BaseContext<APIChatInputApplicationCommandInteraction, S> {
  public subcommandGroup?: APIApplicationCommandInteractionDataSubcommandGroupOption;
  public subcommand?: APIApplicationCommandInteractionDataSubcommandOption;
  public options: ApplicationCommandOptions;

  constructor(client: Client, data: APIChatInputApplicationCommandInteraction) {
    super(client, data);

    this.subcommandGroup = this.raw.data.options?.find(
      (option) => option.type === ApplicationCommandOptionType.SubcommandGroup,
    ) as APIApplicationCommandInteractionDataSubcommandGroupOption;
    this.subcommand = this.raw.data.options?.find(
      (option) => option.type === ApplicationCommandOptionType.Subcommand,
    ) as APIApplicationCommandInteractionDataSubcommandOption;

    this.options = new ApplicationCommandOptions(this.client, this.raw.data.options ?? [], this.raw.data.resolved);
  }

  /**
   * Defers reply the interaction recieved
   *
   * @param {boolean} ephemeral - Whether or not the reply should be ephemeral
   * @return {Promise<void>} A promise that resolves when the deferral is complete.
   */
  public async defer(ephemeral = false): Promise<void> {
    try {
      await this.client.api.interactions.defer(this.id, this.token, {
        flags: ephemeral ? MessageFlags.Ephemeral : undefined,
      });

      this.deferred = true;
    } catch (error) {
      throw new VesperaError(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Replies to an interaction.
   *
   * @param {Omit<RESTPostAPIWebhookWithTokenJSONBody, "username" | "avatar_url"> & { flags?: MessageFlags | undefined; } & { files?: RawFile[] }} data - The data for creating the reply.
   * @return {Promise<void>} A promise that resolves when the reply is sent.
   */
  public async reply(
    data: CamelCasedPropertiesDeep<
      Omit<RESTPostAPIWebhookWithTokenJSONBody, 'username' | 'avatar_url'> & {
        flags?: MessageFlags | undefined;
      } & { files?: RawFile[] }
    >,
  ): Promise<void> {
    try {
      await this.client.api.interactions.reply(
        this.id,
        this.token,
        toSnakeCase(data) as Parameters<typeof this.client.api.interactions.reply>[2],
      );

      this.replied = true;
    } catch (error) {
      throw new VesperaError(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Edits a reply.
   *
   * @param {Omit<RESTPostAPIWebhookWithTokenJSONBody, "username" | "avatar_url"> & { flags?: MessageFlags | undefined; } & { files?: RawFile[] }} data - The data for editing the reply.
   * @return {Promise<APIMessage>} A promise that resolves when the reply is edited.
   */
  public async editReply(
    data: CamelCasedPropertiesDeep<
      Omit<RESTPostAPIWebhookWithTokenJSONBody, 'username' | 'avatar_url'> & {
        flags?: MessageFlags | undefined;
      } & { files?: RawFile[] }
    >,
  ): Promise<APIMessage> {
    try {
      return this.client.api.interactions.editReply(
        this.applicationId,
        this.token,
        toSnakeCase(data) as Parameters<typeof this.client.api.interactions.editReply>[2],
      );
    } catch (error) {
      throw new VesperaError(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Deletes a reply.
   *
   * @return {Promise<void>} A promise that resolves when the reply is deleted.
   */
  public async deleteReply(): Promise<void> {
    await this.client.api.interactions.deleteReply(this.applicationId, this.token);
  }

  /**
   * Fetches the reply asynchronously.
   *
   * @return {Promise<APIMessage>} A promise that resolves when the original reply is fetched.
   */
  public async fetchReply(): Promise<APIMessage> {
    return this.client.api.interactions.getOriginalReply(this.applicationId, this.token);
  }

  /**
   * Reply to a modal.
   *
   * @param {APIModalInteractionResponseCallbackData} data - The data for creating the modal.
   * @return {Promise<void>} A promise that resolves when the modal is created.
   */
  public async replyModal(data: CamelCasedPropertiesDeep<APIModalInteractionResponseCallbackData>): Promise<void> {
    try {
      await this.client.api.interactions.createModal(
        this.id,
        this.token,
        toSnakeCase(data) as Parameters<typeof this.client.api.interactions.createModal>[2],
      );
    } catch (error) {
      throw new VesperaError(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Calls the followUp method of the API class with the provided data.
   *
   * @param {Omit<RESTPostAPIWebhookWithTokenJSONBody, "username" | "avatar_url"> & { flags?: MessageFlags | undefined; } & { files?: RawFile[] }} data - The data to be passed to the followUp method.
   * @return {Promise<APIMessage>} A promise that resolves to an APIMessage object.
   */
  public async followUp(
    data: CamelCasedPropertiesDeep<
      Omit<RESTPostAPIWebhookWithTokenJSONBody, 'username' | 'avatar_url'> & {
        flags?: MessageFlags | undefined;
      } & { files?: RawFile[] }
    >,
  ): Promise<APIMessage> {
    try {
      return this.client.api.interactions.followUp(
        this.applicationId,
        this.token,
        toSnakeCase(data) as Parameters<typeof this.client.api.interactions.followUp>[2],
      );
    } catch (error) {
      throw new VesperaError(error instanceof Error ? error.message : 'Unknown error');
    }
  }
}
