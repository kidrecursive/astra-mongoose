// Copyright DataStax, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import _ from 'lodash';
import url from 'url';

interface ParsedUri {
  baseUrl: string;
  keyspaceName: string;
  applicationToken: string;
}

const types = ['String', 'Number', 'Boolean', 'ObjectId'];

export const formatQuery = (query: any, options?: any) => {
  // console.log(query);
  const modified = _.mapValues(query, (value: any) => {
    // console.log(value, value.constructor.name);
    if (options?.collation) {
      throw new Error('Collations are not supported');
    }

    if (types.includes(value.constructor.name)) {
      return { $eq: value };
    }
    return value;
  });
  // console.log(modified);
  return modified;
};

/**
 * Parse an Astra connection URI
 * @param uri a uri in the format of: https://${databaseId}-${region}.apps.astra.datastax.com/${keyspace}?applicationToken=${applicationToken}
 * @returns ParsedUri
 */
export const parseUri = (uri: string): ParsedUri => {
  const parsedUrl = url.parse(uri, true);
  const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
  const keyspaceName = parsedUrl.pathname?.replace('/', '');
  const applicationToken = parsedUrl.query?.applicationToken as string;
  if (!keyspaceName) {
    throw new Error('Invalid URI: keyspace is required');
  }
  if (!applicationToken) {
    throw new Error('Invalid URI: applicationToken is required');
  }
  return {
    baseUrl,
    keyspaceName,
    applicationToken
  };
};

/**
 * Create a production Astra connection URI
 * @param databaseId the database id of the Astra database
 * @param region the region of the Astra database
 * @param keyspace the keyspace to connect to
 * @param applicationToken an Astra application token
 * @returns string
 */
export const createAstraUri = (
  databaseId: string,
  region: string,
  keyspace?: string,
  applicationToken?: string
) => {
  let uri = `https://${databaseId}-${region}.apps.astra.datastax.com`;
  if (keyspace) {
    uri += `/${keyspace}`;
  }
  if (applicationToken) {
    uri += `?applicationToken=${applicationToken}`;
  }
  return uri;
};
