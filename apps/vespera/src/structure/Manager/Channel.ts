import type { Snowflake } from '../../core';
import { Base } from '../Base';
import { Channel } from '../Channel';
import type { Client } from '../Client';

export class ChannelManager extends Base {
  /**
   * Constructor for creating a new instance of the class.
   *
   * @param {Client} client - the client object
   * @return {void}
   */
  constructor(client: Client) {
    super(client);
  }

  /**
   * Fetches data using the provided ID.
   *
   * @param {Snowflake} id - The ID used to fetch data.
   * @return {Promise<Channel>} The data fetched using the ID.
   */
  public async fetch(id: Snowflake) {
    const data = await this.client.api.channels.get(id);
    return new Channel(this.client, data);
  }
}
