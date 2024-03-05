import type { Guild } from '..';
import type { APIAuditLog, APIAuditLogEntry } from '../core';

export class GuildAuditLogsEntry {
  public guild: Guild;
  public logs: APIAuditLog;
  public entry: APIAuditLogEntry;

  constructor(guild: Guild, logs: APIAuditLog, entry: APIAuditLogEntry) {
    this.guild = guild;
    this.logs = logs;
    this.entry = entry;
  }
}
