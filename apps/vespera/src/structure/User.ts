import type { CamelCasedPropertiesDeep } from 'type-fest';

import type { Client } from '..';
import { Base, Channel } from '..';
import type { APIUser, Snowflake } from '../core';
import type { ImageURLOptions } from '../rest';
import { calculateUserDefaultAvatarIndex } from '../rest';
import { getTimestamp, userMention } from '../utils';

/* The User class */
export class User extends Base {
  /**
   * The raw object returned from the Discord API
   *
   * @property
   * @name raw
   * @kind property
   * @memberof User
   * @public
   * @type {APIUser}
   */
  public raw: APIUser;

  /**
   * This property will hold the unique identifier (Snowflake) associated with the user
   *
   * @property
   * @name id
   * @kind property
   * @memberof User
   * @public
   * @type {string}
   */
  public id: Snowflake;

  /**
   * This property is used to store the discriminator value associated with the user. The discriminator is
   * a four-digit number that appears after the user's username and "#" symbol in their tag (e.g., Username#1234).
   *
   * @property
   * @name discriminator
   * @kind property
   * @memberof User
   * @public
   * @type {string}
   */
  public discriminator: string;

  /**
   * This property is used to store the username associated with the user.
   *
   * @property
   * @name username
   * @kind property
   * @memberof User
   * @public
   * @type {string}
   */
  public username: string;

  /**
   * This property is used to store the accent color associated with
   * the user, represented as a number. If the accent color is not set or available, the property will be `undefined`.
   *
   * @property
   * @name accentColor
   * @kind property
   * @memberof User
   * @public
   * @type {number | undefined}
   */
  public accentColor: number | undefined;

  /**
   * This property is used to store the URL of the user's avatar key provided by discord. If the
   * user does not have an avatar set, the property will be `undefined`.
   *
   * @property
   * @name avatar
   * @kind property
   * @memberof User
   * @public
   * @type {string | undefined}
   */
  public avatar: string | undefined;

  /**
   * This property can hold a value of type `string` (representing the URL of the user's banner) or
   * `undefined` if the user does not have a banner set. It allows for storing and accessing the user's banner information
   * within an instance of the `User` class.
   *
   * @property
   * @name banner
   * @kind property
   * @memberof User
   * @public
   * @type {string | undefined}
   */
  public banner: string | undefined;

  /**
   * This property can hold a value of type `string` (representing the URL of the user's avatar decoration)
   * or `undefined` if the user does not have an avatar decoration set. It allows for storing and accessing the user's avatar
   * decoration information within an instance of the `User` class.
   *
   * @property
   * @name avatarDecoration
   * @kind property
   * @memberof User
   * @public
   * @type {string | undefined}
   */
  public avatarDecoration: string | undefined;

  /**
   * This property is used to indicate whether the user is a bot account. If the user is a
   * bot, the `bot` property will hold a value of `true`, indicating that the user is a bot account. If the user is not a
   * bot, the `bot` property will be `undefined`. This allows for distinguishing between regular user accounts and bot
   * accounts within an instance of the `User` class.
   *
   * @property
   * @name bot
   * @kind property
   * @memberof User
   * @public
   * @type {boolean | undefined}
   */
  public bot: boolean | undefined;

  /**
   * This property is used to indicate whether the user is a system account. If the
   * user is a system account, the `system` property will hold a value of `true`, indicating that the user is a system
   * account. If the user is not a system account, the `system` property will be `undefined`. This allows for distinguishing
   * between regular user accounts and system accounts within an instance of the `User` class.
   *
   * @property
   * @name system
   * @kind property
   * @memberof User
   * @public
   * @type {boolean | undefined}
   */
  public system: boolean | undefined;

  /**
   * This property is used to indicate whether multi-factor authentication (MFA)
   * is enabled for the user.
   *
   * @property
   * @name mfaEnabled
   * @kind property
   * @memberof User
   * @public
   * @type {boolean | undefined}
   */
  public mfaEnabled: boolean | undefined;

  /**
   *
   * @property
   * @name verified
   * @kind property
   * @memberof User
   * @public
   * @type {boolean | undefined}
   */
  public verified: boolean | undefined;

  /**
   * property that can either be a string value representing the user's email address, or it can be undefined if the user does not have an email
   * associated with their account.
   *
   * @property
   * @name email
   * @kind property
   * @memberof User
   * @public
   * @type {string | undefined}
   */
  public email: string | undefined;

  constructor(client: Client, data: APIUser) {
    super(client);

    this.raw = data;

    this.id = this.raw.id;
    this.discriminator = this.raw.discriminator;
    this.username = this.raw.username;
    this.accentColor = this.raw.accent_color as number | undefined;
    this.avatar = this.raw.avatar as string | undefined;
    this.banner = this.raw.banner as string | undefined;
    this.avatarDecoration = this.raw.avatar_decoration as string | undefined;
    this.bot = this.raw.bot;
    this.system = this.raw.system;
    this.mfaEnabled = this.raw.mfa_enabled;
    this.verified = this.raw.verified;
    this.email = this.raw.email as string | undefined;
  }

  /**
   * The timestamp the user was created at
   * @type {number}
   * @readonly
   */
  public createdTimestamp() {
    return getTimestamp(this.id);
  }

  /**
   * The time the user was created at
   * @type {Date}
   * @readonly
   */
  public createdAt() {
    return new Date(this.createdTimestamp());
  }

  /**
   * A link to the user's avatar.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  public avatarURL(options?: CamelCasedPropertiesDeep<ImageURLOptions>) {
    return this.avatar && this.client.rest.cdn.avatar(this.id, this.avatar, options);
  }

  /**
   * A link to the user's avatar decoration.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  public avatarDecorationURL(options?: CamelCasedPropertiesDeep<ImageURLOptions>) {
    return this.avatarDecoration && this.client.rest.cdn.avatarDecoration(this.id, this.avatarDecoration, options);
  }

  /**
   * A link to the user's default avatar
   * @type {string}
   * @readonly
   */
  get defaultAvatarURL() {
    const index =
      this.discriminator === '0' ? calculateUserDefaultAvatarIndex(this.id) : parseInt(this.discriminator) % 5;
    return this.client.rest.cdn.defaultAvatar(index);
  }

  /**
   * A link to the user's avatar if they have one.
   * Otherwise a link to their default avatar will be returned.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {string}
   */
  public async displayAvatarURL(options?: CamelCasedPropertiesDeep<ImageURLOptions>) {
    return this.avatarURL(options) ?? this.defaultAvatarURL;
  }

  /**
   * The hexadecimal version of the user accent color, with a leading hash
   * <info>The user must be force fetched for this property to be present</info>
   * @type {?string}
   * @readonly
   */
  public hexAccentColor() {
    if (typeof this.accentColor !== 'number') return this.accentColor;
    return `#${this.accentColor.toString(16).padStart(6, '0')}`;
  }

  /**
   * A link to the user's banner. See {@link User#banner} for more info
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  public bannerURL(options?: CamelCasedPropertiesDeep<ImageURLOptions>) {
    return this.banner && this.client.rest.cdn.banner(this.id, this.banner, options);
  }

  /**
   * Creates a DM channel between the client and the user.
   * @returns {Promise<Channel>}
   */
  public async createDM() {
    const channel = await this.client.api.users.createDM(this.id);
    return new Channel(this.client, channel);
  }

  /**
   * When concatenated with a string, this automatically returns the user's mention instead of the User object.
   * @returns {string}
   * @example
   * // Logs: Hello from <@123456789012345678>!
   * console.log(`Hello from ${user}!`);
   */
  toString() {
    return userMention(this.id);
  }
}
