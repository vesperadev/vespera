import type { APIMessageComponentSelectMenuInteraction } from '../../core';
import type { Client } from '../Client';

import { ComponentContext } from './ComponentContext';

export class SelectMenuContext<S extends unknown> extends ComponentContext<S> {
  public values: string[];

  constructor(client: Client, data: APIMessageComponentSelectMenuInteraction) {
    super(client, data);

    this.values = data.data.values ?? [];
  }
}
