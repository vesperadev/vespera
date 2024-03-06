import { CamelCasedPropertiesDeep } from 'type-fest';
import { Base } from '../Base';
import { Client } from '../Client';
import { APIEntitlement, RESTGetAPIEntitlementsQuery, Routes } from '@discordjs/core';
import { makeURLSearchParams } from '@discordjs/rest';
import { Collection, toSnakeCase } from '../../utils';

export class EntitlementManager extends Base {
  /**
   * Constructor for creating a new instance of the class.
   *
   * @param {Client} client - the client object
   * @return {void}
   */
  constructor(client: Client) {
    super(client);
  }

  /**
   * Fetches entitlements for this application
   * @param {FetchEntitlementsOptions} [options={}] Options for fetching the entitlements
   * @returns {Promise<Collection<Snowflake, Entitlement>>}
   */
  async fetch(options?: CamelCasedPropertiesDeep<RESTGetAPIEntitlementsQuery>) {
    const query = makeURLSearchParams(toSnakeCase(options ?? {}));

    const entitlements = (await this.client.rest.get(Routes.entitlements(this.client.user.id), {
      query,
    })) as APIEntitlement[];

    return entitlements.reduce(
      (collection, entitlement) => collection.set(entitlement.id, entitlement),
      new Collection(),
    );
  }
}
