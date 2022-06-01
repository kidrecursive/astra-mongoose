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
import { FindCursor } from './cursor';
import { HTTPClient } from '@/src/client';
import { formatQuery, addDefaultId, setOptionsAndCb, executeOperation } from './utils';

interface DocumentCallback {
  (err: Error | undefined, res: any): void;
}

export class Collection {
  httpClient: any;
  name: string;
  collectionName: string;

  /**
   *
   * @param httpClient
   * @param name
   */
  constructor(httpClient: HTTPClient, name: string) {
    if (!name) {
      throw new Error('Collection name is required');
    }
    // use a clone of the underlying http client to support multiple collections from a single db
    this.httpClient = _.cloneDeep(httpClient);
    this.httpClient.baseUrl += `/collections/${name}`;
    this.name = name;
    this.collectionName = name;
  }

  /**
   *
   * @param mongooseDoc
   * @param options
   * @param cb
   * @returns Promise
   */
  async insertOne(doc: Record<string, any>, options?: any, cb?: DocumentCallback): Promise<any> {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      addDefaultId(doc);
      const res = await this.httpClient.put(`/${doc._id}`, doc, options);
      if (res.documentId) {
        res.insertedId = res.documentId;
        delete res.documentId;
      }
      return res;
    }, cb);
  }

  async insertMany(docs: any, options?: any, cb?: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      docs = docs.map((doc: any) => addDefaultId(doc));
      return await this.httpClient.post('/batch', docs, { params: { 'id-path': '_id' } });
    }, cb);
  }

  async updateMany(query: any, update: any, options: any, cb: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      if (update.$set) {
        update = {
          ...update.$set
        };
        delete update.$set;
      }
      const cursor = this.find(query, options);
      const docs = await cursor.toArray();
      if (docs.length) {
        return await Promise.all(
          docs.map((doc: any) => {
            return this.httpClient.patch(`${doc._id}`, update);
          })
        );
      }
    }, cb);
  }

  async updateOne(query: any, update: any, options: any, cb: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      if (update.$set) {
        update = {
          ...update.$set
        };
        delete update.$set;
      }
      const doc = await this.findOne(query, options);
      if (doc) {
        if (update.$inc) {
          _.keys(update.$inc).forEach(incrementKey => {
            if (doc[incrementKey]) {
              update[incrementKey] += update.$inc[incrementKey];
            } else {
              update[incrementKey] = update.$inc[incrementKey];
            }
            delete update.$inc;
          });
        }
        const res = await this.httpClient.patch(`${doc._id}`, update);
        res.modifiedCount = 1;
        if (options?.returnDocument === 'after') {
          res.value = { ...doc, ...update };
        } else {
          res.value = { ...doc };
        }
        return res;
      }
    }, cb);
  }

  async findOneAndUpdate(query: any, update: any, options: any, cb: any) {
    return this.updateOne(query, update, options, cb);
  }

  async replaceOne(query: any, newDoc: any, options: any, cb: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      const doc = await this.findOne(query, options);
      if (doc) {
        return await this.httpClient.replace(doc._id, newDoc);
      }
    }, cb);
  }

  async findOneAndDelete(query: any, options: any, cb: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      const doc = await this.findOne(query, options);
      if (doc) {
        await this.httpClient.delete(`/${doc._id}`);
        return { value: doc, deletedCount: 1 };
      }
    }, cb);
  }

  async remove(query: any, options: any, cb: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      const cursor = this.find(query, options);
      const docs = await cursor.toArray();
      if (docs.length) {
        const res = await Promise.all(
          docs.map((doc: any) => this.httpClient.delete(`/${doc._id}`))
        );
        return { deletedCount: res.length };
      }
    }, cb);
  }

  find(query: any, options?: any, cb?: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    const cursor = new FindCursor(this, query, options);
    if (cb) {
      return cb(undefined, cursor);
    }
    return cursor;
  }

  async findOne(query: any, options?: any, cb?: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      const cursor = this.find(query, { ...options, limit: 1 });
      return await cursor.toArray()[0];
    }, cb);
  }

  async distinct(key: any, filter: any, options?: any, cb?: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      const res = await this.httpClient.find(formatQuery(filter, options));
      let list: any[] = [];
      if (res.data) {
        _.keys(res.data).forEach(resKey => {
          list = list.concat(res.data[resKey][key]);
        });
      }
      return _.uniq(list);
    }, cb);
  }

  async countDocuments(query: any, options?: any, cb?: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      const cursor = this.find(query, options);
      return await cursor.count();
    }, cb);
  }

  // deprecated and overloaded

  async deleteMany(query: any, options: any, cb: any) {
    return this.remove(query, options, cb);
  }

  async findOneAndRemove(query: any, options: any, cb: any) {
    return this.findOneAndDelete(query, options, cb);
  }

  async deleteOne(query: any, options: any, cb: any) {
    return this.findOneAndDelete(query, options, cb);
  }

  async count(query: any, options: any, cb: any) {
    return this.countDocuments(query, options, cb);
  }

  async update(query: any, update: any, options: any, cb: any) {
    return this.updateMany(query, update, options, cb);
  }

  // NOOPS and unimplemented

  /**
   *
   * @param pipeline
   * @param options
   */
  aggregate<T>(pipeline?: any[], options?: any) {
    throw new Error('Not Implemented');
  }

  /**
   *
   * @param index
   * @param options
   * @param cb
   * @returns any
   */
  async createIndex(index: any, options: any, cb: any) {
    if (cb) {
      return cb(index);
    }
    return index;
  }
}
