import { ButtonBuilder as DISCORDJSButtonBuilder } from '@discordjs/builders';
import { mix } from 'ts-mixer';

import { VesperaMixins } from './VesperaMixins';

/**
 * A class representing a ButtonBuilder which is a mix of VesperaMixins and DISCORDJSButtonBuilder functionalities.
 * @mixes VesperaMixins
 * @mixes DISCORDJSButtonBuilder
 */
@mix(VesperaMixins, DISCORDJSButtonBuilder)
export class ButtonBuilder<T extends unknown> {}

/**
 * Interface for ButtonBuilder that extends the functionalities of both VesperaMixins and DISCORDJSButtonBuilder.
 * @interface
 * @extends {VesperaMixins}
 * @extends {DISCORDJSButtonBuilder}
 */
export interface ButtonBuilder<T extends unknown> extends VesperaMixins<T>, DISCORDJSButtonBuilder {}
