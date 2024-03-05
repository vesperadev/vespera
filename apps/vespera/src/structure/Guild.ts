import type { CamelCasedPropertiesDeep } from 'type-fest';

import type { Client } from '..';
import { Base, Emoji, VesperaError } from '..';
import { GuildFeature, GuildPremiumTier } from '../core';
import type {
  APIGuild,
  APIGuildWidgetSettings,
  GuildDefaultMessageNotifications,
  GuildExplicitContentFilter,
  GuildMFALevel,
  GuildSystemChannelFlags,
  GuildVerificationLevel,
  GuildWidgetStyle,
  Locale,
  RESTGetAPIAuditLogQuery,
  RESTPatchAPIGuildJSONBody,
  RESTPatchAPIGuildWelcomeScreenJSONBody,
  RESTPostAPIGuildTemplatesJSONBody,
  RESTPutAPIGuildOnboardingJSONBody,
  Snowflake,
} from '../core';
import type { ImageURLOptions } from '../rest';
import { Collection, toSnakeCase } from '../utils';

import { GuildAuditLogs } from './GuildAuditLogs';
import { GuildIntegration } from './GuildIntegration';
import { GuildOnboarding } from './GuildOnboarding';
import { GuildPreview } from './GuildPreview';
import { GuildTemplate } from './GuildTemplate';
import { GuildWelcomeScreen } from './GuildWelcomeScreen';
import { GuildMembersManager } from './Manager/GuildMember';
import { GuildRolesManager } from './Manager/Role';
import { Webhook } from './Webhook';

export class Guild extends Base {
  public id: Snowflake;
  public members: GuildMembersManager;

  public name: string | undefined;
  public icon: string | undefined;
  public splash: string | undefined;
  public discoverySplash: string | undefined;
  public ownerId: Snowflake | undefined;
  /**
   * The timestamp the client user joined the guild at
   * @type {number}
   */
  public joinedTimestamp: number | undefined;
  public permissions: string | undefined;
  public afkChannelId: Snowflake | undefined;
  public afkTimeout: number | undefined;
  public widgetEnabled: boolean | undefined;
  public widgetChannelId: Snowflake | undefined;
  public verificationLevel: number | undefined;
  public defaultMessageNotifications: number | undefined;
  public explicitContentFilter: number | undefined;
  public roles: GuildRolesManager;
  public emojis: Emoji[];
  public features: GuildFeature[] = [];
  public mfaLevel: number | undefined;
  public applicationId: Snowflake | undefined;
  public systemChannelId: Snowflake | undefined;
  public systemChannelFlags: number | undefined;

  /**
   * The premium tier of this guild
   * @type {GuildPremiumTier}
   */
  public premiumTier: GuildPremiumTier | undefined;

  /**
   * The rules channel's id for the guild
   * @type {?Snowflake}
   */
  public rulesChannelId: Snowflake | undefined;

  /**
   * The public updates channel's id for the guild
   * @type {?Snowflake}
   */
  public publicUpdatesChannelId: Snowflake | undefined;

  /**
   * The maximum amount of members for the guild
   * @type {?number}
   */
  public maxMembers: number | undefined;

  /**
   * The preferred locale of the guild, defaults to `en-US`
   * @type {Locale}
   */
  public preferredLocale: Locale | undefined;

  /**
   * The guild's safety channel id
   * @type {?Snowflake}
   */
  public safetyAlertsChannelId: Snowflake | undefined;

  constructor(client: Client, data: APIGuild) {
    super(client);

    this.id = data.id;

    if ('name' in data) {
      this.name = data.name;
    }

    if ('icon' in data) {
      this.icon = data.icon as string | undefined;
    }

    if ('splash' in data) {
      this.splash = data.splash as string | undefined;
    }

    if ('discovery_splash' in data) {
      this.discoverySplash = data.discovery_splash as string | undefined;
    }

    if ('joined_at' in data) {
      this.joinedTimestamp = Date.parse(data.joined_at as string);
    }

    if ('owner_id' in data) {
      this.ownerId = data.owner_id;
    }

    if ('permissions' in data) {
      this.permissions = data.permissions;
    }

    if ('afk_channel_id' in data) {
      this.afkChannelId = data.afk_channel_id as string | undefined;
    }

    if ('afk_timeout' in data) {
      this.afkTimeout = data.afk_timeout;
    }

    if ('widget_enabled' in data) {
      this.widgetEnabled = data.widget_enabled as boolean | undefined;
    }

    if ('widget_channel_id' in data) {
      this.widgetChannelId = data.widget_channel_id as Snowflake | undefined;
    }

    if ('verification_level' in data) {
      this.verificationLevel = data.verification_level;
    }

    if ('default_message_notifications' in data) {
      this.defaultMessageNotifications = data.default_message_notifications;
    }

    if ('explicit_content_filter' in data) {
      this.explicitContentFilter = data.explicit_content_filter;
    }

    if ('premium_tier' in data) {
      this.premiumTier = data.premium_tier;
    }

    if ('rules_channel_id' in data) {
      this.rulesChannelId = data.rules_channel_id as Snowflake | undefined;
    }

    if ('public_updates_channel_id' in data) {
      this.publicUpdatesChannelId = data.public_updates_channel_id as Snowflake | undefined;
    }

    if ('safety_alerts_channel_id' in data) {
      this.safetyAlertsChannelId = data.safety_alerts_channel_id as Snowflake | undefined;
    }

    if ('preferred_locale' in data) {
      this.preferredLocale = data.preferred_locale as Locale | undefined;
    }

    if ('features' in data) {
      this.features = data.features;
    }

    if ('mfa_level' in data) {
      this.mfaLevel = data.mfa_level;
    }

    if ('system_channel_flags' in data) {
      this.systemChannelFlags = data.system_channel_flags;
    }

    this.members = new GuildMembersManager(this.client, this);
    this.roles = new GuildRolesManager(this.client, this);
    this.emojis = data.emojis.map((emoji) => new Emoji(this.client, emoji));
  }

  /**
   * The time the client user joined the guild
   * @type {Date}
   * @readonly
   */
  public joinedAt() {
    return new Date(this.joinedTimestamp ?? Date.now());
  }

  /**
   * The URL to this guild's discovery splash image.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  public discoverySplashURL(options: CamelCasedPropertiesDeep<ImageURLOptions>) {
    return this.discoverySplash && this.client.rest.cdn.discoverySplash(this.id, this.discoverySplash, options);
  }

  /**
   * Fetches the owner of the guild.
   * If the member object isn't needed, use {@link Guild#ownerId} instead.
   * @returns {Promise<GuildMember>}
   */
  async fetchOwner() {
    if (!this.ownerId) {
      throw new VesperaError('Guild does not have an owner');
    }

    const member = await this.members.fetch(this.ownerId);
    return member;
  }

  /**
   * AFK voice channel for this guild
   * @returns {?Channel}
   */
  public async afkChannel() {
    if (!this.afkChannelId) {
      return null;
    }

    return this.client.channels.fetch(this.afkChannelId);
  }

  /**
   * System channel for this guild
   * @returns {?Channel}
   */
  public async systemChannel() {
    if (!this.systemChannelId) {
      return null;
    }

    return this.client.channels.fetch(this.systemChannelId);
  }

  /**
   * Widget channel for this guild
   * @returns {?Channel}
   */
  public async widgetChannel() {
    if (!this.widgetChannelId) {
      return null;
    }

    return this.client.channels.fetch(this.widgetChannelId);
  }

  /**
   * Rules channel for this guild
   * @type {?TextChannel}
   * @readonly
   */
  get rulesChannel() {
    if (!this.rulesChannelId) {
      return null;
    }

    return this.client.channels.fetch(this.rulesChannelId);
  }

  /**
   * Public updates channel for this guild
   * @type {?TextChannel}
   * @readonly
   */
  get publicUpdatesChannel() {
    if (!this.publicUpdatesChannelId) {
      return null;
    }

    return this.client.channels.fetch(this.publicUpdatesChannelId);
  }

  /**
   * Safety alerts channel for this guild
   * @type {?TextChannel}
   * @readonly
   */
  get safetyAlertsChannel() {
    if (!this.safetyAlertsChannelId) {
      return null;
    }

    return this.client.channels.fetch(this.safetyAlertsChannelId);
  }

  /**
   * The maximum bitrate available for this guild
   * @type {number}
   * @readonly
   */
  get maximumBitrate() {
    if (this.features.includes(GuildFeature.VIPRegions)) {
      return 384_000;
    }

    switch (this.premiumTier) {
      case GuildPremiumTier.Tier1:
        return 128_000;
      case GuildPremiumTier.Tier2:
        return 256_000;
      case GuildPremiumTier.Tier3:
        return 384_000;
      default:
        return 96_000;
    }
  }

  /**
   * Fetches a collection of integrations to this guild.
   * Resolves with a collection mapping integrations by their ids.
   * @returns {Promise<Collection<Snowflake|string, Integration>>}
   * @example
   * // Fetch integrations
   * guild.fetchIntegrations()
   *   .then(integrations => console.log(`Fetched ${integrations.size} integrations`))
   *   .catch(console.error);
   */
  async fetchIntegrations() {
    const data = await this.client.api.guilds.getIntegrations(this.id);

    return data.reduce(
      (collection, integration) => collection.set(integration.id, new GuildIntegration(this, integration)),
      new Collection(),
    );
  }

  /**
   * Fetches a collection of templates from this guild.
   * Resolves with a collection mapping templates by their codes.
   * @returns {Promise<Collection<string, GuildTemplate>>}
   */
  async fetchTemplates() {
    const templates = await this.client.api.guilds.getTemplates(this.id);
    return templates.reduce(
      (collection, template) => collection.set(template.code, new GuildTemplate(this, template)),
      new Collection(),
    );
  }

  /**
   * Fetches the welcome screen for this guild.
   * @returns {Promise<WelcomeScreen>}
   */
  async fetchWelcomeScreen() {
    const data = await this.client.api.guilds.getWelcomeScreen(this.id);
    return new GuildWelcomeScreen(this, data);
  }

  /**
   * Creates a template for the guild.
   * @param {string} name The name for the template
   * @param {string} [description] The description for the template
   * @returns {Promise<GuildTemplate>}
   */
  async createTemplate(body: CamelCasedPropertiesDeep<RESTPostAPIGuildTemplatesJSONBody>) {
    const data = await this.client.api.guilds.createTemplate(this.id, body);
    return new GuildTemplate(this, data);
  }

  /**
   * Obtains a guild preview for this guild from Discord.
   * @returns {Promise<GuildPreview>}
   */
  async fetchPreview() {
    const data = await this.client.api.guilds.getPreview(this.id);
    return new GuildPreview(this, data);
  }

  /**
   * An object containing information about a guild's vanity invite.
   * @typedef {Object} Vanity
   * @property {?string} code Vanity invite code
   * @property {number} uses How many times this invite has been used
   */

  /**
   * Fetches the vanity URL invite object to this guild.
   * Resolves with an object containing the vanity URL invite code and the use count
   * @returns {Promise<Vanity>}
   * @example
   * // Fetch invite data
   * guild.fetchVanityData()
   *   .then(res => {
   *     console.log(`Vanity URL: https://discord.gg/${res.code} with ${res.uses} uses`);
   *   })
   *   .catch(console.error);
   */
  async fetchVanityData() {
    const data = await this.client.api.guilds.getVanityURL(this.id);
    return data;
  }

  /**
   * Fetches all webhooks for the guild.
   * @returns {Promise<Collection<Snowflake, Webhook>>}
   * @example
   * // Fetch webhooks
   * guild.fetchWebhooks()
   *   .then(webhooks => console.log(`Fetched ${webhooks.size} webhooks`))
   *   .catch(console.error);
   */
  async fetchWebhooks() {
    const hooks = await this.client.api.guilds.getWebhooks(this.id);
    return hooks.reduce(
      (collection, webhook) => collection.set(webhook.id, new Webhook(this.client, webhook)),
      new Collection(),
    );
  }

  /**
   * Data for the Guild Widget Settings object
   * @typedef {Object} GuildWidgetSettings
   * @property {boolean} enabled Whether the widget is enabled
   * @property {?(TextChannel|NewsChannel|VoiceChannel|StageChannel|ForumChannel|MediaChannel)} channel
   * The widget invite channel
   */

  /**
   * The Guild Widget Settings object
   * @typedef {Object} GuildWidgetSettingsData
   * @property {boolean} enabled Whether the widget is enabled
   * @property {?(TextChannel|NewsChannel|VoiceChannel|StageChannel|ForumChannel|MediaChannel|Snowflake)} channel
   * The widget invite channel
   */

  /**
   * Fetches the guild widget settings.
   * @returns {Promise<GuildWidgetSettings>}
   * @example
   * // Fetches the guild widget settings
   * guild.fetchWidgetSettings()
   *   .then(widget => console.log(`The widget is ${widget.enabled ? 'enabled' : 'disabled'}`))
   *   .catch(console.error);
   */
  async fetchWidgetSettings() {
    const data = await this.client.api.guilds.getWidgetSettings(this.id);

    return {
      enabled: data.enabled,
      channel: data.channel_id ? this.client.channels.fetch(data.channel_id) : null,
    };
  }

  /**
   * Returns a URL for the PNG widget of the guild.
   * @param {GuildWidgetStyle} [style] The style for the widget image
   * @returns {string}
   */
  widgetImageURL(style: GuildWidgetStyle) {
    return this.client.api.guilds.getWidgetImage(this.id, style);
  }

  /**
   * Options used to fetch audit logs.
   * @typedef {Object} GuildAuditLogsFetchOptions
   * @property {Snowflake|GuildAuditLogsEntry} [before] Consider only entries before this entry
   * @property {Snowflake|GuildAuditLogsEntry} [after] Consider only entries after this entry
   * @property {number} [limit] The number of entries to return
   * @property {UserResolvable} [user] Only return entries for actions made by this user
   * @property {?AuditLogEvent} [type] Only return entries for this action type
   */

  /**
   * Fetches audit logs for this guild.
   * @param {GuildAuditLogsFetchOptions} [options={}] Options for fetching audit logs
   * @returns {Promise<GuildAuditLogs>}
   * @example
   * // Output audit log entries
   * guild.fetchAuditLogs()
   *   .then(audit => console.log(audit.entries.first()))
   *   .catch(console.error);
   */
  async fetchAuditLogs(options?: CamelCasedPropertiesDeep<RESTGetAPIAuditLogQuery>) {
    const data = await this.client.api.guilds.getAuditLogs(this.id, options);
    return new GuildAuditLogs(this, data);
  }

  /**
   * Fetches the guild onboarding data for this guild.
   * @returns {Promise<GuildOnboarding>}
   */
  async fetchOnboarding() {
    const data = await this.client.api.guilds.getOnboarding(this.id);
    return new GuildOnboarding(this, data);
  }

  /**
   * The data for editing a guild.
   * @typedef {Object} GuildEditOptions
   * @property {string} [name] The name of the guild
   * @property {?GuildVerificationLevel} [verificationLevel] The verification level of the guild
   * @property {?GuildDefaultMessageNotifications} [defaultMessageNotifications] The default message
   * notification level of the guild
   * @property {?GuildExplicitContentFilter} [explicitContentFilter] The level of the explicit content filter
   * @property {?VoiceChannelResolvable} [afkChannel] The AFK channel of the guild
   * @property {number} [afkTimeout] The AFK timeout of the guild
   * @property {?(BufferResolvable|Base64Resolvable)} [icon] The icon of the guild
   * @property {GuildMemberResolvable} [owner] The owner of the guild
   * @property {?(BufferResolvable|Base64Resolvable)} [splash] The invite splash image of the guild
   * @property {?(BufferResolvable|Base64Resolvable)} [discoverySplash] The discovery splash image of the guild
   * @property {?(BufferResolvable|Base64Resolvable)} [banner] The banner of the guild
   * @property {?TextChannelResolvable} [systemChannel] The system channel of the guild
   * @property {SystemChannelFlagsResolvable} [systemChannelFlags] The system channel flags of the guild
   * @property {?TextChannelResolvable} [rulesChannel] The rules channel of the guild
   * @property {?TextChannelResolvable} [publicUpdatesChannel] The community updates channel of the guild
   * @property {?TextChannelResolvable} [safetyAlertsChannel] The safety alerts channel of the guild
   * @property {?string} [preferredLocale] The preferred locale of the guild
   * @property {GuildFeature[]} [features] The features of the guild
   * @property {?string} [description] The discovery description of the guild
   * @property {boolean} [premiumProgressBarEnabled] Whether the guild's premium progress bar is enabled
   * @property {string} [reason] Reason for editing this guild
   */

  /**
   * Data that can be resolved to a Text Channel object. This can be:
   * * A TextChannel
   * * A Snowflake
   * @typedef {TextChannel|Snowflake} TextChannelResolvable
   */

  /**
   * Data that can be resolved to a Voice Channel object. This can be:
   * * A VoiceChannel
   * * A Snowflake
   * @typedef {VoiceChannel|Snowflake} VoiceChannelResolvable
   */

  /**
   * Updates the guild with new information - e.g. a new name.
   * @param {GuildEditOptions} options The options to provide
   * @returns {Promise<Guild>}
   * @example
   * // Set the guild name
   * guild.edit({
   *   name: 'Discord Guild',
   * })
   *   .then(updated => console.log(`New guild name ${updated}`))
   *   .catch(console.error);
   */
  async edit({ reason, ...options }: CamelCasedPropertiesDeep<RESTPatchAPIGuildJSONBody> & { reason?: string }) {
    return this.client.api.guilds.edit(
      this.id,
      toSnakeCase(options) as Parameters<typeof this.client.api.guilds.edit>[1],
      { reason },
    );
  }

  /**
   * Options used to edit the guild onboarding.
   * @typedef {Object} GuildOnboardingEditOptions
   * @property {GuildOnboardingPromptData[]|Collection<Snowflake, GuildOnboardingPrompt>} [prompts]
   * The prompts shown during onboarding and in customize community
   * @property {ChannelResolvable[]|Collection<Snowflake, GuildChannel>} [defaultChannels]
   * The channels that new members get opted into automatically
   * @property {boolean} [enabled] Whether the onboarding is enabled
   * @property {GuildOnboardingMode} [mode] The mode to edit the guild onboarding with
   * @property {string} [reason] The reason for editing the guild onboarding
   */

  /**
   * Data for editing a guild onboarding prompt.
   * @typedef {Object} GuildOnboardingPromptData
   * @property {Snowflake} [id] The id of the prompt
   * @property {string} title The title for the prompt
   * @property {boolean} [singleSelect] Whether users are limited to selecting one option for the prompt
   * @property {boolean} [required] Whether the prompt is required before a user completes the onboarding flow
   * @property {boolean} [inOnboarding] Whether the prompt is present in the onboarding flow
   * @property {GuildOnboardingPromptType} [type] The type of the prompt
   * @property {GuildOnboardingPromptOptionData[]|Collection<Snowflake, GuildOnboardingPrompt>} options
   * The options available within the prompt
   */

  /**
   * Data for editing a guild onboarding prompt option.
   * @typedef {Object} GuildOnboardingPromptOptionData
   * @property {?Snowflake} [id] The id of the option
   * @property {ChannelResolvable[]|Collection<Snowflake, GuildChannel>} [channels]
   * The channels a member is added to when the option is selected
   * @property {RoleResolvable[]|Collection<Snowflake, Role>} [roles]
   * The roles assigned to a member when the option is selected
   * @property {string} title The title of the option
   * @property {?string} [description] The description of the option
   * @property {?(EmojiIdentifierResolvable|Emoji)} [emoji] The emoji of the option
   */

  /**
   * Edits the guild onboarding data for this guild.
   * @param {GuildOnboardingEditOptions} options The options to provide
   * @returns {Promise<GuildOnboarding>}
   */
  async editOnboarding({
    reason,
    ...options
  }: CamelCasedPropertiesDeep<RESTPutAPIGuildOnboardingJSONBody> & { reason?: string }) {
    const data = await this.client.api.guilds.editOnboarding(
      this.id,
      toSnakeCase(options) as Parameters<typeof this.client.api.guilds.editOnboarding>[1],
      { reason },
    );

    return new GuildOnboarding(this, data);
  }

  /**
   * Welcome channel data
   * @typedef {Object} WelcomeChannelData
   * @property {string} description The description to show for this welcome channel
   * @property {TextChannel|NewsChannel|ForumChannel|MediaChannel|Snowflake} channel
   * The channel to link for this welcome channel
   * @property {EmojiIdentifierResolvable} [emoji] The emoji to display for this welcome channel
   */

  /**
   * Welcome screen edit data
   * @typedef {Object} WelcomeScreenEditOptions
   * @property {boolean} [enabled] Whether the welcome screen is enabled
   * @property {string} [description] The description for the welcome screen
   * @property {WelcomeChannelData[]} [welcomeChannels] The welcome channel data for the welcome screen
   */

  /**
   * Data that can be resolved to a GuildTextChannel object. This can be:
   * * A TextChannel
   * * A NewsChannel
   * * A Snowflake
   * @typedef {TextChannel|NewsChannel|Snowflake} GuildTextChannelResolvable
   */

  /**
   * Data that can be resolved to a GuildVoiceChannel object. This can be:
   * * A VoiceChannel
   * * A StageChannel
   * * A Snowflake
   * @typedef {VoiceChannel|StageChannel|Snowflake} GuildVoiceChannelResolvable
   */

  /**
   * Updates the guild's welcome screen
   * @param {WelcomeScreenEditOptions} options The options to provide
   * @returns {Promise<WelcomeScreen>}
   * @example
   * guild.editWelcomeScreen({
   *   description: 'Hello World',
   *   enabled: true,
   *   welcomeChannels: [
   *     {
   *       description: 'foobar',
   *       channel: '222197033908436994',
   *     }
   *   ],
   * })
   */
  async editWelcomeScreen({
    reason,
    ...options
  }: CamelCasedPropertiesDeep<RESTPatchAPIGuildWelcomeScreenJSONBody> & { reason?: string }) {
    const data = await this.client.api.guilds.editWelcomeScreen(
      this.id,
      toSnakeCase(options) as Parameters<typeof this.client.api.guilds.editWelcomeScreen>[1],
      { reason },
    );

    return new GuildWelcomeScreen(this, data);
  }

  /**
   * Edits the level of the explicit content filter.
   * @param {?GuildExplicitContentFilter} explicitContentFilter The new level of the explicit content filter
   * @param {string} [reason] Reason for changing the level of the guild's explicit content filter
   * @returns {Promise<Guild>}
   */
  setExplicitContentFilter({ reason, filter }: { reason?: string; filter: GuildExplicitContentFilter }) {
    return this.edit({ explicitContentFilter: filter, reason });
  }

  /**
   * Edits the setting of the default message notifications of the guild.
   * @param {?GuildDefaultMessageNotifications} defaultMessageNotifications
   * The new default message notification level of the guild
   * @param {string} [reason] Reason for changing the setting of the default message notifications
   * @returns {Promise<Guild>}
   */
  setDefaultMessageNotifications({
    reason,
    notification,
  }: {
    reason?: string;
    notification: GuildDefaultMessageNotifications;
  }) {
    return this.edit({ defaultMessageNotifications: notification, reason });
  }

  /**
   * Edits the flags of the default message notifications of the guild.
   * @param {SystemChannelFlagsResolvable} systemChannelFlags The new flags for the default message notifications
   * @param {string} [reason] Reason for changing the flags of the default message notifications
   * @returns {Promise<Guild>}
   */
  setSystemChannelFlags({ reason, flags }: { reason?: string; flags: GuildSystemChannelFlags }) {
    return this.edit({ systemChannelFlags: flags, reason });
  }

  /**
   * Edits the name of the guild.
   * @param {string} name The new name of the guild
   * @param {string} [reason] Reason for changing the guild's name
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild name
   * guild.setName('Discord Guild')
   *  .then(updated => console.log(`Updated guild name to ${updated.name}`))
   *  .catch(console.error);
   */
  setName({ name, reason }: { name: string; reason?: string }) {
    return this.edit({ name, reason });
  }

  /**
   * Edits the verification level of the guild.
   * @param {?GuildVerificationLevel} verificationLevel The new verification level of the guild
   * @param {string} [reason] Reason for changing the guild's verification level
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild verification level
   * guild.setVerificationLevel(1)
   *  .then(updated => console.log(`Updated guild verification level to ${guild.verificationLevel}`))
   *  .catch(console.error);
   */
  setVerificationLevel({ reason, level }: { reason?: string; level: GuildVerificationLevel }) {
    return this.edit({ verificationLevel: level, reason });
  }

  /**
   * Edits the AFK channel of the guild.
   * @param {?VoiceChannelResolvable} afkChannel The new AFK channel
   * @param {string} [reason] Reason for changing the guild's AFK channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild AFK channel
   * guild.setAFKChannel(channel)
   *  .then(updated => console.log(`Updated guild AFK channel to ${guild.afkChannel.name}`))
   *  .catch(console.error);
   */
  setAFKChannel({ reason, channel }: { reason?: string; channel: Snowflake }) {
    return this.edit({ afkChannelId: channel, reason });
  }

  /**
   * Edits the system channel of the guild.
   * @param {?TextChannelResolvable} systemChannel The new system channel
   * @param {string} [reason] Reason for changing the guild's system channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild system channel
   * guild.setSystemChannel(channel)
   *  .then(updated => console.log(`Updated guild system channel to ${guild.systemChannel.name}`))
   *  .catch(console.error);
   */
  setSystemChannel({ reason, channel }: { reason?: string; channel: Snowflake }) {
    return this.edit({ systemChannelId: channel, reason });
  }

  /**
   * Edits the AFK timeout of the guild.
   * @param {number} afkTimeout The time in seconds that a user must be idle to be considered AFK
   * @param {string} [reason] Reason for changing the guild's AFK timeout
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild AFK channel
   * guild.setAFKTimeout(60)
   *  .then(updated => console.log(`Updated guild AFK timeout to ${guild.afkTimeout}`))
   *  .catch(console.error);
   */
  setAFKTimeout({ reason, timeout }: { reason?: string; timeout: 60 | 300 | 900 | 1800 | 3600 | undefined }) {
    return this.edit({ afkTimeout: timeout, reason });
  }

  /**
   * Sets a new guild icon.
   * @param {?(Base64Resolvable|BufferResolvable)} icon The new icon of the guild
   * @param {string} [reason] Reason for changing the guild's icon
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild icon
   * guild.setIcon('./icon.png')
   *  .then(updated => console.log('Updated the guild icon'))
   *  .catch(console.error);
   */
  setIcon({ reason, icon }: { reason?: string; icon: string }) {
    return this.edit({ icon, reason });
  }

  /**
   * Sets a new owner of the guild.
   * @param {GuildMemberResolvable} owner The new owner of the guild
   * @param {string} [reason] Reason for setting the new owner
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild owner
   * guild.setOwner(guild.members.cache.first())
   *  .then(guild => guild.fetchOwner())
   *  .then(owner => console.log(`Updated the guild owner to ${owner.displayName}`))
   *  .catch(console.error);
   */
  setOwner({ reason, owner }: { reason?: string; owner: Snowflake }) {
    return this.edit({ ownerId: owner, reason });
  }

  /**
   * Sets a new guild invite splash image.
   * @param {?(Base64Resolvable|BufferResolvable)} splash The new invite splash image of the guild
   * @param {string} [reason] Reason for changing the guild's invite splash image
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild splash
   * guild.setSplash('./splash.png')
   *  .then(updated => console.log('Updated the guild splash'))
   *  .catch(console.error);
   */
  setSplash({ reason, splash }: { reason?: string; splash: string }) {
    return this.edit({ splash, reason });
  }

  /**
   * Sets a new guild discovery splash image.
   * @param {?(Base64Resolvable|BufferResolvable)} discoverySplash The new discovery splash image of the guild
   * @param {string} [reason] Reason for changing the guild's discovery splash image
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild discovery splash
   * guild.setDiscoverySplash('./discoverysplash.png')
   *   .then(updated => console.log('Updated the guild discovery splash'))
   *   .catch(console.error);
   */
  setDiscoverySplash({ reason, splash }: { reason?: string; splash: string }) {
    return this.edit({ discoverySplash: splash, reason });
  }

  /**
   * Sets a new guild banner.
   * @param {?(Base64Resolvable|BufferResolvable)} banner The new banner of the guild
   * @param {string} [reason] Reason for changing the guild's banner
   * @returns {Promise<Guild>}
   * @example
   * guild.setBanner('./banner.png')
   *  .then(updated => console.log('Updated the guild banner'))
   *  .catch(console.error);
   */
  setBanner({ reason, banner }: { reason?: string; banner: string }) {
    return this.edit({ banner, reason });
  }

  /**
   * Edits the rules channel of the guild.
   * @param {?TextChannelResolvable} rulesChannel The new rules channel
   * @param {string} [reason] Reason for changing the guild's rules channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild rules channel
   * guild.setRulesChannel(channel)
   *  .then(updated => console.log(`Updated guild rules channel to ${guild.rulesChannel.name}`))
   *  .catch(console.error);
   */
  setRulesChannel({ reason, channel }: { reason?: string; channel: Snowflake }) {
    return this.edit({ rulesChannelId: channel, reason });
  }

  /**
   * Edits the community updates channel of the guild.
   * @param {?TextChannelResolvable} publicUpdatesChannel The new community updates channel
   * @param {string} [reason] Reason for changing the guild's community updates channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild community updates channel
   * guild.setPublicUpdatesChannel(channel)
   *  .then(updated => console.log(`Updated guild community updates channel to ${guild.publicUpdatesChannel.name}`))
   *  .catch(console.error);
   */
  setPublicUpdatesChannel({ reason, channel }: { reason?: string; channel: Snowflake }) {
    return this.edit({ publicUpdatesChannelId: channel, reason });
  }

  /**
   * Edits the preferred locale of the guild.
   * @param {?Locale} preferredLocale The new preferred locale of the guild
   * @param {string} [reason] Reason for changing the guild's preferred locale
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild preferred locale
   * guild.setPreferredLocale('en-US')
   *  .then(updated => console.log(`Updated guild preferred locale to ${guild.preferredLocale}`))
   *  .catch(console.error);
   */
  setPreferredLocale({ reason, preferredLocale }: { reason?: string; preferredLocale: Locale }) {
    return this.edit({ preferredLocale, reason });
  }

  /**
   * Edits the enabled state of the guild's premium progress bar
   * @param {boolean} [enabled=true] The new enabled state of the guild's premium progress bar
   * @param {string} [reason] Reason for changing the state of the guild's premium progress bar
   * @returns {Promise<Guild>}
   */
  setPremiumProgressBarEnabled(enabled = true, reason: string) {
    return this.edit({ premiumProgressBarEnabled: enabled, reason });
  }

  /**
   * Edits the safety alerts channel of the guild.
   * @param {?TextChannelResolvable} safetyAlertsChannel The new safety alerts channel
   * @param {string} [reason] Reason for changing the guild's safety alerts channel
   * @returns {Promise<Guild>}
   * @example
   * // Edit the guild safety alerts channel
   * guild.setSafetyAlertsChannel(channel)
   *  .then(updated => console.log(`Updated guild safety alerts channel to ${updated.safetyAlertsChannel.name}`))
   *  .catch(console.error);
   */
  setSafetyAlertsChannel({ reason, channel }: { reason?: string; channel: Snowflake }) {
    return this.edit({ safetyAlertsChannelId: channel, reason });
  }

  /**
   * Edits the guild's widget settings.
   * @param {GuildWidgetSettingsData} settings The widget settings for the guild
   * @param {string} [reason] Reason for changing the guild's widget settings
   * @returns {Promise<Guild>}
   */
  async setWidgetSettings({
    reason,
    ...settings
  }: CamelCasedPropertiesDeep<Partial<APIGuildWidgetSettings>> & { reason?: string }) {
    await this.client.api.guilds.editWidgetSettings(this.id, toSnakeCase(settings), { reason });

    return this;
  }

  /**
   * Sets the guild's MFA level
   * <info>An elevated MFA level requires guild moderators to have 2FA enabled.</info>
   * @param {GuildMFALevel} level The MFA level
   * @param {string} [reason] Reason for changing the guild's MFA level
   * @returns {Promise<Guild>}
   * @example
   * // Set the MFA level of the guild to Elevated
   * guild.setMFALevel(GuildMFALevel.Elevated)
   *   .then(guild => console.log("Set guild's MFA level to Elevated"))
   *   .catch(console.error);
   */
  async setMFALevel({ level, reason }: { level: GuildMFALevel; reason?: string }) {
    await this.client.api.guilds.editMFALevel(this.id, level, { reason });

    return this;
  }

  /**
   * Leaves the guild.
   * @returns {Promise<Guild>}
   * @example
   * // Leave a guild
   * guild.leave()
   *   .then(guild => console.log(`Left the guild: ${guild.name}`))
   *   .catch(console.error);
   */
  async leave() {
    if (this.ownerId === this.client.user.id) throw new VesperaError('Guild owner cannot leave the guild');
    await this.client.api.guilds.removeMember(this.id, this.client.user.id);
    return this;
  }

  /**
   * Deletes the guild.
   * @returns {Promise<Guild>}
   * @example
   * // Delete a guild
   * guild.delete()
   *   .then(guild => console.log(`Deleted the guild ${guild}`))
   *   .catch(console.error);
   */
  async delete() {
    await this.client.api.guilds.delete(this.id);
    return this;
  }

  /**
   * Sets whether this guild's invites are disabled.
   * @param {boolean} [disabled=true] Whether the invites are disabled
   * @returns {Promise<Guild>}
   */
  async disableInvites(disabled = true) {
    const features = this.features.filter((feature) => feature !== GuildFeature.InvitesDisabled);
    if (disabled) features.push(GuildFeature.InvitesDisabled);

    return this.edit({ features });
  }
}
