import type { Guild } from '..';
import type { APIGuildIntegration } from '../core';

export class GuildIntegration {
  public raw: APIGuildIntegration;
  public guild: Guild;

  public id: string;
  public name: string;
  public type: string;
  public roleId: string | undefined;
  public enabled: boolean;

  constructor(guild: Guild, data: APIGuildIntegration) {
    this.guild = guild;
    this.raw = data;

    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.roleId = data.role_id;
    this.enabled = data.enabled;
  }

  public async delete(reason: string) {
    return this.guild.client.api.guilds.deleteIntegration(this.guild.id, this.id, { reason });
  }
}
