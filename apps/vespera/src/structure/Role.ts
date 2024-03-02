import type { Client } from '..';
import { Base } from '..';
import type { APIRole } from '../core';

export class Role extends Base {
  constructor(client: Client, data: APIRole) {
    super(client);
  }
}
