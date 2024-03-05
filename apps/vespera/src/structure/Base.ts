import type { Client } from './Client';

/* The Base class */
export class Base {
  /**
   * This property allows instances of the `Base` class to have access to a `Client` object, which can be used to interact
   * with or utilize the functionalities provided by the `Client` class.
   *
   * @property
   * @name client
   * @kind property
   * @memberof Base
   * @public
   * @type {Client}
   */
  public client: Client;

  /**
   * The constructor function initializes an instance of a class with a client parameter.
   * @param {Client} client - This allows the class to interact with or utilize the
   * functionalities provided by the `Client` object within its own
   */
  constructor(client: Client) {
    this.client = client;
  }
}
