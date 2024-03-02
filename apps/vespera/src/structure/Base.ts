import type { Client } from './Client';

export class Base {
  public client: Client;

  constructor(client: Client) {
    this.client = client;
  }
}
