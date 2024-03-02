import type { Client } from '..';
import { Base } from '..';
import type { APIGuild, Snowflake } from '../core';
import { GuildMembersManager } from './Manager/GuildMember';

export class Guild extends Base {
  public id: Snowflake;

  public members: GuildMembersManager;

  constructor(client: Client, data: APIGuild) {
    super(client);

    this.id = data.id;

    this.members = new GuildMembersManager(this.client, this);
  }
}
