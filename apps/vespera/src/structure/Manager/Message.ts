import type { APIMessage, Snowflake } from '../../core';
import { Base } from '../Base';
import type { Channel } from '../Channel';
import type { Client } from '../Client';
import { Message } from '../Message';

export class MessageManager extends Base {
  /**
   * The channel
   * @type {Channel}
   * @readonly
   **/
  public channel: Channel;

  /**
   * Constructor for creating a new instance of the class.
   *
   * @param {Client} client - the client object
   * @param {Channel} channel - the channel object
   * @return {void}
   */
  constructor(client: Client, channel: Channel) {
    super(client);

    this.channel = channel;
  }

  /**
   * Fetches data using the provided ID.
   *
   * @param {Snowflake} id - The ID used to fetch data.
   * @return {Promise<Channel>} The data fetched using the ID.
   */
  public async fetch(id: Snowflake) {
    const data = await this.client.api.channels.getMessage(this.channel.id, id);
    return new Message(this.client, data);
  }
}
