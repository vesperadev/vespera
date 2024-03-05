import { ButtonBuilder } from './ButtonBuilder';
import { VesperaError } from './Error';
import { StringSelectMenuBuilder } from './StringSelectMenuBuilder';

/**
 * Interface for a component.
 *
 * @interface
 */
export type Component = 'Button' | 'StringSelect';

export class createComponentBuilder<S extends unknown = unknown> {
  /**
   * @public @property {Component} type - The type of the component.
   */
  public type = '' as unknown;

  public constructor() {}

  /**
   * A function to set the type of a component.
   *
   * @param {T} type - the type of the component
   * @return {(ButtonBuilder<S> | StringSelectMenuBuilder<S>)} an instance of ButtonBuilder or StringSelectMenuBuilder, or undefined
   */
  public setType<T extends Component>(type: T): T extends 'Button' ? ButtonBuilder<S> : StringSelectMenuBuilder<S> {
    this.type = type;

    switch (type) {
      case 'Button':
        return new ButtonBuilder<unknown>() as T extends 'Button' ? ButtonBuilder<S> : StringSelectMenuBuilder<S>;

      case 'StringSelect':
        return new StringSelectMenuBuilder<unknown>() as T extends 'Button'
          ? ButtonBuilder<S>
          : StringSelectMenuBuilder<S>;

      default:
        throw new VesperaError('Unknown component type');
    }
  }
}
