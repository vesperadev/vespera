import { StringSelectMenuBuilder as DISCORDJSStringSelectMenuBuilder } from '@discordjs/builders';

import type { Callback } from '../utils';

import { ButtonBuilder } from './ButtonBuilder';
import type { Component } from './ComponentBuilder';
import { createComponentBuilder } from './ComponentBuilder';
import type { SelectMenuContext } from './Context/SelectMenuContext';

export class StringSelectMenuBuilder<S extends unknown> extends DISCORDJSStringSelectMenuBuilder {
  /**
   * @public @property {Callback<[SelectMenuContext<S>]>} run - The callback function to be executed when the command is executed.
   */
  public run!: Callback<[SelectMenuContext<S>]>;

  /**
   * @public @property {Callback<[SelectMenuContext<S>]>[]} middlewares - The list of callbacks to be executed before the command is executed.
   */
  public middlewares!: Callback<[SelectMenuContext<S>]>[];

  /**
   * @public @property {Record<Component, Record<string, Callback<[unknown]>>>} components - The list of components to be added to the command.
   */
  public components!: Record<Component, Record<string, Callback<[unknown]>>>;

  /**
   * Execute the callback function and set it as the 'run' property, then return the current object.
   *
   * @param {Callback<[SelectMenuContext<S>]>} callback - The callback function to be executed and set as the 'run' property.
   * @return {this} The current object.
   */
  public execute(callback: Callback<[SelectMenuContext<S>]>) {
    Reflect.set(this, 'run', callback);
    return this;
  }

  /**
   * createMiddleware - adds a callback to the list of middlewares.
   *
   * @param {Callback<[SelectMenuContext<S>]>} callback - the callback to be added to the middlewares list
   * @return {this} the current instance of the class
   */
  public createMiddleware(callback: Callback<[SelectMenuContext<S>]>) {
    this.middlewares.push(callback);
    return this;
  }

  /**
   * Adds a component to the list of components.
   *
   * @param {Callback<[createComponentBuilder]>} component - the component to be added
   * @return {this} the current instance of the class
   */
  public addComponent(callback: Callback<[createComponentBuilder]>) {
    if (!Reflect.has(this, 'components')) {
      Reflect.set(this, 'components', {});
    }

    const builder = new createComponentBuilder();
    callback(builder);

    if (builder instanceof ButtonBuilder) {
      if (!Reflect.has(this.components, 'Button')) {
        Reflect.set(this.components, 'Button', {});
      }

      if ('id' in builder.data && typeof builder.data.id === 'string') {
        Reflect.set(this.components.Button, builder.data.id, builder.run);
      }
    }

    if (builder instanceof StringSelectMenuBuilder) {
      if (!Reflect.has(this.components, 'StringSelectMenu')) {
        Reflect.set(this.components, 'StringSelectMenu', {});
      }

      if ('id' in builder.data && typeof builder.data.id === 'string') {
        Reflect.set(this.components.StringSelect, builder.data.id, builder.run);
      }
    }

    return this;
  }
}
