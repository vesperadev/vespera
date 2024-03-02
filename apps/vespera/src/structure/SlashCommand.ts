import {
  SlashCommandBuilder as DISCORDJSSlashCommandBuilder,
  SlashCommandSubcommandBuilder as DISCORDJSSlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder as DISCORDJSSlashCommandSubcommandGroupBuilder,
} from '@discordjs/builders';
import { mix } from 'ts-mixer';

import type { Callback } from '../utils';

import { VesperaMixins } from './VesperaMixins';

/**
 * A class representing a SlashCommandBuilder which is a mix of VesperaMixins and DISCORDJSSlashCommandBuilder functionalities.
 * @mixes VesperaMixins
 * @mixes DISCORDJSSlashCommandBuilder
 */
@mix(VesperaMixins, DISCORDJSSlashCommandBuilder)
export class SlashCommandBuilder<T extends unknown> {
  public addSubcommand(callback: Callback<[SlashCommandSubcommandBuilder<T>]>) {
    const subcommand = new SlashCommandSubcommandBuilder<T>();
    callback(subcommand);

    this.options.push(subcommand);
  }

  public addSubcommandGroup(callback: Callback<[SlashCommandSubcommandGroupBuilder<T>]>) {
    const subcommandGroup = new SlashCommandSubcommandGroupBuilder<T>();
    callback(subcommandGroup);

    this.options.push(subcommandGroup);
  }
}

/**
 * A class representing a SlashCommandSubcommandBuilder which is a mix of VesperaMixins and DISCORDJSSlashCommandSubcommandBuilder functionalities.
 * @mixes VesperaMixins
 * @mixes DISCORDJSSlashCommandSubcommandBuilder
 */
@mix(VesperaMixins, DISCORDJSSlashCommandSubcommandBuilder)
export class SlashCommandSubcommandBuilder<T extends unknown> {}

/**
 * A class representing a SlashCommandSubcommandGroupBuilder which is a mix of VesperaMixins and DISCORDJSSlashCommandSubcommandGroupBuilder functionalities.
 * @mixes VesperaMixins
 * @mixes DISCORDJSSlashCommandSubcommandGroupBuilder
 */
@mix(VesperaMixins, DISCORDJSSlashCommandSubcommandGroupBuilder)
export class SlashCommandSubcommandGroupBuilder<T extends unknown> {
  public addSubcommand(callback: Callback<[SlashCommandSubcommandBuilder<T>]>) {
    const subcommand = new SlashCommandSubcommandBuilder<T>();
    callback(subcommand);

    this.options.push(subcommand);
  }
}

/**
 * Interface for SlashCommandBuilder that extends the functionalities of both VesperaMixins and DISCORDJSSlashCommandBuilder.
 * @interface
 * @extends {VesperaMixins}
 * @extends {DISCORDJSSlashCommandBuilder}
 */
// @ts-expect-error - ignore this
export interface SlashCommandBuilder<T extends unknown> extends VesperaMixins<T>, DISCORDJSSlashCommandBuilder {}

/**
 * Interface for SlashCommandSubcommandBuilder that extends the functionalities of both VesperaMixins and DISCORDJSSlashCommandSubcommandBuilder.
 * @interface
 * @extends {VesperaMixins}
 * @extends {DISCORDJSSlashCommandSubcommandBuilder}
 */
export interface SlashCommandSubcommandBuilder<T extends unknown>
  extends VesperaMixins<T>,
    DISCORDJSSlashCommandSubcommandBuilder {}

/**
 * Interface for SlashCommandSubcommandGroupBuilder that extends the functionalities of both VesperaMixins and DISCORDJSSlashCommandSubcommandGroupBuilder.
 * @interface
 * @extends {VesperaMixins}
 * @extends {DISCORDJSSlashCommandSubcommandGroupBuilder}
 */
// @ts-expect-error - ignore this
export interface SlashCommandSubcommandGroupBuilder<T extends unknown>
  extends VesperaMixins<T>,
    DISCORDJSSlashCommandSubcommandGroupBuilder {}
