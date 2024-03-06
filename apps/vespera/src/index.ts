export * from './lib/command';
export * from './lib/button';
export * from './lib/selectMenu';

export * from './structure/Base';
export * from './structure/Channel';
export * from './structure/Client';
export * from './structure/ClientUser';
export * from './structure/Error';
export * from './structure/Guild';
export * from './structure/GuildIntegration';
export * from './structure/GuildOnboarding';
export * from './structure/GuildWelcomeScreen';
export * from './structure/GuildPreview';
export * from './structure/GuildTemplate';
export * from './structure/GuildAuditLogs';
export * from './structure/GuildAuditLogsEntry';
export * from './structure/Message';
export * from './structure/Role';
export * from './structure/User';
export * from './structure/Attachment';
export * from './structure/ClientHandler';
export * from './structure/Emoji';
export * from './structure/Webhook';
export * from './structure/WebhookClient';

export * from './structure/ApplicationCommandOptions';

export * from './structure/Context/Base';
export * from './structure/Context/CommandContext';
export * from './structure/Context/ComponentContext';
export * from './structure/Context/ButtonContext';
export * from './structure/Context/SelectMenuContext';

export * from './structure/Manager/Channel';
export * from './structure/Manager/Message';
export * from './structure/Manager/Guild';
export * from './structure/Manager/GuildMember';
export * from './structure/Manager/Role';
export * from './structure/Manager/User';
export * from './structure/Manager/Entitlement';

/**
 * Vespera Client's Environment Interface
 *
 * @interface
 * @name Environment
 * @kind interface
 * @param {Record<string, string>} V
 * @param {Record<string, unknown>} S
 * @exports
 */
export interface Environment<V extends Record<string, string>, S extends Record<string, unknown>> {
  variables?: V;
  state?: S;
}
