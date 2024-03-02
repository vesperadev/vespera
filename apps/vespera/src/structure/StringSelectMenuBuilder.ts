import { StringSelectMenuBuilder as DISCORDJSStringSelectMenuBuilder } from '@discordjs/builders';
import { mix } from 'ts-mixer';

import { VesperaMixins } from './VesperaMixins';

/**
 * A class representing a StringSelectMenuBuilder which is a mix of VesperaMixins and DISCORDJSStringSelectMenuBuilder functionalities.
 * @mixes VesperaMixins
 * @mixes DISCORDJSStringSelectMenuBuilder
 */
@mix(VesperaMixins, DISCORDJSStringSelectMenuBuilder)
export class StringSelectMenuBuilder<T extends unknown> {}

/**
 * Interface for StringSelectMenuBuilder that extends the functionalities of both VesperaMixins and DISCORDJSStringSelectMenuBuilder.
 * @interface
 * @extends {VesperaMixins}
 * @extends {DISCORDJSStringSelectMenuBuilder}
 */
export interface StringSelectMenuBuilder<T extends unknown>
  extends VesperaMixins<T>,
    DISCORDJSStringSelectMenuBuilder {}
