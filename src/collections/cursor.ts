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
import { Collection } from './collection';
import { formatQuery, setOptionsAndCb, executeOperation } from './utils';

const DEFAULT_PAGE_SIZE = 20;

interface ResultCallback {
  (err: Error | undefined, res: Array<any>): void;
}

export class FindCursor {
  collection: Collection;
  query: any;
  options: any;
  documents: Record<string, any>[] = [];
  status: string = 'uninitialized';
  nextPageState?: string;
  limit: number;

  /**
   *
   * @param collection
   * @param query
   * @param options
   */
  constructor(collection: any, query: any, options?: any) {
    this.collection = collection;
    this.query = formatQuery(query, options);
    this.options = options;
    this.limit = options?.limit || Infinity;
    this.status = 'initialized';
  }

  /**
   *
   * @returns void
   */
  private async getAll() {
    if (this.status === 'executed' || this.status === 'executing') {
      return;
    }
    this.status = 'executing';
    const oneRequest = this.limit && this.limit < DEFAULT_PAGE_SIZE;
    do {
      const reqParams: any = {
        where: this.query,
        'page-size': oneRequest ? this.limit : DEFAULT_PAGE_SIZE
      };
      if (this.nextPageState) {
        reqParams['page-state'] = this.nextPageState;
      }
      const res = await this.collection.httpClient.get('/', {
        params: reqParams
      });
      this.nextPageState = res.pageState;
      const resAsArray = _.keys(res.data).map(i => res.data[i]);
      this.documents = this.documents.concat(resAsArray);
    } while (!oneRequest && this.documents.length < this.limit && this.nextPageState);
    this.status = 'executed';
  }

  /**
   *
   * @param cb
   * @returns Promise
   */
  async toArray(cb?: ResultCallback): Promise<Array<any>> {
    return executeOperation(async () => {
      await this.getAll();
      return this.documents;
    }, cb);
  }

  /**
   *
   * @param iterator
   * @param cb
   */
  async forEach(iterator: any, cb?: any) {
    return executeOperation(async () => {
      await this.getAll();
      for (const doc of this.documents) {
        await iterator(doc);
      }
      return this.documents;
    }, cb);
  }

  /**
   *
   * @param options
   * @param cb
   * @returns Promise<number>
   */
  async count(options?: any, cb?: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      await this.getAll();
      return this.documents.length;
    }, cb);
  }

  // NOOPS and unimplemented

  /**
   *
   * @param options
   */
  stream(options?: any) {
    throw new Error('Streaming cursors are not supported');
  }
}
