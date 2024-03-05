import type { APIMessageComponentButtonInteraction } from '../../core';
import type { Client } from '../Client';

import { ComponentContext } from './ComponentContext';

/* The `ButtonContext` class extends `ComponentContext` and is used for handling button interactions in
TypeScript. */
export class ButtonContext<S extends unknown> extends ComponentContext<S> {
  /**
   * The `constructor(client: Client, data: APIMessageComponentButtonInteraction)` is a constructor method of the
   * `ButtonContext` class. It is used to create instances of the `ButtonContext` class with specific parameters.
   *
   * @constructor
   * @name ButtonContext
   * @param {Client} client
   * @param {APIMessageComponentButtonInteraction} data
   */
  constructor(client: Client, data: APIMessageComponentButtonInteraction) {
    super(client, data);
  }
}
