import {
  SlashCommandBuilder as DISCORDJSSlashCommandBuilder,
  SlashCommandSubcommandBuilder as DISCORDJSSlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder as DISCORDJSSlashCommandSubcommandGroupBuilder,
} from '@discordjs/builders';

import type { CommandContext } from '..';
import type { Callback } from '../utils';

import { ButtonBuilder } from './ButtonBuilder';
import type { Component } from './ComponentBuilder';
import { createComponentBuilder } from './ComponentBuilder';
import { StringSelectMenuBuilder } from './StringSelectMenuBuilder';

export class SlashCommandBuilder<S extends unknown> extends DISCORDJSSlashCommandBuilder {
  /**
   * @public @property {Callback<[CommandContext<S>]>} run - The callback function to be executed when the command is executed.
   */
  public run!: Callback<[CommandContext<S>]>;

  /**
   * @public @property {Callback<[CommandContext<S>]>[]} middlewares - The list of callbacks to be executed before the command is executed.
   */
  public middlewares!: Callback<[CommandContext<S>]>[];

  /**
   * @public @property {Record<Component, Record<string, Callback<[unknown]>>>} components - The list of components to be added to the command.
   */
  public components!: Record<Component, Record<string, Callback<[unknown]>>>;

  /**
   * Execute the callback function and set it as the 'run' property, then return the current object.
   *
   * @param {Callback<[CommandContext<S>]>} callback - The callback function to be executed and set as the 'run' property.
   * @return {this} The current object.
   */
  public execute(callback: Callback<[CommandContext<S>]>) {
    Reflect.set(this, 'run', callback);
    return this;
  }

  /**
   * createMiddleware - adds a callback to the list of middlewares.
   *
   * @param {Callback<[CommandContext<S>]>} callback - the callback to be added to the middlewares list
   * @return {this} the current instance of the class
   */
  public createMiddleware(callback: Callback<[CommandContext<S>]>) {
    if (!Reflect.has(this, 'middlewares')) {
      Reflect.set(this, 'middlewares', []);
    }

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
      if (!Reflect.has(this.components, 'StringSelect')) {
        Reflect.set(this.components, 'StringSelect', {});
      }

      if (typeof builder.data.custom_id === 'string') {
        Reflect.set(this.components.StringSelect, builder.data.custom_id, builder.run);
      }
    }

    return this;
  }

  // @ts-expect-error - ignore this, we are extending the base method
  public addSubcommand(callback: Callback<[SlashCommandSubcommandBuilder<S>]>) {
    const subcommand = new SlashCommandSubcommandBuilder<S>();
    callback(subcommand);

    this.options.push(subcommand);

    return this;
  }

  // @ts-expect-error - ignore this, we are extending the base method
  public addSubcommandGroup(callback: Callback<[SlashCommandSubcommandGroupBuilder<S>]>) {
    const subcommandGroup = new SlashCommandSubcommandGroupBuilder<S>();
    callback(subcommandGroup);

    this.options.push(subcommandGroup);

    return this;
  }
}

export class SlashCommandSubcommandBuilder<S extends unknown> extends DISCORDJSSlashCommandSubcommandBuilder {
  /**
   * @public @property {Callback<[CommandContext<S>]>} run - The callback function to be executed when the command is executed.
   */
  public run!: Callback<[CommandContext<S>]>;

  /**
   * @public @property {Callback<[CommandContext<S>]>[]} middlewares - The list of callbacks to be executed before the command is executed.
   */
  public middlewares!: Callback<[CommandContext<S>]>[];

  /**
   * @public @property {Record<Component, Record<string, Callback<[unknown]>>>} components - The list of components to be added to the command.
   */
  public components!: Record<Component, Record<string, Callback<[unknown]>>>;

  /**
   * Execute the callback function and set it as the 'run' property, then return the current object.
   *
   * @param {Callback<[CommandContext<S>]>} callback - The callback function to be executed and set as the 'run' property.
   * @return {this} The current object.
   */
  public execute(callback: Callback<[CommandContext<S>]>) {
    Reflect.set(this, 'run', callback);
    return this;
  }

  /**
   * createMiddleware - adds a callback to the list of middlewares.
   *
   * @param {Callback<[CommandContext<S>]>} callback - the callback to be added to the middlewares list
   * @return {this} the current instance of the class
   */
  public createMiddleware(callback: Callback<[CommandContext<S>]>) {
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
      if (!Reflect.has(this.components, 'StringSelect')) {
        Reflect.set(this.components, 'StringSelect', {});
      }

      if (typeof builder.data.custom_id === 'string') {
        Reflect.set(this.components.StringSelect, builder.data.custom_id, builder.run);
      }
    }

    return this;
  }
}

export class SlashCommandSubcommandGroupBuilder<S extends unknown> extends DISCORDJSSlashCommandSubcommandGroupBuilder {
  /**
   * @public @property {Callback<[CommandContext<S>]>} run - The callback function to be executed when the command is executed.
   */
  public run!: Callback<[CommandContext<S>]>;

  /**
   * @public @property {Callback<[CommandContext<S>]>[]} middlewares - The list of callbacks to be executed before the command is executed.
   */
  public middlewares!: Callback<[CommandContext<S>]>[];

  /**
   * @public @property {Record<Component, Record<string, Callback<[unknown]>>>} components - The list of components to be added to the command.
   */
  public components!: Record<Component, Record<string, Callback<[unknown]>>>;

  /**
   * Execute the callback function and set it as the 'run' property, then return the current object.
   *
   * @param {Callback<[CommandContext<S>]>} callback - The callback function to be executed and set as the 'run' property.
   * @return {this} The current object.
   */
  public execute(callback: Callback<[CommandContext<S>]>) {
    Reflect.set(this, 'run', callback);
    return this;
  }

  /**
   * createMiddleware - adds a callback to the list of middlewares.
   *
   * @param {Callback<[CommandContext<S>]>} callback - the callback to be added to the middlewares list
   * @return {this} the current instance of the class
   */
  public createMiddleware(callback: Callback<[CommandContext<S>]>) {
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
      if (!Reflect.has(this.components, 'StringSelect')) {
        Reflect.set(this.components, 'StringSelect', {});
      }

      if (typeof builder.data.custom_id === 'string') {
        Reflect.set(this.components.StringSelect, builder.data.custom_id, builder.run);
      }
    }

    return this;
  }

  // @ts-expect-error - ignore this, we are extending the base method
  public addSubcommand(callback: Callback<[SlashCommandSubcommandBuilder<S>]>) {
    const subcommand = new SlashCommandSubcommandBuilder<S>();
    callback(subcommand);

    this.options.push(subcommand);

    return this;
  }
}
