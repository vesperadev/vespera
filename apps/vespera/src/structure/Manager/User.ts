import type { Snowflake } from '../../core';
import { Base } from '../Base';
import { User } from '../User';
import type { Client } from '../Client';

export class UserManager extends Base {
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
   * @return {Promise<User>} The data fetched using the ID.
   */
  public async fetch(id: Snowflake) {
    const data = await this.client.api.users.get(id);
    return new User(this.client, data);
  }
}
