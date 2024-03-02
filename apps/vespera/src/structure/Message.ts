import type { Client } from '..';
import { Base } from '..';
import type { APIMessage } from '../core';

export class Message extends Base {
  public constructor(client: Client, data: APIMessage) {
    super(client);
  }
}
