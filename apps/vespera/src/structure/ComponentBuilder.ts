import { VesperaError } from '../structure/Error';

import { ButtonBuilder } from './ButtonBuilder';
import type { ButtonContext } from './Context/ButtonContext';
import { StringSelectMenuBuilder } from './StringSelectMenuBuilder';

/**
 * Interface for ComponentBuilder that extends the functionalities of both VesperaMixins and DISCORDJSButtonBuilder.
 *
 * @interface
 */
export type Component = 'Button' | 'StringSelect';

export class createComponentBuilder {
  /**
   * @public @property {Component} type - The type of the component.
   */
  public type = '' as unknown;

  public constructor() {}

  /**
   * A function to set the type of a component.
   *
   * @param {T} type - the type of the component
   * @return {(ButtonBuilder<ButtonContext> | StringSelectMenuBuilder<unknown> | undefined)} an instance of ButtonBuilder or StringSelectMenuBuilder, or undefined
   */
  public setType<S extends unknown, T extends Component>(
    type: T,
  ): T extends 'Button' ? ButtonBuilder<ButtonContext<S>> : StringSelectMenuBuilder<unknown> {
    this.type = type;

    switch (type) {
      case 'Button':
        return new ButtonBuilder<unknown>() as T extends 'Button'
          ? ButtonBuilder<ButtonContext<S>>
          : StringSelectMenuBuilder<unknown>;

      case 'StringSelect':
        return new StringSelectMenuBuilder<unknown>() as T extends 'Button'
          ? ButtonBuilder<ButtonContext<S>>
          : StringSelectMenuBuilder<unknown>;

      default:
        throw new VesperaError('Unknown component type');
    }
  }
}
