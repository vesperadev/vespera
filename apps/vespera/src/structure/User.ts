import { Base, Client } from '..';
import { APIUser } from '../core';

export class User extends Base {
  constructor(client: Client, data: APIUser) {
    super(client);
  }
}
