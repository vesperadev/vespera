import { ApplicationCommandOptionType } from '../../core';
import type {
  APIApplicationCommandInteractionDataSubcommandGroupOption,
  APIApplicationCommandInteractionDataSubcommandOption,
  APIChatInputApplicationCommandInteraction,
} from '../../core';
import { ApplicationCommandOptions } from '../ApplicationCommandOptions';
import type { Client } from '../Client';

import { BaseContext } from './Base';

export class CommandContext<S extends unknown> extends BaseContext<APIChatInputApplicationCommandInteraction, S> {
  public subcommandGroup?: APIApplicationCommandInteractionDataSubcommandGroupOption;
  public subcommand?: APIApplicationCommandInteractionDataSubcommandOption;
  public options: ApplicationCommandOptions;

  constructor(client: Client, data: APIChatInputApplicationCommandInteraction) {
    super(client, data);

    this.subcommandGroup = this.raw.data.options?.find(
      (option) => option.type === ApplicationCommandOptionType.SubcommandGroup,
    ) as APIApplicationCommandInteractionDataSubcommandGroupOption;
    this.subcommand = this.raw.data.options?.find(
      (option) => option.type === ApplicationCommandOptionType.Subcommand,
    ) as APIApplicationCommandInteractionDataSubcommandOption;

    this.options = new ApplicationCommandOptions(this.client, this.raw.data.options ?? [], this.raw.data.resolved);
  }
}
