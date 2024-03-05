/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import type { APIWebhook } from '../core';
import { WebhookType } from '../core';
import type { ImageURLOptions } from '../rest';

import { Base } from './Base';
import type { Client } from './Client';
import { VesperaError } from './Error';
import { User } from './User';
import { WebhookClient } from './WebhookClient';

export class Webhook extends Base {
  public readonly raw: APIWebhook;

  public id: string;
  public type: WebhookType;
  public token?: string;
  public avatar?: string;
  public creator?: User;

  /**
   * Initializes a new instance of the class.
   *
   * @param {YorClient} client - The client instance.
   * @param {APIWebhook} data - The webhook data.
   */
  constructor(client: Client, data: APIWebhook) {
    super(client);

    this.raw = data;

    this.id = this.raw.id;
    this.type = this.raw.type;
    this.token = this.raw.token;
    this.avatar = this.raw.avatar as string | undefined;
    this.creator = this.raw.user && new User(this.client, this.raw.user);
  }

  /**
   * Creates a client if the call is incoming and returns a new WebhookClient instance.
   *
   * @return {WebhookClient} A new WebhookClient instance.
   */
  public createClient() {
    return this.isIncoming() && new WebhookClient({ id: this.id, token: this.token as string });
  }

  /**
   * Returns the created timestamp as a Date object.
   *
   * @return {number} The created timestamp.
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
   * Returns the creation date of the object.
   *
   * @return {Date} The creation date of the object.
   */
  public createdAt(): Date {
    return new Date(this.createdTimestamp());
  }

  /**
   * Returns the URL of the avatar image for this user.
   *
   * @param {ImageURLOptions} options - Optional parameters for the image URL.
   * @return {string | undefined} The URL of the avatar image, or undefined if there is no avatar.
   */
  public avatarURL(options?: ImageURLOptions) {
    return this.avatar && this.client.rest.cdn.avatar(this.id, this.avatar, options);
  }

  /**
   * Whether this webhook is created by a user.
   * @returns {boolean}
   */
  public isUserCreated(): boolean {
    return Boolean(this.type === WebhookType.Incoming && this.creator && !this.creator.bot);
  }

  /**
   * Whether this webhook is created by an application.
   * @returns {boolean}
   */
  public isApplicationCreated(): boolean {
    return this.type === WebhookType.Application;
  }

  /**
   * Whether or not this webhook is a channel follower webhook.
   * @returns {boolean}
   */
  public isChannelFollower(): boolean {
    return this.type === WebhookType.ChannelFollower;
  }

  /**
   * Whether or not this webhook is an incoming webhook.
   * @returns {boolean}
   */
  public isIncoming(): boolean {
    return this.type === WebhookType.Incoming;
  }
}
