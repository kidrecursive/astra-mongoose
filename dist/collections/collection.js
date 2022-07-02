"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const lodash_1 = __importDefault(require("lodash"));
const cursor_1 = require("./cursor");
const utils_1 = require("./utils");
class Collection {
    /**
     *
     * @param httpClient
     * @param name
     */
    constructor(httpClient, name) {
        if (!name) {
            throw new Error('Collection name is required');
        }
        // use a clone of the underlying http client to support multiple collections from a single db
        this.httpClient = lodash_1.default.cloneDeep(httpClient);
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
    async insertOne(doc, options, cb) {
        ({ options, cb } = (0, utils_1.setOptionsAndCb)(options, cb));
        return (0, utils_1.executeOperation)(async () => {
            (0, utils_1.addDefaultId)(doc);
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
    async insertMany(docs, options, cb) {
        ({ options, cb } = (0, utils_1.setOptionsAndCb)(options, cb));
        return (0, utils_1.executeOperation)(async () => {
            docs = docs.map((doc) => (0, utils_1.addDefaultId)(doc));
            const { data } = await this.httpClient.post('/batch', docs, { params: { 'id-path': '_id' } });
            data.acknowledged = false;
            if (data.documentIds?.length) {
                data.acknowledged = true;
                data.insertedIds = {};
                data.documentIds.forEach((docId, index) => {
                    data.insertedIds[index] = docId;
                });
                delete data.documentIds;
            }
            return data;
        }, cb);
    }
    async doUpdate(doc, update) {
        if (update.$set) {
            update = lodash_1.default.merge(update, update.$set);
            delete update.$set;
        }
        if (update.$inc) {
            lodash_1.default.keys(update.$inc).forEach(incrementKey => {
                if (doc[incrementKey]) {
                    update[incrementKey] = doc[incrementKey] + update.$inc[incrementKey];
                }
                else {
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
    async updateOne(query, update, options, cb) {
        ({ options, cb } = (0, utils_1.setOptionsAndCb)(options, cb));
        return (0, utils_1.executeOperation)(async () => {
            const doc = await this.findOne(query, options);
            if (doc) {
                return await this.doUpdate(doc, update);
            }
            return { modifiedCount: 0, matchedCount: 0 };
        }, cb);
    }
    async updateMany(query, update, options, cb) {
        ({ options, cb } = (0, utils_1.setOptionsAndCb)(options, cb));
        return (0, utils_1.executeOperation)(async () => {
            const cursor = this.find(query, options);
            const docs = await cursor.toArray();
            if (docs.length) {
                const res = await Promise.all(docs.map((doc) => {
                    return this.doUpdate(doc, lodash_1.default.cloneDeep(update));
                }));
                return { acknowledged: true, modifiedCount: res.length, matchedCount: res.length };
            }
            return { modifiedCount: 0, matchedCount: 0 };
        }, cb);
    }
    async replaceOne(query, newDoc, options, cb) {
        ({ options, cb } = (0, utils_1.setOptionsAndCb)(options, cb));
        return (0, utils_1.executeOperation)(async () => {
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
    async deleteOne(query, options, cb) {
        ({ options, cb } = (0, utils_1.setOptionsAndCb)(options, cb));
        return (0, utils_1.executeOperation)(async () => {
            const doc = await this.findOne(query, options);
            if (doc) {
                await this.httpClient.delete(`/${doc._id}`);
                return { value: doc, ok: true };
            }
            return { ok: false };
        }, cb);
    }
    async deleteMany(query, options, cb) {
        ({ options, cb } = (0, utils_1.setOptionsAndCb)(options, cb));
        return (0, utils_1.executeOperation)(async () => {
            const cursor = this.find(query, options);
            const docs = await cursor.toArray();
            if (docs.length) {
                const res = await Promise.all(docs.map((doc) => this.httpClient.delete(`/${doc._id}`)));
                return { acknowledged: true, deletedCount: res.length };
            }
            return { acknowledged: true, deletedCount: 0 };
        }, cb);
    }
    find(query, options, cb) {
        ({ options, cb } = (0, utils_1.setOptionsAndCb)(options, cb));
        const cursor = new cursor_1.FindCursor(this, query, options);
        if (cb) {
            return cb(undefined, cursor);
        }
        return cursor;
    }
    async findOne(query, options, cb) {
        ({ options, cb } = (0, utils_1.setOptionsAndCb)(options, cb));
        return (0, utils_1.executeOperation)(async () => {
            const cursor = this.find(query, { ...options, limit: 1 });
            const res = await cursor.toArray();
            return res.length ? res[0] : undefined;
        }, cb);
    }
    async distinct(key, filter, options, cb) {
        ({ options, cb } = (0, utils_1.setOptionsAndCb)(options, cb));
        return (0, utils_1.executeOperation)(async () => {
            const cursor = this.find(filter, { ...options, limit: 1 });
            const res = await cursor.toArray();
            const list = [];
            if (res.length) {
                res.forEach((doc) => list.push(doc[key]));
            }
            return lodash_1.default.uniq(list);
        }, cb);
    }
    async countDocuments(query, options, cb) {
        ({ options, cb } = (0, utils_1.setOptionsAndCb)(options, cb));
        return (0, utils_1.executeOperation)(async () => {
            const cursor = this.find(query, options);
            return await cursor.count();
        }, cb);
    }
    // deprecated and overloaded
    async remove(query, options, cb) {
        return await this.deleteMany(query, options, cb);
    }
    async insert(docs, options, cb) {
        return await this.insertMany(docs, options, cb);
    }
    async findOneAndDelete(query, options, cb) {
        return await this.deleteOne(query, options, cb);
    }
    async count(query, options, cb) {
        return await this.countDocuments(query, options, cb);
    }
    async update(query, update, options, cb) {
        return await this.updateMany(query, update, options, cb);
    }
    async findOneAndUpdate(query, update, options, cb) {
        return await this.updateOne(query, update, options, cb);
    }
    // NOOPS and unimplemented
    /**
     *
     * @param pipeline
     * @param options
     */
    aggregate(pipeline, options) {
        throw new Error('Not Implemented');
    }
    /**
     *
     * @param index
     * @param options
     * @param cb
     * @returns any
     */
    async createIndex(index, options, cb) {
        if (cb) {
            return cb(index);
        }
        return index;
    }
    /**
     *
     * @param index
     * @param options
     * @param cb
     * @returns any
     */
    async dropIndexes(cb) {
        if (cb) {
            return cb(null);
        }
    }
}
exports.Collection = Collection;
//# sourceMappingURL=collection.js.map