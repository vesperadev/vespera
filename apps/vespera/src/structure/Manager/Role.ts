import type { RESTPatchAPIGuildRolePositionsJSONBody, Snowflake } from '../../core';
import { Base } from '../Base';
import type { Client } from '../Client';
import type { Guild } from '../Guild';
import { Role } from '../Role';

export class GuildRolesManager extends Base {
  public guild: Guild;

  /**
   * Constructor for creating a new instance of the class.
   *
   * @param {Client} client - the client object
   * @return {void}
   */
  constructor(client: Client, guild: Guild) {
    super(client);

    this.guild = guild;
  }

  /**
   * Fetches data using the provided ID.
   *
   * @param {Snowflake} id - The ID used to fetch data.
   * @return {Promise<Role>} The data fetched using the ID.
   */
  public async fetch(id: Snowflake) {
    const data = await this.client.api.guilds.getRoles(this.guild.id);
    const role = data.find((r) => r.id === id);

    return role ? new Role(this.client, role) : null;
  }

  public async delete({ role, reason }: { role: Snowflake; reason?: string }) {
    await this.client.api.guilds.deleteRole(this.guild.id, role, { reason });
  }

  public async setPositions({ reason, ...roles }: RESTPatchAPIGuildRolePositionsJSONBody & { reason?: string }) {
    return await this.client.api.guilds.setRolePositions(this.guild.id, roles, { reason });
  }
}
