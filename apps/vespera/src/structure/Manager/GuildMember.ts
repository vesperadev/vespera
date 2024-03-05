import type { CamelCasedPropertiesDeep } from 'type-fest';

import type {
  RESTGetAPIGuildMembersQuery,
  RESTGetAPIGuildMembersSearchQuery,
  RESTGetAPIGuildPruneCountQuery,
  RESTPatchAPIGuildMemberJSONBody,
  RESTPostAPIGuildPruneJSONBody,
  RESTPutAPIGuildBanJSONBody,
  Snowflake,
} from '../../core';
import { Collection, toSnakeCase } from '../../utils';
import { Base } from '../Base';
import type { Client } from '../Client';
import type { Guild } from '../Guild';

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

  /**
   * Searches for members in the guild based on a query.
   * @param {GuildSearchMembersOptions} options Options for searching members
   * @returns {Promise<Collection<Snowflake, GuildMember>>}
   */
  public async search(query: CamelCasedPropertiesDeep<RESTGetAPIGuildMembersSearchQuery>) {
    const data = await this.client.api.guilds.searchForMembers(this.guild.id, toSnakeCase(query));
    return data.reduce((collection, member) => collection.set(member.user?.id, member), new Collection());
  }

  /**
   * Lists up to 1000 members of the guild.
   * @param {GuildListMembersOptions} [options] Options for listing members
   * @returns {Promise<Collection<Snowflake, GuildMember>>}
   */
  public async list(query: CamelCasedPropertiesDeep<RESTGetAPIGuildMembersQuery>) {
    const data = await this.client.api.guilds.getMembers(this.guild.id, toSnakeCase(query));

    return data.reduce((collection, member) => collection.set(member.user?.id, member), new Collection());
  }

  /**
   * Edits a member of the guild.
   * @param {Snowflake} user The user to edit
   * @param {GuildEditMemberOptions} options Options for editing the member
   * @returns {Promise<void>}
   */
  public async edit(
    user: Snowflake,
    { reason, ...options }: CamelCasedPropertiesDeep<RESTPatchAPIGuildMemberJSONBody> & { reason?: string },
  ) {
    await this.client.api.guilds.editMember(this.guild.id, user, toSnakeCase(options), { reason });
  }

  /**
   * Prunes members from the guild.
   * @param {boolean} dry Whether or not to do a dry run
   * @param {GuildPruneMembersOptions} options Options for pruning members
   * @returns {Promise<number>}
   */
  public async prune<D extends boolean>(
    dry: D,
    options: CamelCasedPropertiesDeep<D extends true ? RESTGetAPIGuildPruneCountQuery : RESTPostAPIGuildPruneJSONBody>,
  ) {
    return dry
      ? this.client.api.guilds.getPruneCount(this.guild.id, toSnakeCase(options) as RESTGetAPIGuildPruneCountQuery)
      : this.client.api.guilds.beginPrune(this.guild.id, toSnakeCase(options) as RESTPostAPIGuildPruneJSONBody);
  }

  /**
   * Kicks a member from the guild.
   * @param {Snowflake} user The user to kick
   * @param {string} [reason] The reason for kicking the member
   * @returns {Promise<void>}
   */
  public async kick({ user, reason }: { user: Snowflake; reason?: string }) {
    return this.client.api.guilds.removeMember(this.guild.id, user, { reason });
  }

  /**
   * Bans a member from the guild.
   * @param {Snowflake} user The user to ban
   * @param {string} [reason] The reason for banning the member
   * @returns {Promise<void>}
   */
  public async ban({
    user,
    reason,
    ...options
  }: CamelCasedPropertiesDeep<RESTPutAPIGuildBanJSONBody> & { user: Snowflake; reason?: string }) {
    return this.client.api.guilds.banUser(this.guild.id, user, toSnakeCase(options), { reason });
  }

  /**
   * Unbans a member from the guild.
   * @param {Snowflake} user The user to unban
   * @param {string} [reason] The reason for unbanning the member
   * @returns {Promise<void>}
   */
  public async unban({ user, reason }: { user: Snowflake; reason?: string }) {
    return this.client.api.guilds.unbanUser(this.guild.id, user, { reason });
  }

  /**
   * Adds a role to a member.
   * @param {Snowflake} user The user to add the role to
   * @param {Snowflake} role The role to add
   * @param {string} [reason] The reason for adding the role
   * @returns {Promise<void>}
   */
  public async addRole({ user, role, reason }: { user: Snowflake; role: Snowflake; reason?: string }) {
    return this.client.api.guilds.addRoleToMember(this.guild.id, user, role, { reason });
  }

  /**
   * Removes a role from a member.
   * @param {Snowflake} user The user to remove the role from
   * @param {Snowflake} role The role to remove
   * @param {string} [reason] The reason for removing the role
   * @returns {Promise<void>}
   */
  public async removeRole({ user, role, reason }: { user: Snowflake; role: Snowflake; reason?: string }) {
    return this.client.api.guilds.removeRoleFromMember(this.guild.id, user, role, { reason });
  }
}
