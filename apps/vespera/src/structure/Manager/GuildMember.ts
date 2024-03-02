import { Guild } from '../Guild';
import { Base } from '../Base';
import { Client } from '../Client';
import { Snowflake } from '@discordjs/core';

export class GuildMembersManager extends Base {
  public guild: Guild;

  constructor(client: Client, guild: Guild) {
    super(client);

    this.guild = guild;
  }

  public async fetch(id: Snowflake) {
    const data = await this.client.api.guilds.getMember(this.guild.id, id);
    return data;
  }

  /**
   * Fetches the client user as a GuildMember of the guild.
   * @param {BaseFetchOptions} [options] The options for fetching the member
   * @returns {Promise<GuildMember>}
   */
  fetchMe() {
    return this.fetch(this.client.user.id);
  }
}
