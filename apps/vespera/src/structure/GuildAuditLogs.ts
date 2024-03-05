import type { Guild } from '..';
import type { APIAuditLog } from '../core';

import { GuildAuditLogsEntry } from './GuildAuditLogsEntry';

/* The GuildAuditLogs class represents the audit logs of a guild */
export class GuildAuditLogs {
  /**
   * @property
   * @name guild
   * @kind property
   * @memberof GuildAuditLogs
   * @public
   * @type {Guild}
   */
  public guild: Guild;

  /**
   * @property
   * @name logs
   * @kind property
   * @memberof GuildAuditLogs
   * @public
   * @type {APIAuditLog}
   */
  public logs: APIAuditLog;

  /**
   * @property
   * @name entries
   * @kind property
   * @memberof GuildAuditLogs
   * @public
   * @type {GuildAuditLogsEntry[]}
   */
  public entries: GuildAuditLogsEntry[];

  /**
   * This TypeScript constructor function initializes an instance with a Guild and APIAuditLog data.
   * @param {Guild} guild - The `guild` parameter likely refers to the guild (server) to which the
   * audit log data belongs. It is a reference to the guild object in the Discord API, containing
   * information about the server such as its name, ID, members, channels, etc.
   * @param {APIAuditLog} data - The `data` parameter in the constructor represents the API response
   * containing the audit log information for the guild. This data typically includes details about
   * actions taken within the guild such as member joins, role changes, channel creations, and more.
   */
  constructor(guild: Guild, data: APIAuditLog) {
    this.logs = data;
    this.guild = guild;

    this.entries = data.audit_log_entries.map((entry) => new GuildAuditLogsEntry(this.guild, data, entry));
  }
}
