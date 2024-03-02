import type { Snowflake } from '../../core';
import { Base } from '../Base';
import type { Client } from '../Client';
import { Guild } from '../Guild';

export class GuildManager extends Base {
  /**
   * Constructor for the class.
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
   * @return {Promise<Guild>} The data fetched using the ID.
   */
  public async fetch(id: Snowflake) {
    const data = await this.client.api.guilds.get(id);
    return new Guild(this.client, data);
  }
}
