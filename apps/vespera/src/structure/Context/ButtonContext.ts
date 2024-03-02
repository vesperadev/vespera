import type { APIMessageComponentButtonInteraction } from '../../core';
import type { Client } from '../Client';

import { BaseContext } from './Base';

export class ButtonContext<S extends unknown> extends BaseContext<APIMessageComponentButtonInteraction, S> {
  constructor(client: Client, data: APIMessageComponentButtonInteraction) {
    super(client, data);
  }
}
