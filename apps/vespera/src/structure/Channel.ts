import type { Client } from '..';
import { Base } from '..';
import type {
  APIChannel,
  APIInvite,
  APIMessage,
  ChannelFlags,
  RESTGetAPIChannelMessagesQuery,
  RESTPatchAPIChannelJSONBody,
  RESTPatchAPIChannelMessageJSONBody,
  RESTPostAPIChannelInviteJSONBody,
  RESTPostAPIChannelMessageJSONBody,
  Snowflake,
  VideoQualityMode,
} from '../core';
import { ChannelType } from '../core';
import type { RawFile } from '../rest';
import { channelLink, channelMention, getTimestamp } from '../utils';

import { MessageManager } from './Manager/Message';

export const TextChannelTypes = [
  ChannelType.AnnouncementThread,
  ChannelType.GuildText,
  ChannelType.DM,
  ChannelType.GroupDM,
  ChannelType.GuildForum,
  ChannelType.GuildAnnouncement,
  ChannelType.PrivateThread,
  ChannelType.PublicThread,
] as const;
export type TextChannel = (typeof TextChannelTypes)[number];

/**
 * Represents any channel on Discord.
 * @extends {Base}
 * @abstract
 */
export class Channel extends Base {
  /**
   * The channel's id
   * @type {Snowflake}
   */
  public id: Snowflake;

  /**
   * The type of the channel
   * @type {ChannelType}
   */
  public type: ChannelType;

  /**
   * The flags that are applied to the channel.
   * @type {?ChannelFlags}
   */
  public flags: ChannelFlags | undefined;

  /**
   * The id of the guild the channel is in.
   * @type {?Snowflake}
   */
  public guildId: Snowflake | undefined;

  /**
   * Whether the channel is NSFW
   * @type {?boolean}
   */
  public nsfw: boolean | undefined;

  /**
   * The RTC region for this voice-based channel. This region is automatically selected if `null`.
   * @type {?string}
   */
  public rtcRegion: string | undefined;

  /**
   * The bitrate of this voice-based channel
   * @type {?number}
   */
  public bitrate: number | undefined;

  /**
   * The maximum amount of users allowed in this channel.
   * @type {?number}
   */
  public userLimit: number | undefined;

  /**
   * The topic of this text-based channel
   * @type {?string}
   */
  public topic: string | undefined;

  /**
   * The id of the last message sent in this channel
   * @type {?Snowflake}
   */
  public lastMessageId: Snowflake | undefined;

  /**
   * The camera video quality mode of the channel
   * @type {?VideoQualityMode}
   */
  public videoQualityMode: VideoQualityMode | undefined;

  /**
   * The amount of seconds a user has to wait before sending another message
   * @type {?number}
   */
  public rateLimitPerUser: number | undefined;

  /**
   * The id of the parent category for a channel, or `null` if it doesn't have one
   * @type {?Snowflake}
   */
  public parentId: Snowflake | undefined;

  /**
   * The message manager class for this channel
   * @type {?MessageManager}
   */
  public messages: MessageManager | undefined;

  /**
   * The raw data of the channel
   * @type {APIChannel}
   */
  public raw: APIChannel;

  constructor(client: Client, data: APIChannel) {
    super(client);

    this.id = data.id;
    this.type = data.type;

    if ('flags' in data) {
      this.flags = data.flags;
    }

    if ('guild_id' in data) {
      this.guildId = data.guild_id;
    }

    if ('nsfw' in data) {
      this.nsfw = data.nsfw;
    }

    if ('rtc_region' in data) {
      this.rtcRegion = data.rtc_region as string | undefined;
    }

    if ('bitrate' in data) {
      this.bitrate = data.bitrate;
    }

    if ('user_limit' in data) {
      this.userLimit = data.user_limit;
    }

    if ('video_quality_mode' in data) {
      this.videoQualityMode = data.video_quality_mode;
    }

    if ('last_message_id' in data) {
      this.lastMessageId = data.last_message_id as string | undefined;
    }

    if ('rate_limit_per_user' in data) {
      this.rateLimitPerUser = data.rate_limit_per_user;
    }

    if ('parent_id' in data) {
      this.parentId = data.parent_id as string | undefined;
    }

    // @ts-expect-error - ignore for now
    if (TextChannelTypes.includes(this.type)) {
      this.messages = new MessageManager(this.client, this);
    }

    this.raw = data;
  }

  /**
   * The timestamp the channel was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return getTimestamp(this.id);
  }

  /**
   * The time the channel was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The URL to the channel
   * @type {string}
   * @readonly
   */
  get url() {
    return this.isDMBased() ? channelLink(this.id) : channelLink(this.id, this.guildId!);
  }

  /**
   * When concatenated with a string, this automatically returns the channel's mention instead of the Channel object.
   * @returns {string}
   */
  toString() {
    return channelMention(this.id);
  }

  /**
   * Deletes this channel.
   * @returns {Promise<BaseChannel>}
   * @example
   * // Delete the channel
   * channel.delete()
   *   .then(console.log)
   *   .catch(console.error);
   */
  async delete() {
    await this.client.api.channels.delete(this.id);
    return this;
  }

  /**
   * Sends a message with the given data.
   *
   * @param {RESTPostAPIChannelMessageJSONBody & { files?: RawFile[] }} data - The data for the message.
   * @return {Promise<APIMessage>} A promise that resolves to the created message.
   */
  public async send(data: RESTPostAPIChannelMessageJSONBody & { files?: RawFile[] }): Promise<APIMessage> {
    return this.client.api.channels.createMessage(this.id, data);
  }

  /**
   * Edits a message.
   *
   * @param {string} messageId - The ID of the message to be edited.
   * @param {RESTPatchAPIChannelMessageJSONBody & { files?: RawFile[] }} data - The data to be updated in the message.
   * @return {Promise<APIMessage>} - A promise that resolves to the edited message.
   */
  public async editMessage(
    messageId: string,
    data: RESTPatchAPIChannelMessageJSONBody & { files?: RawFile[] },
  ): Promise<APIMessage> {
    return this.client.api.channels.editMessage(this.id, messageId, data);
  }

  /**
   * Fetches a specific message by its ID.
   *
   * @param {string} messageId - The ID of the message to fetch.
   * @return {Promise<APIMessage>} A Promise that resolves to the fetched message.
   */
  public async fetchMessage(messageId: string): Promise<APIMessage> {
    return this.client.api.channels.getMessage(this.id, messageId);
  }

  /**
   * Fetches messages using the provided data.
   *
   * @param {RESTGetAPIChannelMessagesQuery } data - The data used to fetch messages.
   * @return {Promise<APIMessage[]>} A promise that resolves to an array of API messages.
   */
  public async fetchMessages(data: RESTGetAPIChannelMessagesQuery): Promise<APIMessage[]> {
    return this.client.api.channels.getMessages(this.id, data);
  }

  /**
   * Crossposts a message.
   *
   * @param {string} messageId - The ID of the message to crosspost.
   * @return {Promise<APIMessage>} A promise that resolves to the crossposted message.
   */
  public async crosspostMessage(messageId: string): Promise<APIMessage> {
    return this.client.api.channels.crosspostMessage(this.id, messageId);
  }

  /**
   * Creates an invite using the given data and returns the created invite.
   *
   * @param {RESTPostAPIChannelInviteJSONBody} data - The data used to create the invite.
   * @return {Promise<APIInvite>} The created invite.
   */
  public async createInvite(data: RESTPostAPIChannelInviteJSONBody): Promise<APIInvite> {
    return this.client.api.channels.createInvite(this.id, data);
  }

  /**
   * Retrieves the invites.
   *
   * @return {Promise<APIInvite[]>} The list of invites.
   */
  public async getInvites(): Promise<APIInvite[]> {
    return this.client.api.channels.getInvites(this.id);
  }

  /**
   * Edits the channel
   *
   * @param {RESTPatchAPIChannelJSONBody} data - The data used to edit the channel
   * @return {Promise<APIChannel>} Promise that resolves to the edited channel
   */
  public async edit(data: RESTPatchAPIChannelJSONBody): Promise<APIChannel> {
    return this.client.api.channels.edit(this.id, data);
  }

  /**
   * Bulk deletes messages
   *
   * @param {string[]} messages - The data used to bulk delete messages
   * @return {Promise<void>} Promise that resolves when the messages are deleted
   */
  public async bulkDeleteMessages(messages: string[]): Promise<void> {
    return this.client.api.channels.bulkDeleteMessages(this.id, messages);
  }

  /**
   * Pin a message
   *
   * @param {string} messageId - The data used to pin a message
   * @return {Promise<void>} Promise that resolves when the message is pinned
   */
  public async pinMessage(messageId: string): Promise<void> {
    return this.client.api.channels.pinMessage(this.id, messageId);
  }

  /**
   * Unpin a message
   *
   * @param {string} messageId - The data used to unpin a message
   * @return {Promise<void>} Promise that resolves when the message is unpinned
   */
  public async unpinMessage(messageId: string): Promise<void> {
    return this.client.api.channels.unpinMessage(this.id, messageId);
  }

  /**
   * Fetches this channel.
   * @returns {Promise<BaseChannel>}
   */
  fetch() {
    return this.client.channels.fetch(this.id);
  }

  /**
   * Indicates whether this channel is a {@link ThreadChannel}.
   * @returns {boolean}
   */
  isThread() {
    return [ChannelType.PublicThread, ChannelType.PrivateThread].includes(this.type);
  }

  /**
   * Indicates whether this channel is {@link TextBasedChannels text-based}.
   * @returns {boolean}
   */
  isTextBased() {
    return 'messages' in this;
  }

  /**
   * Indicates whether this channel is DM-based (either a {@link DMChannel} or a {@link PartialGroupDMChannel}).
   * @returns {boolean}
   */
  isDMBased() {
    return [ChannelType.DM, ChannelType.GroupDM].includes(this.type);
  }

  /**
   * Indicates whether this channel is {@link BaseGuildVoiceChannel voice-based}.
   * @returns {boolean}
   */
  isVoiceBased() {
    return 'bitrate' in this;
  }

  /**
   * Indicates whether this channel is {@link ThreadOnlyChannel thread-only}.
   * @returns {boolean}
   */
  isThreadOnly() {
    return 'availableTags' in this;
  }
}
