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
      const { data } = await this.httpClient.put(`/${doc._id}`, doc, options);
      data.acknowledged = false;
      if (data.documentId) {
        data.insertedId = data.documentId;
        data.acknowledged = true;
        delete data.documentId;
      }
      return data;
    }, cb);
  }

  async insertMany(docs: any, options?: any, cb?: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      docs = docs.map((doc: any) => addDefaultId(doc));
      const { data } = await this.httpClient.post('/batch', docs, { params: { 'id-path': '_id' } });
      data.acknowledged = false;
      if (data.documentIds?.length) {
        data.acknowledged = true;
        data.insertedIds = {};
        data.documentIds.forEach((docId: string, index: number) => {
          data.insertedIds[index] = docId;
        });
        delete data.documentIds;
      }
      return data;
    }, cb);
  }

  private async doUpdate(doc: any, update: any) {
    if (update.$set) {
      update = _.merge(update, update.$set);
      delete update.$set;
    }
    if (update.$inc) {
      _.keys(update.$inc).forEach(incrementKey => {
        if (doc[incrementKey]) {
          update[incrementKey] = doc[incrementKey] + update.$inc[incrementKey];
        } else {
          update[incrementKey] = update.$inc[incrementKey];
        }
        delete update.$inc;
      });
    }
    const { data } = await this.httpClient.patch(`/${doc._id}`, update);
    data.acknowledged = true;
    data.matchedCount = 1;
    data.modifiedCount = 1;
    delete data.documentId;
    return data;
  }

  async updateOne(query: any, update: any, options?: any, cb?: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      const doc = await this.findOne(query, options);
      if (doc) {
        return await this.doUpdate(doc, update);
      }
      return { modifiedCount: 0, matchedCount: 0 };
    }, cb);
  }

  async updateMany(query: any, update: any, options?: any, cb?: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      const cursor = this.find(query, options);
      const docs = await cursor.toArray();
      if (docs.length) {
        const res = await Promise.all(
          docs.map((doc: any) => {
            return this.doUpdate(doc, _.cloneDeep(update));
          })
        );
        return { acknowledged: true, modifiedCount: res.length, matchedCount: res.length };
      }
      return { modifiedCount: 0, matchedCount: 0 };
    }, cb);
  }

  async replaceOne(query: any, newDoc: any, options?: any, cb?: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      const doc = await this.findOne(query, options);
      if (doc) {
        const { data } = await this.httpClient.put(`/${doc._id}`, newDoc);
        data.acknowledged = true;
        data.matchedCount = 1;
        data.modifiedCount = 1;
        delete data.documentId;
        return data;
      }
    }, cb);
  }

  async deleteOne(query: any, options?: any, cb?: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      const doc = await this.findOne(query, options);
      if (doc) {
        await this.httpClient.delete(`/${doc._id}`);
        return { value: doc, ok: true };
      }
      return { ok: false };
    }, cb);
  }

  async deleteMany(query: any, options: any, cb: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      const cursor = this.find(query, options);
      const docs = await cursor.toArray();
      if (docs.length) {
        const res = await Promise.all(
          docs.map((doc: any) => this.httpClient.delete(`/${doc._id}`))
        );
        return { acknowledged: true, deletedCount: res.length };
      }
      return { acknowledged: true, deletedCount: 0 };
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
      const res = await cursor.toArray();
      return res.length ? res[0] : undefined;
    }, cb);
  }

  async distinct(key: any, filter: any, options?: any, cb?: any) {
    ({ options, cb } = setOptionsAndCb(options, cb));
    return executeOperation(async () => {
      const cursor = this.find(filter, { ...options, limit: 1 });
      const res = await cursor.toArray();
      const list: string[] = [];
      if (res.length) {
        res.forEach((doc: any) => list.push(doc[key]));
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

  async remove(query: any, options: any, cb: any) {
    return await this.deleteMany(query, options, cb);
  }

  async insert(docs: any[], options?: any, cb?: any) {
    return await this.insertMany(docs, options, cb);
  }

  async findOneAndDelete(query: any, options: any, cb: any) {
    return await this.deleteOne(query, options, cb);
  }

  async count(query: any, options: any, cb: any) {
    return await this.countDocuments(query, options, cb);
  }

  async update(query: any, update: any, options: any, cb: any) {
    return await this.updateMany(query, update, options, cb);
  }

  async findOneAndUpdate(query: any, update: any, options: any, cb: any) {
    return await this.updateOne(query, update, options, cb);
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
