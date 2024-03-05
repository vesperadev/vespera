import type { Client } from '..';
import { Base } from '..';
import type { RESTPatchAPICurrentUserJSONBody, Snowflake } from '../core';

/* This class extends the Base class and represents a client user. */
export class ClientUser extends Base {
  public id: Snowflake;

  /**
   * The constructor initializes the id property of the class instance with the application id from the
   * client options.
   * @param {Client} client - The `client` parameter in the constructor is an instance of the `Client`
   * class. It is being passed to the constructor to initialize the object.
   */
  constructor(client: Client) {
    super(client);

    this.id = client.options.application.id;
  }

  /**
   * Data used to edit the logged in client
   * @typedef {Object} ClientUserEditOptions
   * @property {string} [username] The new username
   * @property {?(BufferResolvable|Base64Resolvable)} [avatar] The new avatar
   */

  /**
   * Edits the logged in client.
   * @param {ClientUserEditOptions} options The options to provide
   * @returns {Promise<ClientUser>}
   */
  async edit(options: RESTPatchAPICurrentUserJSONBody & { avatar?: string }) {
    const data = await this.client.api.users.edit(options);
    return this;
  }

  /**
   * Sets the username of the logged in client.
   * Changing usernames in Discord is heavily rate limited, with only 2 requests
   * every hour. Use this sparingly!
   * @param {string} username The new username
   * @returns {Promise<ClientUser>}
   * @example
   * // Set username
   * client.user.setUsername('discordjs')
   *   .then(user => console.log(`My new username is ${user.username}`))
   *   .catch(console.error);
   */
  setUsername(username: string) {
    return this.edit({ username });
  }

  /**
   * Sets the avatar of the logged in client.
   * @param {?(BufferResolvable|Base64Resolvable)} avatar The new avatar
   * @returns {Promise<ClientUser>}
   * @example
   * // Set avatar
   * client.user.setAvatar('./avatar.png')
   *   .then(user => console.log(`New avatar set!`))
   *   .catch(console.error);
   */
  setAvatar(avatar: string) {
    return this.edit({ avatar });
  }
}
